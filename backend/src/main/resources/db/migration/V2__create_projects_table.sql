-- ═══════════════════════════════════════════════════════════════
-- V2: Projects Table
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE projects (
    id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id             UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name                VARCHAR(255)  NOT NULL,
    description         TEXT,
    source_type         VARCHAR(20)   NOT NULL,
    github_url          VARCHAR(500),
    primary_language    VARCHAR(50),
    status              VARCHAR(20)   NOT NULL DEFAULT 'UPLOADING',
    total_files         INT           NOT NULL DEFAULT 0,
    total_size_bytes    BIGINT        NOT NULL DEFAULT 0,
    indexed_files       INT           NOT NULL DEFAULT 0,
    framework_detected  VARCHAR(100),
    storage_path        VARCHAR(500),
    language_stats      JSON,
    created_at          TIMESTAMP     NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_status ON projects(status);
