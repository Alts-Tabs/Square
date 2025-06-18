package com.example.board.dto;

import lombok.Data;

@Data
public class BoardFileDto {
    private Long id;              // 파일 ID (선택적)
    private Long postId;          // 해당 게시글 ID
    private String fileName;      // 원본 파일 이름
    private String filePath;      // NCP 버킷 내 저장 경로 (예: "board/202506161603_filename.jpg")
    private String contentType;   // 파일 MIME 타입 (예: "image/jpeg")
    private long fileSize;        // 파일 크기 (바이트 단위)
    private String downloadUrl;   // 다운로드 가능한 URL (NCP에서 생성)

    // 기본 생성자
    public BoardFileDto() {}

    // 생성자 (필요한 필드만 포함)
    public BoardFileDto(Long postId, String fileName, String filePath, String contentType, long fileSize, String downloadUrl) {
        this.postId = postId;
        this.fileName = fileName;
        this.filePath = filePath;
        this.contentType = contentType;
        this.fileSize = fileSize;
        this.downloadUrl = downloadUrl;
    }
}