const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber, LevelFormat, PageBreak
} = require("docx");
const fs = require("fs");

// ── Cores ──────────────────────────────────────────────────────────────────
const VERDE       = "1B6B3A";
const VERDE_CLARO = "E8F5E9";
const CINZA_HEADER = "4A4A4A";
const CINZA_LINHA  = "F5F5F5";
const BRANCO = "FFFFFF";

// ── Bordas ─────────────────────────────────────────────────────────────────
const borda = (cor = "CCCCCC") => ({ style: BorderStyle.SINGLE, size: 1, color: cor });
const bordas = (cor) => ({ top: borda(cor), bottom: borda(cor), left: borda(cor), right: borda(cor) });

function h(level, text, cor) {
  return new Paragraph({
    heading: level,
    children: [new TextRun({ text, color: cor || (level === HeadingLevel.HEADING_1 ? VERDE : CINZA_HEADER) })],
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
    border: { left: { style: BorderStyle.SINGLE, size: 8, color: VERDE, space: 1 } },
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

function divisor(cor = VERDE) {
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
  return celula(texto, largura, { fill: VERDE, bold: true, color: BRANCO, size: 20, center: true, borderColor: VERDE });
}

// ── DADOS DOS REELS ────────────────────────────────────────────────────────
const reelsSerie = [
  [1,  "DINAMISMO",          "309 mil", "Mais viral da série"],
  [2,  "NARRADO",            "160 mil", ""],
  [3,  "TRIVIAL",            "155 mil", ""],
  [4,  "CAIXINHA POLÊMICA",  "144 mil", ""],
  [5,  "DIÁLOGO",            "109 mil", ""],
  [6,  "TELA VERDE",         "96 mil",  ""],
  [7,  "VLOG",               "172 mil", ""],
  [8,  "COMPARAÇÃO",         "136 mil", ""],
  [9,  "TELA DIVIDIDA",      "98 mil",  ""],
  [10, "PALESTRINHA",        "103 mil", ""],
  [11, "ANÁLISE",            "107 mil", ""],
  [12, "CONVERSA DE BAR",    "90 mil",  ""],
  [13, "CRIATIVO PREGUIÇOSO","145 mil", ""],
  [14, "ANALOGIA",           "106 mil", ""],
  [15, "NARRADOR",           "110 mil", ""],
  [16, "FORMATO COMBINADO",  "177 mil", "Último episódio — revela produto"],
];

const reelsAvulsos = [
  ["ok esse é um vídeo desmotivacional",       "183 mil", "Vulnerabilidade / storytelling emocional"],
  ["9 horas por dia no celular",               "233 mil", "Polêmica / comportamento"],
  ["1 milhão de seguidores",                   "212 mil", "Marco / celebração"],
  ["(vídeo sem texto sobreposto)",             "696 mil", "Maior viral do perfil"],
  ["(vídeo sem texto sobreposto)",             "449 mil", "Segundo maior viral"],
  ["não bateu a meta de seguidores e agr...",  "~150 mil","Vulnerabilidade cômica"],
];

function tabelaSerie() {
  return new Table({
    width: { size: 8760, type: WidthType.DXA },
    columnWidths: [600, 3960, 1400, 2800],
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          celulaHeader("#", 600),
          celulaHeader("Formato Criativo", 3960),
          celulaHeader("Views", 1400),
          celulaHeader("Observação", 2800),
        ],
      }),
      ...reelsSerie.map(([n, formato, views, obs], i) => {
        const isTop = ["309 mil", "177 mil", "172 mil", "160 mil"].includes(views);
        const fill = i % 2 === 0 ? BRANCO : CINZA_LINHA;
        return new TableRow({ children: [
          celula(String(n), 600, { fill, center: true, bold: true }),
          celula(formato, 3960, { fill, bold: isTop }),
          celula(views, 1400, { fill, bold: isTop, color: isTop ? VERDE : "333333", center: true }),
          celula(obs || "—", 2800, { fill, color: "666666", italic: true }),
        ]});
      }),
    ],
  });
}

function tabelaAvulsos() {
  return new Table({
    width: { size: 8760, type: WidthType.DXA },
    columnWidths: [4200, 1400, 3160],
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          celulaHeader("Título / Hook", 4200),
          celulaHeader("Views", 1400),
          celulaHeader("Tipo de Conteúdo", 3160),
        ],
      }),
      ...reelsAvulsos.map(([titulo, views, tipo], i) => {
        const isTop = ["696 mil", "449 mil", "233 mil"].includes(views);
        const fill = i % 2 === 0 ? BRANCO : CINZA_LINHA;
        return new TableRow({ children: [
          celula(titulo, 4200, { fill }),
          celula(views, 1400, { fill, bold: isTop, color: isTop ? VERDE : "333333", center: true }),
          celula(tipo, 3160, { fill }),
        ]});
      }),
    ],
  });
}

// ── TABELA ROTEIROS ────────────────────────────────────────────────────────
const roteiros = [
  ["Reel 1 — Medo do escuro (102k)",
   "Hook: 'Do que você tem medo?' Metáfora poética: medo do escuro na infância → paralelo com medo de criar → 'o medo de escuro desaparece quando você acende a luz'. Sem CTA de produto. Puro conteúdo emocional de entrada."],
  ["Reel 2 — Vídeo desmotivacional (183k)",
   "Hook: 'Ok, esse é um vídeo desmotivacional.' Vulnerabilidade total: confessa 1 ano parada com ansiedade. Revela resultados do Desafio (7k pessoas postaram, 30k+ vídeos). Emoção crescente até o choro. CTA: 'de criador para criador'."],
  ["Reel 3 — Formato Combinado #16 (177k)",
   "Hook: resultados de alunos com números específicos. Apresenta o formato do dia. Revela o 'Plano do 100'. CTA com urgência: 'dia 16 às 19h16 vou entregar'. É o episódio final da série — conversão máxima."],
  ["Reel 4 — Formato Narrador #15 (110k)",
   "Hook: 'Ela não tem vergonha de copiar essa trend.' Narrador em 3ª pessoa fala SOBRE a própria Hanah. META-CONTEÚDO: o vídeo sobre formato narrador usa o próprio formato narrador. Ensino: 'copiar seus próprios vídeos que deram certo'."],
  ["Reel 5 — Formato Analogia #14 (106k)",
   "Hook: demonstração física ao vivo — tenta enfiar um prato dentro de um pote. Metáfora: 'eu me quebrando pra caber no mercado'. Insight: 'você não precisa se diminuir pra caber'. CTA: link na bio → Plano do 100."],
  ["Reel 6 — Criativo Preguiçoso #13 (145k)",
   "Hook: exemplos de criadores que 'copiaram' ganchos. Ensino: os 3 primeiros segundos decidem tudo — gancho visual forte + conteúdo preguiçoso depois. 'Seu cérebro decide em 3 segundos se vai ficar no vídeo ou não.'"],
  ["Reel 7 — Conversa de Bar #12 (90k)",
   "Hook: 'Eu tenho uma raiva de quem vende disciplina.' Provocação → história pessoal (800 posts seguidos, 3 meias maratonas) → insight: 'o que falta não é vontade, é ter um plano'. Formato: não olha pra câmera, tom de conversa."],
  ["Reel 8 — Formato Análise #11 (107k)",
   "Hook: 'A Malu já me traiu duas vezes.' Analisa o formato do casal @maluetranks. 3 elementos ensinados: tema universal, contraste emocional, formatos repetitivos. Conclusão: 'encontre um formato e repita, repita, repita'."],
  ["Reel 10 — Formato Palestrinha #10 (103k)",
   "Hook: 'Lefi, a gente precisa conversar. Eu quero ter um filho.' Cena cômica — convence o namorado com argumentos numerados a 'ter um filho' (que é um cachorro). Só no final revela que é o formato palestrinha. Humor como trojan horse."],
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

// ── TABELA COMPARATIVO ─────────────────────────────────────────────────────
function tabelaComparativo() {
  const rows = [
    ["Tom",           "Autoritário, direto, ordena",   "Narrativo, emocional, inspira"],
    ["Gancho",        "Declaração ou opinião forte",    "Contradição / curiosidade / confusão"],
    ["CTA",           '"Dois toques na tela, seu ingrato"', '"Link na bio" → produto único'],
    ["Vulnerabilidade","Pontual e estratégica",         "Central à identidade, frequente"],
    ["Estratégia",    "Hábito + rotina diária",         "Série numerada + funil de 16 dias"],
    ["Ensino",        "Instrução direta, imperativa",   "Demonstração implícita (meta-conteúdo)"],
    ["Espiritualidade","Fé como ancoragem pessoal",     "Não aparece nas análises"],
    ["Produto no CTA","Análise do perfil (lead)",       "Plano do 100 (conversão direta)"],
  ];
  return new Table({
    width: { size: 8760, type: WidthType.DXA },
    columnWidths: [2200, 3280, 3280],
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          celulaHeader("Dimensão", 2200),
          celulaHeader("@afonsomolina", 3280),
          celulaHeader("@hanahfranklin", 3280),
        ],
      }),
      ...rows.map(([dim, af, hf], i) => new TableRow({
        children: [
          celula(dim, 2200, { fill: VERDE_CLARO, bold: true }),
          celula(af, 3280, { fill: i % 2 === 0 ? BRANCO : CINZA_LINHA }),
          celula(hf, 3280, { fill: i % 2 === 0 ? BRANCO : CINZA_LINHA }),
        ],
      })),
    ],
  });
}

// ── TABELA PADRÕES REPLICÁVEIS ─────────────────────────────────────────────
const padroes = [
  ["Série numerada",
   '"Desafio Conteúdo Viral: 10 formatos que usei para viralizar fazendo arte" — cria comprometimento da audiência por episódios e expectativa entre posts'],
  ["Meta-conteúdo",
   "Usar o próprio vídeo viral do Augusto como demonstração ao vivo do que ensina. Ex: analisar o próprio conteúdo que viralizou para mostrar por que funcionou"],
  ["Confusão proposital",
   "Abrir com algo que parece não ter relação com o tema e revelar a conexão no meio do vídeo. Ex: mostrar uma obra de vidro quebrando e conectar com 'assim é quem tenta viralizar sem método'"],
  ["Funil de série",
   "Cada episódio entrega valor real e converge para um produto/mentoria ao final. O conteúdo gratuito é o funil — quanto melhor o episódio, mais aquece a audiência"],
  ["Prova social de alunos",
   "Quando tiver os primeiros alunos, colocar os números deles ANTES da dica. Ex: 'Esse cara tinha 200 seguidores, aplicou isso aqui e chegou a X'"],
  ["Contradição como gancho",
   '"Esse é um vídeo anti-viral" ou "eu não sei fazer conteúdo — e viralizo mesmo assim" — paradoxos que forçam o seguidor a ficar para entender'],
  ["Vulnerabilidade da origem",
   "Contar que viralizou sem estratégia, por acidente, sem saber o que estava fazendo. Isso é o maior diferencial — a prova de que o método pode ser aprendido"],
  ["Demonstração com prop físico",
   "Usar objetos do ateliê de vidro/espelho para criar metáforas visuais sobre criação de conteúdo. Ex: 'moldar vidro é como moldar seu posicionamento'"],
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
        run: { size: 36, bold: true, font: "Arial", color: VERDE },
        paragraph: { spacing: { before: 320, after: 160 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: CINZA_HEADER },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Arial", color: VERDE },
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
          border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: VERDE, space: 1 } },
          alignment: AlignmentType.RIGHT,
          spacing: { before: 0, after: 120 },
          children: [new TextRun({ text: "Dossiê de Conteúdo — @hanahfranklin", size: 18, color: "888888", font: "Arial" })],
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
        children: [new TextRun({ text: "DOSSIÊ DE CONTEÚDO", size: 52, bold: true, font: "Arial", color: VERDE })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 400 },
        children: [new TextRun({ text: "@hanahfranklin", size: 40, bold: true, font: "Arial", color: CINZA_HEADER })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: VERDE, space: 1 } },
        spacing: { before: 0, after: 300 },
        children: [new TextRun({ text: "Análise de Ganchos, Série Numerada, Roteiros e Funil de Conteúdo", size: 26, font: "Arial", color: "666666", italics: true })],
      }),
      ...espacamento(2),
      new Table({
        width: { size: 5200, type: WidthType.DXA },
        columnWidths: [2600, 2600],
        rows: [
          new TableRow({ children: [
            celula("Perfil",      2600, { fill: VERDE_CLARO, bold: true, center: true }),
            celula("@hanahfranklin", 2600, { center: true }),
          ]}),
          new TableRow({ children: [
            celula("Nome",        2600, { fill: VERDE_CLARO, bold: true, center: true }),
            celula("Hanah Franklin", 2600, { center: true }),
          ]}),
          new TableRow({ children: [
            celula("Seguidores",  2600, { fill: VERDE_CLARO, bold: true, center: true }),
            celula("893 mil",     2600, { center: true, bold: true, color: VERDE }),
          ]}),
          new TableRow({ children: [
            celula("Posts totais",2600, { fill: VERDE_CLARO, bold: true, center: true }),
            celula("1.452",       2600, { center: true }),
          ]}),
          new TableRow({ children: [
            celula("Nicho",       2600, { fill: VERDE_CLARO, bold: true, center: true }),
            celula("Criação de conteúdo / creator economy", 2600, { center: true }),
          ]}),
          new TableRow({ children: [
            celula("Produto principal", 2600, { fill: VERDE_CLARO, bold: true, center: true }),
            celula("Desafio Formato Criativo + Plano do 100", 2600, { center: true }),
          ]}),
          new TableRow({ children: [
            celula("Reels analisados", 2600, { fill: VERDE_CLARO, bold: true, center: true }),
            celula("22 reels coletados / 9 transcritos", 2600, { center: true }),
          ]}),
          new TableRow({ children: [
            celula("Data da análise", 2600, { fill: VERDE_CLARO, bold: true, center: true }),
            celula("Abril / 2026",    2600, { center: true }),
          ]}),
        ],
      }),
      ...espacamento(1),
      p("Pesquisa de referência para o reposicionamento de Augusto Felipe como especialista em conteúdo viral.", { center: true, color: "888888", italic: true, after: 0 }),
      new Paragraph({ children: [new PageBreak()] }),

      // ── SEÇÃO 1 — VISÃO GERAL ─────────────────────────────────────────
      h(HeadingLevel.HEADING_1, "1. Visão Geral do Perfil"),
      divisor(),
      p("Hanah Franklin é criadora de conteúdo e educadora no nicho de creator economy. Com 893 mil seguidores, ela ensina outras pessoas a crescerem no Instagram através da criação de conteúdo estratégico.", { after: 160 }),
      p("Seu maior diferencial é a execução de séries temáticas — especialmente o 'Desafio Formato Criativo', uma série de 16 episódios que ensina um formato diferente a cada dia. Cada episódio demonstra o próprio formato enquanto o ensina (meta-conteúdo), e toda a série converge para um único produto: o Plano do 100.", { after: 200 }),

      h(HeadingLevel.HEADING_2, "1.1 Pilares de Conteúdo"),
      bullet("Educação sobre formatos de conteúdo para o Instagram"),
      bullet("Storytelling emocional e vulnerabilidade estratégica"),
      bullet("Serialização — séries numeradas com progressão"),
      bullet("Prova social de alunos com resultados concretos"),
      bullet("Meta-conteúdo — vídeos que demonstram o que ensinam"),
      new Paragraph({ children: [new PageBreak()] }),

      // ── SEÇÃO 2 — REELS DA SÉRIE ──────────────────────────────────────
      h(HeadingLevel.HEADING_1, "2. Desafio Formato Criativo — 16 Episódios"),
      divisor(),
      p("A série é o coração do perfil. Cada episódio tem identidade visual consistente (badge numerado + nome do formato), o que cria reconhecimento imediato e fidelização da audiência.", { after: 200 }),
      tabelaSerie(),
      ...espacamento(1),
      p("Média de views por episódio da série: ~128 mil. O episódio 01 (DINAMISMO) foi o mais viral com 309 mil views, e o episódio final (#16) chegou a 177 mil — demonstrando que a audiência chegou aquecida ao momento de venda.", { after: 200, color: "555555", italic: true }),

      h(HeadingLevel.HEADING_2, "2.1 Reels Avulsos (fora da série)"),
      p("Os reels fora da série mostram um perfil diferente — mais viral e mais emocional.", { after: 160 }),
      tabelaAvulsos(),
      new Paragraph({ children: [new PageBreak()] }),

      // ── SEÇÃO 3 — PADRÕES DE GANCHO ───────────────────────────────────
      h(HeadingLevel.HEADING_1, "3. Padrões de Gancho"),
      divisor(),

      h(HeadingLevel.HEADING_2, "3.1 Contradição que Gera Curiosidade"),
      p("Ela afirma algo que vai exatamente contra o esperado — o seguidor fica confuso e precisa ficar para entender o paradoxo.", { after: 120 }),
      quote("Ok, esse é um vídeo desmotivacional — 183 mil views"),
      quote("Ela não tem vergonha de copiar essa trend — 110 mil views"),
      quote("Eu tenho uma raiva de quem vende disciplina — 90 mil views"),
      ...espacamento(1),

      h(HeadingLevel.HEADING_2, "3.2 Confusão Proposital (Reveal no Final)"),
      p("Abre com uma situação que parece não ter relação com o tema e revela a conexão somente no meio ou no final.", { after: 120 }),
      quote("A Malu já me traiu duas vezes [era análise de formato de casal]"),
      quote("Lefi, a gente precisa conversar. Eu quero ter um filho [era pedido para adotar cachorro]"),
      p("A audiência fica confusa os primeiros 3 segundos — exatamente o tempo que o algoritmo mede retenção.", { after: 200, color: "666666" }),

      h(HeadingLevel.HEADING_2, "3.3 Prova Social de Alunos com Números Específicos"),
      p("Sempre antes da dica, nunca depois. O número concreto serve como gancho de credibilidade.", { after: 120 }),
      quote("Essa garota cresceu 16 mil seguidores com gancho polo"),
      quote("Ela só tinha 600 seguidores quando pegou 300 mil views com formato na rádio"),
      quote("A Taís ganhou quase 10 mil seguidores em uma semana quando acertou no formato dinamismo"),
      ...espacamento(1),

      h(HeadingLevel.HEADING_2, "3.4 Demonstração Física com Prop do Cotidiano"),
      p("Usa objetos físicos ao vivo para criar metáforas visuais que transformam conceitos abstratos em algo concreto.", { after: 120 }),
      quote("Tem um jeito de botar esse prato dentro desse pote... Nem quebrando o prato por inteiro cabe no pote"),
      p("Analogia: 'eu me quebrando pra caber no mercado' → 'você não precisa se diminuir pra caber'.", { after: 200, color: "666666" }),

      new Paragraph({ children: [new PageBreak()] }),

      // ── SEÇÃO 4 — META-CONTEÚDO ───────────────────────────────────────
      h(HeadingLevel.HEADING_1, "4. A Técnica Central: Meta-Conteúdo"),
      divisor(),
      p("Esta é a técnica mais original e diferenciadora do perfil. Cada episódio do desafio usa o próprio formato que está ensinando para ensinar:", { after: 160 }),
      bullet("O vídeo sobre 'Formato Narrador' é narrado em 3ª pessoa"),
      bullet("O vídeo sobre 'Formato Palestrinha' usa estrutura de argumentos numerados"),
      bullet("O vídeo sobre 'Formato Análise' faz uma análise ao vivo de outro criador"),
      bullet("O vídeo sobre 'Formato Analogia' usa uma analogia física com prato/pote"),
      bullet("O vídeo sobre 'Criativo Preguiçoso' demonstra gancho visual forte + conteúdo simples"),
      ...espacamento(1),
      p("Isso cria uma didática implícita — o seguidor aprende vendo, não apenas ouvindo. A demonstração está incorporada no próprio conteúdo.", { after: 200, color: "555555", italic: true }),

      h(HeadingLevel.HEADING_2, "4.1 O Ensino Central que Aparece em Vários Reels"),
      p("Um princípio se repete de formas diferentes em toda a série:", { after: 120 }),
      quote("Encontre um formato que funciona para você e repita, repita, repita infinitamente"),
      quote("A maioria das pessoas acha que repetir é chato. Os maiores criadores cresceram sem parar repetindo o mesmo formato"),
      quote("Você não precisa se quebrar para caber. Testa os formatos e vê qual combina com o seu tamanho"),
      new Paragraph({ children: [new PageBreak()] }),

      // ── SEÇÃO 5 — FUNIL EMBUTIDO ──────────────────────────────────────
      h(HeadingLevel.HEADING_1, "5. O Funil da Série"),
      divisor(),
      p("Toda a série de 16 dias foi construída como um funil de conversão. Cada episódio entrega valor real e termina com o mesmo CTA:", { after: 160 }),
      bullet("CTA consistente: 'Link na bio' → acesso ao 'Plano do 100'"),
      bullet("Urgência crescente: 'No dia 16 às 19h16 vou entregar o plano'"),
      bullet("Aquecimento progressivo: a audiência chega ao dia 16 já convencida do método"),
      bullet("Prova durante a jornada: resultados de alunos são mostrados ao longo da série"),
      ...espacamento(1),
      p("O 'Plano do 100' é o produto que promete levar perfis pequenos a 100 mil seguidores. O nome é simples, memorável e específico — '100' se torna o número-âncora de toda a série.", { after: 200, color: "555555", italic: true }),

      h(HeadingLevel.HEADING_2, "5.1 Estrutura Padrão de Cada Episódio"),
      bullet("1. GANCHO — confusão, contradição ou prova social de aluno"),
      bullet("2. DEMONSTRAÇÃO — mostra o formato enquanto o executa (meta-conteúdo)"),
      bullet("3. ENSINAMENTO — explica o princípio por trás do formato"),
      bullet("4. INSIGHT MEMORÁVEL — frase de efeito que resume o aprendizado"),
      bullet("5. CTA ÚNICO — 'link na bio' → Plano do 100"),
      new Paragraph({ children: [new PageBreak()] }),

      // ── SEÇÃO 6 — ANÁLISE DE ROTEIROS ────────────────────────────────
      h(HeadingLevel.HEADING_1, "6. Análise de Roteiro — 9 Vídeos Transcritos"),
      divisor(),
      p("Os 9 reels mais recentes tiveram seus áudios baixados via yt-dlp e transcritos localmente com o modelo Whisper (small).", { after: 200 }),
      tabelaRoteiros(),
      new Paragraph({ children: [new PageBreak()] }),

      // ── SEÇÃO 7 — COMPARATIVO ────────────────────────────────────────
      h(HeadingLevel.HEADING_1, "7. Comparativo: @hanahfranklin vs @afonsomolina"),
      divisor(),
      p("Os dois perfis atuam no mesmo nicho (crescimento no Instagram) mas com abordagens opostas — o que os torna complementares como referências para o Augusto Felipe.", { after: 200 }),
      tabelaComparativo(),
      ...espacamento(1),
      p("Conclusão: Afonso conquista pela autoridade e pela frequência. Hanah conquista pela narrativa e pela serialização. O Augusto pode combinar os dois — autoridade baseada em resultado próprio + série estruturada.", { after: 0, color: "555555", italic: true }),
      new Paragraph({ children: [new PageBreak()] }),

      // ── SEÇÃO 8 — PADRÕES REPLICÁVEIS ────────────────────────────────
      h(HeadingLevel.HEADING_1, "8. Padrões Replicáveis para Augusto Felipe"),
      divisor(),
      p("Padrões identificados no perfil @hanahfranklin adaptados para o reposicionamento do Augusto Felipe como especialista em conteúdo viral:", { after: 200 }),
      tabelaPadroes(),
      ...espacamento(2),

      h(HeadingLevel.HEADING_2, "8.1 Ideia de Série para o Augusto"),
      p("Inspirado no Desafio Formato Criativo da Hanah:", { after: 120 }),
      bullet('"Desafio Viral: 10 formatos que eu usei para viralizar fazendo arte" — 1 episódio por dia'),
      bullet("Cada episódio usa o próprio formato que ensina (meta-conteúdo)"),
      bullet("Badge visual numerado para criar identidade de série"),
      bullet("Todos os episódios convergem para um produto: método/mentoria do Augusto"),
      bullet("Episódio final = revelação do método completo + CTA de venda"),
      ...espacamento(2),

      divisor(VERDE),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 160, after: 80 },
        children: [new TextRun({ text: "Pesquisa de referência para o reposicionamento de Augusto Felipe como especialista em conteúdo viral.", size: 18, color: "888888", italics: true, font: "Arial" })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 80 },
        children: [new TextRun({ text: "22 reels coletados via navegador + 9 transcrições por Whisper local  |  Abril de 2026", size: 18, color: "888888", font: "Arial" })],
      }),
    ],
  }],
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("E:/projeto-fidevidraceiro/instagram-analyzer/dossie_hanahfranklin.docx", buffer);
  console.log("OK: dossie_hanahfranklin.docx gerado com sucesso.");
}).catch(err => {
  console.error("ERRO:", err.message);
  process.exit(1);
});
