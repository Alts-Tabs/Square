package com.example.evaluations.entity;

import java.sql.Timestamp;

import com.example.user.entity.StudentsEntity;
import com.example.user.entity.TeachersEntity;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Table(name="evaluations")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class EvaluationsEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int evaluation_id;
	
	//StudentEntity랑 추후 연결 예정
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name="student_id",nullable = false)
	@OnDelete(action = OnDeleteAction.CASCADE)
	private StudentsEntity student;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name="teacher_id",nullable = false)
	@OnDelete(action = OnDeleteAction.CASCADE)
	private TeachersEntity teacher;
	
	@Column(length = 200)
	private String subject;
	
	private int score;
	
	@Column(length = 30)
	private String startDate;
	
	@Column(length = 30)
	private String endDate;
	
	@Column(length = 1000)
	private String contents;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	@Builder.Default
	private EvaluationPeriod period=EvaluationPeriod.WEEKLY;

	@CreationTimestamp
	@Column(nullable = false)
	@JsonFormat(pattern = "yyyy-MM-dd",timezone = "Asia/Seoul")
	private Timestamp created_at;
}
