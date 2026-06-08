import { NextResponse } from "next/server";
import { checkConsumed, markConsumed } from "../../../lib/analise-gate";

// Endpoint chamado pela Action do Custom GPT "Construindo um Viral".
// Recebe um @ do Instagram, puxa perfil + últimos posts via Apify e devolve
// um JSON enxuto pro GPT escrever o diagnóstico. O token Apify NUNCA sai daqui.
//
// Auth: Authorization: Bearer <ANALISE_API_KEY>  (configurado na Action do GPT)
// Uso:  GET /api/analise-perfil?handle=<@ ou url>

export const runtime = "nodejs";
// Apify run-sync pode demorar; pedimos a janela máxima do plano Vercel Pro.
export const maxDuration = 60;

const PROFILE_ACTOR = "apify~instagram-profile-scraper";
const POSTS_ACTOR = "apify~instagram-scraper";
const POSTS_LIMIT = 12;

// Budget interno (ms) — abaixo do timeout da Action do GPT (~45s) e do maxDuration.
const PROFILE_BUDGET_MS = 40_000;
const POSTS_BUDGET_MS = 45_000;

// Cache em memória (instância quente) — corta custo Apify em @ repetidos.
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const cache = new Map<string, { at: number; data: unknown }>();

// Rate-limit grosseiro por janela, por chave (handle) — backstop anti-abuso.
// O controle forte é a API key; isto evita loop acidental do GPT.
const RL_WINDOW_MS = 60_000;
const RL_MAX = 20;
const rl = new Map<string, number[]>();

function normalizeHandle(v: string) {
  return v
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/^(www\.)?instagram\.com\//i, "")
    .replace(/^@/, "")
    .replace(/\/+$/, "")
    .split(/[/?#]/)[0]
    .toLowerCase();
}

const HANDLE_RE = /^[A-Za-z0-9._]{1,30}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function rateLimited(key: string) {
  const now = Date.now();
  const hits = (rl.get(key) ?? []).filter((t) => now - t < RL_WINDOW_MS);
  hits.push(now);
  rl.set(key, hits);
  return hits.length > RL_MAX;
}

async function apifyRunSync(
  actor: string,
  input: unknown,
  token: string,
  budgetMs: number,
): Promise<unknown[]> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), budgetMs);
  try {
    const res = await fetch(
      `https://api.apify.com/v2/acts/${actor}/run-sync-get-dataset-items?token=${token}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
        signal: ctrl.signal,
      },
    );
    if (!res.ok) {
      throw new Error(`apify ${actor} -> HTTP ${res.status}`);
    }
    const json = (await res.json()) as unknown;
    return Array.isArray(json) ? json : [];
  } finally {
    clearTimeout(timer);
  }
}

function pick<T>(o: Record<string, unknown>, k: string): T | undefined {
  return o[k] as T | undefined;
}

function normalizeProfile(item: Record<string, unknown> | undefined) {
  if (!item) return null;
  return {
    username: pick<string>(item, "username") ?? null,
    fullName: pick<string>(item, "fullName") ?? null,
    biography: pick<string>(item, "biography") ?? null,
    followers: pick<number>(item, "followersCount") ?? null,
    following: pick<number>(item, "followsCount") ?? null,
    posts: pick<number>(item, "postsCount") ?? null,
    verified: pick<boolean>(item, "verified") ?? null,
    private: pick<boolean>(item, "private") ?? null,
    category: pick<string>(item, "businessCategoryName") ?? null,
    externalUrl: pick<string>(item, "externalUrl") ?? null,
  };
}

function normalizePosts(items: unknown[]) {
  return items
    .map((raw) => {
      const p = raw as Record<string, unknown>;
      const type = pick<string>(p, "type") ?? null;
      const productType = pick<string>(p, "productType") ?? null;
      return {
        kind:
          productType === "clips" || type === "Video"
            ? "reel/video"
            : type ?? "post",
        caption: pick<string>(p, "caption") ?? null,
        likes: pick<number>(p, "likesCount") ?? null,
        comments: pick<number>(p, "commentsCount") ?? null,
        views:
          pick<number>(p, "videoPlayCount") ??
          pick<number>(p, "videoViewCount") ??
          null,
        durationSec: pick<number>(p, "videoDuration") ?? null,
        timestamp: pick<string>(p, "timestamp") ?? null,
        url: pick<string>(p, "url") ?? null,
      };
    })
    .slice(0, POSTS_LIMIT);
}

export async function GET(req: Request) {
  // --- Auth -----------------------------------------------------------------
  const expected = process.env.ANALISE_API_KEY;
  if (!expected || expected.length < 16) {
    console.error("[analise-perfil] ANALISE_API_KEY nao configurada");
    return NextResponse.json({ error: "unconfigured" }, { status: 500 });
  }
  const auth = req.headers.get("authorization") ?? "";
  const provided = auth.replace(/^Bearer\s+/i, "").trim();
  if (provided !== expected) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const apifyToken = process.env.APIFY_TOKEN;
  if (!apifyToken || apifyToken.length < 16) {
    console.error("[analise-perfil] APIFY_TOKEN nao configurado");
    return NextResponse.json({ error: "unconfigured" }, { status: 500 });
  }

  // --- Input ----------------------------------------------------------------
  const url = new URL(req.url);
  const handle = normalizeHandle(url.searchParams.get("handle") ?? "");
  if (!HANDLE_RE.test(handle)) {
    return NextResponse.json(
      { error: "handle_invalid", message: "Informe um @ válido do Instagram." },
      { status: 400 },
    );
  }

  const email = (url.searchParams.get("email") ?? "").trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      {
        error: "email_required",
        message:
          "Peça ao aluno o email do cadastro na área de membros para liberar a análise.",
      },
      { status: 400 },
    );
  }

  if (rateLimited(handle)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  // --- Gate de escassez: 1 análise gratuita por email -----------------------
  const consumed = await checkConsumed(email);
  if (consumed.blocked) {
    return NextResponse.json({
      ok: true,
      allowed: false,
      reason: "already_used",
      previousHandle: consumed.handle,
      message:
        "Este aluno já usou a análise gratuita do perfil. Não rode outra. " +
        "Explique com gentileza que a análise é uma por aluno e ofereça o " +
        "Assistente de Conteúdo (order bump) para continuar criando ganchos e roteiros.",
    });
  }

  // --- Cache ----------------------------------------------------------------
  // O gate por email já rodou acima; o cache só evita re-scrape (custo Apify).
  const cached = cache.get(handle);
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
    await markConsumed(email, handle);
    return NextResponse.json(cached.data);
  }

  // --- Apify (perfil + posts em paralelo, falha parcial tolerada) -----------
  const [profileRes, postsRes] = await Promise.allSettled([
    apifyRunSync(
      PROFILE_ACTOR,
      { usernames: [handle] },
      apifyToken,
      PROFILE_BUDGET_MS,
    ),
    apifyRunSync(
      POSTS_ACTOR,
      {
        directUrls: [`https://www.instagram.com/${handle}/`],
        resultsType: "posts",
        resultsLimit: POSTS_LIMIT,
      },
      apifyToken,
      POSTS_BUDGET_MS,
    ),
  ]);

  const profile =
    profileRes.status === "fulfilled"
      ? normalizeProfile(profileRes.value[0] as Record<string, unknown>)
      : null;

  // Sem perfil = não conseguimos nada útil (privado, inexistente, ou Apify caiu).
  if (!profile || !profile.username) {
    const reason =
      profileRes.status === "rejected"
        ? "scrape_failed"
        : "profile_not_found";
    return NextResponse.json(
      {
        error: reason,
        message:
          "Não consegui ler esse perfil. Ele pode ser privado, não existir, ou o @ está errado. Confirme o @ ou cole os dados manualmente.",
      },
      { status: 404 },
    );
  }

  const posts =
    postsRes.status === "fulfilled" && !profile.private
      ? normalizePosts(postsRes.value)
      : [];

  const data = {
    ok: true,
    allowed: true,
    fetchedFor: handle,
    profile,
    posts,
    postsAvailable: posts.length,
    // Sinaliza pro GPT quando faltam posts (privado/timeout) pra ele pedir ao aluno.
    notes:
      posts.length === 0
        ? profile.private
          ? "Perfil privado: só foi possível ler os dados públicos do perfil. Peça ao aluno as legendas e métricas dos últimos posts."
          : "Não foi possível puxar os posts a tempo. Diagnostique o perfil e peça ao aluno as legendas/métricas dos últimos conteúdos."
        : null,
  };

  cache.set(handle, { at: Date.now(), data });
  await markConsumed(email, handle);
  return NextResponse.json(data);
}
