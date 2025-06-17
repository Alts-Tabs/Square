package com.example.reference.controller;

import com.example.reference.dto.CategoryResponseDto;
import com.example.reference.dto.ReferenceDto;
import com.example.reference.dto.ReferenceResponse;
import com.example.reference.dto.ReferenceUpdateRequestDto;
import com.example.reference.jpa.ReferenceRepository;
import com.example.reference.service.ReferenceService;
import com.example.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriUtils;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.net.URLConnection;
import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin
public class ReferenceController {

    private final ReferenceRepository ReferenceRepository;
    private final ReferenceService referenceService;

    // 게시글 리스트 조회
    @GetMapping("/public/{academyId}/getFiles")
    public ResponseEntity<List<ReferenceResponse>> getReferences(@PathVariable int academyId) {
        List<ReferenceResponse> list = referenceService.getAllReferences(academyId );
        return ResponseEntity.ok(list);
    }

    // 게시글 상세보기
    @GetMapping("/public/{id}/reference")
    public ResponseEntity<ReferenceDto> getReference(@PathVariable Long id) {
        ReferenceDto reference = referenceService.getReference(id);
        return ResponseEntity.ok(reference);
    }

    // 게시글 파일 다운로드 프록시
    @GetMapping("/public/download/reference")
    public ResponseEntity<Resource> downloadFile(@RequestParam String url,
                                                 @RequestParam String originalFilename) throws IOException {
        URL fileUrl = new URL(url);
        URLConnection conn = fileUrl.openConnection();

        InputStream inputStream = conn.getInputStream();
        InputStreamResource resource = new InputStreamResource(inputStream);

        String encodedFilename = UriUtils.encode(originalFilename, StandardCharsets.UTF_8);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + encodedFilename + "\"; filename*=UTF-8''" + encodedFilename)
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }

    // 카테고리 출력
    @GetMapping("/public/{academyId}/category")
    public ResponseEntity<List<CategoryResponseDto>> getAllCategory(@PathVariable int academyId) {
        List<CategoryResponseDto> list = referenceService.getAllCategory(academyId);
        return ResponseEntity.ok(list);
    }

    // 카테고리 생성
    @PostMapping("/th/{academyId}/createCategory")
    public ResponseEntity<?> createCategory(@PathVariable int academyId, @RequestParam String categoryName) {
        referenceService.createCategory(academyId, categoryName);
        return ResponseEntity.ok().build();
    }

    // 자료실 글 생성 (파일 업로드 포함)
    @PostMapping(value = "/th/{academyId}/references", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createReference(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable int academyId,
            @RequestParam String title,
            @RequestParam String content,
            @RequestParam Long idx,
            @RequestPart(required = false) List<MultipartFile> files) {

        referenceService.createReference(userDetails.getUserId(), academyId, title, content, idx, files);
        return ResponseEntity.ok().build();
    }

    // 자료실 수정
    @PutMapping(value = "/th/{referenceId}/update", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateReference(@PathVariable Long referenceId,
                                             @ModelAttribute ReferenceUpdateRequestDto request) {
        referenceService.updateReference(referenceId, request);
        return ResponseEntity.ok().build();
    }

    // 자료실 삭제
    @DeleteMapping("/th/{referenceId}/deleteReference")
    public ResponseEntity<?> deleteReference(@PathVariable Long referenceId) {
        referenceService.deleteReference(referenceId);
        return ResponseEntity.ok().build();
    }

}