import type { EconomiaPrevistaData } from "../types";

interface Props {
  data: EconomiaPrevistaData;
}

function formatBRL(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

export function EconomiaSection({ data }: Props) {
  const temFuncionarios = data.funcionarios.length > 0;
  const temPlataformas = data.plataformas.length > 0;

  return (
    <section className="w-full bg-brand-background px-4 md:px-8 lg:px-12 py-20 lg:py-28">
      <div className="max-w-6xl mx-auto flex flex-col gap-12">
        <div className="flex flex-col gap-4 max-w-3xl">
          <span className="text-sm font-medium uppercase tracking-wider text-brand-button-hover">
            {data.eyebrow}
          </span>
          <h2 className="text-4xl lg:text-[56px] font-medium text-brand-title leading-[1.05]">
            {data.titulo}
          </h2>
          <p className="text-base md:text-lg text-brand-body font-light leading-relaxed">
            {data.subtitulo}
          </p>
        </div>

        {temFuncionarios && (
          <div className="flex flex-col gap-5">
            <h3 className="text-xs font-medium uppercase tracking-wider text-brand-title/60">
              Substituição de funções humanas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.funcionarios.map((item, idx) => (
                <div
                  key={`${item.cargo}-${idx}`}
                  className="rounded-[24px] border border-brand-title/10 bg-white p-6 flex flex-col gap-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-base font-medium text-brand-title">
                      {item.cargo}
                    </span>
                    <span
                      className={`text-[11px] font-medium uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        item.substituivel
                          ? "bg-brand-highlight text-brand-title"
                          : "bg-brand-title/5 text-brand-title/60"
                      }`}
                    >
                      {item.substituivel ? "Substituível" : "Mantém humano"}
                    </span>
                  </div>
                  <p className="text-sm text-brand-body font-light leading-relaxed">
                    {item.como}
                  </p>
                  <div className="pt-3 border-t border-brand-title/10 flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider text-brand-title/60">
                      Custo mensal atual
                    </span>
                    <span className="text-lg font-medium text-brand-title">
                      {formatBRL(item.custoAtualEstimado)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {temPlataformas && (
          <div className="flex flex-col gap-5">
            <h3 className="text-xs font-medium uppercase tracking-wider text-brand-title/60">
              Plataformas que podem sair do stack
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.plataformas.map((item, idx) => (
                <div
                  key={`${item.nome}-${idx}`}
                  className="rounded-[24px] border border-brand-title/10 bg-white p-6 flex flex-col gap-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-base font-medium text-brand-title">
                      {item.nome}
                    </span>
                    <span
                      className={`text-[11px] font-medium uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        item.substituivel
                          ? "bg-brand-highlight text-brand-title"
                          : "bg-brand-title/5 text-brand-title/60"
                      }`}
                    >
                      {item.substituivel ? "Substituível" : "Manter"}
                    </span>
                  </div>
                  <p className="text-sm text-brand-body font-light leading-relaxed">
                    {item.alternativa}
                  </p>
                  <div className="pt-3 border-t border-brand-title/10 flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider text-brand-title/60">
                      Custo mensal atual
                    </span>
                    <span className="text-lg font-medium text-brand-title">
                      {formatBRL(item.custoAtualEstimado)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-[28px] bg-brand-title text-white p-8 md:p-10 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-wider text-white/60">
                Custo atual mensal
              </span>
              <span className="text-3xl font-medium line-through decoration-white/40">
                {formatBRL(data.totais.custoAtualMensal)}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-wider text-white/60">
                Custo projetado mensal
              </span>
              <span className="text-3xl font-medium text-white">
                {formatBRL(data.totais.custoProjetadoMensal)}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-wider text-brand-highlight">
                Economia estimada
              </span>
              <span className="text-3xl font-medium text-brand-highlight">
                {formatBRL(data.totais.economiaMensal)}
                <span className="text-base text-white/60 font-light"> /mês</span>
              </span>
              <span className="text-sm text-white/70 font-light">
                {formatBRL(data.totais.economiaAnual)} em 12 meses
              </span>
            </div>
          </div>

          {data.observacao && (
            <p className="text-xs text-white/60 font-light leading-relaxed pt-4 border-t border-white/10">
              {data.observacao}
            </p>
          )}
        </div>

        <div className="flex flex-col items-center text-center gap-5 pt-4">
          <h3 className="text-2xl md:text-3xl font-medium text-brand-title leading-tight max-w-2xl">
            {data.cta.titulo}
          </h3>
          {data.cta.subtitulo && (
            <p className="text-base text-brand-body font-light max-w-xl">
              {data.cta.subtitulo}
            </p>
          )}
          <a
            href={data.cta.href ?? "#contato"}
            className="inline-flex items-center gap-2 bg-brand-title text-white px-8 py-4 rounded-2xl font-medium text-base hover:bg-brand-button-hover transition-colors"
          >
            {data.cta.botao}
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
