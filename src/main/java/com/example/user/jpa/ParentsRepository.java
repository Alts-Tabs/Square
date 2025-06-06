package com.example.user.jpa;

import com.example.user.entity.ParentsEntity;
import com.example.user.entity.UsersEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ParentsRepository extends JpaRepository<ParentsEntity, Integer> {
    @Query("SELECT p FROM ParentsEntity p JOIN FETCH p.academy WHERE p.user = :user")
    Optional<ParentsEntity> findByUserWithAcademy(@Param("user") UsersEntity user);

    /** userId로 parent 조회 */
    @Query("SELECT p from ParentsEntity p WHERE p.user.user_id= :userId")
    Optional<ParentsEntity> findByUserUserId(@Param("userId") int userId);
}
