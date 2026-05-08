import { gateway } from "@ai-sdk/gateway";

/**
 * Cliente do Vercel AI Gateway.
 *
 * Em prod (deploy Vercel), o gateway autentica via OIDC token automaticamente —
 * não precisa de chave. Em dev local, exporte `AI_GATEWAY_API_KEY` no .env.local.
 *
 * Model ID precisa do prefixo do provider, ex: 'openai/gpt-4.1-mini'.
 * Trocar por 'anthropic/claude-sonnet-4-6' ou outro requer só esta var.
 */
export const ANALISE_MODEL = process.env.AI_GATEWAY_MODEL ?? "openai/gpt-4.1-mini";

export function analiseModel() {
  return gateway(ANALISE_MODEL);
}
