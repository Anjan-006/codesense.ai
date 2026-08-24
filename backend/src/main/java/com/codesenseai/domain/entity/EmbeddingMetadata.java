package com.codesenseai.domain.entity;

import com.codesenseai.common.enums.ChunkType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "embedding_metadata")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmbeddingMetadata {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "project_id", nullable = false)
    private UUID projectId;

    @Column(name = "file_id", nullable = false)
    private UUID fileId;

    @Enumerated(EnumType.STRING)
    @Column(name = "chunk_type", nullable = false, length = 30)
    private ChunkType chunkType;

    @Column(name = "chunk_content", nullable = false, columnDefinition = "TEXT")
    private String chunkContent;

    @Column(name = "class_name")
    private String className;

    @Column(name = "method_name")
    private String methodName;

    @Column(name = "module_name")
    private String moduleName;

    @Column(name = "package_name")
    private String packageName;

    @Column(length = 100)
    private String framework;

    @Column(length = 50)
    private String language;

    @Column(name = "start_line")
    private Integer startLine;

    @Column(name = "end_line")
    private Integer endLine;

    @Column(name = "qdrant_point_id", nullable = false)
    private UUID qdrantPointId;

    @Column(name = "token_count", nullable = false)
    @Builder.Default
    private int tokenCount = 0;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
