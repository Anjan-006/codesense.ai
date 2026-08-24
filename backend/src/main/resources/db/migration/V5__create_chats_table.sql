-- ═══════════════════════════════════════════════════════════════
-- V5: Chats Table
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE chats (
    id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id     UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    project_id  UUID         NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title       VARCHAR(255) NOT NULL DEFAULT 'New Chat',
    chat_type   VARCHAR(30)  NOT NULL DEFAULT 'GENERAL',
    archived    BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_chats_user ON chats(user_id);
CREATE INDEX idx_chats_project ON chats(project_id);
