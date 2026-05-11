const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber, LevelFormat, PageBreak
} = require("docx");
const fs = require("fs");

// ── Cores ──────────────────────────────────────────────────────────────────
const TEAL        = "0F766E";
const TEAL_CLARO  = "F0FDFA";
const TEAL_MEDIO  = "14B8A6";
const CINZA_HEADER = "4A4A4A";
const CINZA_LINHA  = "F5F5F5";
const BRANCO       = "FFFFFF";

// ── Bordas ─────────────────────────────────────────────────────────────────
const borda = (cor = "CCCCCC") => ({ style: BorderStyle.SINGLE, size: 1, color: cor });
const bordas = (cor) => ({ top: borda(cor), bottom: borda(cor), left: borda(cor), right: borda(cor) });

function h(level, text, cor) {
  return new Paragraph({
    heading: level,
    children: [new TextRun({ text, color: cor || (level === HeadingLevel.HEADING_1 ? TEAL : CINZA_HEADER) })],
  });
}

function p(text, opts = {}) {
  return new Paragraph({
    alignment: opts.center ? AlignmentType.CENTER : AlignmentType.LEFT,
    spacing: { before: opts.before ?? 100, after: opts.after ?? 120 },
    children: [new TextRun({ text, size: opts.size ?? 22, bold: opts.bold, color: opts.color ?? "333333", font: "Arial", italics: opts.italic })],
  });
}

function quote(text) {
  return new Paragraph({
    indent: { left: 720 },
    spacing: { before: 100, after: 100 },
    border: { left: { style: BorderStyle.SINGLE, size: 8, color: TEAL_MEDIO, space: 1 } },
    children: [new TextRun({ text: `"${text}"`, size: 22, color: "555555", font: "Arial", italics: true })],
  });
}

function bullet(text, lvl = 0) {
  return new Paragraph({
    numbering: { reference: "bullets", level: lvl },
    spacing: { before: 60, after: 60 },
    children: [new TextRun({ text, size: 22, color: "333333", font: "Arial" })],
  });
}

function divisor(cor = TEAL) {
  return new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: cor, space: 1 } },
    spacing: { before: 200, after: 200 },
    children: [],
  });
}

function espacamento(n = 1) {
  return Array.from({ length: n }, () =>
    new Paragraph({ spacing: { before: 0, after: 0 }, children: [new TextRun("")] })
  );
}

function celula(texto, largura, opcoes = {}) {
  return new TableCell({
    borders: bordas(opcoes.borderColor ?? "CCCCCC"),
    width: { size: largura, type: WidthType.DXA },
    shading: { fill: opcoes.fill ?? BRANCO, type: ShadingType.CLEAR },
    margins: { top: 100, bottom: 100, left: 150, right: 150 },
    verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({
      alignment: opcoes.center ? AlignmentType.CENTER : AlignmentType.LEFT,
      children: [new TextRun({
        text: String(texto), size: opcoes.size ?? 20, bold: opcoes.bold ?? false,
        color: opcoes.color ?? "333333", font: "Arial", italics: opcoes.italic,
      })],
    })],
  });
}

function celulaHeader(texto, largura) {
  return celula(texto, largura, { fill: TEAL, bold: true, color: BRANCO, size: 20, center: true, borderColor: TEAL });
}

// ── DADOS DOS REELS ────────────────────────────────────────────────────────
const reels = [
  ["Reel 01", "Família no jardim / piscina — lifestyle puro, sem texto",          "5,1 mi",  "MAIOR VIRAL — zero produto, zero dica — lifestyle aspiracional"],
  ["Reel 02", "Live: Como tirar suas ideias do papel — planejamento anual",        "976 mil", "Live de 1h+ salva como reel — aula completa de estratégia"],
  ["Reel 03", "Live no aeroporto: O básico do básico do marketing digital",        "126 mil", "Gravada no aeroporto, descabelado, esperando voo — sem edição"],
  ["Reel 04", "ganharem muito dinheiro. (texto sobreposto)",                       "30 mil",  "Hook de aspiração financeira — conteúdo visual curto"],
  ["Reel 05", "Casal / lifestyle — viagem ou evento",                              "122 mil", "Conteúdo de relacionamento / casal"],
  ["Reel 06", "Hotmart Galaxy '26 — dois clones (Leandro + clone)",               "275 mil", "Evento de elite — humor do clone + prestígio da plataforma"],
  ["Reel 07", "Q&A: Qual sistema para gravar e editar aulas?",                     "26,7 mil","Story Q&A respondido em reel — conteúdo técnico sob demanda"],
  ["Reel 08", "Q&A: Criativos bons, bons números, mas página não converte",        "33,4 mil","Story Q&A técnico de tráfego — diagnóstico ao vivo"],
  ["Reel 09", "EXCLUSIVO: Manoel Gomes (Caneta Azul) fala sobre candidatura",      "162 mil", "Newsjacking de figura viral — exclusividade + atualidade"],
  ["Reel 10", "A Vida Comum de Quem Empreende: Como Pilotar um Jato",             "234 mil", "Lifestyle de elite + desconstrução da ideia de vida de empreendedor"],
];

function tabelaReels() {
  return new Table({
    width: { size: 8760, type: WidthType.DXA },
    columnWidths: [900, 3560, 1200, 3100],
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          celulaHeader("Reel", 900),
          celulaHeader("Formato / Hook", 3560),
          celulaHeader("Views", 1200),
          celulaHeader("Observação", 3100),
        ],
      }),
      ...reels.map(([num, formato, views, obs], i) => {
        const isTop = ["5,1 mi", "976 mil", "275 mil", "234 mil"].includes(views);
        const fill = i % 2 === 0 ? BRANCO : CINZA_LINHA;
        return new TableRow({ children: [
          celula(num, 900, { fill, center: true, bold: true }),
          celula(formato, 3560, { fill, bold: isTop }),
          celula(views, 1200, { fill, bold: isTop, color: isTop ? TEAL : "333333", center: true }),
          celula(obs, 3100, { fill, color: "666666", italic: true }),
        ]});
      }),
    ],
  });
}

// ── TABELA ROTEIROS ────────────────────────────────────────────────────────
const roteiros = [
  ["Reel 01 — Família jardim/piscina (5,1 mi)",
   "Sem narração transcrita — conteúdo 100% visual de lifestyle. Família, jardim bem cuidado, piscina, luz dourada de fim de tarde. Sem produto, sem dica, sem CTA. O maior viral do recorte não tem absolutamente nada a ver com o produto do criador. Puro aspiracional de estilo de vida."],
  ["Reel 02 — Live Planejamento Anual (976 mil, 58.900 chars)",
   "Live de 1h+ salva como reel. Conteúdo: planilha de projeção financeira (produto × ticket × vendas/dia = faturamento). Conceitos-chave: 'ação de criação' vs 'compromisso', volatilidade de quem não tem plano, curva de aprendizado como resistência natural. Frases-chave: 'eu prefiro 160 pessoas numa live a 1 milhão de views num reel', 'planejamento é a arte de criar um futuro possível e provável'. Encerra com convidar aluna live — momento de emoção orgânica ao vivo. CTA: evento gratuito Venda Todo Santo Dia."],
  ["Reel 03 — Live Aeroporto Marketing Digital (126 mil, 58.100 chars)",
   "Live gravada no aeroporto do Galeão, descabelado, sem edição, esperando voo para palestra do Pedro Sobral. Conteúdo: PLR (contra), afiliado (contra), dropship (contra), produto digital próprio (a favor). 13 conceitos de tráfego: CPC, CPL, CPA, Lead, Taxa de conversão, ROAS, ROI, Funil. Planilha ao vivo: investir R$1k → faturar R$21k com produto de R$300. História pessoal: 'com a Cátia da Marçena, faturamos mais de R$150 milhões'. CTA: mesmo evento."],
  ["Reel 06 — Hotmart Galaxy com clone (275 mil)",
   "Conteúdo de evento de prestígio: Hotmart Galaxy '26. Leandro aparece com um sósia/clone visual posando na entrada do evento. Humor da duplicação + demonstração de participação no evento mais exclusivo da Hotmart. Nenhuma narração técnica — pura prova social de pertencimento à elite da plataforma."],
  ["Reel 09 — Exclusivo Caneta Azul (162 mil)",
   "Newsjacking: entrevista com Manoel Gomes, o Caneta Azul (figura viral da internet brasileira), sobre candidatura política. Leandro posiciona como quem tem acesso a personalidades virais. 'EXCLUSIVO' no thumbnail — gatilho de escassez/privilégio de informação. Conteúdo que toca duas audiências: fãs do Caneta Azul + seguidores de Leandro."],
  ["Reel 10 — Vida Comum do Empreendedor: Jato (234 mil)",
   "Desconstrução de expectativa: 'A Vida Comum de Quem Empreende' — acompanhado de cena em jato executivo. A tensão entre 'vida comum' e 'jato' é o gancho. Reframe: o empreendedor de sucesso normaliza privilégios que o público considera extraordinários. 'Como Pilotar um Jato' sugere que isso está ao alcance de quem aprender."],
];

function tabelaRoteiros() {
  return new Table({
    width: { size: 8760, type: WidthType.DXA },
    columnWidths: [2600, 6160],
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          celulaHeader("Reel", 2600),
          celulaHeader("Análise do Roteiro", 6160),
        ],
      }),
      ...roteiros.map(([titulo, analise], i) => new TableRow({
        children: [
          celula(titulo, 2600, { fill: i % 2 === 0 ? BRANCO : CINZA_LINHA, bold: true }),
          celula(analise, 6160, { fill: i % 2 === 0 ? BRANCO : CINZA_LINHA }),
        ],
      })),
    ],
  });
}

// ── TABELA COMPARATIVO 5 PERFIS ────────────────────────────────────────────
function tabelaComparativo() {
  const rows = [
    ["Seguidores",       "~900 mil",                   "893 mil",                      "1,5 mi",                      "2,2 mi",                     "2,1 mi"],
    ["Nicho",            "Crescimento Instagram",       "Creator economy",              "Marketing viral",             "Tráfego pago",               "Prod. digital / vendas"],
    ["Tom",              "Autoritário, ordena",         "Narrativo, inspira",           "Direto, coleguial",           "Irônico, dramático",          "Confiante, prof. real"],
    ["Maior viral",      "~700 mil",                    "309 mil (série)",              "8,5 mi",                      "276 mil (visual)",            "5,1 mi (família)"],
    ["Maior viral é...", "Instrução direta",            "Episódio da série",            "Lista rítmica",               "Visual sem narração",         "Lifestyle puro"],
    ["Formato-estrela",  "Opinion + instrução",         "Série numerada 16 eps",        "Ruim / Bom / Viral",          "Visual pausável + manifesto", "Live salva como reel"],
    ["Autoridade via",   "Volume + consistência",       "Série + meta-conteúdo",        "62k alunos declarados",       "120k alunos, 8 anos",         "R$150M + Hotmart Galaxy"],
    ["CTA",              '"Dois toques, seu ingrato"',  '"Link na bio"',                '"Toca aqui para me seguir"',  '"Clica no link da bio"',      "Evento gratuito VTSD"],
    ["Lifestyle",        "Não aparece",                 "Mínimo",                       "Não aparece",                 "Mínimo",                      "Central — maior viral"],
    ["Lives longas",     "Não",                         "Não",                          "Não",                         "Não",                         "Sim — salvas como reels"],
    ["Newsjacking",      "Não",                         "Não",                          "Não",                         "Não",                         "Sim (Caneta Azul, 162k)"],
  ];
  return new Table({
    width: { size: 8760, type: WidthType.DXA },
    columnWidths: [1400, 1472, 1472, 1472, 1472, 1472],
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          celulaHeader("Dimensão", 1400),
          celulaHeader("@afonsomolina", 1472),
          celulaHeader("@hanahfranklin", 1472),
          celulaHeader("@oneyaraujo", 1472),
          celulaHeader("@pedrosobral", 1472),
          celulaHeader("@leandroladeiran", 1472),
        ],
      }),
      ...rows.map(([dim, af, hf, oa, ps, ll], i) => new TableRow({
        children: [
          celula(dim, 1400, { fill: TEAL_CLARO, bold: true }),
          celula(af, 1472, { fill: i % 2 === 0 ? BRANCO : CINZA_LINHA }),
          celula(hf, 1472, { fill: i % 2 === 0 ? BRANCO : CINZA_LINHA }),
          celula(oa, 1472, { fill: i % 2 === 0 ? BRANCO : CINZA_LINHA }),
          celula(ps, 1472, { fill: i % 2 === 0 ? BRANCO : CINZA_LINHA }),
          celula(ll, 1472, { fill: i % 2 === 0 ? BRANCO : CINZA_LINHA }),
        ],
      })),
    ],
  });
}

// ── TABELA PADRÕES REPLICÁVEIS ─────────────────────────────────────────────
const padroes = [
  ["Lifestyle puro como maior viral",
   "O maior viral de Leandro (5,1 mi) é família no jardim — sem produto, sem dica. Para o Augusto: mostrar o ateliê, a família, o processo de criação com luz natural, as mãos trabalhando no vidro. Conteúdo de vida real que humaniza antes de qualquer oferta."],
  ["Live longa salva como reel",
   "Gravar uma aula ou sessão ao vivo de 30-60 minutos e publicar diretamente como reel. Sem edição, sem corte. A autenticidade da live ao vivo transfere autoridade que um reel editado não tem. Para o Augusto: 'Vou mostrar ao vivo como eu crio um painel de vidro do zero — do risco até o corte final.'"],
  ["Ação de criação vs. compromisso",
   "O conceito mais poderoso das lives: 'Você está criando algo novo ou só se ocupando?' Para o Augusto: aplicar esse frame ao ensino de conteúdo. 'A maioria dos criadores passa o dia assistindo lives e fazendo reuniões. A única coisa que te faz crescer é criar — um reel, um post, um produto. Só isso.'"],
  ["Planilha ao vivo como CTA",
   "Leandro cria uma planilha ao vivo na frente da audiência e pede que o seguidor crie a própria. Para o Augusto: planilha de projeção de receita com arte viral. '1 reel viral → X seguidores → Y% viram leads → produto de R$Z. Faz essa conta ao vivo comigo.'"],
  ["Q&A Stories → Reel de resposta técnica",
   "Usar a caixa de perguntas dos Stories para coletar dores específicas e responder via reel. Cada resposta é um reel direcionado à dor real da audiência. Para o Augusto: 'Quais são suas maiores dúvidas sobre criar conteúdo viral com arte?' → responder cada pergunta técnica num reel curto."],
  ["Newsjacking de figura viral",
   "Aproveitar um personagem que já está em alta na internet para criar conteúdo com contexto de exclusividade. Para o Augusto: entrevistar um artista ou criador de conteúdo que viralizou recentemente na área de arte/criatividade. 'EXCLUSIVO: Fulano me contou como viralizou com arte.'"],
  ["Hotmart Galaxy / evento de elite como prova social",
   "Participação em eventos de top performance como prova de resultado — não apenas de presença. Para o Augusto: quando alcançar algum marco (100k seguidores, primeiro produto vendido em escala), documentar com 'Fui chamado para [evento] porque...'. O convite é a prova, não o produto."],
  ["Desconstrução de expectativa via lifestyle",
   "'A vida comum de quem empreende: como pilotar um jato.' A tensão entre 'vida comum' e 'jato' é o gancho. Para o Augusto: 'A vida normal de quem vive de arte: acordei às 6h, comi pão com manteiga, e hoje vou ensinar 200 pessoas a viralizarem.' A normalidade do extraordinário cria identificação."],
];

function tabelaPadroes() {
  return new Table({
    width: { size: 8760, type: WidthType.DXA },
    columnWidths: [2800, 5960],
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          celulaHeader("Padrão", 2800),
          celulaHeader("Como aplicar para Augusto Felipe", 5960),
        ],
      }),
      ...padroes.map(([pad, uso], i) => new TableRow({
        children: [
          celula(pad, 2800, { fill: i % 2 === 0 ? BRANCO : CINZA_LINHA, bold: true }),
          celula(uso, 5960, { fill: i % 2 === 0 ? BRANCO : CINZA_LINHA }),
        ],
      })),
    ],
  });
}

// ── DOCUMENTO ─────────────────────────────────────────────────────────────
const doc = new Document({
  numbering: {
    config: [{
      reference: "bullets",
      levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }],
    }],
  },
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, font: "Arial", color: TEAL },
        paragraph: { spacing: { before: 320, after: 160 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: CINZA_HEADER },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Arial", color: TEAL },
        paragraph: { spacing: { before: 180, after: 80 }, outlineLevel: 2 } },
    ],
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 },
        margin: { top: 1440, right: 1200, bottom: 1440, left: 1200 },
      },
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: TEAL, space: 1 } },
          alignment: AlignmentType.RIGHT,
          spacing: { before: 0, after: 120 },
          children: [new TextRun({ text: "Dossiê de Conteúdo — @leandroladeiran", size: 18, color: "888888", font: "Arial" })],
        })],
      }),
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          border: { top: { style: BorderStyle.SINGLE, size: 2, color: "CCCCCC", space: 1 } },
          alignment: AlignmentType.CENTER,
          spacing: { before: 120, after: 0 },
          children: [
            new TextRun({ text: "Página ", size: 18, color: "888888", font: "Arial" }),
            new TextRun({ children: [PageNumber.CURRENT], size: 18, color: "888888", font: "Arial" }),
          ],
        })],
      }),
    },
    children: [

      // ── CAPA ──────────────────────────────────────────────────────────
      ...espacamento(4),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 200 },
        children: [new TextRun({ text: "DOSSIÊ DE CONTEÚDO", size: 52, bold: true, font: "Arial", color: TEAL })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 400 },
        children: [new TextRun({ text: "@leandroladeiran", size: 40, bold: true, font: "Arial", color: CINZA_HEADER })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: TEAL, space: 1 } },
        spacing: { before: 0, after: 300 },
        children: [new TextRun({ text: "Análise de Lives como Reels, Lifestyle Aspiracional, Q&A Técnico e Newsjacking", size: 26, font: "Arial", color: "666666", italics: true })],
      }),
      ...espacamento(2),
      new Table({
        width: { size: 5200, type: WidthType.DXA },
        columnWidths: [2600, 2600],
        rows: [
          new TableRow({ children: [
            celula("Perfil",       2600, { fill: TEAL_CLARO, bold: true, center: true }),
            celula("@leandroladeiran", 2600, { center: true }),
          ]}),
          new TableRow({ children: [
            celula("Nome",         2600, { fill: TEAL_CLARO, bold: true, center: true }),
            celula("Leandro Ladeira Neiva", 2600, { center: true }),
          ]}),
          new TableRow({ children: [
            celula("Seguidores",   2600, { fill: TEAL_CLARO, bold: true, center: true }),
            celula("2,1 milhões",  2600, { center: true, bold: true, color: TEAL }),
          ]}),
          new TableRow({ children: [
            celula("Maior viral",  2600, { fill: TEAL_CLARO, bold: true, center: true }),
            celula("5,1 milhões de views (família)", 2600, { center: true, bold: true, color: TEAL }),
          ]}),
          new TableRow({ children: [
            celula("Nicho",        2600, { fill: TEAL_CLARO, bold: true, center: true }),
            celula("Produtos digitais / marketing / vendas", 2600, { center: true }),
          ]}),
          new TableRow({ children: [
            celula("Resultado",    2600, { fill: TEAL_CLARO, bold: true, center: true }),
            celula("R$150M+ com Cátia da Marçena | Hotmart Galaxy 25+ anos", 2600, { center: true }),
          ]}),
          new TableRow({ children: [
            celula("Produto principal", 2600, { fill: TEAL_CLARO, bold: true, center: true }),
            celula("Venda Todo Santo Dia (VTSD)", 2600, { center: true }),
          ]}),
          new TableRow({ children: [
            celula("Reels analisados", 2600, { fill: TEAL_CLARO, bold: true, center: true }),
            celula("10 reels coletados / 2 transcritos (lives longas)", 2600, { center: true }),
          ]}),
          new TableRow({ children: [
            celula("Data da análise", 2600, { fill: TEAL_CLARO, bold: true, center: true }),
            celula("Abril / 2026",  2600, { center: true }),
          ]}),
        ],
      }),
      ...espacamento(1),
      p("Pesquisa de referência para o reposicionamento de Augusto Felipe como especialista em conteúdo viral.", { center: true, color: "888888", italic: true, after: 0 }),
      new Paragraph({ children: [new PageBreak()] }),

      // ── SEÇÃO 1 — VISÃO GERAL ─────────────────────────────────────────
      h(HeadingLevel.HEADING_1, "1. Visão Geral do Perfil"),
      divisor(),
      p("Leandro Ladeira Neiva é o perfil com a trajetória mais documentada dos cinco analisados. Com 2,1 milhões de seguidores e mais de 25 participações consecutivas no Hotmart Galaxy (top 25 da plataforma), ele representa a elite mais longeva do mercado de produtos digitais brasileiro.", { after: 160 }),
      p("Junto com a Cátia da Marçena, construiu um projeto que faturou mais de R$150 milhões. Hoje opera o Venda Todo Santo Dia (VTSD), focado em perpétuo — o modelo de vendas contínuas sem abertura e fechamento de carrinho. Criador do primeiro perpétuo brasileiro a superar 1 milhão de reais, em 2013.", { after: 200 }),

      h(HeadingLevel.HEADING_2, "1.1 A Grande Descoberta: Lifestyle É o Maior Viral"),
      p("O maior viral do recorte analisado é o reel 01 — família no jardim, sem texto, sem produto, sem dica. 5,1 milhões de views em conteúdo 100% aspiracional.", { after: 120 }),
      bullet("Isso confirma que o algoritmo distribui conteúdo de INTERESSE, não de instrução"),
      bullet("Para o Augusto: o reel mais viral pode ser ele no ateliê com a família, sem ensinar nada"),
      bullet("A autoridade acumulada por conteúdo técnico é o que faz o lifestyle converter — não o contrário"),
      ...espacamento(1),

      h(HeadingLevel.HEADING_2, "1.2 Pilares de Conteúdo"),
      bullet("Lives longas salvas como reels — educação profunda sem edição"),
      bullet("Lifestyle aspiracional — família, viagens, eventos de elite"),
      bullet("Q&A Stories → reel de resposta técnica — conteúdo sob demanda"),
      bullet("Newsjacking — entrevistas com figuras virais do momento"),
      bullet("Eventos de prestígio — Hotmart Galaxy como prova de resultado"),
      bullet("Desconstrução de expectativa — 'a vida comum de quem empreende'"),
      new Paragraph({ children: [new PageBreak()] }),

      // ── SEÇÃO 2 — REELS ANALISADOS ────────────────────────────────────
      h(HeadingLevel.HEADING_1, "2. Reels Coletados — 10 Vídeos"),
      divisor(),
      p("Os 10 reels coletados incluem os 3 pinned do perfil (mais virais de todos os tempos) e os 7 mais recentes. Os reels 02 e 03 são lives completas de 1h+ salvas diretamente como reel — o que explica a transcrição de 58.000+ caracteres cada.", { after: 200 }),
      tabelaReels(),
      ...espacamento(1),
      p("Padrão crítico: o maior viral (família, 5,1 mi) e o segundo (live técnica, 976k) são formatos completamente opostos. Isso demonstra uma estratégia consciente de mistura: conteúdo aspiracional de alto alcance + conteúdo educacional de alta conversão.", { after: 200, color: "555555", italic: true }),
      new Paragraph({ children: [new PageBreak()] }),

      // ── SEÇÃO 3 — LIVE COMO REEL ──────────────────────────────────────
      h(HeadingLevel.HEADING_1, "3. O Formato-Chave: Live Longa Salva como Reel"),
      divisor(),
      p("Nenhum dos outros quatro perfis analisados usa esse formato. Leandro publica lives de 1 hora ou mais diretamente como reels — sem edição, sem corte, com os erros, as distrações e os momentos orgânicos de conexão.", { after: 200 }),

      h(HeadingLevel.HEADING_2, "3.1 Por que Funciona"),
      bullet("Autenticidade radical: o seguidor sente que está vendo o que ninguém mais vê"),
      bullet("Autoridade por volume: 1 hora de conteúdo técnico não-editado = impossível de fingi"),
      bullet("Momentos orgânicos: uma aluna aparece ao vivo na live e conta sua história → 976k views"),
      bullet("Custo de produção zero: gravado no sofá, no aeroporto, onde estiver"),
      bullet("O algoritmo distribui porque a retenção de quem continua assistindo é altíssima"),
      ...espacamento(1),

      h(HeadingLevel.HEADING_2, "3.2 O Momento Viral Dentro da Live (976k)"),
      p("O maior viral de lives é o reel 02. O que acontece nele que cria 976k views?", { after: 120 }),
      p("Durante a live sobre planejamento, Leandro descobre ao vivo que a aluna que faz turismo rural (que acabara de conhecer pessoalmente horas antes) estava assistindo a live em tempo real. O encontro aleatório do dia e a coincidência de ela estar presente cria um momento de emoção genuíno e orgânico.", { after: 160 }),
      quote("Essa mulher é uma aula para vocês. Eu cheguei hoje, sem combinar, e ela estava lá — vivendo do sonho dela."),
      p("Lição: momentos orgânicos não planejados dentro de uma live podem ser o catalisador do alcance.", { after: 200, color: "666666", italic: true }),

      h(HeadingLevel.HEADING_2, "3.3 A Frase Mais Estratégica das Lives"),
      quote("Eu prefiro 160 pessoas assistindo uma live comigo do que 1 milhão de views num reel. É matemática — já calculei com o Victor."),
      p("Esta confissão pública vai contra a lógica dominante do nicho (todos querem virais) e por isso é poderosa. Leandro usa sua própria experiência de ter virais de 1M+ para validar que prefere audiências menores e mais qualificadas. É autoridade por contradição.", { after: 200, color: "555555", italic: true }),
      new Paragraph({ children: [new PageBreak()] }),

      // ── SEÇÃO 4 — PADRÕES DE GANCHO ───────────────────────────────────
      h(HeadingLevel.HEADING_1, "4. Padrões de Gancho"),
      divisor(),

      h(HeadingLevel.HEADING_2, "4.1 Lifestyle Puro (5,1 mi — sem narração)"),
      p("O maior viral não tem gancho verbal. O gancho é o visual: família, jardim bonito, luz de fim de tarde, vida aparentemente despreocupada. Não há instrução, produto ou CTA.", { after: 120 }),
      p("Função: criar associação emocional de 'quero essa vida' antes que qualquer produto seja oferecido. É topo de funil absoluto.", { after: 200, color: "666666" }),

      h(HeadingLevel.HEADING_2, "4.2 Desconstrução de Expectativa (234 mil)"),
      quote("A Vida Comum de Quem Empreende: Como Pilotar um Jato"),
      p("A tensão entre 'vida comum' e 'pilotar um jato' força o clique. Se fosse só 'como eu pilotar um jato' seria aspiracional comum. 'Vida comum' + 'jato' cria dissonância cognitiva.", { after: 200, color: "666666" }),

      h(HeadingLevel.HEADING_2, "4.3 Newsjacking com Exclusividade (162 mil)"),
      p("'EXCLUSIVO: Manoel Gomes, o Caneta Azul, fala sobre candidatura.' Três elementos combinados:", { after: 120 }),
      bullet("EXCLUSIVO — gatilho de raridade da informação"),
      bullet("Caneta Azul — figura viral do momento que ainda está em evidência"),
      bullet("Candidatura — tema polêmico que atrai engajamento"),
      p("O Leandro se posiciona como quem tem acesso privilegiado a pessoas relevantes — autoridade por associação.", { after: 200, color: "666666" }),

      h(HeadingLevel.HEADING_2, "4.4 Q&A Stories → Reel Técnico"),
      p("Dois reels do recorte são respostas a perguntas reais dos seguidores coletadas via Stories:", { after: 120 }),
      quote("Qual sistema vc recomenda para gravar e editar as aulas? Estou travado neste ponto."),
      quote("Os criativos estão bons. Bons números. Mas a página parece não está convertendo"),
      p("A pergunta real do seguidor no thumbnail funciona como prova social: outras pessoas têm essa dúvida → eu também preciso saber. O seguidor se reconhece na dúvida do outro.", { after: 0 }),
      new Paragraph({ children: [new PageBreak()] }),

      // ── SEÇÃO 5 — ANÁLISE DOS CONCEITOS-CHAVE DAS LIVES ──────────────
      h(HeadingLevel.HEADING_1, "5. Conceitos-Chave Extraídos das Lives"),
      divisor(),
      p("As duas lives transcritas (reels 02 e 03) contêm frameworks e conceitos que formam a base do posicionamento de Leandro. São ensinamentos que podem ser adaptados para o Augusto Felipe:", { after: 200 }),

      h(HeadingLevel.HEADING_2, "5.1 Ação de Criação vs. Compromisso"),
      p("Conceito central da live de 976k:", { after: 120 }),
      quote("O que vai te deixar rico é criar algo que não existia no mundo e agora existe e é útil para alguém."),
      quote("Se você não tem ação de criação diária, você está só se ocupando — e se ocupar não enriquece."),
      p("Para o Augusto: 'Você passa horas assistindo reels de outros criadores. Mas quantos minutos hoje você dedicou a criar o seu próximo reel? Só o que você cria enriquece.'", { after: 200, color: "666666" }),

      h(HeadingLevel.HEADING_2, "5.2 A Planilha de Projeção"),
      p("Framework ensinado ao vivo: produto × ticket × vendas/dia = faturamento anual. Exemplo concreto da live:", { after: 120 }),
      bullet("Produto de R$300 · 7 vendas/dia · TXL de 50% · TXV de 7% → R$1.000 investidos viram R$21.000 faturados"),
      bullet("Reinvestir → escalar → margem de 50% → lucro líquido de R$45k/mês"),
      bullet("'Só preciso de 3 vendas por dia. Num universo de 70 milhões de mulheres, é possível.'"),
      ...espacamento(1),
      p("A força do framework é transformar um número abstrato ('quero ser rico') em uma meta diária concreta ('preciso fazer 3 vendas hoje').", { after: 200, color: "555555", italic: true }),

      h(HeadingLevel.HEADING_2, "5.3 PLR, Afiliado, Dropship → Produto Próprio"),
      p("Leandro dedica parte da live do aeroporto a descreditar os modelos de entrada mais fáceis (PLR, afiliado, dropship) para posicionar o produto digital próprio como a única escolha inteligente:", { after: 120 }),
      quote("PLR é comprar o direito de vender uma porcaria para os outros com uma promessa absurda de cura."),
      quote("Afiliado: você paga o anúncio, divide a comissão. Se não vender, você perdeu. Se vender, ficou com uma marga minúscula."),
      quote("Produto próprio: você fica com 100% da comissão, você controla a qualidade, você constrói um ativo que é seu."),
      new Paragraph({ children: [new PageBreak()] }),

      // ── SEÇÃO 6 — ANÁLISE DOS ROTEIROS ────────────────────────────────
      h(HeadingLevel.HEADING_1, "6. Análise de Roteiro — Reels com Transcrição"),
      divisor(),
      p("Os 10 reels coletados tiveram seus áudios baixados via yt-dlp. Por rate-limit do Instagram, apenas os reels 02 e 03 (ambos lives longas) foram transcritos com Whisper (small). Os demais foram analisados via thumbnail e visualização direta.", { after: 200 }),
      tabelaRoteiros(),
      new Paragraph({ children: [new PageBreak()] }),

      // ── SEÇÃO 7 — COMPARATIVO 5 PERFIS ────────────────────────────────
      h(HeadingLevel.HEADING_1, "7. Comparativo: Os Cinco Perfis Analisados"),
      divisor(),
      p("Com @leandroladeiran, completa-se o mapa de cinco referências do nicho de educação digital e marketing no Brasil. O comparativo final revela os cinco arquétipos de criação de conteúdo que o Augusto Felipe pode combinar:", { after: 200 }),
      tabelaComparativo(),
      ...espacamento(1),
      p("Síntese definitiva: Afonso = volume e instrução. Hanah = serialização e meta-conteúdo. Oney = viralização pura. Pedro = sofisticação narrativa e visual sem narração. Leandro = lifestyle aspiracional + live como autoridade + resultado financeiro como prova.", { after: 0, color: "555555", italic: true }),
      new Paragraph({ children: [new PageBreak()] }),

      // ── SEÇÃO 8 — PADRÕES REPLICÁVEIS ─────────────────────────────────
      h(HeadingLevel.HEADING_1, "8. Padrões Replicáveis para Augusto Felipe"),
      divisor(),
      p("Padrões identificados em @leandroladeiran adaptados para o reposicionamento do Augusto Felipe como especialista em conteúdo viral:", { after: 200 }),
      tabelaPadroes(),
      ...espacamento(2),

      h(HeadingLevel.HEADING_2, "8.1 A Síntese Final dos 5 Perfis — O Modelo do Augusto"),
      p("Com base na análise dos 5 perfis, a estratégia recomendada para o Augusto Felipe é uma combinação específica de cada arquétipo:", { after: 160 }),
      bullet("Semana 1-2 (ONEY): Ruim / Bom / Viral adaptado para arte e conteúdo. Zero narração necessária."),
      bullet("Semana 3-4 (HANAH): Série '10 formatos que eu usei para viralizar fazendo arte' — episódio diário com badge visual."),
      bullet("Semana 5-6 (PEDRO): Visual pausável — mapa mental de 'tudo que você aprende criando conteúdo com arte'."),
      bullet("Semana 7-8 (AFONSO): Consistência diária de instrução + CTA de seguir embutido no ensinamento."),
      bullet("Semana 9-10 (LEANDRO): Live de 30-45min no ateliê — ao vivo, sem edição, com demonstração do processo."),
      ...espacamento(1),
      p("A vantagem exclusiva do Augusto: ele é o único criador neste nicho que tem um ateliê físico. Todo conteúdo pode ser demonstrado com vidro e espelho — o que nenhum concorrente consegue replicar.", { after: 200, color: "555555", italic: true }),

      divisor(TEAL),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 160, after: 80 },
        children: [new TextRun({ text: "Pesquisa de referência para o reposicionamento de Augusto Felipe como especialista em conteúdo viral.", size: 18, color: "888888", italics: true, font: "Arial" })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 80 },
        children: [new TextRun({ text: "10 reels coletados via navegador + 2 lives transcritas por Whisper local  |  Abril de 2026", size: 18, color: "888888", font: "Arial" })],
      }),
    ],
  }],
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("E:/projeto-fidevidraceiro/instagram-analyzer/dossie_leandroladeiran.docx", buffer);
  console.log("OK: dossie_leandroladeiran.docx gerado com sucesso.");
}).catch(err => {
  console.error("ERRO:", err.message);
  process.exit(1);
});
