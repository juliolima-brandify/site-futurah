-- Migration 0002: dropar tabela `leads` do D1.
--
-- Captura de leads agora vai pro Payload (Postgres) via /api/leads/ingest
-- no site-futurah, com tenant scope. A tabela aqui (criada na 0001) ficou
-- redundante e nunca chegou a ser fonte autoritativa — foi feature gap, não
-- migration de dado.
--
-- Drop dos índices vem antes (boa prática mesmo com IF EXISTS no DROP TABLE).

DROP INDEX IF EXISTS idx_leads_site_email;
DROP INDEX IF EXISTS idx_leads_site_created;
DROP TABLE IF EXISTS leads;
