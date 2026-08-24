package com.codesenseai.domain.repository;

import com.codesenseai.domain.entity.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ChatRepository extends JpaRepository<Chat, UUID> {

    List<Chat> findByProjectIdAndUserIdOrderByUpdatedAtDesc(UUID projectId, UUID userId);

    List<Chat> findByUserIdOrderByUpdatedAtDesc(UUID userId);

    long countByUserId(UUID userId);
}
