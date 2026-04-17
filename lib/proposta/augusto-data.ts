import type { AnaliseData } from "@/components/proposta/types";

export const augustoData: AnaliseData = {
  variante: "criador",
  meta: {
    title: "Análise · @fidevidraceiro | Futurah and Co.",
    description:
      "Uma leitura estratégica do potencial de monetização do perfil @fidevidraceiro — Augusto Felipe.",
  },

  hero: {
    badge: "Análise estratégica · @fidevidraceiro",
    titulo:
      "Uma leitura do <br />potencial que o seu <br />perfil carrega <span class='italic font-medium'>hoje.</span>",
    subtitulo:
      "Augusto, este documento não é uma oferta. É uma conversa em forma de análise, olhando pro seu perfil como profissionais de marketing olhariam — e mapeando o que já está pronto pra virar negócio, sem atropelar o que te trouxe até aqui.",
    ctaAncora: "Começar a leitura ↓",
    rodape: "Preparada pela Futurah and Co. · Abril de 2026",
  },

  retrato: {
    eyebrow: "Retrato do perfil",
    titulo: "Quem é o Augusto, em números reais.",
    subtitulo:
      "Antes de qualquer conversa sobre monetização, o exercício é olhar com calma pro ativo. E o que se vê de fora é raro:",
    instagramMock: {
      handle: "fidevidraceiro",
      displayName: "Augusto Felipe",
      avatarUrl: "/proposta-augusto/augusto.jpg",
      verified: true,
      stats: { posts: "594", seguidores: "739 mil", seguindo: "3.029" },
      bio: [
        "Criador(a) de conteúdo digital",
        "Toda semana transformo ideias malucas em arte 🖼️",
        "🎨 @fidevidraceiro.art",
        "📩 fidevidraceiro@outlook.com",
      ],
      linkExterno: "linktr.ee/fidevidraceiro",
    },
    stats: [
      { num: "23", label: "anos · formado em administração" },
      { num: "1M+", label: "views no vídeo viral do globo de luz" },
      { num: "IG + TikTok", label: "presença ativa nas duas plataformas" },
    ],
    fechamento:
      'Mais relevante que o número bruto: a base é <span class="font-medium text-brand-title">engajada, híbrida (fãs + vidraceiros)</span>, com perfil verificado, e foi construída em torno de algo raro — a relação com o seu pai e o bastidor de uma vidraçaria de cidade do interior. Isso não se compra em tráfego pago.',
  },

  diagnostico: {
    eyebrow: "Diagnóstico",
    titulo: "Seis coisas que a gente notou no seu perfil.",
    subtitulo:
      "Leitura de fora pra dentro, como faríamos com qualquer criador antes de pensar em estratégia.",
    cards: [
      {
        titulo: "Audiência híbrida",
        body: "Fãs de entretenimento (humor, relação pai/filho) coabitam com um nicho técnico altíssimo (vidraceiros). Dois mercados em uma só base.",
      },
      {
        titulo: "Prova social viva",
        body: "A vidraçaria cresceu desde o primeiro espelho viral. Você é o próprio case — e esse tipo de autoridade não se compra em tráfego pago.",
      },
      {
        titulo: "Demanda reprimida",
        body: "Pedidos de espelhos customizados e de dicas para vidraceiros aparecem nos comentários. Há oferta esperando do outro lado da tela.",
      },
      {
        titulo: "Zero monetização estruturada",
        body: "Hoje não existe ponto de captura, funil, produto próprio ou publi recorrente. A atenção é gerada e perdida todo dia.",
      },
      {
        titulo: "Ativo de marca frágil",
        body: "A autenticidade é o que sustenta tudo. Qualquer produto mal calibrado corrói o que levou anos pra construir.",
      },
      {
        titulo: "Timing favorável",
        body: "A base ainda está em expansão. Monetizar agora, com calma e estratégia, custa muito menos do que tentar consertar depois.",
      },
    ],
  },

  tese: {
    eyebrow: "A tese",
    titulo:
      "A sua audiência já é o ativo. {{highlight}}Falta só colocar ela pra trabalhar{{/highlight}} — sem queimar o que ela gosta em você.",
    body: "A maioria dos criadores do seu porte pula direto pra um curso genérico e, no processo, perde a confiança que construiu. A nossa aposta é inversa: entrar pelas bordas com produtos leves, validar o que a audiência de fato compra, e só depois subir o ticket. O que você vai ver abaixo é o mapa do que é possível — o formato da parceria a gente desenha junto depois.",
  },

  frentes: {
    eyebrow: "Frentes de monetização",
    titulo: "Por onde esse perfil poderia começar a gerar receita.",
    subtitulo:
      "Três caminhos possíveis, com tempos e riscos diferentes. Nenhum exclui o outro — na prática, rodam em paralelo e um financia o outro.",
    cards: [
      {
        numero: "01",
        pillLabel: "Caixa rápido",
        pillTone: "lime",
        titulo: "Publi & parcerias estratégicas",
        body: "Prospecção ativa com marcas que combinam com seu conteúdo — ferramentas (Tramontina, Vonder), EPI, vidros (Cebrace, Guardian), apps de gestão pra MEI. Fluxo de caixa imediato, zero risco de brand se curado direito.",
        bullets: [
          "Media kit profissional",
          "Tabela de preços por formato",
          "Contrato modelo e critérios de aprovação",
          "Meta: 2–4 publis/mês até o fim do trimestre",
        ],
      },
      {
        numero: "02",
        pillLabel: "Baixo risco",
        pillTone: "dark",
        titulo: "Produtos digitais low-ticket",
        body: "Produtos que resolvem dor real do vidraceiro que te segue. Margem ~100%, entrega automática, zero logística. Servem pra validar demanda antes de qualquer curso mais caro.",
        bullets: [
          "Tabela de precificação editável",
          "Pack de stencils e moldes para espelho",
          "Guia “Vidraceiro que aparece nas redes”",
          "Captura de e-mail em todo ponto de contato",
        ],
      },
      {
        numero: "03",
        pillLabel: "Ticket alto",
        pillTone: "lime",
        destaque: true,
        titulo: "Mentoria em grupo — fase 2",
        body: "Só depois que os low-tickets validarem a disposição de pagar, construímos uma mentoria focada em vidraceiros que querem crescer pelo digital. Ticket mais alto, turmas fechadas, preserva seu tempo e sua marca.",
        bullets: [
          "Lista de espera a partir dos low-tickets",
          "Turmas fechadas e intimistas",
          "Metodologia baseada no seu próprio caso",
          "Lançamento só depois da validação",
        ],
      },
    ],
    observacao:
      "Obs. importante: e-commerce de espelhos customizados foi descartado nessa primeira fase. A operação física (produção, quebra, frete) exige estrutura que não se monta em 90 dias sem comprometer a qualidade. Fica pra uma fase 3, já com caixa.",
  },

  bancoIdeias: {
    eyebrow: "Banco de ideias",
    titulo: "Coisas que a gente pensou olhando pro seu perfil.",
    subtitulo:
      "Essa lista é pra você guardar. Nem tudo aqui faz sentido agora, nem tudo é pra sempre — mas tudo é factível com o que você já tem. A gente jogou isso no papel como quem pensa junto, na mesa de bar, sem compromisso de executar tudo.",
    categorias: [
      {
        numero: "01",
        titulo: "Cursos & mentoria",
        itens: [
          "Curso “Vidraceiro que Vende” — como captar clientes pelo Instagram",
          "Mini-curso “Do zero ao primeiro espelho personalizado”",
          "Masterclass de precificação para vidraçaria",
          "Mentoria em grupo para vidraceiros que querem crescer",
          "Workshop gravado “Como viralizei sendo vidraceiro”",
          "Curso “Empresa familiar sem brigar com o pai” (meta, só seu)",
        ],
      },
      {
        numero: "02",
        titulo: "Produtos digitais · baixo ticket",
        itens: [
          "Tabela de precificação editável (planilha pronta)",
          "Pack de stencils/moldes para espelhos",
          "E-book “Guia de orçamento para vidraçaria”",
          "Kit de templates de stories e reels",
          "Scripts de WhatsApp para atendimento de cliente difícil",
          "Checklist de segurança na obra",
          "Pack “Receitas de conteúdo” (roteiros prontos)",
        ],
      },
      {
        numero: "03",
        titulo: "Produtos físicos & loja",
        itens: [
          "Linha de espelhos autorais (capivara, personalizados, minis)",
          "Kit “Faça você mesmo” — cortador + tutorial digital",
          "Merch: bonés, camisetas, moletom do canal",
          "Adesivos e decalques com arte das peças virais",
          "Caixa-presente “Presenteie um Vidraceiro”",
          "Licenciamento da marca pra outras vidraçarias",
        ],
      },
      {
        numero: "04",
        titulo: "Patrocínios & parcerias",
        itens: [
          "Ferramentas (Tramontina, Vonder, DeWalt, Bosch)",
          "EPI e segurança (luvas, óculos, capacetes)",
          "Fabricantes de vidro (Cebrace, Guardian, Saint-Gobain)",
          "Selantes e adesivos (você já usa a Silvaselantes)",
          "Apps de gestão pra MEI (Conta Azul, Nubank PJ)",
          "Plataformas de afiliado (Hotmart, Kiwify, Eduzz)",
          "Embaixador de longo prazo (anual, não pontual)",
        ],
      },
      {
        numero: "05",
        titulo: "Comunidade & recorrência",
        itens: [
          "“Clube do Claudão” — membership mensal pros fãs",
          "Rede PRO de vidraceiros (networking pago mensal)",
          "Newsletter premium com bastidores e dicas",
          "Grupo fechado no Telegram/WhatsApp",
          "Lives exclusivas com o pai, bastidores, bloopers",
          "Programa de indicação entre vidraceiros",
        ],
      },
      {
        numero: "06",
        titulo: "IA, bots & automações",
        itens: [
          "Bot de WhatsApp “Orçamento Rápido de Vidraçaria”",
          "Agente de atendimento automatizado pra vidraçarias",
          "Chatbot “Calcule seu espelho” pro consumidor final",
          "Assistente de IA que ajuda no diagnóstico de obra",
          "Automação de captura e follow-up de lead",
          "App simples de gestão de orçamentos (pago mensal)",
        ],
      },
      {
        numero: "07",
        titulo: "Pra sonhar junto · ideias de longo prazo",
        fullWidth: true,
        itens: [
          "Encontro presencial anual de vidraceiros (evento de marca)",
          "Livro físico “De vidraceiro a criador”",
          "Podcast semanal com seu pai, sobre ofício e vida",
          "Canal no YouTube com conteúdo longo e entrevistas",
          "Franquia/licenciamento da marca “Fí de Vidraceiro”",
          "Série documental “Bastidores de um ofício”",
          "Feira de produtos de vidraçarias independentes",
          "Plataforma de cursos própria pra profissionais do ofício",
        ],
      },
    ],
    fechamento:
      "Sobre essa lista: não é pra fazer tudo, nem é pra fazer agora. É pra você ter em mãos quando bater aquela dúvida de “o que dá pra fazer com isso aqui?”. A gente pensou como parceiro pensa — sem agenda, sem cronograma, só jogando ideia em cima da mesa.",
  },

  fases: {
    eyebrow: "Como isso poderia rodar",
    titulo: "Um exercício de imaginação: 90 dias em três fases.",
    subtitulo:
      "Não é um cronograma fechado. É só um jeito de mostrar a ordem natural das coisas — o que viria primeiro, o que financiaria o quê.",
    fases: [
      {
        phase: "Fase 1",
        weeks: "Semanas 1 a 4",
        title: "Base e caixa rápido",
        bullets: [
          "Media kit + tabela de publis",
          "Prospecção ativa de marcas",
          "Captura de e-mail em todos os pontos",
          "Definição de identidade comercial",
        ],
      },
      {
        phase: "Fase 2",
        weeks: "Semanas 5 a 8",
        title: "Validação low-ticket",
        bullets: [
          "Lançamento da tabela de precificação",
          "Pack de stencils + guia digital",
          "Funil de e-mail automatizado",
          "Primeiras campanhas pagas leves",
        ],
      },
      {
        phase: "Fase 3",
        weeks: "Semanas 9 a 12",
        title: "Subida de ticket",
        bullets: [
          "Abertura da lista de espera da mentoria",
          "Captação qualificada com anúncios",
          "Preparo do lançamento principal",
          "Relatório e plano para próximo trimestre",
        ],
      },
    ],
  },

  escopo: {
    eyebrow: "O que a Futurah faria",
    titulo: "Tudo que envolve estratégia, execução e acompanhamento.",
    subtitulo:
      "Caso você decida envolver a gente nessa jornada, o escopo natural de trabalho seria:",
    itens: [
      "Estratégia comercial e de produto",
      "Identidade visual dos produtos digitais",
      "Páginas de venda e checkout integrado",
      "Funis de e-mail e automações",
      "Prospecção e negociação de publis",
      "Copy de lançamento e roteiros de reels",
      "Dashboards com métricas reais, não de vaidade",
      "Acompanhamento semanal com você",
    ],
  },

  potencial: {
    eyebrow: "Ordem de grandeza",
    titulo: "Pra você dimensionar o tamanho do que já é possível hoje.",
    subtitulo:
      "As faixas abaixo são referências de mercado, não promessas. Servem pra mostrar a escala do que uma audiência do seu porte comporta — antes mesmo dela crescer mais.",
    cards: [
      {
        eyebrow: "Frente 1 · Publi",
        titulo: "Patrocínios recorrentes",
        body: "Com media kit e prospecção ativa, um perfil do seu porte sustenta confortavelmente de 2 a 4 publis mensais com ticket médio de mercado na faixa de R$ 3 mil a R$ 8 mil por postagem.",
        potencialLabel: "Potencial mensal",
        potencialValor: "R$ 10k – R$ 30k",
      },
      {
        eyebrow: "Frente 2 · Digitais",
        titulo: "Produtos low-ticket",
        body: "Margem ~100%, entrega automática. Com uma base engajada do seu tamanho, uma taxa de conversão de 1% em campanhas pontuais já gera volume relevante — e escala sem custo marginal.",
        potencialLabel: "Potencial mensal",
        potencialValor: "R$ 8k – R$ 20k",
      },
      {
        eyebrow: "Frente 3 · Mentoria",
        titulo: "Ticket alto",
        body: "Pensada pra rodar 2 a 3 vezes por ano, com turmas enxutas e ticket alto. É a camada que transforma audiência em negócio de verdade, sem exigir esforço operacional diário.",
        potencialLabel: "Potencial por turma",
        potencialValor: "R$ 40k – R$ 100k",
        destaque: true,
      },
    ],
    observacao:
      "São faixas de mercado, não promessas. Servem apenas pra dimensionar a ordem de grandeza do que uma audiência como a sua já comporta — hoje, boa parte disso é atenção que passa e não volta em forma de negócio.",
    formatosParceria:
      'O modelo a gente desenha juntos conforme o seu apetite: pode ser <span class="font-bold text-white">fee mensal fixo</span> pela operação, uma <span class="font-bold text-white">divisão de receita (50/50 ou variável por produto)</span> nos infoprodutos que lançarmos, ou até uma <span class="font-bold text-white">sociedade em novos negócios</span> que nasçam dessa audiência. Cada formato tem vantagens — a conversa certa é sobre qual faz sentido pra você neste momento.',
  },

  encerramento: {
    eyebrow: "Encerrando a leitura",
    titulo: "Se fez sentido, {{italic}}a gente conversa.{{/italic}}",
    body: "Este documento existe só pra abrir o diálogo. Nenhuma proposta comercial, nenhum compromisso. Se alguma das ideias aqui mexer com você, a gente senta, escuta o que você quer da sua vida hoje — e só então discute formato de trabalho, se houver interesse de parte a parte.",
    emailContato: "contato@futurah.com.br",
    disclaimer:
      "Documento de caráter analítico. Os números usados são referências públicas de mercado ou dados de matérias sobre o @fidevidraceiro. Não constitui oferta comercial.",
  },
};
