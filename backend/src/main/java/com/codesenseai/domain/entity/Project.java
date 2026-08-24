package com.codesenseai.domain.entity;

import com.codesenseai.common.enums.ProjectStatus;
import com.codesenseai.common.enums.SourceType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "projects")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "source_type", nullable = false, length = 20)
    private SourceType sourceType;

    @Column(name = "github_url", length = 500)
    private String githubUrl;

    @Column(name = "primary_language", length = 50)
    private String primaryLanguage;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private ProjectStatus status = ProjectStatus.UPLOADING;

    @Column(name = "total_files", nullable = false)
    @Builder.Default
    private int totalFiles = 0;

    @Column(name = "total_size_bytes", nullable = false)
    @Builder.Default
    private long totalSizeBytes = 0L;

    @Column(name = "indexed_files", nullable = false)
    @Builder.Default
    private int indexedFiles = 0;

    @Column(name = "framework_detected", length = 100)
    private String frameworkDetected;

    @Column(name = "storage_path", length = 500)
    private String storagePath;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "language_stats", columnDefinition = "jsonb")
    private Map<String, Integer> languageStats;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // ─── Derived ────────────────────────────────────────────────

    @Transient
    public boolean isReady() {
        return status == ProjectStatus.READY;
    }

    @Transient
    public float getIndexingProgress() {
        if (totalFiles == 0) return 0f;
        return (float) indexedFiles / totalFiles * 100;
    }
}
