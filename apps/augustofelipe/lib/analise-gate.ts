import { getPool } from "./db";

// Gate de escassez do bônus "Análise de Perfil": 1 análise gratuita por aluno,
// identificado pelo email (o do cadastro na área de membros). Estado persistido
// numa tabela própria no Postgres do Payload (não gerida pelo Payload — ele
// ignora tabelas que não conhece).
//
// Filosofia de falha: se o DB estiver indisponível (ou DATABASE_URL ausente em
// dev), a gente NÃO trava o aluno — libera com warning. Melhor furar a escassez
// num apagão raro do que quebrar a experiência de um produto pago.

let ensured = false;

async function ensureTable(): Promise<boolean> {
  const pool = getPool();
  if (!pool) return false;
  if (ensured) return true;
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS analise_usage (
        email   text PRIMARY KEY,
        handle  text NOT NULL,
        site_id text NOT NULL DEFAULT 'augustofelipe',
        used_at timestamptz NOT NULL DEFAULT now()
      );
    `);
    ensured = true;
    return true;
  } catch (err) {
    console.error("[analise-gate] ensureTable falhou", err);
    return false;
  }
}

export type ConsumedCheck =
  | { blocked: false } // pode rodar (nunca usou, ou DB indisponível → fail-open)
  | { blocked: true; handle: string; usedAt: string };

/** Verifica se o email já consumiu a análise. NÃO marca consumo. */
export async function checkConsumed(email: string): Promise<ConsumedCheck> {
  const ok = await ensureTable();
  const pool = getPool();
  if (!ok || !pool) return { blocked: false }; // fail-open
  try {
    const res = await pool.query<{ handle: string; used_at: Date }>(
      "SELECT handle, used_at FROM analise_usage WHERE email = $1 LIMIT 1",
      [email],
    );
    const row = res.rows[0];
    if (!row) return { blocked: false };
    return {
      blocked: true,
      handle: row.handle,
      usedAt: row.used_at.toISOString(),
    };
  } catch (err) {
    console.error("[analise-gate] checkConsumed falhou", err);
    return { blocked: false }; // fail-open
  }
}

/** Marca o consumo (idempotente). Chamar só após a análise dar certo. */
export async function markConsumed(email: string, handle: string): Promise<void> {
  const ok = await ensureTable();
  const pool = getPool();
  if (!ok || !pool) return;
  try {
    await pool.query(
      `INSERT INTO analise_usage (email, handle)
       VALUES ($1, $2)
       ON CONFLICT (email) DO NOTHING`,
      [email, handle],
    );
  } catch (err) {
    console.error("[analise-gate] markConsumed falhou", err);
  }
}
