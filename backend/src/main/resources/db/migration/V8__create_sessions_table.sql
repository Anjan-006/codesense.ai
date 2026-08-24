-- ═══════════════════════════════════════════════════════════════
-- V8: Sessions Table
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE sessions (
    id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id       UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    refresh_token VARCHAR(500) NOT NULL UNIQUE,
    device_info   VARCHAR(255),
    ip_address    VARCHAR(45),
    expires_at    TIMESTAMP    NOT NULL,
    revoked       BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at    TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sessions_user ON sessions(user_id);
CREATE INDEX idx_sessions_token ON sessions(refresh_token);
CREATE INDEX idx_sessions_expires ON sessions(expires_at);
