package com.example.reference.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Table(name = "reference_files")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReferenceFileEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String originalFilename;
    private String storedFilename;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reference_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private ReferenceEntity reference;
}