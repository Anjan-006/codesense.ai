-- ═══════════════════════════════════════════════════════════════
-- V4: Embedding Metadata Table
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE embedding_metadata (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id      UUID          NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    file_id         UUID          NOT NULL REFERENCES project_files(id) ON DELETE CASCADE,
    chunk_type      VARCHAR(30)   NOT NULL,
    chunk_content   TEXT          NOT NULL,
    class_name      VARCHAR(255),
    method_name     VARCHAR(255),
    module_name     VARCHAR(255),
    package_name    VARCHAR(255),
    framework       VARCHAR(100),
    language        VARCHAR(50),
    start_line      INT,
    end_line        INT,
    qdrant_point_id UUID          NOT NULL,
    token_count     INT           NOT NULL DEFAULT 0,
    created_at      TIMESTAMP     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_embedding_metadata_project ON embedding_metadata(project_id);
CREATE INDEX idx_embedding_metadata_file ON embedding_metadata(file_id);
CREATE INDEX idx_embedding_metadata_qdrant ON embedding_metadata(qdrant_point_id);
