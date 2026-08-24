package com.codesenseai.domain.repository;

import com.codesenseai.domain.entity.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface SessionRepository extends JpaRepository<Session, UUID> {

    Optional<Session> findByRefreshToken(String refreshToken);

    @Modifying
    @Query("UPDATE Session s SET s.revoked = true WHERE s.userId = :userId")
    void revokeAllByUserId(@Param("userId") UUID userId);

    @Modifying
    @Query("DELETE FROM Session s WHERE s.expiresAt < CURRENT_TIMESTAMP")
    void deleteExpiredSessions();
}
