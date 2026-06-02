import { AnaliseCTA } from "../AnaliseCTA";
import { whatsappFundadorLink, WHATSAPP_MSG_CALL } from "@/lib/contato";

/**
 * CTA de fechamento da prévia de diagnóstico: encaminha o lead direto pro
 * WhatsApp de um fundador, onde o diagnóstico profundo é feito ao vivo na
 * call. A página /analise mostra só a PRÉVIA (radar) — o plano completo é
 * apresentado na conversa.
 */
export function CtaCallSection() {
  const href = whatsappFundadorLink(WHATSAPP_MSG_CALL);

  return (
    <section className="w-full bg-brand-title text-white px-4 md:px-8 lg:px-12 py-20 lg:py-24">
      <div className="max-w-3xl mx-auto flex flex-col items-center text-center gap-7">
        <span className="text-sm font-medium uppercase tracking-wider text-brand-highlight">
          Próximo passo
        </span>
        <h2 className="text-3xl md:text-[44px] font-medium leading-[1.1] tracking-tight text-white">
          Seu diagnóstico completo a gente faz junto.
        </h2>
        <p className="text-base md:text-lg text-white/70 font-light leading-relaxed max-w-2xl">
          Essa é a prévia. Numa call rápida, um dos fundadores da Futurah lê seu
          diagnóstico ponto a ponto com você — onde está travando, o que a IA
          destrava primeiro e qual o plano pros próximos 90 dias. Por trás da
          IA, tem gente.
        </p>
        <AnaliseCTA
          href={href}
          location="teaser"
          external
          className="inline-flex items-center gap-2 bg-brand-highlight text-brand-title px-8 py-4 rounded-2xl font-medium text-base hover:bg-white transition-colors"
        >
          Falar com um fundador no WhatsApp
          <span aria-hidden="true">→</span>
        </AnaliseCTA>
        <p className="text-xs text-white/50 font-light">
          Sem compromisso. A call é prática, focada no seu negócio.
        </p>
      </div>
    </section>
  );
}
