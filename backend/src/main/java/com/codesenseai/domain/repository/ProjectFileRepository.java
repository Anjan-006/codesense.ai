package com.codesenseai.domain.repository;

import com.codesenseai.domain.entity.ProjectFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProjectFileRepository extends JpaRepository<ProjectFile, UUID> {

    List<ProjectFile> findByProjectIdOrderByFilePath(UUID projectId);

    long countByProjectId(UUID projectId);

    @Query("SELECT COALESCE(SUM(f.linesOfCode), 0) FROM ProjectFile f WHERE f.projectId = :projectId")
    long sumLinesOfCodeByProjectId(@Param("projectId") UUID projectId);

    @Query("SELECT f.language, COUNT(f) FROM ProjectFile f WHERE f.projectId = :projectId GROUP BY f.language")
    List<Object[]> countByLanguageForProject(@Param("projectId") UUID projectId);
}
