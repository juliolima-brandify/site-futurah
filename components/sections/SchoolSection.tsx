import React from 'react';

export const SchoolSection: React.FC = () => {
  return (
    <section className="w-full flex flex-col gap-10 px-4 md:px-8 lg:px-12 py-14 lg:py-20">
      <div className="flex flex-col gap-4">
        <h2 className="text-[63px] leading-[1] font-medium tracking-[-0.04em] text-[#1E1E1E]">
          Marketing Inteligente e <br /> De Alta Performance
        </h2>
        <p className="text-[20px] font-light text-[#1E1E1E] tracking-tight">
          Para quem busca lucro, não apenas likes.
        </p>
      </div>

      <div className="w-full h-[450px] rounded-[34px] overflow-hidden bg-black shadow-inner">
        <video
          src="/media/method-background.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1.8fr] gap-12 items-end">
        <div className="flex flex-col gap-4">
          <div className="bg-[#EBEBEB]/50 border border-black/5 p-8 rounded-[24px] flex flex-col gap-4 relative group cursor-default transition-all duration-300 hover:bg-white hover:shadow-lg">
            <div className="flex justify-between items-start">
              <span className="text-[12px] font-bold tracking-[0.08em] text-[#0D0D0D]">
                GESTÃO DATA-DRIVEN ↗
              </span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[#0D0D0D]/30 group-hover:text-[#0D0D0D] transition-colors"
              >
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </div>
            <p className="text-[15px] leading-relaxed text-[#313131] max-w-[320px]">
              Chega de "achismos" e testes cegos. Nossas campanhas não contam com a sorte. Analisamos padrões de compra e métricas financeiras para garantir o ROI do seu investimento.
            </p>
          </div>

          <div className="bg-[#BAD6D2] p-8 rounded-[24px] flex flex-col gap-4 cursor-default transition-all duration-300 hover:shadow-lg">
            <span className="text-[12px] font-bold tracking-[0.08em] text-[#0D0D0D]">
              ESTRATÉGIA BOUTIQUE
            </span>
            <p className="text-[15px] leading-relaxed text-[#313131] max-w-[320px]">
              Fugimos do modelo de "fábrica de posts". Desenvolvemos funis de vendas personalizados e narrativas sofisticadas que respeitam a autoridade da sua marca.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-10 text-right">
          <div className="flex gap-3">
            <div className="bg-[#1E1E1E] px-4 py-2 rounded-full">
              <span className="text-[11px] font-bold text-white uppercase tracking-wider">
                GROWTH
              </span>
            </div>
            <div className="border border-black/10 px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm">
              <span className="text-[11px] font-bold text-[#1E1E1E] uppercase tracking-wider">
                PERFORMANCE
              </span>
            </div>
          </div>

          <h3 className="text-[53px] leading-[1] font-medium tracking-[-0.04em] text-[#1E1E1E] max-w-[600px]">
            Pare de gastar com marketing amador. Construa um ativo comercial de valor real para sua empresa.
          </h3>
        </div>
      </div>
    </section>
  );
};
