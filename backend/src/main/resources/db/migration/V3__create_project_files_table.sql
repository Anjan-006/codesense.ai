-- ═══════════════════════════════════════════════════════════════
-- V3: Project Files Table
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE project_files (
    id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id        UUID          NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    file_path         VARCHAR(1000) NOT NULL,
    file_name         VARCHAR(255)  NOT NULL,
    language          VARCHAR(50),
    size_bytes        BIGINT        NOT NULL DEFAULT 0,
    content_hash      VARCHAR(64),
    classes_count     INT           NOT NULL DEFAULT 0,
    methods_count     INT           NOT NULL DEFAULT 0,
    lines_of_code     INT           NOT NULL DEFAULT 0,
    complexity_score  FLOAT,
    content           TEXT,
    created_at        TIMESTAMP     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_project_files_project_id ON project_files(project_id);
CREATE INDEX idx_project_files_language ON project_files(language);
