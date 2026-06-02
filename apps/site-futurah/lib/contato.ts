// Contato comercial — WhatsApp de um dos fundadores, usado como CTA final
// do funil de diagnóstico (a call onde o diagnóstico profundo é feito).
export const WHATSAPP_FUNDADOR_DISPLAY = "+55 34 99254-8114";
export const WHATSAPP_FUNDADOR_NUMERO = "5534992548114";

export function whatsappFundadorLink(mensagem?: string): string {
  const base = `https://wa.me/${WHATSAPP_FUNDADOR_NUMERO}`;
  return mensagem ? `${base}?text=${encodeURIComponent(mensagem)}` : base;
}

// Mensagem pré-preenchida no CTA da call (mesma pra todos os leads).
export const WHATSAPP_MSG_CALL =
  "Oi! Acabei de fazer o diagnóstico no site da Futurah e queria agendar a call pra ver o diagnóstico completo.";
