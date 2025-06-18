package com.example.reference.service;

import com.amazonaws.services.kms.model.NotFoundException;
import com.example.naver.storage.NcpObjectStorageService;
import com.example.reference.dto.*;
import com.example.reference.entity.*;
import com.example.reference.jpa.*;
import com.example.user.entity.AcademiesEntity;
import com.example.user.entity.UsersEntity;
import com.example.user.jpa.AcademiesRepository;
import com.example.user.jpa.UsersRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReferenceService {
    private final UsersRepository usersRepository;
    private final AcademiesRepository academiesRepository;
    private final ReferenceRepository referenceRepository;
    private final ReferenceFileRepository fileRepository;
    private final ReferenceCategoryRepository categoryRepository;
    private final CategoryMappingRepository mappingRepository;
    private final ReferenceLikeRepository likeRepository;
    private final NcpObjectStorageService objectStorageService;

    private String bucketName = "square";
    private String folderName = "references";

    @Value("${file.upload-dir}")
    private String uploadDir;

    // 전체 조회
    public List<ReferenceResponse> getAllReferences(int academyId) {
        AcademiesEntity academy = academiesRepository.findById(academyId).orElseThrow(() -> new NotFoundException("NOT FOUND ACADEMY"));
        List<ReferenceEntity> references = referenceRepository.findAllByAcademyOrderByCreatedAtDesc(academy);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        return references.stream()
                .map(r -> {
                    UsersEntity user = usersRepository.findById(r.getUser().getUser_id()).orElseThrow(() -> new NotFoundException("NOT FOUND USER"));
                    Optional<CategoryMappingEntity> mapping = mappingRepository.findByReference(r);
                    String category = "";
                    if(mapping.isPresent()) {
                        category = mapping.get().getCategory().getCategory();
                    }

                    return ReferenceResponse.builder()
                            .id(r.getId())
                            .title(r.getTitle())
                            .createdAt(r.getCreatedAt().format(formatter))
                            .writer(user.getName())
                            .category(category)
                            .build();
                }).toList();
    }

    // 게시물 자세히 보기
    public ReferenceDto getReference(Long id) {
        ReferenceEntity reference = referenceRepository.findById(id).orElseThrow(() -> new NotFoundException("NOT FOUND REFERENCE"));
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
        List<ReferenceFileEntity> files = fileRepository.findByReference(reference);

        Optional<CategoryMappingEntity> mapping = mappingRepository.findByReference(reference);
        Long idx = 0L;
        if(mapping.isPresent()) {
            idx = mapping.get().getCategory().getIdx();
        }

        List<ReferenceFileDto> filesDto = files.stream()
                .map(file -> new ReferenceFileDto(
                        file.getId(),
                        file.getOriginalFilename(),
                        "https://kr.object.ncloudstorage.com/square/"+folderName+"/"+file.getStoredFilename()
                ))
                .toList();

        return ReferenceDto.builder()
                .id(id)
                .writer(reference.getUser().getName())
                .title(reference.getTitle())
                .content(reference.getContent())
                .categoryIdx(idx)
                .files(filesDto)
                .createdAt(reference.getCreatedAt().format(formatter))
                .build();
    }

    // 게시글 생성 + 파일 저장
    @Transactional
    public void createReference(Integer userId, int academyId, String title, String content, Long idx, List<MultipartFile> uploadFiles) {
        UsersEntity user = usersRepository.findById(userId).orElseThrow(() -> new NotFoundException("NOT FOUND USER"));
        AcademiesEntity academy = academiesRepository.findById(academyId).orElseThrow(() -> new NotFoundException("NOT FOUND ACADEMY"));

        ReferenceEntity reference = ReferenceEntity.builder()
                .title(title)
                .user(user)
                .academy(academy)
                .content(content)
                .build();

        ReferenceEntity savedReference = referenceRepository.save(reference);
        if(uploadFiles != null && !uploadFiles.isEmpty()) {
            saveFiles(savedReference, uploadFiles);
        }

        if(idx != 0) {
            ReferenceCategoryEntity category = categoryRepository.findById(idx).orElseThrow(() -> new NotFoundException("NOT FOUND CATEGORY"));
            CategoryMappingEntity mapping = CategoryMappingEntity.builder()
                    .category(category)
                    .reference(reference)
                    .build();

            mappingRepository.save(mapping);
        }
    }

    // 게시글 수정
    @Transactional
    public void updateReference(Long id, ReferenceUpdateRequestDto request) {
        ReferenceEntity reference = referenceRepository.findById(id).orElseThrow(() -> new NotFoundException("NOT FOUND REFERENCE"));

        // 카테고리 값 변경
        Optional<CategoryMappingEntity> mappingOpt = mappingRepository.findByReference(reference); // 현재 mapping 여부 확인
        boolean check = request.getCategoryIdx() != 0; // 카테고리 값 여부

        if(mappingOpt.isEmpty()) {
            // mapping 없는 경우
           if(check) {
               ReferenceCategoryEntity category = categoryRepository.findById(request.getCategoryIdx()).orElseThrow(() -> new NotFoundException("NOT FOUND CATEGORY"));

               CategoryMappingEntity categoryMapping = CategoryMappingEntity.builder()
                       .reference(reference)
                       .category(category)
                       .build();
               mappingRepository.save(categoryMapping);
           }
        } else {
            CategoryMappingEntity mapping = mappingOpt.get();
            ReferenceCategoryEntity category = categoryRepository.findById(request.getCategoryIdx()).orElseThrow(() -> new NotFoundException("NOT FOUND CATEGORY"));

            if(check && !mapping.getCategory().equals(category)) {
                mapping.setCategory(category);
                mappingRepository.save(mapping); // 기존 매핑 수정
            }

            if(!check) { // 기존 매핑에서 0으로 바뀌면 삭제
                mappingRepository.delete(mapping);
            }
        }

        // 기본 reference 값 변경
        reference.setTitle(request.getTitle());
        reference.setContent(request.getContent());

        // 받은 삭제 필드 NCP에서 삭제
        if(request.getDeleteFileIds() != null) {
            for(Long field : request.getDeleteFileIds()) {
                ReferenceFileEntity file = fileRepository.findById(field).orElseThrow(() -> new NotFoundException("NOT FOUND FILE"));
                objectStorageService.deleteFile(bucketName, folderName, file.getStoredFilename());
                fileRepository.delete(file);
            }
        }

        // 새 파일 업로드
        if(request.getFiles() != null && !request.getFiles().isEmpty()) {
            saveFiles(reference, request.getFiles());
        }
    }

    // 파일 저장
    private void saveFiles(ReferenceEntity reference, List<MultipartFile> files) {
        if (files == null) return;

        for (MultipartFile file : files) {
            if (!file.isEmpty()) {
                String originalFilename = file.getOriginalFilename();
                String storedFilename = objectStorageService.uploadFile(bucketName, folderName, file);

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

    // 카테고리 출력
    public List<CategoryResponseDto> getAllCategory(int academyId) {
        AcademiesEntity academy = academiesRepository.findById(academyId).orElseThrow(() -> new NotFoundException("NOT FOUND ACADEMY"));
        List<CategoryResponseDto> list = categoryRepository.findAllByAcademy(academy).stream()
                .map(c -> {
                    return CategoryResponseDto.builder()
                            .idx(c.getIdx())
                            .category(c.getCategory())
                            .build();
                }).toList();
        return list;
    }

    // 카테도리 생성
    @Transactional
    public void createCategory(int academyId, String categoryName) {
        AcademiesEntity academy = academiesRepository.findById(academyId).orElseThrow(() -> new NotFoundException("NOT FOUND ACADEMY"));
        ReferenceCategoryEntity category = ReferenceCategoryEntity.builder()
                .academy(academy)
                .category(categoryName)
                .build();
        categoryRepository.save(category);
    }

    // 카테고리 삭제
    @Transactional
    public void deleteCategory(Long idx) {
        ReferenceCategoryEntity category = categoryRepository.findById(idx)
                .orElseThrow(() -> new NotFoundException("NOT FOUND CATEGORY"));

        List<CategoryMappingEntity> mappings = mappingRepository.findByCategory(category);
        for(CategoryMappingEntity mapping : mappings) {
            mappingRepository.delete(mapping);
        }
        categoryRepository.delete(category);
    }

    // 게시글 삭제
    @Transactional
    public void deleteReference(Long id) {
        ReferenceEntity reference = referenceRepository.findById(id).orElseThrow(() -> new NotFoundException("NOT FOUND REFERENCE"));
        // 매핑 삭제
        Optional<CategoryMappingEntity> mappingOpt = mappingRepository.findByReference(reference);
        mappingOpt.ifPresent(mappingRepository::delete);

        List<ReferenceFileEntity> files = fileRepository.findByReference(reference);

        for(ReferenceFileEntity file : files) {
            objectStorageService.deleteFile(bucketName, folderName, file.getStoredFilename());
            fileRepository.delete(file);
        }

        referenceRepository.delete(reference);
    }

    // 좋아요 수 조회
    public long getLikeCount(Long referenceId) {
        return likeRepository.countByReference_IdAndStatusTrue(referenceId);
    }

    // 좋아요 상태 조회
    public boolean getLikeStatus(Long referenceId, Integer userId) {
        ReferenceEntity reference = referenceRepository.findById(referenceId)
                .orElseThrow(() -> new IllegalArgumentException("해당 자료가 존재하지 않습니다."));
        UsersEntity user = usersRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("해당 유저가 존재하지 않습니다."));

        return likeRepository.findByUserAndReference(user, reference)
                .map(ReferenceLikeEntity::isStatus)
                .orElse(false);
    }

    // 좋아요 토글
    @Transactional
    public boolean toggleLike(Long referenceId, Integer userId) {
        ReferenceEntity reference = referenceRepository.findById(referenceId)
                .orElseThrow(() -> new IllegalArgumentException("해당 자료가 존재하지 않습니다."));
        UsersEntity user = usersRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("해당 유저가 존재하지 않습니다."));

        ReferenceLikeEntity like = likeRepository.findByUserAndReference(user, reference)
                .orElse(ReferenceLikeEntity.builder()
                        .reference(reference)
                        .user(user)
                        .status(false)
                        .build());

        like.setStatus(!like.isStatus());
        likeRepository.save(like);

        return like.isStatus(); // true: 좋아요, false: 취소됨
    }

}