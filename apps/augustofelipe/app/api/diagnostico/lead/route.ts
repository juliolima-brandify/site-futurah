import { NextResponse } from "next/server";

// Site_id deste app — mapeia 1:1 com `tenants.siteId` no Payload do site-futurah.
const SITE_ID = "augustofelipe";

// Endpoint do site-futurah que faz a ingestão tenant-aware.
// Override via env (LEADS_INGEST_URL) pra rodar contra preview/staging.
function ingestEndpoint(): string {
  const fromEnv = process.env.LEADS_INGEST_URL;
  if (fromEnv && fromEnv.length > 0) return fromEnv;
  return "https://www.futurah.co/api/leads/ingest";
}

type LeadPayload = {
  name?: string;
  whatsapp?: string;
  email?: string;
  answers?: unknown;
  source?: string;
};

export async function POST(req: Request) {
  let body: LeadPayload;
  try {
    body = (await req.json()) as LeadPayload;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  // Defesa em profundidade: validamos aqui antes de chamar o site-futurah,
  // pra cortar payloads obviamente ruins sem round-trip.
  const name = (body.name ?? "").trim();
  const whatsappDigits = (body.whatsapp ?? "").replace(/\D+/g, "");
  const email = (body.email ?? "").trim().toLowerCase();

  if (name.length < 2)
    return NextResponse.json({ error: "name_invalid" }, { status: 400 });
  if (whatsappDigits.length < 10 || whatsappDigits.length > 11)
    return NextResponse.json({ error: "whatsapp_invalid" }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return NextResponse.json({ error: "email_invalid" }, { status: 400 });

  const token = process.env.LEADS_INGEST_TOKEN;
  if (!token || token.length < 16) {
    console.error("[diagnostico/lead] LEADS_INGEST_TOKEN nao configurado");
    return NextResponse.json({ error: "ingest_unconfigured" }, { status: 500 });
  }

  const ingestPayload = {
    siteId: SITE_ID,
    name,
    email,
    whatsapp: whatsappDigits,
    source: body.source || "diagnostico",
    answers: Array.isArray(body.answers) ? body.answers : null,
  };

  let upstream: Response;
  try {
    upstream = await fetch(ingestEndpoint(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(ingestPayload),
    });
  } catch (err) {
    console.error("[diagnostico/lead] ingest fetch failed", err);
    return NextResponse.json({ error: "upstream_unreachable" }, { status: 502 });
  }

  let upstreamJson: unknown;
  try {
    upstreamJson = await upstream.json();
  } catch {
    upstreamJson = null;
  }

  if (!upstream.ok) {
    const out =
      upstreamJson && typeof upstreamJson === "object"
        ? (upstreamJson as Record<string, unknown>)
        : { error: "upstream_error" };
    return NextResponse.json(out, { status: upstream.status });
  }

  return NextResponse.json(upstreamJson ?? { ok: true });
}
