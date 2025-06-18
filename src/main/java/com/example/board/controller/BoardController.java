package com.example.board.controller;

import com.example.board.dto.BoardRequestDto;
import com.example.board.dto.BoardResponseDto;
import com.example.board.entity.BoardCommentEntity;
import com.example.board.entity.BoardEntity;
import com.example.board.service.Boardservice;
import com.example.naver.storage.NcpObjectStorageService;
import com.example.user.entity.UsersEntity;
import com.example.user.jpa.UsersRepository;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/public/api/board")
@RequiredArgsConstructor
@CrossOrigin
public class BoardController {

    private final Boardservice boardService;
    private final NcpObjectStorageService ncpObjectStorageService;
    private final UsersRepository usersRepository;

    // 게시글 목록 조회 (페이징 지원)
    @GetMapping
    public ResponseEntity<?> getBoards(
            @RequestParam(defaultValue = "공지사항") String category,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String searchType,
            @RequestParam(defaultValue = "id,desc") String sort) {
        Sort.Direction direction = sort.endsWith("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        String sortField = sort.split(",")[0];
        PageRequest pageRequest = PageRequest.of(page - 1, size, Sort.by(direction, sortField));
        Map<String, Object> result = boardService.getBoards(category, pageRequest, keyword, searchType);
        return ResponseEntity.ok(result);
    }

    // 게시글 상세 조회
    @GetMapping("/{id}")
    public ResponseEntity<?> getBoard(@PathVariable Long id, HttpSession session, Authentication authentication) {
        String username = (authentication != null && authentication.isAuthenticated()) ? authentication.getName() : null;
        BoardResponseDto board = boardService.getBoardById(id, session, username);
        if (board == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("게시글을 찾을 수 없습니다.");
        }
        return ResponseEntity.ok(board);
    }

    // 게시글 작성
    @PostMapping
    public ResponseEntity<?> createBoard(
            @RequestPart("board") BoardRequestDto dto,
            @RequestPart(value = "files", required = false) MultipartFile[] files,
            Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        String username = authentication.getName();
        UsersEntity user = usersRepository.findByUsername(username);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("사용자를 찾을 수 없습니다.");
        }
        String author = user.getName();
        String role = user.getRole().name().replace("ROLE_", "");

        List<String> fileNames = null;
        if (files != null && files.length > 0) {
            fileNames = java.util.Arrays.stream(files)
                    .map(file -> ncpObjectStorageService.uploadFile("square", "board", file))
                    .collect(Collectors.toList());
        }

        BoardEntity board = boardService.createBoard(dto, author, role, fileNames);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "게시글 작성 성공", "id", board.getId()));
    }

    // 게시글 수정
    @PutMapping("/{id}")
    public ResponseEntity<?> updateBoard(
            @PathVariable Long id,
            @RequestPart("board") BoardRequestDto dto,
            @RequestPart(value = "files", required = false) MultipartFile[] files,
            Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        String username = authentication.getName();
        UsersEntity user = usersRepository.findByUsername(username);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("사용자를 찾을 수 없습니다.");
        }
        List<String> fileNames = null;
        if (files != null && files.length > 0) {
            fileNames = java.util.Arrays.stream(files)
                    .map(file -> ncpObjectStorageService.uploadFile("square", "board", file))
                    .collect(Collectors.toList());
        }
        BoardEntity updatedBoard = boardService.updateBoard(id, dto, user.getName(), user.getRole().name().replace("ROLE_", ""), fileNames);
        return ResponseEntity.ok(Map.of("message", "게시글 수정 성공", "id", updatedBoard.getId()));
    }

    // 게시글 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBoard(@PathVariable Long id, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        String username = authentication.getName(); // getUsername() 대신 getName() 사용
        UsersEntity user = usersRepository.findByUsername(username); // findById(id) 대신 findByUsername 사용
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("사용자를 찾을 수 없습니다.");
        }
        boardService.deleteBoard(id, user.getName(), user.getRole().name().replace("ROLE_", ""));
        return ResponseEntity.ok(Map.of("message", "게시글 삭제 성공"));
    }

    // 댓글 생성
    @PostMapping("/{id}/comments")
    public ResponseEntity<?> createComment(
            @PathVariable Long id,
            @RequestBody Map<String, String> request,
            Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        String username = authentication.getName();
        UsersEntity user = usersRepository.findByUsername(username);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("사용자를 찾을 수 없습니다.");
        }

        String content = request.get("content");
        if (content == null || content.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("댓글 내용이 없습니다.");
        }

        String role = user.getRole().name().replace("ROLE_", "");
        BoardCommentEntity comment = boardService.createComment(id, content, user.getName(), role);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "message", "댓글 작성 성공",
                "id", comment.getId(),
                "author", comment.getAuthor(),
                "content", comment.getContent(),
                "role", comment.getRole(),
                "date", comment.getCreatedAt().toString()
        ));
    }

    // 댓글 조회
    @GetMapping("/{id}/comments")
    public ResponseEntity<?> getComments(@PathVariable Long id) {
        List<BoardCommentEntity> comments = boardService.getCommentsByPostId(id);
        List<Map<String, Object>> commentDtos = comments.stream().map(comment -> {
            Map<String, Object> dto = new HashMap<>();
            dto.put("id", comment.getId());
            dto.put("author", comment.getAuthor());
            dto.put("content", comment.getContent());
            dto.put("role", comment.getRole());
            dto.put("date", comment.getCreatedAt().toString());
            return dto;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(commentDtos);
    }

    //댓글 삭제
    @DeleteMapping("/{id}/comments/{commentId}")
    public ResponseEntity<?> deleteComment(
            @PathVariable Long id,
            @PathVariable Long commentId,
            Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        String username = authentication.getName();
        UsersEntity user = usersRepository.findByUsername(username);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("사용자를 찾을 수 없습니다.");
        }

        try {
            boardService.deleteComment(id, commentId, user.getName(), user.getRole().name().replace("ROLE_", ""));
            return ResponseEntity.ok(Map.of("message", "댓글 삭제 성공"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/{id}/comments/{commentId}")
    public ResponseEntity<?> updateComment(
            @PathVariable Long id,
            @PathVariable Long commentId,
            @RequestBody Map<String, String> request,
            Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        String username = authentication.getName();
        UsersEntity user = usersRepository.findByUsername(username);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("사용자를 찾을 수 없습니다.");
        }

        String content = request.get("content");
        if (content == null || content.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("댓글 내용이 없습니다.");
        }

        try {
            BoardCommentEntity updatedComment = boardService.updateComment(id, commentId, content, user.getName(), user.getRole().name().replace("ROLE_", ""));
            return ResponseEntity.ok(Map.of(
                    "message", "댓글 수정 성공",
                    "id", updatedComment.getId(),
                    "content", updatedComment.getContent()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}