// Salt rotativo diário em KV para hash de IP. Mantém K-anonimato sem expor
// IP em claro: o salt muda a cada 24h UTC, então o mesmo IP gera hashes
// diferentes em dias diferentes — re-identificação cross-day fica inviável
// (decisão LGPD intencional, não bug). Em plano paid, um Cron diário rota
// o salt; em free, geramos on-demand na primeira request do dia.

import type { Env } from "./types";

const SALT_TTL_SECONDS = 60 * 60 * 36; // 36h, evita race no rollover.

// Fallback in-memory para quando o KV está indisponível. Vive por instância
// de isolate, então pode haver divergência entre isolates da mesma região —
// aceitável: hash de IP é "best effort" e o sistema todo continua funcionando.
let memoFallbackSalt: string | null = null;

function todayKey(now: Date = new Date()): string {
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, "0");
  const d = String(now.getUTCDate()).padStart(2, "0");
  return `salt:${y}-${m}-${d}`;
}

function randomSalt(): string {
  const buf = new Uint8Array(32);
  crypto.getRandomValues(buf);
  return Array.from(buf, (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function getDailySalt(env: Env): Promise<string> {
  const key = todayKey();
  try {
    const existing = await env.KV.get(key);
    if (existing) return existing;
    const fresh = randomSalt();
    // race tolerável: se duas instâncias gerarem salt diferente no mesmo segundo,
    // o último write vence; alguns hashes do mesmo IP nesse instante divergem.
    // Trade-off aceito — alternativa exigiria Durable Object só pra isso.
    try {
      await env.KV.put(key, fresh, { expirationTtl: SALT_TTL_SECONDS });
    } catch {
      // best-effort: se o put falhar, ainda retornamos o salt gerado.
      // Isolates concorrentes podem produzir salts diferentes — aceitável.
    }
    return fresh;
  } catch {
    if (!memoFallbackSalt) memoFallbackSalt = randomSalt();
    return memoFallbackSalt;
  }
}

// TODO(cron): chamar via Cron Trigger 1x/dia (00:05 UTC) pra pré-rotar o salt
// e evitar a primeira request do dia pagar a latência do KV write.
export async function rotateSaltCron(env: Env): Promise<void> {
  const key = todayKey();
  const fresh = randomSalt();
  await env.KV.put(key, fresh, { expirationTtl: SALT_TTL_SECONDS });
}

export async function hashIp(ip: string, env: Env): Promise<string> {
  if (!ip) return "";
  try {
    const salt = await getDailySalt(env);
    const data = new TextEncoder().encode(`${salt}:${ip}`);
    const buf = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
  } catch (err) {
    // KV totalmente indisponível: prefere gravar evento sem ip_hash a abortar a
    // ingestão inteira. Visível em wrangler tail.
    console.error("[salt] hashIp failed", err);
    return "";
  }
}
