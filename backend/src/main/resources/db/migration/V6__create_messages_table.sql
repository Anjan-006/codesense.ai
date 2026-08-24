-- ═══════════════════════════════════════════════════════════════
-- V6: Messages Table
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE messages (
    id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    chat_id          UUID         NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
    role             VARCHAR(20)  NOT NULL,
    content          TEXT         NOT NULL,
    code_references  JSON,
    confidence_score FLOAT,
    tokens_used      INT          NOT NULL DEFAULT 0,
    latency_ms       INT,
    created_at       TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_messages_chat ON messages(chat_id);
CREATE INDEX idx_messages_created ON messages(created_at);
