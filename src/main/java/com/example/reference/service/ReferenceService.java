package com.example.reference.service;

import com.example.reference.dto.ReferenceDto;
import com.example.reference.entity.ReferenceEntity;
import com.example.reference.entity.ReferenceFileEntity;
import com.example.reference.jpa.ReferenceFileRepository;
import com.example.reference.jpa.ReferenceRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class ReferenceService {

    private final ReferenceRepository referenceRepository;
    private final ReferenceFileRepository fileRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    // 게시글 생성 + 파일 저장
    public ReferenceDto createReference(String title, String content, List<MultipartFile> files) {
        ReferenceEntity reference = ReferenceEntity.builder()
                .title(title)
                .content(content)
                .build();

        ReferenceEntity savedReference = referenceRepository.save(reference);
        saveFiles(savedReference, files);

        return ReferenceDto.fromEntity(savedReference);
    }

    // 게시글 단건 조회
    public ReferenceDto getReference(Long id) {
        ReferenceEntity reference = referenceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다. id=" + id));

        reference.getFiles().size(); // LAZY 강제 초기화
        return ReferenceDto.fromEntity(reference);
    }

    // 전체 조회
    public List<ReferenceDto> getAllReferences() {
        return referenceRepository.findAll().stream()
                .map(ReferenceDto::fromEntity)
                .toList();
    }

    // 수정
    public ReferenceDto updateReference(Long id, String title, String content, List<MultipartFile> files) {
        ReferenceEntity reference = referenceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다. id=" + id));

        reference.setTitle(title);
        reference.setContent(content);

        saveFiles(reference, files);

        return ReferenceDto.fromEntity(reference);
    }

    // 삭제
    public void deleteReference(Long id) {
        ReferenceEntity reference = referenceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다. id=" + id));

        deleteFiles(reference);
        referenceRepository.delete(reference);
    }

    // 여러 개 삭제
    public void deleteReferences(List<Long> ids) {
        for (Long id : ids) {
            deleteReference(id);
        }
    }

    // 파일 저장
    private void saveFiles(ReferenceEntity reference, List<MultipartFile> files) {
        if (files == null) return;

        for (MultipartFile file : files) {
            if (!file.isEmpty()) {
                String originalFilename = file.getOriginalFilename();
                String storedFilename = UUID.randomUUID() + "_" + originalFilename;

                Path path = Paths.get(uploadDir).resolve(storedFilename);
                try {
                    Files.createDirectories(path.getParent());
                    file.transferTo(path);
                } catch (IOException e) {
                    throw new RuntimeException("파일 저장 실패", e);
                }

                ReferenceFileEntity fileEntity = ReferenceFileEntity.builder()
                        .originalFilename(originalFilename)
                        .storedFilename(storedFilename)
                        .reference(reference)
                        .build();

                fileRepository.save(fileEntity);
                reference.getFiles().add(fileEntity);
            }
        }
    }

    // 파일 삭제
    private void deleteFiles(ReferenceEntity reference) {
        for (ReferenceFileEntity file : reference.getFiles()) {
            Path filePath = Paths.get(uploadDir).resolve(file.getStoredFilename());
            try {
                Files.deleteIfExists(filePath);
            } catch (IOException e) {
                throw new RuntimeException("파일 삭제 실패: " + file.getOriginalFilename(), e);
            }
        }
    }

    public String getUploadDir() {
        return uploadDir;
    }
}
