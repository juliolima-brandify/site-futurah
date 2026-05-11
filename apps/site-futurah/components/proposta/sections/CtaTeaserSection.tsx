import { AnaliseCTA } from "../AnaliseCTA";
import { resolveAgendaUrl, isExternalAgenda } from "../agendaUrl";

interface Props {
  agendaUrl?: string;
}

export function CtaTeaserSection({ agendaUrl }: Props) {
  const href = resolveAgendaUrl(agendaUrl);
  const external = isExternalAgenda(href);

  return (
    <section className="w-full bg-brand-title text-white px-4 md:px-8 lg:px-12 py-20 lg:py-24">
      <div className="max-w-3xl mx-auto flex flex-col items-center text-center gap-7">
        <span className="text-sm font-medium uppercase tracking-wider text-brand-highlight">
          Próximo passo
        </span>
        <h2 className="text-3xl md:text-[44px] font-medium leading-[1.1] tracking-tight text-white">
          O plano de ação completo está pronto.
        </h2>
        <p className="text-base md:text-lg text-white/70 font-light leading-relaxed max-w-2xl">
          Esta análise mostra o diagnóstico — onde sua operação está deixando dinheiro
          na mesa. As frentes de execução, o cronograma de 90 dias e o escopo detalhado
          são apresentados ao vivo, numa Sessão Estratégica gratuita de 30 minutos com
          um consultor da Futurah.
        </p>
        <AnaliseCTA
          href={href}
          location="teaser"
          external={external}
          className="inline-flex items-center gap-2 bg-brand-highlight text-brand-title px-8 py-4 rounded-2xl font-medium text-base hover:bg-white transition-colors"
        >
          Agendar Sessão Estratégica
          <span aria-hidden="true">→</span>
        </AnaliseCTA>
        <p className="text-xs text-white/50 font-light">
          Sem compromisso. Sessão 100% prática, focada no seu negócio.
        </p>
      </div>
    </section>
  );
}
