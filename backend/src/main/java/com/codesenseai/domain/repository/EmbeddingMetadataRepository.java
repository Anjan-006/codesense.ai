package com.codesenseai.domain.repository;

import com.codesenseai.domain.entity.EmbeddingMetadata;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface EmbeddingMetadataRepository extends JpaRepository<EmbeddingMetadata, UUID> {

    List<EmbeddingMetadata> findByProjectId(UUID projectId);

    List<EmbeddingMetadata> findByFileId(UUID fileId);

    long countByProjectId(UUID projectId);

    void deleteByProjectId(UUID projectId);

    List<EmbeddingMetadata> findByQdrantPointIdIn(List<UUID> qdrantPointIds);
}
