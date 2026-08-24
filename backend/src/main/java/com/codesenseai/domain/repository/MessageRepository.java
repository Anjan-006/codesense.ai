package com.codesenseai.domain.repository;

import com.codesenseai.domain.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MessageRepository extends JpaRepository<Message, UUID> {

    List<Message> findByChatIdOrderByCreatedAtAsc(UUID chatId);

    long countByChatId(UUID chatId);

    @Query("SELECT COALESCE(SUM(m.tokensUsed), 0) FROM Message m " +
           "JOIN Chat c ON m.chatId = c.id WHERE c.userId = :userId")
    long sumTokensUsedByUserId(@Param("userId") UUID userId);
}
