import "server-only";
import { Resend } from "resend";

let _client: Resend | null = null;
function getClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  if (!_client) _client = new Resend(apiKey);
  return _client;
}

export interface OnboardingAnswer {
  step: string;
  question: string;
  value: string;
}

export interface OnboardingEmailArgs {
  to: string;
  lead: {
    name: string;
    email: string;
    whatsapp: string;
    instagram: string;
  };
  answers: OnboardingAnswer[];
  submittedAt: Date;
}

interface SendResult {
  ok: boolean;
  skipped?: boolean;
  error?: string;
  id?: string;
}

const DEFAULT_FROM = "Creator Elite <analise@futurah.co>";

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatWhatsapp(digits: string): string {
  const d = digits.replace(/\D+/g, "");
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return digits;
}

function formatDate(d: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    dateStyle: "short",
    timeStyle: "short",
  }).format(d);
}

function buildHtml({ lead, answers, submittedAt }: OnboardingEmailArgs): string {
  const safeName = escapeHtml(lead.name);
  const safeEmail = escapeHtml(lead.email);
  const safeWhats = escapeHtml(formatWhatsapp(lead.whatsapp));
  const safeIg = escapeHtml(lead.instagram);
  const igUrl = `https://instagram.com/${encodeURIComponent(lead.instagram)}`;
  const whatsUrl = `https://wa.me/55${lead.whatsapp.replace(/\D+/g, "")}`;
  const when = escapeHtml(formatDate(submittedAt));

  const answerRows = answers
    .map(
      (a) => `
        <tr>
          <td style="padding: 16px 20px; border-bottom: 1px solid #e5e7eb; vertical-align: top; width: 30%;">
            <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; color: #6b7280; font-weight: 600;">${escapeHtml(a.step)}</div>
            <div style="margin-top: 4px; font-size: 14px; color: #111827; font-weight: 600;">${escapeHtml(a.question)}</div>
          </td>
          <td style="padding: 16px 20px; border-bottom: 1px solid #e5e7eb; vertical-align: top; font-size: 14px; line-height: 1.55; color: #1f2937; white-space: pre-wrap;">${escapeHtml(a.value)}</td>
        </tr>`,
    )
    .join("");

  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Novo questionário Creator Elite</title>
</head>
<body style="margin: 0; padding: 0; background: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif; color: #111827;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: #f3f4f6; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 720px; background: #fff; border-radius: 20px; overflow: hidden;">
          <tr>
            <td style="padding: 32px 32px 16px;">
              <p style="margin: 0; font-size: 12px; color: #6b7280; letter-spacing: 0.08em; text-transform: uppercase; font-weight: 600;">Creator Elite · Onboarding</p>
              <h1 style="margin: 8px 0 4px; font-size: 24px; font-weight: 700; line-height: 1.25; color: #111827;">
                Novo questionário preenchido por ${safeName}
              </h1>
              <p style="margin: 0; font-size: 13px; color: #6b7280;">Enviado em ${when}</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 32px 24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: #f9fafb; border-radius: 12px; border: 1px solid #e5e7eb;">
                <tr>
                  <td style="padding: 16px 20px; font-size: 14px; color: #374151; line-height: 1.6;">
                    <strong>Nome:</strong> ${safeName}<br />
                    <strong>Email:</strong> <a href="mailto:${safeEmail}" style="color: #1d4ed8;">${safeEmail}</a><br />
                    <strong>WhatsApp:</strong> <a href="${whatsUrl}" style="color: #1d4ed8;">${safeWhats}</a><br />
                    <strong>Instagram:</strong> <a href="${igUrl}" style="color: #1d4ed8;">@${safeIg}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 32px 32px;">
              <h2 style="margin: 16px 0 12px; font-size: 16px; font-weight: 700; color: #111827;">Respostas</h2>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
                ${answerRows}
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildText({ lead, answers, submittedAt }: OnboardingEmailArgs): string {
  const lines = [
    `Novo questionário Creator Elite preenchido por ${lead.name}.`,
    `Enviado em ${formatDate(submittedAt)}.`,
    "",
    "DADOS DE CONTATO",
    `Nome: ${lead.name}`,
    `Email: ${lead.email}`,
    `WhatsApp: ${formatWhatsapp(lead.whatsapp)}`,
    `Instagram: @${lead.instagram} (https://instagram.com/${lead.instagram})`,
    "",
    "RESPOSTAS",
  ];
  for (const a of answers) {
    lines.push("", `[${a.step}] ${a.question}`, a.value);
  }
  return lines.join("\n");
}

export async function enviarEmailOnboarding(
  args: OnboardingEmailArgs,
): Promise<SendResult> {
  const client = getClient();
  if (!client) {
    console.warn(
      "[email/onboarding] RESEND_API_KEY ausente — pulando notificacao para",
      args.to,
    );
    return { ok: false, skipped: true };
  }

  const from = process.env.RESEND_FROM_EMAIL || DEFAULT_FROM;
  const subject = `[Creator Elite] Novo questionário — ${args.lead.name}`;
  const replyTo = args.lead.email;

  try {
    const { data, error } = await client.emails.send({
      from,
      to: args.to,
      replyTo,
      subject,
      html: buildHtml(args),
      text: buildText(args),
    });
    if (error) {
      console.error("[email/onboarding] resend falhou", error);
      return { ok: false, error: error.message ?? "unknown" };
    }
    return { ok: true, id: data?.id };
  } catch (err) {
    console.error("[email/onboarding] exception", err);
    return { ok: false, error: err instanceof Error ? err.message : "unknown" };
  }
}
