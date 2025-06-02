package com.example.reference.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LikeDto {
    private Long referenceId;
    private Long likeCount;
}
