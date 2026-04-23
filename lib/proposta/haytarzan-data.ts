import type { AnaliseData } from "@/components/proposta/types";

export const haytarzanData: AnaliseData = {
  modelo: "cash_on_delivery",
  variante: "criador",
  meta: {
    title: "Proposta Cash on Delivery · João Pedro (@haytarzan) | Futurah and Co.",
    description:
      "Estrutura digital e agentes de IA 24h para transformar 1,1 milhão de seguidores em agenda cheia e demanda qualificada — por cerca de 60% do custo de contratar um time humano equivalente.",
  },

  hero: {
    badge: "Proposta Cash on Delivery · @haytarzan",
    titulo:
      "1,1 milhão de seguidores. <br />Agenda travada pelo gargalo humano. <br /><span class='italic font-medium'>Agentes de IA rodando 24 horas por dia.</span>",
    subtitulo:
      "João Pedro, essa proposta substitui o trabalho operacional que custaria um time completo de atendimento, pré-venda e mídia paga por uma estrutura de agentes dedicados + gestão contínua de tráfego — respondendo DM, qualificando leads, agendando, fazendo follow-up e captando demanda nova 24 horas por dia, por uma fração do custo de contratar o equivalente humano.",
    ctaAncora: "Ver a proposta ↓",
    rodape: "Preparada pela Futurah and Co. · Abril de 2026",
  },

  retrato: {
    eyebrow: "Ponto de partida",
    titulo: "1,1M de alcance. Zero capacidade de resposta em escala.",
    subtitulo:
      "O problema não é alcance — é o que acontece depois que o conteúdo viraliza.",
    instagramMock: {
      handle: "haytarzan",
      displayName: "João Pedro",
      avatarUrl: "/proposta-haytarzan/joaopedro.jpg",
      verified: false,
      stats: { posts: "1.570", seguidores: "1,1 milhão", seguindo: "2.909" },
      bio: [
        "Fisioterapeuta & Thai Massage",
        "Estude comigo ou agende uma Massagem 🇹🇭",
        "🌐 terapeutaemfoco.com/haytarzan",
      ],
      linkExterno: "terapeutaemfoco.com/haytarzan",
    },
    stats: [
      { num: "1,1M", label: "seguidores — e +1.500 novos por dia" },
      { num: "24h", label: "cobertura contínua dos agentes (vs 8h de um funcionário CLT)" },
      { num: "~60%", label: "do custo de contratar atendente + SDR humanos" },
    ],
    fechamento:
      "Cada vídeo que viraliza gera um volume de DMs, dúvidas e pedidos de agendamento que nenhum atendente humano resolve sozinho. A escolha hoje é: <span class=\"font-medium text-brand-title\">contratar um time fixo que sai caro e dorme de noite</span>, ou montar uma operação de agentes que responde, qualifica e agenda sem parar — por menos da metade do custo.",
  },

  diagnostico: {
    eyebrow: "Diagnóstico de operação",
    titulo: "Seis leituras do gargalo atual.",
    subtitulo:
      "Mistura de oportunidade e problema. Tudo baseado no tamanho real do perfil e no tipo de operação que ele exige.",
    cards: [
      {
        titulo: "Volume de contato > capacidade humana",
        body: "Um perfil de 1,1M com pico viral gera centenas de DMs por semana. Uma pessoa só resolve até um ponto — depois, mensagens esfriam, leads somem e oportunidade vira atrito.",
      },
      {
        titulo: "Agenda presencial = gargalo físico",
        body: "O atendimento individual é o produto de menor escala possível. Cada hora trocada por dinheiro trava a audiência de 1,1M em um funil que nunca vai comportar a demanda que você já gera.",
      },
      {
        titulo: "Lead esfria em 24h sem resposta",
        body: "Quem manda DM de madrugada ou no fim de semana espera resposta em minutos, não horas. Sem agente 24h, o melhor momento de intenção (logo depois do vídeo viral) é desperdiçado.",
      },
      {
        titulo: "Follow-up manual é inviável em escala",
        body: "Cliente que agendou e não retornou, lead que não fechou, orçamento em aberto: tudo isso exige cadência de retorno. No volume do seu perfil, nenhum humano consegue dar conta sem automação.",
      },
      {
        titulo: "Contratar CLT = custo fixo alto + limite de 8h",
        body: "Um SDR ou atendente custa R$3-4k de salário + encargos (~R$5-7k total), trabalha 8h/dia, precisa de férias, treinamento e gestão. E ainda assim o problema de cobertura 24h continua.",
      },
      {
        titulo: "Sem funil, oferta e captura estruturados",
        body: "A audiência chega, se interessa — e sai sem deixar contato. Não existe mecanismo pra transformar o espectador de hoje em cliente ou aluno amanhã. Atenção evapora sem receita.",
      },
    ],
  },

  tese: {
    eyebrow: "Tese da proposta",
    titulo:
      "A operação não cresce contratando gente. {{highlight}}Cresce montando agentes.{{/highlight}}",
    body: "A proposta substitui o time humano que seria necessário pra operar um perfil de 1,1M por uma estrutura de agentes de IA dedicados — atendimento, pré-qualificação, agendamento e follow-up rodando em paralelo, 24 horas por dia. Custo final: cerca de 60% do que sairia contratar atendente + SDR em CLT. Sem férias, sem turno, sem gargalo humano.",
  },

  frentes: {
    layout: "stack",
    eyebrow: "Oferta em stack",
    titulo: "Implementação + operação mensal com agentes dedicados 24h.",
    subtitulo:
      "Um bloco de implementação pra colocar a estrutura e os agentes no ar, mais uma mensalidade de operação — por cerca de 60% do custo de um time humano equivalente.",
    cards: [
      {
        numero: "R$15k-20k",
        pillLabel: "Stack 1 · Implementação",
        pillTone: "lime",
        titulo: "Estrutura digital e agentes configurados.",
        body: "Projeto de entrada pra montar base comercial e colocar os agentes no ar prontos pra operar com seu tom de voz, sua oferta e suas regras de agendamento.",
        bullets: [
          "Landing de agendamento + captura de lead com foco em conversão",
          "Identidade visual aplicada aos principais pontos de contato",
          "4 agentes configurados, treinados e integrados (DM, WhatsApp, calendar, CRM)",
          "Funil de captação com pré-qualificação por questionário",
          "Estrutura inicial de tráfego pago: pixel, eventos de conversão e primeiras campanhas em Meta Ads e Google Ads",
        ],
      },
      {
        numero: "R$5k-6k/mês",
        pillLabel: "Stack 2 · Operação mensal",
        pillTone: "dark",
        titulo: "Agentes rodando 24h + gestão da operação.",
        body: "Equivale a cerca de 60% do que custaria manter atendente + SDR em CLT (R$9-10k/mês com encargos). A diferença é que os agentes não dormem, não tiram férias e não perdem lead fora do horário comercial.",
        bullets: [
          "Agentes no ar 24 horas por dia, 7 dias por semana",
          "Especialista humano do time Futurah auditando e gerenciando os 4 agentes — revisando conversas, ajustando scripts e garantindo qualidade",
          "Gestão completa de tráfego pago em Meta Ads e Google Ads — criativos, públicos, lances, otimização semanal",
          "Ajustes de scripts, funil e regras de qualificação",
          "Criação e postagem de conteúdo recorrente",
          "Relatório mensal com métricas dos agentes e do tráfego (CPL, CPA, ROAS, agendamentos)",
        ],
      },
      {
        numero: "COD",
        pillLabel: "Stack 3 · Garantia operacional",
        pillTone: "lime",
        destaque: true,
        titulo: "Entrega clara, medição contínua, decisão por dados.",
        body: "Cada agente tem critério de entrega observável (tempo de resposta, volume atendido, taxa de qualificação). Você acompanha em tempo real se a operação tá pagando o próprio custo.",
        bullets: [
          "Plano de ação com marcos quinzenais",
          "Dashboard com volume de DMs, tempo de resposta e agendamentos",
          "Ritual de revisão quinzenal para ajustes de rota",
          "Prioridade em leads com maior intenção e maior ticket",
        ],
      },
    ],
    observacao:
      "Comparação direta: contratar atendente + SDR em CLT custa ~R$9-10k/mês (salário + encargos + gestão), cobre 8h/dia, precisa de férias e treinamento. A operação Futurah entra em ~R$5-6k/mês, cobre 24h, escala sob demanda e não tem passivo trabalhista.",
  },

  bancoIdeias: {
    eyebrow: "Os agentes na sua operação",
    titulo: "Quatro agentes dedicados trabalhando em paralelo.",
    subtitulo:
      "Cada agente substitui uma função que hoje seria humana — com cobertura 24h, sem limite de volume e integrados entre si.",
    categorias: [
      {
        numero: "01",
        titulo: "Agente de Atendimento 24h (DM + WhatsApp)",
        itens: [
          "Responde primeira mensagem em Instagram e WhatsApp em segundos, não horas",
          "Coberto noite, fim de semana, feriado — sem delay humano",
          "Escala conforme volume (vídeo viral não trava a caixa de entrada)",
          "Transição fluida para humano quando necessário",
        ],
      },
      {
        numero: "02",
        titulo: "Agente de Pré-qualificação",
        itens: [
          "Filtra por cidade, tipo de serviço desejado e urgência",
          "Descarta lead frio antes de chegar na sua agenda",
          "Pontua lead por nível de intenção e ticket potencial",
          "Entrega apenas contato quente pra fechamento humano",
        ],
      },
      {
        numero: "03",
        titulo: "Agente de Agendamento",
        itens: [
          "Integra com Google Calendar e bloqueia horários em tempo real",
          "Oferece opções conforme regras definidas (tipo de sessão, duração, local)",
          "Envia confirmação automática + lembrete 24h antes",
          "Reorganiza cancelamento e remarcação sem envolver você",
        ],
      },
      {
        numero: "04",
        titulo: "Agente de Follow-up",
        itens: [
          "Retoma leads que iniciaram conversa e não fecharam",
          "Aciona pós-consulta pra retorno e recompra",
          "Cadência automatizada baseada em comportamento do lead",
          "Feedback de satisfação + pedido de indicação em escala",
        ],
      },
    ],
    fechamento:
      "Os 4 agentes conversam entre si e operam de forma integrada. Um lead que entra pelo agente de atendimento, é qualificado, agendado e acompanhado no follow-up sem precisar de intervenção humana no meio. <span class=\"font-medium text-brand-title\">Por trás dos agentes existe um especialista humano do time Futurah</span> auditando conversas, ajustando scripts e garantindo que a operação mantenha qualidade — não é IA solta no ar.",
  },

  fases: {
    eyebrow: "Cronograma",
    titulo: "Três blocos: estrutura, ativação dos agentes, otimização.",
    subtitulo:
      "Escopo operacional completo distribuído em etapas, com os agentes entrando no ar já na segunda fase.",
    fases: [
      {
        phase: "Semanas 1 a 3",
        weeks: "Estruturação",
        title: "Base digital e treinamento dos agentes",
        bullets: [
          "Kickoff, alinhamento de tom de voz e regras de negócio",
          "Landing de agendamento + captura de lead no ar",
          "Identidade visual aplicada aos ativos principais",
          "Definição do funil e questionário de qualificação",
          "Treinamento inicial dos 4 agentes com scripts personalizados",
        ],
      },
      {
        phase: "Semanas 4 a 6",
        weeks: "Ativação",
        title: "Agentes no ar + tráfego rodando",
        bullets: [
          "Agentes de atendimento e qualificação em produção",
          "Integração com Google Calendar ativa (agendamento automático)",
          "Subida de campanhas em Meta Ads e Google Ads",
          "Primeiro ciclo de follow-up automatizado em operação",
          "Dashboard ao vivo com métricas dos agentes",
        ],
      },
      {
        phase: "Semanas 7 a 12",
        weeks: "Otimização",
        title: "Afinamento dos agentes e escala do funil",
        bullets: [
          "Ajuste de scripts baseado em conversas reais dos agentes",
          "Refino de público, criativos e landing por desempenho",
          "Cadência de conteúdo com foco em alimentar o funil",
          "Expansão do agente de follow-up para retorno e recompra",
          "Rotina quinzenal de revisão com ajustes de rota",
        ],
      },
    ],
  },

  escopo: {
    eyebrow: "Escopo operacional",
    titulo: "Entrega integrada de estrutura, agentes e operação.",
    subtitulo:
      "Pacote pensado para resolver base, aquisição, atendimento e follow-up com cobertura 24h.",
    itens: [
      "Diagnóstico inicial e desenho do funil de captação",
      "Landing de agendamento com foco em conversão",
      "Aplicação de identidade visual nos ativos principais",
      "Configuração e treinamento dos 4 agentes dedicados",
      "Especialista humano do time Futurah auditando conversas e gerenciando a operação dos agentes",
      "Integração com Google Calendar, CRM, WhatsApp e Instagram",
      "Scripts dos agentes personalizados por tom de voz e regras de negócio",
      "Configuração e gestão contínua de campanhas em Meta Ads e Google Ads (criativos, públicos, otimização semanal)",
      "Questionário de qualificação com lógica de priorização",
      "Automação de follow-up pós-consulta e recompra",
      "Dashboard com volume de DMs, conversão, agendamentos e ticket médio",
      "Planejamento de conteúdo mensal",
      "Criação de conteúdo e apoio em postagem",
      "Rotina quinzenal de acompanhamento e ajustes",
    ],
  },

  potencial: {
    eyebrow: "Potencial operacional",
    titulo: "Três cenários de operação com agentes.",
    subtitulo:
      "Cenários de maturidade da operação, não promessa de faturamento. Todos partem de premissa conservadora: agentes respondendo 100% das DMs em até 5 minutos, 24h por dia.",
    cards: [
      {
        eyebrow: "Cenário 1",
        titulo: "Validação inicial",
        body: "Agentes no ar, primeiros ciclos de atendimento e agendamento rodando sem intervenção humana em 80%+ dos casos.",
        potencialLabel: "Objetivo principal",
        potencialValor: "100% das DMs respondidas em <5 min, agenda crescendo de forma organizada",
      },
      {
        eyebrow: "Cenário 2",
        titulo: "Tração consistente",
        body: "Funil calibrado, ticket médio subindo pela qualificação, follow-up recuperando leads frios.",
        potencialLabel: "Objetivo principal",
        potencialValor: "Aumentar volume de agendamentos qualificados sem aumentar horas trabalhadas",
      },
      {
        eyebrow: "Cenário 3",
        titulo: "Escala orientada a dados",
        body: "Agentes cruzam informação, funil evergreen ativo, conteúdo recorrente alimenta captação. Operação vira máquina.",
        potencialLabel: "Objetivo principal",
        potencialValor: "Escalar sem perder qualidade — e sem contratar equipe humana equivalente",
        destaque: true,
      },
    ],
    observacao:
      "Resultados variam por mercado, oferta, velocidade de resposta comercial e qualidade de execução conjunta. Nenhum resultado é garantido.",
    formatosParceria:
      'Modelo de trabalho em duas camadas: <span class="font-bold text-white">implementação inicial</span> para ativação da estrutura e dos agentes, e <span class="font-bold text-white">operação mensal</span> com os agentes rodando 24h.',
  },

  encerramento: {
    eyebrow: "Fechamento",
    titulo: "Se fizer sentido, {{italic}}iniciamos a implantação.{{/italic}}",
    body: "A proposta foi desenhada pra resolver o que mais trava crescimento quando um perfil passa da casa do milhão: capacidade de resposta, qualificação e agendamento em escala. Com os agentes no ar, você para de perder lead fora do horário comercial, para de depender de contratação humana e opera uma estrutura 24h por cerca de 60% do que um time equivalente custaria em CLT.",
    emailContato: "contato@futurah.com.br",
    disclaimer:
      "Proposta de caráter comercial. Valores em faixa de referência conforme escopo apresentado. Entregas e investimentos finais podem ser ajustados em contrato após alinhamento técnico. Os dados de audiência são públicos e coletados em abril de 2026 via Social Blade.",
  },

  miniFaq: {
    eyebrow: "FAQ",
    titulo: "Perguntas frequentes antes de avançarmos.",
    itens: [
      {
        pergunta: "O que entra na implementação inicial (R$15k-20k)?",
        resposta:
          "Entra a fundação da operação: landing de agendamento, identidade aplicada aos principais ativos, configuração e treinamento dos 4 agentes (atendimento, qualificação, agendamento, follow-up), integrações com Google Calendar, WhatsApp, Instagram e CRM, estrutura inicial de captação paga e setup operacional.",
      },
      {
        pergunta: "O que entra na operação mensal (R$5k-6k)?",
        resposta:
          "Os 4 agentes rodando 24h, gestão completa de tráfego pago em Meta Ads e Google Ads (criativos, públicos, lances e otimização semanal), ajustes de scripts e funil com base em conversas reais, criação e postagem de conteúdo recorrente e relatório mensal de métricas dos agentes e do tráfego (CPL, CPA, ROAS, agendamentos). Importante: a verba de mídia paga pros anúncios é separada da mensalidade e fica com você — a Futurah opera, otimiza e reporta, mas não cobra a mídia em cima.",
      },
      {
        pergunta: "Como os agentes comparam com contratar uma pessoa?",
        resposta:
          "Custam cerca de 60% do valor, cobrem 24 horas (vs 8h humano), não tiram férias, escalam sob demanda em pico viral e não geram passivo trabalhista. E não rodam sozinhos: todo agente é auditado e gerenciado por um especialista humano do time Futurah, que revisa conversas, ajusta scripts e mantém a qualidade da operação. Onde humano de fora ainda vence: decisões subjetivas, relacionamento quente e casos de exceção — por isso a operação sempre prevê handoff pra você ou seu time quando faz sentido.",
      },
      {
        pergunta: "Em quanto tempo os agentes estão no ar?",
        resposta:
          "Os 2 primeiros agentes (atendimento e qualificação) entram em produção na semana 4-5. Os 2 últimos (agendamento automático e follow-up) entram na semana 5-6. A janela de 90 dias serve pra estabilizar, afinar scripts e validar que a operação tá pagando o próprio custo.",
      },
    ],
  },
};
