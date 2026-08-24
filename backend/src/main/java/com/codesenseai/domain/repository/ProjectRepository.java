package com.codesenseai.domain.repository;

import com.codesenseai.common.enums.ProjectStatus;
import com.codesenseai.domain.entity.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProjectRepository extends JpaRepository<Project, UUID> {

    Page<Project> findByUserIdOrderByCreatedAtDesc(UUID userId, Pageable pageable);

    List<Project> findByUserIdAndStatusNot(UUID userId, ProjectStatus status);

    long countByUserId(UUID userId);

    @Query("SELECT COALESCE(SUM(p.totalSizeBytes), 0) FROM Project p WHERE p.userId = :userId")
    long sumTotalSizeByUserId(@Param("userId") UUID userId);

    List<Project> findTop5ByUserIdOrderByCreatedAtDesc(UUID userId);
}
