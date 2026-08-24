package com.codesenseai.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "project_files")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectFile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "project_id", nullable = false)
    private UUID projectId;

    @Column(name = "file_path", nullable = false, length = 1000)
    private String filePath;

    @Column(name = "file_name", nullable = false)
    private String fileName;

    @Column(length = 50)
    private String language;

    @Column(name = "size_bytes", nullable = false)
    @Builder.Default
    private long sizeBytes = 0L;

    @Column(name = "content_hash", length = 64)
    private String contentHash;

    @Column(name = "classes_count", nullable = false)
    @Builder.Default
    private int classesCount = 0;

    @Column(name = "methods_count", nullable = false)
    @Builder.Default
    private int methodsCount = 0;

    @Column(name = "lines_of_code", nullable = false)
    @Builder.Default
    private int linesOfCode = 0;

    @Column(name = "complexity_score")
    private Float complexityScore;

    @Column(columnDefinition = "TEXT")
    private String content;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
