package com.codesenseai.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsResponse {

    private long totalProjects;
    private long totalQuestions;
    private long totalDocumentsIndexed;
    private long storageUsedBytes;
    private String storageUsedFormatted;
}
