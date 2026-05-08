import type { EncerramentoData } from "../types";
import { resolveAgendaUrl, isExternalAgenda } from "../agendaUrl";
import { AnaliseCTA } from "../AnaliseCTA";

interface Props {
  data: EncerramentoData;
  /** URL da agenda (Calendly etc.) — vinda do `AnaliseData.agendaUrl` */
  agendaUrl?: string;
}

function renderTitulo(titulo: string) {
  const html = titulo.replace(
    /\{\{italic\}\}(.*?)\{\{\/italic\}\}/g,
    '<span class="italic">$1</span>'
  );
  return { __html: html };
}

export function EncerramentoSection({ data, agendaUrl }: Props) {
  const ctaHref = resolveAgendaUrl(agendaUrl);
  const ctaExternal = isExternalAgenda(ctaHref);
  // Se a resolução caiu em mailto (sem agenda configurada), usamos só o
  // email logo abaixo — não duplicar botão.
  const temAgenda = ctaExternal;

  return (
    <section
      id="contato"
      className="w-full bg-brand-background px-4 md:px-8 lg:px-12 py-20 lg:py-28"
    >
      <div className="max-w-3xl mx-auto flex flex-col items-center text-center gap-8">
        <span className="text-sm font-medium uppercase tracking-wider text-brand-button-hover">
          {data.eyebrow}
        </span>
        <h2
          className="text-3xl md:text-5xl lg:text-[56px] font-medium text-brand-title leading-[1.1]"
          dangerouslySetInnerHTML={renderTitulo(data.titulo)}
        />
        <p className="text-base md:text-lg text-brand-body font-light leading-relaxed">
          {data.body}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          {temAgenda && (
            <AnaliseCTA
              href={ctaHref}
              location="encerramento"
              external
              className="inline-flex items-center gap-2 bg-brand-title text-white px-8 py-4 rounded-2xl font-medium text-base hover:bg-brand-button-hover transition-colors"
            >
              Agendar Sessão Estratégica
              <span aria-hidden="true">→</span>
            </AnaliseCTA>
          )}
          <a
            href={`mailto:${data.emailContato}`}
            className="text-sm font-medium text-brand-title underline underline-offset-4 hover:text-brand-button-hover transition-colors"
          >
            {data.emailContato}
          </a>
        </div>
        {data.disclaimer && (
          <p className="text-xs text-brand-body/60 pt-10 border-t border-brand-title/10 w-full max-w-2xl">
            {data.disclaimer}
          </p>
        )}
      </div>
    </section>
  );
}
