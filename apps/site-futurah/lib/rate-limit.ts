import "server-only";

/**
 * Rate-limit em memória, janela deslizante.
 *
 * In-memory por instância — migrar pra Upstash Redis se escalar horizontal
 * (múltiplas regiões/funções compartilhando estado). Pra Vercel single-region
 * e o volume atual de `/api/aplicacao` (lead magnet), in-memory cobre.
 *
 * Cada `consume()` retorna `{ ok, retryAfterSeconds }`. Quando `ok=false`,
 * o caller responde 429 com `Retry-After`.
 */

type Bucket = number[]; // timestamps em ms

const stores = new Map<string, Map<string, Bucket>>();

function getStore(name: string): Map<string, Bucket> {
  let s = stores.get(name);
  if (!s) {
    s = new Map();
    stores.set(name, s);
  }
  return s;
}

export interface RateLimitConfig {
  /** Identificador da regra (ex: "aplicacao:ip"). */
  name: string;
  /** Janela em milissegundos. */
  windowMs: number;
  /** Quantas operações são permitidas dentro da janela. */
  max: number;
}

export interface RateLimitResult {
  ok: boolean;
  /** Segundos até o slot mais antigo expirar (só relevante quando `ok=false`). */
  retryAfterSeconds: number;
  /** Quantas operações restantes na janela atual. */
  remaining: number;
}

/**
 * Tenta consumir 1 slot do bucket `key` na regra `cfg`. Lazy expiration:
 * limpa entries vencidas só quando a key é tocada.
 */
export function consume(cfg: RateLimitConfig, key: string): RateLimitResult {
  if (!key) {
    // Sem identificador, deixamos passar (não é nosso job validar input).
    return { ok: true, retryAfterSeconds: 0, remaining: cfg.max };
  }

  const store = getStore(cfg.name);
  const now = Date.now();
  const cutoff = now - cfg.windowMs;

  let bucket = store.get(key);
  if (!bucket) {
    bucket = [];
    store.set(key, bucket);
  }

  // Lazy expiration: remove timestamps fora da janela.
  let i = 0;
  while (i < bucket.length && bucket[i] < cutoff) i++;
  if (i > 0) bucket.splice(0, i);

  if (bucket.length >= cfg.max) {
    const oldest = bucket[0];
    const retryAfterMs = Math.max(0, oldest + cfg.windowMs - now);
    return {
      ok: false,
      retryAfterSeconds: Math.ceil(retryAfterMs / 1000),
      remaining: 0,
    };
  }

  bucket.push(now);
  return {
    ok: true,
    retryAfterSeconds: 0,
    remaining: cfg.max - bucket.length,
  };
}

/**
 * Extrai um IP "razoável" do request — primeiro hop do `x-forwarded-for`
 * com fallback `unknown` (deixa o rate-limit funcionar de forma agregada
 * em vez de quebrar).
 */
export function extractIp(headers: Headers): string {
  const xff = headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  const real = headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}

// Configs default usados pelo `/api/aplicacao`. Centralizadas aqui pra
// ficar fácil ajustar em um lugar só.
export const RL_APLICACAO_IP: RateLimitConfig = {
  name: "aplicacao:ip",
  windowMs: 60 * 60 * 1000, // 1h
  max: 5,
};

export const RL_APLICACAO_EMAIL: RateLimitConfig = {
  name: "aplicacao:email",
  windowMs: 24 * 60 * 60 * 1000, // 24h
  max: 2,
};
