package com.codesenseai.dto.response;

import com.codesenseai.common.enums.ProjectStatus;
import com.codesenseai.common.enums.SourceType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Data
@Builder
public class ProjectResponse {
    private UUID id;
    private String name;
    private String description;
    private SourceType sourceType;
    private String githubUrl;
    private String primaryLanguage;
    private ProjectStatus status;
    private int totalFiles;
    private long totalSizeBytes;
    private int indexedFiles;
    private String frameworkDetected;
    private Map<String, Integer> languageStats;
    private float indexingProgress;
    private String storageSizeFormatted;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
