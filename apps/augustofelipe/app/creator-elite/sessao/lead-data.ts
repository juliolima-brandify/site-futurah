// =============================================================================
// DADOS DA LEAD — Sessão Estratégica Creator Elite
// =============================================================================
// Estrutura baseada no FORM DE APLICAÇÃO (Situação atual → Encaixe →
// Comprometimento → Contexto). Troque este objeto a cada call.
//
// Campos com ⚠️ TROCAR ainda não vieram (nome, @, WhatsApp ficam fora do
// `answers` no Payload) ou são escritos por você (gancho, notas, oferta).
// =============================================================================

export type Lead = {
  // Identificação (⚠️ vêm de campos separados no Payload — preencher)
  nome: string;
  primeiroNome: string;
  instagram: string; // sem @
  whatsapp: string;

  // Situação atual
  seguidores: string;
  nicho: string;
  faturamento: string;
  monetizacao: string;

  // Gancho emocional (1 linha) — você escreve, é o fio condutor da call
  gancho: string;

  // Encaixe (por que agora / o que precisa)
  precisaAgora: string;
  travaPrincipal: string;
  porqueAugusto: string;
  prontidao: string;
  jaFezMentoria: string;

  // Contexto — a dor, nas palavras dela
  dor: string;

  // Objetivo (extraído do contexto)
  objetivo: string;
  prazo: string;

  // Diagnóstico ao vivo — bullets que VOCÊ fala olhando o perfil dela
  notasPerfil: string[];

  // Oferta — você preenche (não vem do form)
  oferta: {
    custoInacao: string;
    garantia: string;
    recomendado: string; // nome do plano que você sugere pra ela
    planos: {
      nome: string;
      duracao: string;
      preco: string;
      inclui: string[];
    }[];
  };
};

export const LEAD: Lead = {
  nome: "⚠️ TROCAR — nome dela",
  primeiroNome: "⚠️ TROCAR",
  instagram: "⚠️trocar", // sem @
  whatsapp: "⚠️ TROCAR",

  seguidores: "Mais de 100.000",
  nicho: "DIY / reformas (obra)",
  faturamento: "R$ 5.000 a R$ 20.000 / mês",
  monetizacao:
    "Vive de publi (contratos fixos + propostas de campanha) — mas SEM produto próprio. No form marcou “ainda não monetizo”.",

  gancho:
    "100k+ em menos de 1 ano — mas presa na obra: fora do nicho, o alcance despenca.",

  precisaAgora:
    "Acompanhamento por um período curto pra executar um objetivo com suporte.",
  travaPrincipal: "Sabe exatamente o que precisa mudar — só precisa de direção.",
  porqueAugusto:
    "Tem resultado de verdade e parece gente falando com gente, não vendedor de mentoria.",
  prontidao: "Quer começar o quanto antes.",
  jaFezMentoria: "Sim, já fez mentoria antes.",

  dor:
    "Hoje tenho um Insta muito bacana e crescendo bem em todas as redes. Tenho contratos fixos de publi e recebo propostas de campanha. Só que meu perfil é muito nichado: qualquer coisa que eu poste fora da obra tem engajamento muito baixo. E tenho enfrentado um dilema com essa troca de algoritmo — o post tem que ser muito disruptivo pra viralizar, e eu não tenho conteúdo tão grandioso pra postar todo dia, ainda mais trabalhando com obra. Meu objetivo é fazer o conteúdo simples chegar em mais pessoas, sem precisar reformar um prédio pra viralizar 😅",

  objetivo:
    "Fazer o conteúdo simples alcançar mais gente, ganhar engajamento FORA do nicho, estabilizar os números e crescer mais rápido.",
  prazo: "Curto — quer começar já.",

  notasPerfil: [
    "100k+ em ~10 meses = tração real. O ativo já existe; o problema é alavancagem, não construção.",
    "Dependência de publi com 0 produto próprio = teto de faturamento e refém de marca. Aqui mora o maior upside.",
    "‘Engajamento cai fora do nicho’ = problema de PONTE de conteúdo (nicho → lifestyle), não de talento.",
    "‘Tem que ser disruptivo pra viralizar’ é crença do algoritmo antigo — reposicionar pra consistência > viral.",
    "Ela JÁ fez mentoria e não quer ‘vendedor’: o valor aqui é direção cirúrgica, não método genérico.",
  ],

  oferta: {
    custoInacao:
      "Cada mês com 100k+ sem produto próprio é faturamento recorrente deixado na mesa — e dependência total da publi.",
    garantia: "⚠️ TROCAR — ex: garantia de execução / 7 dias (opcional)",
    recomendado: "3 Meses", // ela pediu acompanhamento p/ executar com suporte
    planos: [
      {
        nome: "1 Call",
        duracao: "Sessão única",
        preco: "R$ 3.000",
        inclui: ["1 Call estratégica", "Acesso à I.A", "Diagnóstico"],
      },
      {
        nome: "1 Mês",
        duracao: "30 dias",
        preco: "R$ 6.000",
        inclui: ["1 Call", "Acesso à I.A", "Grupo no WhatsApp", "Diagnóstico"],
      },
      {
        nome: "3 Meses",
        duracao: "90 dias",
        preco: "R$ 10.000",
        inclui: ["4 Calls", "Acesso à I.A", "Grupo no WhatsApp", "Diagnóstico"],
      },
    ],
  },
};

// =============================================================================
// MAPPER — lead real do Payload (form de qualificação) → shape do deck.
// Campos do form preenchem os reais; o que NÃO vem do form (gancho derivado,
// notasPerfil, oferta/preços) cai no default ou é derivado pra não vazar o
// exemplo. As `answers` casam pelo texto exato da `question` (ver buildAnswers
// em ../qualificacao/QualificacaoForm.tsx).
// =============================================================================

export type RawLeadAnswer = { step?: string; question?: string; value?: string };

export type RawLead = {
  nome?: string | null;
  email?: string | null;
  whatsapp?: string | null;
  social?: string | null;
  answers?: unknown;
};

export function mapLeadToDeck(raw: RawLead): Lead {
  const answers: RawLeadAnswer[] = Array.isArray(raw.answers)
    ? (raw.answers as RawLeadAnswer[])
    : [];
  const ans = (question: string) =>
    answers.find((a) => a && a.question === question)?.value?.trim() ?? "";

  const nome = (raw.nome ?? "").trim();
  const seguidores = ans("Seguidores no Instagram") || LEAD.seguidores;
  const nicho = ans("Nicho / tema principal") || LEAD.nicho;
  const necessidade = ans("O que você precisa agora");

  return {
    ...LEAD, // mantém oferta (preços) e demais defaults
    nome: nome || LEAD.nome,
    primeiroNome: nome ? nome.split(/\s+/)[0] : LEAD.primeiroNome,
    instagram: (raw.social ?? "").trim() || LEAD.instagram,
    whatsapp: (raw.whatsapp ?? "").trim() || LEAD.whatsapp,

    seguidores,
    nicho,
    faturamento: ans("Faturamento mensal médio") || LEAD.faturamento,
    monetizacao: ans("Monetização atual") || LEAD.monetizacao,

    precisaAgora: necessidade || LEAD.precisaAgora,
    travaPrincipal: ans("O que está travando você hoje") || LEAD.travaPrincipal,
    porqueAugusto:
      ans("Por que busca uma mentoria com o Augusto agora") || LEAD.porqueAugusto,
    prontidao: ans("Pronto para começar") || LEAD.prontidao,
    jaFezMentoria:
      ans("Investimento anterior em mentoria ou curso") || LEAD.jaFezMentoria,
    dor: ans("Maior dor com o Instagram hoje") || LEAD.dor,

    // Não vêm do form — derivar do real pra não exibir o exemplo numa call ao vivo.
    gancho: `${seguidores} · ${nicho}`,
    objetivo: necessidade || LEAD.objetivo,
    prazo: ans("Pronto para começar") || LEAD.prazo,
    notasPerfil: [], // diagnóstico ao vivo — Augusto preenche/edita
  };
}
