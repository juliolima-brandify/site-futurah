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

interface Bucket {
  /** Timestamps de operações na janela atual, em ms. */
  ts: number[];
  /** Último toque na bucket (pra ordenar/descartar no sweep). */
  last: number;
}

const stores = new Map<string, Map<string, Bucket>>();

/** Cap por store antes do sweep. Suficiente pra single-instance Vercel. */
const STORE_CAP = 5000;
/** A cada N consumes verificamos o tamanho. Sem `setInterval` global pra
 *  não duplicar com HMR/multiple instances do Next App Router. */
const SWEEP_EVERY_N_CONSUMES = 100;

let consumesSinceSweep = 0;

function getStore(name: string): Map<string, Bucket> {
  let s = stores.get(name);
  if (!s) {
    s = new Map();
    stores.set(name, s);
  }
  return s;
}

/**
 * Limpa entries cujas janelas expiraram em todas as stores; se ainda passar
 * do cap, descarta as mais antigas (LRU por `last`).
 */
function sweep(): void {
  for (const [name, store] of stores) {
    const cfg = configByName.get(name);
    const windowMs = cfg?.windowMs ?? 0;
    const cutoff = Date.now() - windowMs;

    // 1ª passada: descarta buckets cujo último timestamp já saiu da janela.
    if (windowMs > 0) {
      for (const [key, b] of store) {
        const lastTs = b.ts[b.ts.length - 1];
        if (lastTs === undefined || lastTs < cutoff) {
          store.delete(key);
        }
      }
    }

    // 2ª passada: se ainda passou do cap, ordena por `last` e descarta os
    // N mais antigos.
    if (store.size > STORE_CAP) {
      const excess = store.size - STORE_CAP;
      const entries = Array.from(store.entries());
      entries.sort((a, b) => a[1].last - b[1].last);
      for (let i = 0; i < excess; i++) {
        store.delete(entries[i][0]);
      }
    }
  }
}

/** Stores indexadas por config — usado pelo sweep pra saber `windowMs`. */
const configByName = new Map<string, RateLimitConfig>();

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
 * limpa entries vencidas só quando a key é tocada. Sweep periódico
 * (a cada `SWEEP_EVERY_N_CONSUMES`) descarta entries fora da janela ou
 * acima do cap pra evitar leak.
 */
export function consume(cfg: RateLimitConfig, key: string): RateLimitResult {
  if (!key) {
    // Sem identificador, deixamos passar (não é nosso job validar input).
    return { ok: true, retryAfterSeconds: 0, remaining: cfg.max };
  }

  configByName.set(cfg.name, cfg);
  const store = getStore(cfg.name);
  const now = Date.now();
  const cutoff = now - cfg.windowMs;

  let bucket = store.get(key);
  if (!bucket) {
    bucket = { ts: [], last: now };
    store.set(key, bucket);
  }

  // Lazy expiration: remove timestamps fora da janela.
  let i = 0;
  while (i < bucket.ts.length && bucket.ts[i] < cutoff) i++;
  if (i > 0) bucket.ts.splice(0, i);

  bucket.last = now;

  // Sweep lazy: a cada N consumes, checa size em todas as stores.
  consumesSinceSweep++;
  if (consumesSinceSweep >= SWEEP_EVERY_N_CONSUMES) {
    consumesSinceSweep = 0;
    let needsSweep = false;
    for (const s of stores.values()) {
      if (s.size > STORE_CAP) {
        needsSweep = true;
        break;
      }
    }
    if (needsSweep) sweep();
  }

  if (bucket.ts.length >= cfg.max) {
    const oldest = bucket.ts[0];
    const retryAfterMs = Math.max(0, oldest + cfg.windowMs - now);
    return {
      ok: false,
      retryAfterSeconds: Math.ceil(retryAfterMs / 1000),
      remaining: 0,
    };
  }

  bucket.ts.push(now);
  return {
    ok: true,
    retryAfterSeconds: 0,
    remaining: cfg.max - bucket.ts.length,
  };
}

// Regex básicos pra IPv4 / IPv6 — só pra rejeitar lixo (string vazia, ":::",
// "spoofed-by-attacker"). Não precisa ser exaustivo: se passar, vira chave
// do Map; se for inválido, cai em "unknown".
const IPV4_RE = /^(\d{1,3}\.){3}\d{1,3}$/;
const IPV6_RE = /^[0-9a-f:]+$/i;

function isPlausibleIp(value: string): boolean {
  if (!value) return false;
  if (IPV4_RE.test(value)) return true;
  // IPv6: precisa de pelo menos um ':' pra evitar matchar palavras alfanum.
  if (value.includes(":") && IPV6_RE.test(value)) return true;
  return false;
}

/**
 * Extrai um IP "razoável" do request. Em Vercel `x-vercel-forwarded-for`
 * é confiável (set pela edge); `x-forwarded-for` é spoofável no header
 * recebido — só o ÚLTIMO hop foi adicionado pelo proxy real.
 */
export function extractIp(headers: Headers): string {
  // 1) Vercel: header dedicado, não controlado pelo cliente.
  const vff = headers.get("x-vercel-forwarded-for");
  if (vff) {
    const candidate = vff.split(",").pop()?.trim() ?? "";
    if (isPlausibleIp(candidate)) return candidate;
  }
  // 2) XFF: pegar o último segmento — Vercel/maioria dos proxies appendam
  //    o IP real ao final, então o primeiro é controlado pelo cliente.
  const xff = headers.get("x-forwarded-for");
  if (xff) {
    const candidate = xff.split(",").pop()?.trim() ?? "";
    if (isPlausibleIp(candidate)) return candidate;
  }
  const real = headers.get("x-real-ip")?.trim() ?? "";
  if (isPlausibleIp(real)) return real;
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
