import type { AnaliseData } from "@/components/proposta/types";

export const augustoData: AnaliseData = {
  modelo: "coproducao",
  variante: "criador",
  meta: {
    title: "Proposta de Coprodução · @fidevidraceiro | Futurah and Co.",
    description:
      "Proposta de coprodução da Futurah and Co. para @fidevidraceiro — transformando 14,4 milhões de views em receita recorrente.",
  },

  hero: {
    badge: "Proposta de coprodução · @fidevidraceiro",
    titulo:
      "14,4 milhões de pessoas <br />viram você no último mês. <br /><span class='italic font-medium'>E 447 clicaram em qualquer coisa.</span>",
    subtitulo:
      "Augusto, este documento é uma proposta concreta — mas antes, uma leitura. A gente passou algumas semanas estudando o seu perfil e os números que ele gera. O que a gente encontrou justifica, pra nós, entrar como sócia operacional do seu marketing — colocando tempo, time e estrutura como contrapartida de uma divisão de receita acordada entre nós.",
    ctaAncora: "Ver a proposta ↓",
    rodape: "Preparada pela Futurah and Co. · Abril de 2026",
  },

  retrato: {
    eyebrow: "Retrato do perfil",
    titulo: "O que os seus números dizem — sem arredondar.",
    subtitulo:
      "Dados do período 18 de março a 16 de abril de 2026. Não são estimativas.",
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
      { num: "14,4M", label: "views nos últimos 30 dias" },
      { num: "19x", label: "ratio views por seguidor — 5x acima da média" },
      { num: "65,8%", label: "das views vêm de quem ainda não te segue" },
    ],
    fechamento:
      'O número mais importante não é o alcance — é o contraste. <span class="font-medium text-brand-title">621.573 visitas ao perfil no mês. 447 cliques no link externo.</span> Uma taxa de 0,07%. Toda essa atenção está sendo gerada, e está escapando. É exatamente isso que essa proposta vem resolver.',
  },

  diagnostico: {
    eyebrow: "O diagnóstico incômodo",
    titulo: "Seis leituras do que a gente encontrou.",
    subtitulo:
      "Mistura de oportunidade e problema. Tudo baseado nos dados reais do perfil.",
    cards: [
      {
        titulo: "Motor em aceleração",
        body: "14,4M de views em 30 dias com 739k seguidores. Um perfil mediano entrega 2–4x. O seu entregou 19x. O algoritmo está ativamente empurrando seu conteúdo pra fora da base.",
      },
      {
        titulo: "65,8% de audiência nova",
        body: "A maioria de quem te vê não te segue ainda. Isso significa que o crescimento está acontecendo agora, de forma orgânica, sem depender da base existente. Janela rara.",
      },
      {
        titulo: "0,07% de conversão",
        body: "621 mil visitas ao perfil no mês. 447 cliques no link. Se 1% dessas visitas virassem leads, seriam 6.215 contatos novos por mês — e a lista seria sua pra sempre.",
      },
      {
        titulo: "Sem ponto de captura",
        body: "Cada vídeo viral é um evento único sem continuidade. Não existe mecanismo pra transformar o visitante de hoje em lead, cliente ou fã ativo amanhã.",
      },
      {
        titulo: "Sem oferta estruturada",
        body: "Não tem o que vender quando alguém quer gastar dinheiro com você. DMs de interesse, pedidos de espelho, perguntas de vidraceiro — todos chegam sem ter pra onde ir.",
      },
      {
        titulo: "Janela aberta agora",
        body: "O perfil está em explosão (+170,5% na atividade vs. mês anterior). Monetizar agora, com estratégia, custa muito menos do que tentar consertar uma base que perdeu momentum.",
      },
    ],
  },

  tese: {
    eyebrow: "A tese",
    titulo:
      "O motor já está funcionando. {{highlight}}Falta o chassi.{{/highlight}}",
    body: "A gente não vai tentar fazer você viralizar mais — você já faz isso melhor do que a gente ensinaria. A aposta é outra: transformar a atenção que você já gera hoje em receita recorrente, sem te tirar do que te trouxe até aqui. Por isso a gente não tá propondo um serviço. Tá propondo uma coprodução.",
  },

  frentes: {
    eyebrow: "A proposta de coprodução",
    titulo: "Você grava. A gente opera tudo o resto.",
    subtitulo:
      "Zero setup, zero fee mensal. A Futurah só ganha se você ganhar. Risco compartilhado, resultado compartilhado — por 12 meses, com saída livre aos 6.",
    cards: [
      {
        numero: "60/40",
        pillLabel: "O modelo",
        pillTone: "lime",
        titulo: "Zero fee. Zero risco adiantado.",
        body: "Uma agência cobraria R$15k–40k/mês independente do resultado. Como coprodutora, a Futurah só vê dinheiro quando você vê. A divisão é 60% pra você, 40% pra nós — sobre a receita que a operação gerar.",
        bullets: [
          "Sem custo fixo mensal pra você",
          "Futurah entra com time, tempo e estrutura",
          "Contrato de 12 meses com saída livre aos 6",
          "Se em 6 meses não passar de R$20k/mês bruto, você sai sem multa",
        ],
      },
      {
        numero: "→",
        pillLabel: "Divisão de trabalho",
        pillTone: "dark",
        titulo: "Você grava. A gente cuida do resto.",
        body: "Você mantém o que faz bem — criar conteúdo autêntico. A Futurah assume 100% da operação de marketing, atendimento e vendas.",
        bullets: [
          "Você: grava conteúdo como sempre fez",
          "Você: aprova campanhas e parcerias grandes",
          "Você: participa de 1 reunião semanal de 30 min",
          "Futurah: distribui, otimiza, vende, responde, prospecta",
        ],
      },
      {
        numero: "✓",
        pillLabel: "Proteção dos dois lados",
        pillTone: "lime",
        destaque: true,
        titulo: "Propriedade e saída garantidas.",
        body: "O ativo é seu. Sempre. A Futurah opera mas não retém nada — curso, lista de e-mail, domínio e automações ficam no seu nome do primeiro ao último dia.",
        bullets: [
          "Curso e roteiros: seus, independente do contrato",
          "Lista de e-mails e CRM: seus, exportáveis a qualquer hora",
          "Site e domínio: construídos no seu nome",
          "Futurah não pega outro criador do nicho no período",
        ],
      },
    ],
    observacao:
      "Aprovações que passam por você: publi acima de R$10k, tema de aula do curso, posicionamento público (entrevistas, colabs, crises). O restante a Futurah decide e executa sem precisar te consultar.",
  },

  bancoIdeias: {
    eyebrow: "Plano de caixa rápido",
    titulo: "O que vai estar vendendo antes do curso ficar pronto.",
    subtitulo:
      "Com 14,4M de views entrando todo mês, não faz sentido esperar 90 dias pra gerar receita. Quatro alavancas rodando desde a semana 1 — em paralelo à estrutura maior.",
    categorias: [
      {
        numero: "01",
        titulo: "Patrocínios desde a semana 1",
        itens: [
          "Media kit profissional pronto em 7 dias",
          "Lista de marcas compatíveis mapeada e qualificada",
          "Prospecção ativa por e-mail e LinkedIn desde o dia 1",
          "Negociação, contrato e cobrança pela Futurah",
          "Briefing e roteiro do conteúdo pra você só gravar",
          "Prazo de caixa: 15–30 dias · Potencial: R$10k–25k no 1º mês",
        ],
      },
      {
        numero: "02",
        titulo: "Produto físico autoral (drop limitado)",
        itens: [
          "Uma peça autoral sua, edição limitada e numerada",
          "Tema e formato definidos após análise dos insights do perfil",
          "Modelo drop: lote único, assinado, urgência — vira conteúdo",
          "Página de venda com contador e numeração ao vivo",
          "Fulfillment e envio coordenado pela Futurah",
          "Prazo: 30–45 dias até lançar · Potencial: R$12k–27k por drop",
        ],
      },
      {
        numero: "03",
        titulo: "Produto digital low-ticket",
        itens: [
          "Produto leve e de impulso baseado em demanda comprovada nos comentários",
          "Tema escolhido após análise dos insights: o que mais se repete, o que mais converte",
          "Entrega automática — zero logística, margem ~100%",
          "Captura e-mail de quem compra → prepara pra o curso perpétuo",
          "Prazo: 20–30 dias até estar vendendo",
          "Potencial: R$25k–40k/mês quando em velocidade",
        ],
      },
      {
        numero: "04",
        titulo: "Merch viral (print-on-demand)",
        itens: [
          "Zero estoque, zero capital imobilizado — modelo print-on-demand",
          "Frases marcantes dos vídeos, arte de peças virais",
          "Identidade da marca em camiseta, moletom, adesivos",
          "Prazo: 21–30 dias até estar vendendo",
          "Potencial: R$18k–30k/mês com escala",
        ],
      },
    ],
    fechamento:
      "Meta de caixa nos primeiros 90 dias (cenário realista): Patrocínios R$45k · Drop físico R$30k · Produto digital R$25k · Merch R$15k = ~R$115k bruto. Sua parte: ~R$69k — antes mesmo do curso perpétuo entrar em operação.",
  },

  fases: {
    eyebrow: "Cronograma — primeiros 90 dias",
    titulo: "Dois trilhos em paralelo: caixa rápido e estrutura perpétua.",
    subtitulo:
      "Não é uma fase esperar a outra. As quatro alavancas de caixa rápido rodam desde o começo, enquanto a estrutura de longo prazo é construída em paralelo.",
    fases: [
      {
        phase: "Semanas 1 a 4",
        weeks: "Caixa rápido + base",
        title: "Primeiros produtos e prospecção",
        bullets: [
          "Media kit pronto e prospecção de marcas iniciada",
          "1ª publi fechada",
          "Produto físico em pré-venda",
          "Site v1 no ar (landing + captura de e-mail)",
          "Acessos, domínio e identidade visual configurados",
        ],
      },
      {
        phase: "Semanas 5 a 8",
        weeks: "Produtos no ar + automações",
        title: "Drop, digital e automação ativa",
        bullets: [
          "Drop físico lançado",
          "Produto digital low-ticket no ar",
          "Merch no ar (print-on-demand)",
          "2ª e 3ª publi fechadas",
          "Automação de Instagram e WhatsApp ativa",
          "Roteiros do curso prontos e gravações iniciando",
        ],
      },
      {
        phase: "Semanas 9 a 12",
        weeks: "Curso + funil evergreen",
        title: "Lançamento interno e funil perpétuo",
        bullets: [
          "4ª e 5ª publi · Drop #2 em planejamento",
          "Curso em edição final",
          "Página de vendas e checkout no ar",
          "Lançamento interno pra base aquecida",
          "Funil evergreen ativo: vídeo viral → lead → venda automática",
        ],
      },
    ],
  },

  escopo: {
    eyebrow: "O que a Futurah entrega",
    titulo: "Três entregas estruturais em paralelo.",
    subtitulo:
      "Tudo que envolve estratégia, execução e operação diária — você só grava e aprova o que for crítico.",
    itens: [
      "Site com múltiplas abas: produtos, curso, imprensa, sobre",
      "Domínio próprio e checkout integrado (Pix, cartão, parcelamento)",
      "SEO básico e pixel de tracking configurados desde o dia 1",
      "Integração com e-mail, CRM e WhatsApp",
      "Instagram: fluxos de DM por palavra-chave e captura de lead",
      "WhatsApp comercial com bot de qualificação e handoff humano",
      "TikTok com link inteligente integrado ao funil",
      "Prospecção ativa de patrocínios e gestão de e-mail comercial",
      "Dashboard ao vivo: receita, leads, conversão e origem de venda",
      "Roteiros completos de todas as aulas do curso — você só grava",
      "Página de vendas do curso com copy, depoimentos e garantia",
      "Funil evergreen: captura → aquecimento → oferta → pós-compra",
      "Sequência de e-mails pré-venda e pós-compra automatizada",
      "Iteração mensal baseada em dados de conversão reais",
      "Reunião semanal de 30 min + relatório mensal de 1 página",
    ],
  },

  potencial: {
    eyebrow: "Potencial de receita",
    titulo: "Três cenários. Todos baseados nos seus números reais.",
    subtitulo:
      "Faixas calculadas a partir do alcance atual do perfil — não de benchmark genérico. Premissa: 14,4M views/mês, 621k visitas ao perfil, 739k seguidores.",
    cards: [
      {
        eyebrow: "Cenário conservador",
        titulo: "Realidade mínima",
        body: "Patrocínios R$10k · Curso perpétuo R$15k · Produto digital R$5k · Drop físico R$5k. Equivale a converter menos de 0,3% das visitas mensais ao perfil.",
        potencialLabel: "Receita bruta mensal · sua parte (60%)",
        potencialValor: "R$35k · R$21k",
      },
      {
        eyebrow: "Cenário realista",
        titulo: "Com estrutura rodando",
        body: "Patrocínios R$25k · Curso perpétuo R$50k · Produto digital R$12k · Drop físico R$15k. Equivale a converter ~1% das visitas em alguma ação de compra.",
        potencialLabel: "Receita bruta mensal · sua parte (60%)",
        potencialValor: "R$102k · R$61k",
      },
      {
        eyebrow: "Cenário otimista",
        titulo: "Com escala",
        body: "Patrocínios R$45k · Curso perpétuo R$120k · Produto digital R$25k · Drop físico R$35k. Perfeitamente factível para um perfil com 14,4M de views mensais e funil bem calibrado.",
        potencialLabel: "Receita bruta mensal · sua parte (60%)",
        potencialValor: "R$225k · R$135k",
        destaque: true,
      },
    ],
    observacao:
      "Faixas de mercado, não promessas. O cenário conservador já é um múltiplo do que o perfil gera hoje — zero. Nenhum resultado é garantido. É por isso que a gente entra como sócia: se não chegar no conservador, nós dois perdemos.",
    formatosParceria:
      'Os números acima são <span class="font-bold text-white">antes do curso perpétuo atingir velocidade</span>. A partir do mês 4, quando o funil evergreen estiver rodando, o curso passa a gerar receita automática 24 horas por dia — sem depender de lançamento, sem exigir energia sua além do conteúdo que você já cria.',
  },

  encerramento: {
    eyebrow: "Encerrando a proposta",
    titulo: "Se fizer sentido pra você, {{italic}}a gente começa.{{/italic}}",
    body: "Essa proposta nasceu porque a gente olhou seus números e ficou incomodado com o tamanho da oportunidade que tá escapando. Se depois de ler você achar que faz sentido, a próxima conversa é sobre contrato e kick-off — conseguimos começar em uma semana. Se não fizer sentido agora, esse documento ainda é seu. Use como mapa. Contrate outra agência, faça internamente, ou deixe rodando como tá — só não deixa a janela fechar sem tentar.",
    emailContato: "contato@futurah.com.br",
    disclaimer:
      "Proposta de caráter comercial. Os números de audiência são dados reais do perfil @fidevidraceiro (período 18 mar – 16 abr 2026). As faixas de receita são estimativas baseadas em benchmarks de mercado e não constituem garantia de resultado.",
  },
};
