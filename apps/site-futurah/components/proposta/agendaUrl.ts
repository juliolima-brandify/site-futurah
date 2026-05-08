/**
 * Resolve a URL da agenda (Calendly etc.) usada nos CTAs da página de análise.
 *
 * Ordem de precedência:
 *  1. `data.agendaUrl` — snapshot setado server-side na hora de salvar
 *     (imutável por análise; preenchido em `lib/ai/gerar.ts` lendo
 *     `process.env.NEXT_PUBLIC_AGENDA_URL`)
 *  2. `cta.href` — override do schema da proposta estática
 *  3. `mailto:contato@futurah.co` — último recurso
 *
 * **Sem fallback de env aqui**: propostas estáticas (Haytarzan, Augusto,
 * Carlos) que só têm `mailto:` no `cta.href` permanecem com mailto. A env
 * `NEXT_PUBLIC_AGENDA_URL` afeta APENAS análises geradas em runtime via
 * `/aplicacao` — onde fica gravada como snapshot em `data.agendaUrl`.
 *
 * Recebe `agendaUrl?` em vez do `AnaliseData` inteiro pra cada seção poder ser
 * usada de forma autocontida.
 */
export function resolveAgendaUrl(
  agendaUrl?: string,
  ctaHref?: string,
): string {
  return (
    agendaUrl?.trim() ||
    ctaHref?.trim() ||
    "mailto:contato@futurah.co"
  );
}

/** True se a URL deve abrir em nova aba (qualquer http(s) externo). */
export function isExternalAgenda(url: string): boolean {
  return url.startsWith("http://") || url.startsWith("https://");
}
