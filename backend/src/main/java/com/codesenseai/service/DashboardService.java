package com.codesenseai.service;

import com.codesenseai.domain.repository.*;
import com.codesenseai.dto.response.DashboardStatsResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ProjectRepository projectRepository;
    private final ChatRepository chatRepository;
    private final EmbeddingMetadataRepository embeddingMetadataRepository;
    private final MessageRepository messageRepository;

    @Transactional(readOnly = true)
    public DashboardStatsResponse getStats(UUID userId) {
        long totalProjects = projectRepository.countByUserId(userId);
        long totalQuestions = chatRepository.countByUserId(userId);
        long storageUsed = projectRepository.sumTotalSizeByUserId(userId);

        return DashboardStatsResponse.builder()
                .totalProjects(totalProjects)
                .totalQuestions(totalQuestions)
                .totalDocumentsIndexed(0) // Will be calculated from embedding metadata
                .storageUsedBytes(storageUsed)
                .storageUsedFormatted(formatBytes(storageUsed))
                .build();
    }

    private String formatBytes(long bytes) {
        if (bytes == 0) return "0 B";
        String[] units = {"B", "KB", "MB", "GB", "TB"};
        int i = (int) (Math.log(bytes) / Math.log(1024));
        return String.format("%.1f %s", bytes / Math.pow(1024, i), units[i]);
    }
}
