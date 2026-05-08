/**
 * Resolve a URL da agenda (Calendly etc.) usada nos CTAs da página de análise.
 *
 * Ordem de precedência:
 *  1. `data.agendaUrl` — snapshot setado server-side na hora de salvar (imutável por análise)
 *  2. `NEXT_PUBLIC_AGENDA_URL` — fallback global (vale pra propostas estáticas que não passam pelo gerador)
 *  3. `cta.href` — eventual override que veio do schema
 *  4. `mailto:contato@futurah.co` — último recurso
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
    process.env.NEXT_PUBLIC_AGENDA_URL?.trim() ||
    ctaHref?.trim() ||
    "mailto:contato@futurah.co"
  );
}

/** True se a URL deve abrir em nova aba (qualquer http(s) externo). */
export function isExternalAgenda(url: string): boolean {
  return url.startsWith("http://") || url.startsWith("https://");
}
