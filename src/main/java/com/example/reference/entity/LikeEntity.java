package com.example.reference.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "reference_likes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LikeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reference_id")
    private ReferenceEntity reference;
}
