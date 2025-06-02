package com.example.reference.controller;

import com.example.reference.dto.ReferenceDto;
import com.example.reference.entity.ReferenceFileEntity;
import com.example.reference.jpa.ReferenceFileRepository;
import com.example.reference.service.ReferenceService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriUtils;

import java.net.MalformedURLException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/references")
@RequiredArgsConstructor
public class ReferenceController {

    private final ReferenceService referenceService;
    private final ReferenceFileRepository referenceFileRepository;

    // 게시글 생성 (파일 업로드 포함)
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ReferenceDto> createReference(
            @RequestParam String title,
            @RequestParam String content,
            @RequestPart(required = false) List<MultipartFile> files) {

        ReferenceDto dto = referenceService.createReference(title, content, files);
        return ResponseEntity.ok(dto);
    }

    // 게시글 단건 조회 (파일 포함)
    @GetMapping("/{id}")
    public ResponseEntity<ReferenceDto> getReference(@PathVariable Long id) {
        ReferenceDto dto = referenceService.getReference(id);
        return ResponseEntity.ok(dto);
    }

    // 게시글 리스트 조회
    @GetMapping
    public ResponseEntity<List<ReferenceDto>> getReferences() {
        List<ReferenceDto> list = referenceService.getAllReferences();
        return ResponseEntity.ok(list);
    }

    // 게시글 수정
    @PutMapping("/{id}")
    public ResponseEntity<ReferenceDto> updateReference(
            @PathVariable Long id,
            @RequestParam String title,
            @RequestParam String content,
            @RequestParam(required = false) List<MultipartFile> files
    ) {
        ReferenceDto updated = referenceService.updateReference(id, title, content, files);
        return ResponseEntity.ok(updated);
    }

    // 게시글 삭제 (단건)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReference(@PathVariable Long id) {
        referenceService.deleteReference(id);
        return ResponseEntity.noContent().build();
    }

    // 게시글 다중 삭제 (IDs 리스트)
    @DeleteMapping
    public ResponseEntity<Void> deleteReferences(@RequestBody List<Long> ids) {
        referenceService.deleteReferences(ids);
        return ResponseEntity.noContent().build();
    }

    // 파일 다운로드
    @GetMapping("/files/{fileId}")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long fileId) {
        ReferenceFileEntity fileEntity = referenceFileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("파일을 찾을 수 없습니다. id=" + fileId));

        Path filePath = Paths.get(referenceService.getUploadDir()).resolve(fileEntity.getStoredFilename()).normalize();

        Resource resource;
        try {
            resource = new UrlResource(filePath.toUri());
            if (!resource.exists()) {
                throw new RuntimeException("파일이 존재하지 않습니다: " + fileEntity.getStoredFilename());
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("파일 경로 오류", e);
        }

        String encodedFilename = UriUtils.encode(fileEntity.getOriginalFilename(), StandardCharsets.UTF_8);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + encodedFilename + "\"")
                .body(resource);
    }
}
