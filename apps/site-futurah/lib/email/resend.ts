import "server-only";
import { Resend } from "resend";

/**
 * Email transacional via Resend.
 *
 * Sem `RESEND_API_KEY` definido o helper apenas dá `console.warn` e
 * retorna `{ ok: false, skipped: true }` — não quebra o admin.
 *
 * Template HTML inline (sem React Email) — é simples o bastante.
 */

let _client: Resend | null = null;
function getClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  if (!_client) _client = new Resend(apiKey);
  return _client;
}

interface EnviarArgs {
  to: string;
  nome: string | null;
  slug: string;
  agendaUrl?: string;
}

interface EnviarResult {
  ok: boolean;
  skipped?: boolean;
  error?: string;
  id?: string;
}

const SITE_URL = "https://futurah.co";
const DEFAULT_FROM = "Futurah <analise@futurah.co>";

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Sanitiza nome pra uso em headers (subject) e corpos: remove CR/LF que
 * permitiriam header injection no envelope SMTP. Defensivo — Resend
 * provavelmente já filtra, mas mantemos o filtro local também.
 */
function sanitizeNome(nome: string): string {
  return nome.replace(/[\r\n]+/g, " ").trim();
}

function buildHtml({ nome, slug, agendaUrl }: EnviarArgs): string {
  const link = `${SITE_URL}/analise/${encodeURIComponent(slug)}`;
  const safeNome = nome ? escapeHtml(sanitizeNome(nome).split(" ")[0]) : "Olá";
  const ctaAgenda = agendaUrl
    ? `<p style="margin: 24px 0 0;">
         <a href="${escapeHtml(agendaUrl)}"
            style="display: inline-block; background: #1B1B1B; color: #fff; padding: 14px 24px; border-radius: 12px; text-decoration: none; font-weight: 500;">
           Agendar Sessão Estratégica →
         </a>
       </p>`
    : `<p style="margin: 24px 0 0; font-size: 14px; color: #555;">
         Quando quiser conversar sobre o plano de implementação,
         responda este email ou escreva pra
         <a href="mailto:contato@futurah.co">contato@futurah.co</a>.
       </p>`;

  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Sua análise estratégica está pronta</title>
</head>
<body style="margin: 0; padding: 0; background: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif; color: #1B1B1B;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: #f5f5f5; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; background: #fff; border-radius: 20px; padding: 40px;">
          <tr>
            <td>
              <p style="margin: 0; font-size: 13px; color: #6b7280; letter-spacing: 0.04em; text-transform: uppercase;">Futurah & Co.</p>
              <h1 style="margin: 12px 0 16px; font-size: 28px; font-weight: 600; line-height: 1.2; color: #1B1B1B;">
                ${safeNome}, sua análise está pronta
              </h1>
              <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.55; color: #383838;">
                Nossa equipe revisou o relatório que a Futurah preparou pra você cruzando os dados que você compartilhou com o nosso catálogo de substituição operacional.
              </p>
              <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.55; color: #383838;">
                A análise está disponível no link abaixo (privado, não indexado em buscadores):
              </p>
              <p style="margin: 16px 0 0;">
                <a href="${link}"
                   style="display: inline-block; background: #DCFF69; color: #1B1B1B; padding: 14px 24px; border-radius: 12px; text-decoration: none; font-weight: 500;">
                  Ver minha análise →
                </a>
              </p>
              <p style="margin: 24px 0 0; font-size: 13px; color: #6b7280;">
                Se o botão não abrir: <a href="${link}" style="color: #0B2FFF;">${link}</a>
              </p>
              ${ctaAgenda}
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0 16px;" />
              <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                Futurah — Inteligência aplicada a operações.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildText({ nome, slug, agendaUrl }: EnviarArgs): string {
  const link = `${SITE_URL}/analise/${slug}`;
  const oi = nome ? `${sanitizeNome(nome).split(" ")[0]},` : "Olá,";
  const lines = [
    `${oi} sua análise estratégica da Futurah está pronta.`,
    "",
    `Acesse aqui (privado, não indexado): ${link}`,
    "",
  ];
  if (agendaUrl) {
    lines.push(
      `Quando quiser ver o plano de implementação detalhado, agende uma Sessão Estratégica: ${agendaUrl}`,
    );
  } else {
    lines.push(
      "Pra conversar sobre o plano de implementação, responda este email ou escreva pra contato@futurah.co.",
    );
  }
  lines.push("", "Futurah — Inteligência aplicada a operações.");
  return lines.join("\n");
}

export async function enviarEmailAnalisePronta(
  args: EnviarArgs,
): Promise<EnviarResult> {
  const client = getClient();
  if (!client) {
    console.warn(
      "[email/resend] RESEND_API_KEY ausente — pulando email de aprovação para",
      args.to,
    );
    return { ok: false, skipped: true };
  }

  const from = process.env.RESEND_FROM_EMAIL || DEFAULT_FROM;
  const subject = args.nome
    ? `${sanitizeNome(args.nome).split(" ")[0]}, sua análise estratégica está pronta`
    : "Sua análise estratégica da Futurah está pronta";

  try {
    const { data, error } = await client.emails.send({
      from,
      to: args.to,
      subject,
      html: buildHtml(args),
      text: buildText(args),
    });

    if (error) {
      console.error("[email/resend] falhou", error);
      return { ok: false, error: error.message ?? "unknown" };
    }

    return { ok: true, id: data?.id };
  } catch (err) {
    console.error("[email/resend] exception:", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "unknown",
    };
  }
}
