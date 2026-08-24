-- ═══════════════════════════════════════════════════════════════
-- V7: Audit Logs Table
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE audit_logs (
    id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id       UUID REFERENCES users(id) ON DELETE SET NULL,
    action        VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id   UUID,
    ip_address    VARCHAR(45),
    user_agent    VARCHAR(500),
    details       JSONB,
    created_at    TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);
