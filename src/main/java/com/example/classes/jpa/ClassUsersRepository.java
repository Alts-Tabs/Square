package com.example.classes.jpa;

import com.example.classes.entity.ClassUsersEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClassUsersRepository extends JpaRepository<ClassUsersEntity, Integer> {
}
