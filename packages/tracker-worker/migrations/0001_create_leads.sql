-- Fase 2: tabela `leads` para captura de formulários (ex.: quiz /diagnostico).
-- Endpoint: POST /lead. INSERT OR IGNORE no UNIQUE(site_id,email) para idempotência.
-- created_at em epoch ms para casar com `Date.now()` usado no resto do Worker.

CREATE TABLE IF NOT EXISTS leads (
  id          TEXT    PRIMARY KEY,
  site_id     TEXT    NOT NULL,
  name        TEXT    NOT NULL,
  whatsapp    TEXT    NOT NULL,
  email       TEXT    NOT NULL,
  source      TEXT    NOT NULL,
  answers     TEXT    NOT NULL DEFAULT '[]',
  anon_id     TEXT,
  ip          TEXT,
  user_agent  TEXT,
  created_at  INTEGER NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_leads_site_email
  ON leads (site_id, email);

CREATE INDEX IF NOT EXISTS idx_leads_site_created
  ON leads (site_id, created_at DESC);
