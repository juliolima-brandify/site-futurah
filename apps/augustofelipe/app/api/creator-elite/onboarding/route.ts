import { NextResponse } from "next/server";
import { after } from "next/server";
import {
  enviarEmailOnboarding,
  type OnboardingAnswer,
} from "../../../../lib/email/onboarding";

const SITE_ID = "augustofelipe";
const SOURCE = "creator-elite-onboarding";
const NOTIFY_TO = process.env.CREATOR_ELITE_NOTIFY_EMAIL || "augustofelipe@futurah.co";

function ingestEndpoint(): string {
  const fromEnv = process.env.LEADS_INGEST_URL;
  if (fromEnv && fromEnv.length > 0) return fromEnv;
  return "https://www.futurah.co/api/leads/ingest";
}

type IncomingAnswer = {
  step?: unknown;
  question?: unknown;
  value?: unknown;
};

type IncomingPayload = {
  name?: unknown;
  email?: unknown;
  whatsapp?: unknown;
  instagram?: unknown;
  answers?: unknown;
};

function normalizeInstagram(v: string): string {
  return v
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/^(www\.)?instagram\.com\//i, "")
    .replace(/^@/, "")
    .replace(/\/+$/, "")
    .split(/[/?#]/)[0];
}

const INSTAGRAM_RE = /^[A-Za-z0-9._]{1,30}$/;

function isString(x: unknown): x is string {
  return typeof x === "string";
}

function sanitizeAnswers(raw: unknown): OnboardingAnswer[] {
  if (!Array.isArray(raw)) return [];
  const out: OnboardingAnswer[] = [];
  for (const item of raw as IncomingAnswer[]) {
    if (!item || typeof item !== "object") continue;
    const step = isString(item.step) ? item.step.slice(0, 80).trim() : "";
    const question = isString(item.question)
      ? item.question.slice(0, 400).trim()
      : "";
    const value = isString(item.value) ? item.value.slice(0, 5000).trim() : "";
    if (!step || !question || !value) continue;
    out.push({ step, question, value });
  }
  return out;
}

export async function POST(req: Request) {
  let body: IncomingPayload;
  try {
    body = (await req.json()) as IncomingPayload;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const name = isString(body.name) ? body.name.trim() : "";
  const email = isString(body.email) ? body.email.trim().toLowerCase() : "";
  const whatsappDigits = isString(body.whatsapp)
    ? body.whatsapp.replace(/\D+/g, "")
    : "";
  const instagram = normalizeInstagram(isString(body.instagram) ? body.instagram : "");
  const answers = sanitizeAnswers(body.answers);

  if (name.length < 2)
    return NextResponse.json({ error: "name_invalid" }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return NextResponse.json({ error: "email_invalid" }, { status: 400 });
  if (whatsappDigits.length < 10 || whatsappDigits.length > 11)
    return NextResponse.json({ error: "whatsapp_invalid" }, { status: 400 });
  if (!INSTAGRAM_RE.test(instagram))
    return NextResponse.json({ error: "instagram_invalid" }, { status: 400 });
  if (answers.length < 5)
    return NextResponse.json({ error: "answers_invalid" }, { status: 400 });

  const token = process.env.LEADS_INGEST_TOKEN;
  if (!token || token.length < 16) {
    console.error("[creator-elite/onboarding] LEADS_INGEST_TOKEN nao configurado");
    return NextResponse.json({ error: "ingest_unconfigured" }, { status: 500 });
  }

  const ingestPayload = {
    siteId: SITE_ID,
    name,
    email,
    whatsapp: whatsappDigits,
    social: instagram,
    source: SOURCE,
    answers,
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
    console.error("[creator-elite/onboarding] ingest fetch failed", err);
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

  after(async () => {
    try {
      await enviarEmailOnboarding({
        to: NOTIFY_TO,
        lead: { name, email, whatsapp: whatsappDigits, instagram },
        answers,
        submittedAt: new Date(),
      });
    } catch (err) {
      console.error("[creator-elite/onboarding] notify exception", err);
    }
  });

  return NextResponse.json({ ok: true });
}
