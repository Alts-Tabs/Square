package com.example.board.service;

import com.example.board.dto.BoardRequestDto;
import com.example.board.dto.BoardResponseDto;
import com.example.board.entity.BoardCommentEntity;
import com.example.board.entity.BoardEntity;
import com.example.board.entity.BoardFileEntity;
import com.example.board.repository.BoardCommentRepository;
import com.example.board.repository.BoardFileRepository;
import com.example.board.repository.BoardRepository;
import com.example.naver.storage.NcpObjectStorageService;
import com.example.user.jpa.UsersRepository;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.jsoup.Jsoup;
import org.jsoup.safety.Safelist;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class Boardservice {

    private final BoardRepository boardRepository;
    private final BoardCommentRepository boardCommentRepository;
    private final BoardFileRepository boardFileRepository;
    private final NcpObjectStorageService ncpObjectStorageService;
    private final UsersRepository usersRepository;

    private static final String BUCKET_NAME = "square"; // 실제 버킷 이름으로 변경

    @Transactional(readOnly = true)
    public Map<String, Object> getBoards(String category, PageRequest pageRequest, String keyword, String searchType) {
        Page<BoardEntity> boardPage;
        if (keyword != null && !keyword.isEmpty()) {
            switch (searchType) {
                case "title":
                    boardPage = boardRepository.findByCategoryAndTitleContaining(category, keyword, pageRequest);
                    break;
                case "content":
                    boardPage = boardRepository.findByCategoryAndContentContaining(category, keyword, pageRequest);
                    break;
                case "title+content":
                default:
                    boardPage = boardRepository.findByCategoryAndTitleContainingOrContentContaining(category, keyword, keyword, pageRequest);
                    break;
            }
        } else {
            boardPage = boardRepository.findByCategory(category, pageRequest);
        }
        return toMap(boardPage.map(this::convertToDto));
    }

    // 추가: Page -> Map 변환을 위한 헬퍼 메서드
    private Map<String, Object> toMap(Page<BoardResponseDto> page) {
        Map<String, Object> result = new HashMap<>();
        result.put("content", page.getContent());
        result.put("totalPages", page.getTotalPages());
        return result;
    }

    @Transactional
    public BoardResponseDto getBoardById(Long id, HttpSession session, String username) {
        BoardEntity board = boardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));

        // 로그인한 사용자에 대해서만 조회 수 관리
        if (username != null) {
            // 세션에서 조회 기록 확인
            String sessionKey = "viewed_post_" + id + "_" + username;
            if (session.getAttribute(sessionKey) == null) {
                // 조회 기록이 없으면 조회 수 증가 및 세션에 기록
                board.setViews(board.getViews() + 1);
                session.setAttribute(sessionKey, true);
                boardRepository.save(board);
            }
        }

        return convertToDto(board);
    }

    @Transactional
    public BoardEntity createBoard(BoardRequestDto dto, String author, String role, List<String> fileNames) {
        // HTML 콘텐츠 정화
        String sanitizedContent = Jsoup.clean(dto.getContent(), Safelist.relaxed()
                .addTags("span", "div")
                .addAttributes("span", "style")
                .addAttributes("div", "style")
                .addAttributes(":all", "class"));

        BoardEntity board = BoardEntity.builder()
                .title(dto.getTitle())
                .content(sanitizedContent)
                .author(author)
                .category(dto.getCategory())
                .division(dto.getDivision())
                .allowComments(dto.isAllowComments())
                .views(0)
                .role(role)
                .createdAt(LocalDateTime.now())
                .build();

        if (fileNames != null && !fileNames.isEmpty()) {
            fileNames.forEach(fileName -> {
                String fileUrl = ncpObjectStorageService.getFileUrl(BUCKET_NAME, fileName);
                BoardFileEntity fileEntity = BoardFileEntity.builder()
                        .post(board)
                        .fileName(fileName.split("/")[fileName.split("/").length - 1])
                        .filePath(fileUrl)
                        .contentType("application/octet-stream")
                        .fileSize(0)
                        .build();
                board.getFileEntities().add(fileEntity);
            });
        }

        return boardRepository.save(board);
    }

    @Transactional
    public BoardEntity updateBoard(Long id, BoardRequestDto dto, String author, String role, List<String> fileNames) {
        BoardEntity board = boardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
        if (!board.getAuthor().equals(author) && !role.equals("ROLE_ADMIN")) {
            throw new RuntimeException("수정 권한이 없습니다.");
        }
        board.setTitle(dto.getTitle());
        board.setContent(dto.getContent());
        board.setCategory(dto.getCategory());
        board.setDivision(dto.getDivision());
        board.setAllowComments(dto.isAllowComments());
        board.setUpdatedAt(LocalDateTime.now());

        if (fileNames != null && !fileNames.isEmpty()) {
            // 기존 파일 삭제
            board.getFileEntities().clear();
            boardFileRepository.deleteAllByPostId(id);
            // 새 파일 추가
            fileNames.forEach(fileName -> {
                String fileUrl = ncpObjectStorageService.getFileUrl(BUCKET_NAME, fileName);
                BoardFileEntity fileEntity = BoardFileEntity.builder()
                        .post(board)
                        .fileName(fileName.split("/")[fileName.split("/").length - 1]) // 파일 이름만 추출
                        .filePath(fileUrl)
                        .contentType("application/octet-stream")
                        .fileSize(0)
                        .build();
                board.getFileEntities().add(fileEntity);
            });
        }

        return boardRepository.save(board);
    }

    @Transactional
    public void deleteBoard(Long id, String author, String role) {
        BoardEntity board = boardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
        if (!board.getAuthor().equals(author) && !role.equals("ROLE_ADMIN")) {
            throw new RuntimeException("삭제 권한이 없습니다.");
        }
        boardRepository.delete(board);
    }

    @Transactional
    public BoardCommentEntity createComment(Long postId, String content, String author, String role) {
        BoardEntity board = boardRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
        if (!board.isAllowComments()) {
            throw new RuntimeException("댓글 작성이 허용되지 않은 게시글입니다.");
        }
        BoardCommentEntity comment = BoardCommentEntity.builder()
                .post(board)
                .author(author)
                .content(content)
                .role(role)
                .build();
        return boardCommentRepository.save(comment);
    }

    @Transactional(readOnly = true)
    public List<BoardCommentEntity> getCommentsByPostId(Long postId) {
        return boardCommentRepository.findByPostId(postId);
    }

    private BoardResponseDto convertToDto(BoardEntity board) {
        BoardResponseDto dto = new BoardResponseDto();
        dto.setId(board.getId());
        dto.setTitle(board.getTitle());
        dto.setContent(board.getContent());
        dto.setAuthor(board.getAuthor());
        dto.setCategory(board.getCategory());
        dto.setDivision(board.getDivision());
        dto.setAllowComments(board.isAllowComments());
        dto.setViews(board.getViews());
        dto.setRole(board.getRole());
        dto.setCreatedAt(board.getCreatedAt());
        dto.setUpdatedAt(board.getUpdatedAt());
        // 파일 URL 및 이름 추가
        dto.setFileUrls(board.getFileEntities().stream()
                .map(BoardFileEntity::getFilePath)
                .collect(Collectors.toList()));
        dto.setFileNames(board.getFileEntities().stream()
                .map(BoardFileEntity::getFileName)
                .collect(Collectors.toList()));
        return dto;
    }

    @Transactional
    public void deleteComment(Long postId, Long commentId, String author, String role) {
        BoardEntity board = boardRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
        BoardCommentEntity comment = boardCommentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("댓글을 찾을 수 없습니다."));

        if (!comment.getAuthor().equals(author) && !role.equals("ROLE_ADMIN")) {
            throw new RuntimeException("댓글 삭제 권한이 없습니다.");
        }

        boardCommentRepository.delete(comment);
    }

    @Transactional
    public BoardCommentEntity updateComment(Long postId, Long commentId, String content, String author, String role) {
        BoardEntity board = boardRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
        BoardCommentEntity comment = boardCommentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("댓글을 찾을 수 없습니다."));

        if (!comment.getAuthor().equals(author) && !role.equals("ROLE_ADMIN")) {
            throw new RuntimeException("댓글 수정 권한이 없습니다.");
        }

        comment.setContent(content);
        comment.setUpdatedAt(LocalDateTime.now());
        return boardCommentRepository.save(comment);
    }

}