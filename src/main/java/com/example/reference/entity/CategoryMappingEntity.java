package com.example.reference.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Table(name = "reference_category_mapping")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryMappingEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long mappingId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reference_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private ReferenceEntity reference;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idx")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private ReferenceCategoryEntity category;
}
