import type { PilaresData, PilarData } from "../types";

interface Props {
  pilares: PilaresData;
}

type Sev = {
  label: string;
  dot: string;
  soft: string;
  text: string;
};

const SEV_CRITICO: Sev = { label: "Crítico", dot: "#E84F3D", soft: "#FDECE9", text: "#B23A2E" };
const SEV_ATENCAO: Sev = { label: "Atenção", dot: "#F2C037", soft: "#FEF6E0", text: "#9A6B0F" };
const SEV_OK: Sev = { label: "No caminho", dot: "#5BB967", soft: "#E8F5EA", text: "#2F6B3B" };

function sevPorScore(score: number): Sev {
  if (score <= 4) return SEV_CRITICO;
  if (score <= 7) return SEV_ATENCAO;
  return SEV_OK;
}

// É um "problema" quando a nota é baixa E a IA preencheu a narrativa.
function ehProblema(p: PilarData): boolean {
  return p.score <= 5 && Boolean(p.problema || p.solucaoIA);
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-black/40 mb-1">
      {children}
    </span>
  );
}

function ProblemaCard({ p }: { p: PilarData }) {
  const sev = sevPorScore(p.score);
  const temContraste = Boolean(p.antes && p.depois);

  return (
    <article
      className="rounded-3xl bg-white border border-black/[0.07] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden"
      style={{ borderLeft: `4px solid ${sev.dot}` }}
    >
      <div className="p-6 md:p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span
              className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: sev.dot }}
            />
            <h3 className="text-[18px] md:text-[20px] font-medium text-brand-title leading-tight">
              {p.nome}
            </h3>
          </div>
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold flex-shrink-0"
            style={{ backgroundColor: sev.soft, color: sev.text }}
          >
            {sev.label} · {p.score}/10
          </span>
        </div>

        {temContraste && (
          <div className="mt-5 flex items-center gap-4 rounded-2xl bg-[#FAFAFA] border border-black/[0.05] px-5 py-3.5">
            <div className="text-center">
              <div className="text-[10px] uppercase tracking-wider text-black/40">Hoje</div>
              <div className="text-[22px] md:text-[26px] font-semibold text-black/35 line-through decoration-1">
                {p.antes}
              </div>
            </div>
            <span className="text-2xl text-black/25" aria-hidden="true">
              →
            </span>
            <div className="text-center">
              <div className="text-[10px] uppercase tracking-wider text-emerald-700/70">Com IA</div>
              <div className="text-[22px] md:text-[26px] font-bold text-emerald-600">
                {p.depois}
              </div>
            </div>
          </div>
        )}

        <div className="mt-5 space-y-4">
          <div>
            <Label>O problema</Label>
            <p className="text-[15px] text-brand-title leading-relaxed">
              {p.problema ?? p.descricao}
            </p>
          </div>
          {p.impacto && (
            <div>
              <Label>Por que te custa</Label>
              <p className="text-[14px] text-brand-body font-light leading-relaxed">
                {p.impacto}
              </p>
            </div>
          )}
          {p.solucaoIA && (
            <div className="rounded-2xl bg-[#F4F6FF] border border-[#0B2FFF]/10 px-4 py-3.5">
              <Label>Como a IA resolve</Label>
              <p className="text-[14px] text-brand-title leading-relaxed">
                {p.solucaoIA}
              </p>
            </div>
          )}
        </div>

        <div className="mt-5 pt-4 border-t border-black/[0.06] flex items-center gap-2 text-[13px] font-medium text-[#0B2FFF]">
          <span aria-hidden="true">→</span>
          A Futurah monta isso pra você — a gente fecha o plano na call.
        </div>
      </div>
    </article>
  );
}

export function PilaresCards({ pilares }: Props) {
  if (pilares.pilares.length === 0) return null;

  const problemas = pilares.pilares
    .filter(ehProblema)
    .sort((a, b) => a.score - b.score);
  const saudaveis = pilares.pilares
    .filter((p) => !ehProblema(p))
    .sort((a, b) => b.score - a.score);

  return (
    <section className="w-full bg-white px-4 md:px-8 lg:px-12 pb-20 md:pb-24">
      <div className="max-w-3xl mx-auto">
        {problemas.length > 0 && (
          <>
            <div className="text-center mb-8 md:mb-10">
              <span className="text-sm font-medium uppercase tracking-wider text-[#E84F3D]">
                Onde está travando
              </span>
              <h3 className="mt-2 text-[26px] md:text-[34px] font-medium text-brand-title leading-tight">
                Seus maiores vazamentos de crescimento
              </h3>
              <p className="mt-3 text-sm md:text-base text-brand-body font-light max-w-xl mx-auto">
                Cada ponto abaixo é dinheiro ou tempo escapando hoje — e o que a
                IA destrava primeiro.
              </p>
            </div>
            <div className="flex flex-col gap-5">
              {problemas.map((p) => (
                <ProblemaCard key={p.chave} p={p} />
              ))}
            </div>
          </>
        )}

        {saudaveis.length > 0 && (
          <div className="mt-12">
            <h4 className="text-center text-[13px] font-semibold uppercase tracking-[0.14em] text-black/40 mb-5">
              O que já está de pé
            </h4>
            <div className="flex flex-wrap justify-center gap-2.5">
              {saudaveis.map((p) => {
                const sev = sevPorScore(p.score);
                return (
                  <span
                    key={p.chave}
                    className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-medium"
                    style={{
                      backgroundColor: sev.soft,
                      color: sev.text,
                      borderColor: `${sev.dot}33`,
                    }}
                  >
                    <span
                      className="inline-block w-2 h-2 rounded-full"
                      style={{ backgroundColor: sev.dot }}
                    />
                    {p.nome}
                    <span className="opacity-60">{p.score}/10</span>
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
