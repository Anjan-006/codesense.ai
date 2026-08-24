-- ═══════════════════════════════════════════════════════════════
-- V1: Users Table
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE users (
    id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email               VARCHAR(255)  NOT NULL UNIQUE,
    password_hash       VARCHAR(255)  NOT NULL,
    first_name          VARCHAR(100)  NOT NULL,
    last_name           VARCHAR(100)  NOT NULL,
    role                VARCHAR(20)   NOT NULL DEFAULT 'USER',
    email_verified      BOOLEAN       NOT NULL DEFAULT FALSE,
    verification_token  VARCHAR(255),
    reset_token         VARCHAR(255),
    reset_token_expiry  TIMESTAMP,
    avatar_url          VARCHAR(500),
    storage_used_bytes  BIGINT        NOT NULL DEFAULT 0,
    created_at          TIMESTAMP     NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
