/**
 * Catálogo interno "o que a Futurah substitui por IA".
 * Alimenta o prompt da OpenAI para gerar a seção EconomiaPrevista.
 */

export interface CargoCatalogo {
  value: string;
  label: string;
  substituivel: boolean;
  como: string;
}

export interface PlataformaCatalogo {
  value: string;
  label: string;
  grupo: string;
  substituivel: boolean;
  alternativa: string;
}

export const CATALOGO_CARGOS: Record<string, CargoCatalogo> = {
  sdr: {
    value: "sdr",
    label: "SDR / Pré-vendas",
    substituivel: true,
    como: "Agente de IA em WhatsApp qualificando leads 24/7, agendando reuniões apenas com leads quentes e respondendo objeções padrão em < 30s.",
  },
  "atendente-whatsapp": {
    value: "atendente-whatsapp",
    label: "Atendente de WhatsApp",
    substituivel: true,
    como: "Agente de IA treinado no tom de voz da marca, responde 95% dos casos automaticamente e escala para humano só o que foge do script.",
  },
  agendadora: {
    value: "agendadora",
    label: "Agendadora / Secretária",
    substituivel: true,
    como: "Agente integrado ao Google Calendar/CRM agenda, reagenda e confirma — sem depender de ninguém responder mensagem.",
  },
  "suporte-n1": {
    value: "suporte-n1",
    label: "Suporte / Atendimento N1",
    substituivel: true,
    como: "Agente de IA com base de conhecimento resolve 70-80% dos tickets simples; casos complexos vão direto pro N2 humano.",
  },
  qualificador: {
    value: "qualificador",
    label: "Qualificador de leads",
    substituivel: true,
    como: "Agente BANT/SPIN conduz conversa estruturada e classifica leads por score; humano só fala com lead quente.",
  },
  "social-media": {
    value: "social-media",
    label: "Social media junior",
    substituivel: true,
    como: "IA gera copy, roteiros de vídeo e carrosséis. Humano sênior revisa e publica — mantém qualidade com menos headcount.",
  },
  "gestor-trafego": {
    value: "gestor-trafego",
    label: "Gestor de tráfego",
    substituivel: false,
    como: "Mantém humano sênior por precisar de leitura estratégica de mercado e ajuste fino em campanhas. IA acelera operação (criativos, audiências).",
  },
  webdesigner: {
    value: "webdesigner",
    label: "Webdesigner",
    substituivel: true,
    como: "IA gera landing pages/criativos sob templates validados. Designer sênior revisa e aprova — troca o junior por automação.",
  },
  "financeiro-op": {
    value: "financeiro-op",
    label: "Financeiro operacional",
    substituivel: true,
    como: "Automação de conciliação, cobrança e emissão de NF via agentes integrados à plataforma financeira existente.",
  },
  recepcionista: {
    value: "recepcionista",
    label: "Recepcionista",
    substituivel: true,
    como: "Agente de IA no WhatsApp + agendamento automático cobre triagem, confirmação de consulta e FAQ de primeira linha.",
  },
};

export const CATALOGO_PLATAFORMAS: Record<string, PlataformaCatalogo> = {
  "rd-station": {
    value: "rd-station",
    label: "RD Station",
    grupo: "CRM",
    substituivel: true,
    alternativa: "CRM leve + agente de IA cobre automação de marketing + funil de vendas com custo menor.",
  },
  hubspot: {
    value: "hubspot",
    label: "HubSpot",
    grupo: "CRM",
    substituivel: false,
    alternativa: "Mantém. HubSpot é plataforma robusta; IA potencializa (agentes atuando dentro do HubSpot via API).",
  },
  pipedrive: {
    value: "pipedrive",
    label: "Pipedrive",
    grupo: "CRM",
    substituivel: false,
    alternativa: "Mantém. IA pluga como camada de automação por cima — não substitui.",
  },
  ploomes: {
    value: "ploomes",
    label: "Ploomes",
    grupo: "CRM",
    substituivel: false,
    alternativa: "Mantém. IA integra via API pra qualificação e nutrição automática.",
  },
  kommo: {
    value: "kommo",
    label: "Kommo",
    grupo: "CRM",
    substituivel: true,
    alternativa: "Kommo é principalmente WhatsApp multiatendimento — substituível por agente de IA dedicado com custo menor por volume.",
  },
  zendesk: {
    value: "zendesk",
    label: "Zendesk",
    grupo: "Atendimento",
    substituivel: true,
    alternativa: "Agente de IA com base de conhecimento resolve a maior parte dos tickets; troca licenças caras por automação.",
  },
  intercom: {
    value: "intercom",
    label: "Intercom",
    grupo: "Atendimento",
    substituivel: true,
    alternativa: "Agente de IA em chat próprio ou WhatsApp substitui o Intercom na maior parte dos casos B2C.",
  },
  tawk: {
    value: "tawk",
    label: "Tawk",
    grupo: "Atendimento",
    substituivel: true,
    alternativa: "Agente de IA próprio cobre atendimento com respostas mais inteligentes e integrado ao CRM.",
  },
  zenvia: {
    value: "zenvia",
    label: "Zenvia",
    grupo: "Atendimento",
    substituivel: true,
    alternativa: "Substituir por API oficial WhatsApp direta + agente próprio — corta taxa de intermediador.",
  },
  "take-blip": {
    value: "take-blip",
    label: "Take Blip",
    grupo: "Atendimento",
    substituivel: true,
    alternativa: "Agente próprio com API oficial elimina a taxa do Blip mantendo a mesma capacidade.",
  },
  calendly: {
    value: "calendly",
    label: "Calendly",
    grupo: "Agendamento",
    substituivel: true,
    alternativa: "Agente de agendamento nativo dentro do WhatsApp — lead agenda na conversa, sem pular plataforma.",
  },
  tidycal: {
    value: "tidycal",
    label: "TidyCal",
    grupo: "Agendamento",
    substituivel: true,
    alternativa: "Mesmo caso do Calendly: agente no WhatsApp + Google Calendar direto cobre.",
  },
  reservio: {
    value: "reservio",
    label: "Reservio",
    grupo: "Agendamento",
    substituivel: true,
    alternativa: "Agente de IA agenda diretamente no Google Calendar/sistema próprio sem intermediador.",
  },
  twilio: {
    value: "twilio",
    label: "Twilio",
    grupo: "WhatsApp",
    substituivel: false,
    alternativa: "Mantém Twilio (ou equivalente) como gateway WhatsApp oficial — IA roda por cima.",
  },
  "360dialog": {
    value: "360dialog",
    label: "360dialog",
    grupo: "WhatsApp",
    substituivel: false,
    alternativa: "Mantém como provedor API WhatsApp oficial. IA consome via API.",
  },
  "z-api": {
    value: "z-api",
    label: "Z-API",
    grupo: "WhatsApp",
    substituivel: false,
    alternativa: "Mantém. É o gateway de WhatsApp — IA roda em cima.",
  },
  blip: {
    value: "blip",
    label: "Blip",
    grupo: "WhatsApp",
    substituivel: true,
    alternativa: "Agente próprio + API oficial substitui a plataforma Blip eliminando taxa recorrente.",
  },
  mailchimp: {
    value: "mailchimp",
    label: "Mailchimp",
    grupo: "Email marketing",
    substituivel: false,
    alternativa: "Mantém. IA escreve os emails e segmenta; Mailchimp só entrega.",
  },
  activecampaign: {
    value: "activecampaign",
    label: "ActiveCampaign",
    grupo: "Email marketing",
    substituivel: false,
    alternativa: "Mantém como plataforma de envio. IA cuida da copy e da segmentação inteligente.",
  },
};

/**
 * Estimativa de custo médio mensal por cargo em R$.
 * Usado quando a faixa de custo do wizard não dá granularidade suficiente
 * para diferenciar cargos.
 */
export const CUSTO_ESTIMADO_CARGO: Record<string, number> = {
  sdr: 4500,
  "atendente-whatsapp": 2800,
  agendadora: 2800,
  "suporte-n1": 3000,
  qualificador: 4000,
  "social-media": 3500,
  "gestor-trafego": 8000,
  webdesigner: 5000,
  "financeiro-op": 4500,
  recepcionista: 2500,
};

/**
 * Valor médio estimado por plataforma/mês em R$ (assinatura típica de SMB).
 * Referência para a IA quando o usuário não especifica custo exato.
 */
export const CUSTO_ESTIMADO_PLATAFORMA: Record<string, number> = {
  "rd-station": 900,
  hubspot: 2400,
  pipedrive: 400,
  ploomes: 600,
  kommo: 500,
  zendesk: 1200,
  intercom: 1800,
  tawk: 100,
  zenvia: 800,
  "take-blip": 1500,
  calendly: 60,
  tidycal: 40,
  reservio: 200,
  twilio: 400,
  "360dialog": 300,
  "z-api": 100,
  blip: 1500,
  mailchimp: 250,
  activecampaign: 500,
};
