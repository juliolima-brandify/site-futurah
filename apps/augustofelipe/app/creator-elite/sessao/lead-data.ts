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

  // Perfil real do Instagram (puxado via Apify — mock realista na seção 2)
  perfil?: {
    fullName: string;
    username: string; // sem @
    avatar: string; // path local em /public
    bio: string; // pode conter \n
    posts: number;
    seguidores: number;
    seguindo: number;
    verificado: boolean;
    link?: string; // externalUrl sem https://
  };

  // Scorecard — pontuação do perfil (após o Diagnóstico). Notas 0-10,
  // cada uma com o porquê e a fonte. Avaliação curada, baseada em dados reais.
  scorecard: {
    notaGeral: number;
    resumo: string;
    baseadoEm: string;
    criterios: { nome: string; nota: number; porque: string; fonte: string }[];
  };

  // Dream Outcome (Hormozi) — o "depois", o destino que a mentoria entrega
  dreamOutcome: {
    headline: string;
    bullets: string[];
  };

  // Diagnóstico ao vivo — bullets que VOCÊ fala olhando o perfil dela
  notasPerfil: string[];

  // Oferta — você preenche (não vem do form)
  oferta: {
    custoInacao: string;
    garantia: string;
    recomendado: string; // nome do plano que você sugere pra ela
    // Value Stack (Hormozi) — tudo que entra na mentoria, com valor ancorado.
    // A soma deve ficar MUITO acima do preço. ⚠️ valores são rascunho — TROCAR.
    stack: { item: string; valor: string; nota?: string }[];
    valorAncora: string; // soma percebida do stack (ex: "R$ 38.000")
    urgencia: string; // escassez/por que decidir agora
    planos: {
      nome: string;
      duracao: string;
      preco: string;
      inclui: string[];
      insignia?: string; // path da insígnia (bronze/prata/ouro)
    }[];
  };
};

export const LEAD: Lead = {
  nome: "Stéfani Maia",
  primeiroNome: "Stéfani",
  instagram: "eustefanimaia", // sem @
  whatsapp: "",

  seguidores: "Mais de 100.000",
  nicho: "DIY / reformas (obra)",
  faturamento: "R$ 5.000 a R$ 20.000 / mês",
  monetizacao:
    "Vive de publi (contratos fixos + propostas de campanha) — mas SEM produto próprio. No form marcou “ainda não monetizo”.",

  gancho:
    "149 mil seguidores em menos de 1 ano — o conteúdo já funciona. Mas o alcance vive preso à obra: fora do nicho, ele despenca. O teto não é talento, é posicionamento.",

  perfil: {
    fullName: "Stéfani Maia",
    username: "eustefanimaia",
    avatar: "/creator-elite/eustefanimaia-avatar.jpg",
    bio: "Transformando sonhos em patrimônio.\nHouse Flipping • Decoração • DIY\nVida real firmada na fé e na família. 🤍\nAssista aos episódios: 👇",
    posts: 132,
    seguidores: 149339,
    seguindo: 661,
    verificado: true,
    link: "beacons.ai/eustefanimaia",
  },

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

  scorecard: {
    notaGeral: 5.3,
    resumo:
      "Base muito forte, teto travado. A tração já existe — o que falta é alavancar o alcance e construir uma renda própria.",
    baseadoEm:
      "Dados públicos do seu Instagram (alcance, frequência e formato dos posts) cruzados com as suas respostas na qualificação.",
    criterios: [
      {
        nome: "Tração / Alcance",
        nota: 8.5,
        porque:
          "149 mil seguidores em ~1 ano (perfil criado em jul/25). Crescimento muito acima da média — o ativo já existe.",
        fonte: "Instagram: seguidores + data de criação do perfil",
      },
      {
        nome: "Consistência de conteúdo",
        nota: 6,
        porque:
          "132 publicações e presença ativa, mas o ritmo depende de produção pesada (obra) — frágil pra sustentar no algoritmo novo.",
        fonte: "Instagram: volume de posts + sua resposta sobre produção",
      },
      {
        nome: "Alcance fora do nicho",
        nota: 3,
        porque:
          "O engajamento despenca em qualquer conteúdo fora de obra. O perfil está preso a um público estreito — seu maior teto de crescimento.",
        fonte: "Sua resposta na qualificação (maior dor)",
      },
      {
        nome: "Monetização própria",
        nota: 2.5,
        porque:
          "Receita 100% de publi avulsa, sem produto próprio. O faturamento existe (R$ 5–20k), mas é refém de marca e sem previsibilidade.",
        fonte: "Qualificação: faturamento + monetização atual",
      },
      {
        nome: "Posicionamento / Autoridade",
        nota: 6.5,
        porque:
          "Autoridade real no nicho de obra/DIY (contratos fixos, propostas recorrentes), mas o posicionamento é estreito demais pra escalar.",
        fonte: "Instagram (bio/conteúdo) + qualificação",
      },
    ],
  },

  dreamOutcome: {
    headline: "Daqui a 30 dias, seu perfil trabalha por você.",
    bullets: [
      "Conteúdo simples alcançando muito além da obra — você cresce sem depender de viral nem de produção gigante.",
      "Um sistema de postagem leve que roda na sua rotina, mesmo nos dias de canteiro.",
      "Uma renda própria e recorrente além da publi — e liberdade pra escolher (e cobrar mais caro) as marcas que aceitar.",
      "Clareza total do próximo passo: nada de achismo, cada post com propósito.",
    ],
  },

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
    garantia:
      "Garantia de execução: se você seguir o plano das calls e não tiver clareza do caminho na primeira semana, a gente refaz seu diagnóstico do zero — sem custo.",
    recomendado: "1 Mês", // plano de 30 dias em destaque
    // ⚠️ VALORES DE ANCORAGEM SÃO RASCUNHO — TROCAR pelos números reais.
    stack: [
      {
        item: "Calls estratégicas 1:1 com o Augusto",
        valor: "R$ 18.000",
        nota: "12 sessões ao vivo, direção cirúrgica pro seu perfil",
      },
      {
        item: "Acesso à I.A Creator Elite",
        valor: "R$ 6.000",
        nota: "roteiros, ganchos e análise de conteúdo entre as calls",
      },
      {
        item: "Diagnóstico estratégico do seu perfil",
        valor: "R$ 3.000",
        nota: "o mapa do que atacar primeiro",
      },
      {
        item: "Grupo no WhatsApp + suporte contínuo",
        valor: "R$ 4.000",
        nota: "ajuste de rota sem esperar a próxima call",
      },
      {
        item: "Sistema de conteúdo leve (frameworks)",
        valor: "R$ 5.000",
        nota: "pilares, ganchos e produção em lote",
      },
      {
        item: "Bônus: trilha de monetização própria",
        valor: "R$ 4.000",
        nota: "como transformar audiência em renda recorrente",
      },
    ],
    valorAncora: "R$ 40.000",
    urgencia:
      "São poucas vagas por turma pra manter o acompanhamento de perto — e o valor de hoje é exclusivo desta sessão.",
    planos: [
      {
        nome: "1 Call",
        duracao: "Sessão única",
        preco: "R$ 3.000",
        inclui: ["1 Call estratégica", "Acesso à I.A", "Diagnóstico"],
        insignia: "/creator-elite/plano-1-bronze.webp",
      },
      {
        nome: "1 Mês",
        duracao: "30 dias",
        preco: "R$ 6.000",
        inclui: ["4 Calls", "Acesso à I.A", "Grupo no WhatsApp", "Diagnóstico"],
        insignia: "/creator-elite/plano-2-prata.webp",
      },
      {
        nome: "3 Meses",
        duracao: "90 dias",
        preco: "R$ 10.000",
        inclui: ["12 Calls", "Acesso à I.A", "Grupo no WhatsApp", "Diagnóstico"],
        insignia: "/creator-elite/plano-3-ouro.webp",
      },
    ],
  },
};

// =============================================================================
// MENTOR — dados do Augusto (Prova / Likelihood do Hormozi). Fixo, não vem do
// lead. Métricas puxadas via Apify de @fidevidraceiro (2026-06-08).
// =============================================================================
export const MENTOR = {
  nome: "Augusto Felipe",
  username: "fidevidraceiro",
  avatar: "/creator-elite/augustofelipe-avatar.jpg",
  verificado: true,
  resumo:
    "Não é teoria. O Augusto construiu uma audiência de 765 mil pessoas com conteúdo fora do óbvio — é o caminho que ele já percorreu como creator, e é isso que ele vai te ajudar a fazer.",
  metricas: [
    { valor: "765 mil", label: "seguidores" },
    { valor: "4,7 mi", label: "views no maior reel" },
    { valor: "+340 mil", label: "curtidas num post" },
    { valor: "615", label: "conteúdos publicados" },
  ],
  // 4 reels MAIS VISTOS (all-time), Apify @fidevidraceiro 2026-06-08.
  // Instagram não expõe nº de compartilhamentos — só views/likes/comments.
  reels: [
    { thumb: "/creator-elite/reel-1.jpg", views: 4666858, likes: 231714, comments: 330 },
    { thumb: "/creator-elite/reel-2.jpg", views: 4591570, likes: 318405, comments: 826 },
    { thumb: "/creator-elite/reel-3.jpg", views: 4000115, likes: 246247, comments: 172 },
    { thumb: "/creator-elite/reel-4.jpg", views: 3681215, likes: 340226, comments: 670 },
    { thumb: "/creator-elite/reel-5.jpg", views: 3409377, likes: 315984, comments: 1350 },
    { thumb: "/creator-elite/reel-6.jpg", views: 3328053, likes: 201482, comments: 401 },
    { thumb: "/creator-elite/reel-7.jpg", views: 2582071, likes: 238999, comments: 166 },
    { thumb: "/creator-elite/reel-8.jpg", views: 2490680, likes: 153176, comments: 163 },
  ],
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
