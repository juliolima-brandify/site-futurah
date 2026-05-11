import type { EconomiaTotais } from "../types";

interface Props {
  totais: EconomiaTotais;
}

function formatBRL(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function ValorNaMesaSection({ totais }: Props) {
  if (!totais.economiaMensal || totais.economiaMensal <= 0) return null;

  return (
    <section className="w-full bg-white px-4 md:px-8 lg:px-12 pt-10 pb-6">
      <div className="max-w-4xl mx-auto">
        <div className="rounded-[28px] border border-[#E89B96] bg-[#FDECE9] px-6 py-8 md:px-10 md:py-10 text-center">
          <p className="text-[15px] md:text-[17px] text-[#B23A2E] font-light leading-relaxed">
            Sua operação está deixando aproximadamente
            <br className="hidden md:block" />
            <span className="block md:inline-block mt-2 md:mt-0 md:ml-2 text-[28px] md:text-[40px] font-medium text-[#B23A2E] tracking-tight">
              {formatBRL(totais.economiaMensal)}
            </span>{" "}
            <span className="block md:inline mt-1 md:mt-0">na mesa todos os meses.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
