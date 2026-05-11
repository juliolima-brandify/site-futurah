const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber, LevelFormat, PageBreak
} = require("docx");
const fs = require("fs");

// ── Cores ──────────────────────────────────────────────────────────────────
const AZUL        = "1E3A8A";
const AZUL_CLARO  = "EFF6FF";
const AZUL_MEDIO  = "3B82F6";
const CINZA_HEADER = "4A4A4A";
const CINZA_LINHA  = "F5F5F5";
const BRANCO = "FFFFFF";

// ── Bordas ─────────────────────────────────────────────────────────────────
const borda = (cor = "CCCCCC") => ({ style: BorderStyle.SINGLE, size: 1, color: cor });
const bordas = (cor) => ({ top: borda(cor), bottom: borda(cor), left: borda(cor), right: borda(cor) });

function h(level, text, cor) {
  return new Paragraph({
    heading: level,
    children: [new TextRun({ text, color: cor || (level === HeadingLevel.HEADING_1 ? AZUL : CINZA_HEADER) })],
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
    border: { left: { style: BorderStyle.SINGLE, size: 8, color: AZUL_MEDIO, space: 1 } },
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

function divisor(cor = AZUL) {
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
  return celula(texto, largura, { fill: AZUL, bold: true, color: BRANCO, size: 20, center: true, borderColor: AZUL });
}

// ── DADOS DOS REELS ────────────────────────────────────────────────────────
const reels = [
  ["Reel 01", "Ruim / Bom / Viral — Áudio, Duração, Horário, Formato",      "8,5 mi",  "Maior viral do perfil — 8 dicas em formato Ruim/Bom/Viral"],
  ["Reel 02", "Ruim / Bom / Excelente — Stories e algoritmo de interação",   "5,5 mi",  "Segundo maior viral — hack sobre respostas em texto"],
  ["Reel 03", "Q&A Ultra-rápido — Como crescer no Instagram",                "3,1 mi",  "Terceiro maior — Formato pergunta/resposta direto"],
  ["Reel 04", "Sem narração / conteúdo visual puro",                         "216 mil", "Áudio vazio transcrito — hook visual/texto sobreposto"],
  ["Reel 05", "Hack dos amigos — quem manda Reels gosta de você",            "133 mil", "Engajamento emocional + CTA comentário"],
  ["Reel 06", "Sempre que pensar em stories, posta no Reels",                "112 mil", "CTA: Dois toques na tela + Código Viral"],
  ["Reel 07", "Autorização explícita para copiar — Control C, Control V",    "95,1 mil","Psicologia reversa: 'copia mesmo, só me segue'"],
  ["Reel 08", "Lista de dicas rápidas — 8 princípios de viralização",        "89,3 mil","Bullet list narrado em menos de 40 segundos"],
  ["Reel 09", "Polêmica: O Instagram acabou — 1.5M de seguidores e...",      "86 mil",  "Marco de seguidores + CTA Código Viral"],
  ["Reel 10", "Curiosidade: Que som é esse? (violoncelo)",                   "76,3 mil","Engajamento por pergunta simples — resposta nos comentários"],
];

function tabelaReels() {
  return new Table({
    width: { size: 8760, type: WidthType.DXA },
    columnWidths: [900, 4060, 1200, 2600],
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          celulaHeader("Reel", 900),
          celulaHeader("Formato / Hook", 4060),
          celulaHeader("Views", 1200),
          celulaHeader("Observação", 2600),
        ],
      }),
      ...reels.map(([num, formato, views, obs], i) => {
        const isTop = ["8,5 mi", "5,5 mi", "3,1 mi"].includes(views);
        const fill = i % 2 === 0 ? BRANCO : CINZA_LINHA;
        return new TableRow({ children: [
          celula(num, 900, { fill, center: true, bold: true }),
          celula(formato, 4060, { fill, bold: isTop }),
          celula(views, 1200, { fill, bold: isTop, color: isTop ? AZUL : "333333", center: true }),
          celula(obs, 2600, { fill, color: "666666", italic: true }),
        ]});
      }),
    ],
  });
}

// ── TABELA ROTEIROS ────────────────────────────────────────────────────────
const roteiros = [
  ["Reel 01 — Ruim/Bom/Viral (8,5 mi)",
   "Formato de 3 níveis comparando áudio, duração, frequência, legendas, horário e a quem seguir. Cada linha termina com 'é viraliza'. Aceleração rítmica crescente. Fecha com CTA de seguir: 'se um desses 10 [que você segue] for o Oney Araújo já resolve sua vida — toca aqui para me seguir'."],
  ["Reel 02 — Ruim/Bom/Excelente Stories (5,5 mi)",
   "Mesmo formato adaptado para Stories: 3 níveis de qualidade. Revela mudança de algoritmo: 'o algoritmo dos stories agora só responde a interação em texto'. Entrega 10 perguntas prontas para usar. Duplo CTA: 'toca aqui ou aqui pra me seguir'."],
  ["Reel 03 — Q&A Ultra-rápido (3,1 mi)",
   "Formato pergunta/resposta em sequência rápida: 'Qual formato para crescer? Reels. Como resolver isolações? Grava no celular e edita no Instagram. Que tipo tem mais engajamento? Fofoca, antes/depois, opinião em tema quente.' Fecha com CTA Código Viral."],
  ["Reel 05 — Hack dos amigos (133k)",
   "Hook: 'Eu vou passar um hack para você — você vai descobrir quem são seus verdadeiros amigos.' Revela: quem manda Reels gosta de você. Insight emocional sobre o algoritmo de compartilhamento. CTA: 'Quem é seu melhor amigo? Comenta aqui'."],
  ["Reel 06 — Stories viram Reels (112k)",
   "Instrução direta: 'Toda vez que pensar em gravar para stories, posta no Reels.' CTA imediato: 'Já dá dois toques na tela'. Três razões: stories somem em 24h, vídeo performa menos que imagem com pergunta, IA detecta scripts genéricos. Fecha com Código Viral."],
  ["Reel 07 — Autorização para copiar (95,1k)",
   "Hook subversivo: 'Quando for me copiar, faz logo. Ctrl C, Ctrl V. Não é reclamação — estou te encorajando.' Revela que até concorrentes copiam e transforma o conteúdo. Fecha com condição: 'se você me copia e não me segue nem deixa like, aí você está de brincadeira'."],
  ["Reel 08 — 8 princípios rápidos (89,3k)",
   "Bullet list falado: títulos servindo de gancho, começa no meio da história, abaixo de 40 segundos, narração diferente do que está na tela, consistência vence talento, se não funcionar posta com outro gancho, fala conversando e não ensinando, deixa like nos que assistiu até o final."],
  ["Reel 09 — O Instagram acabou (86k)",
   "Hook dramático de polêmica: '14 anos aqui, 1.5M de seguidores — e agora alguém com zero seguidores pode ter mais views que eu.' Reframe: não é reclamação, é oportunidade. 'Instagram deixou de ser rede social e virou rede de interesse.' Fecha com CTA Código Viral."],
  ["Reel 10 — Curiosidade (76,3k)",
   "Hook de pergunta simples: 'Que som é esse?' (toca trecho de violoncelo). Engajamento puro — sem dica, sem produto. 100% voltado para gerar comentários. Demonstra que nem todo vídeo precisa ensinar algo."],
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

// ── TABELA COMPARATIVO 3 PERFIS ────────────────────────────────────────────
function tabelaComparativo() {
  const rows = [
    ["Tom",              "Autoritário, ordena",         "Narrativo, inspira",            "Direto, coleguial, descontraído"],
    ["Gancho dominante", "Declaração forte de opinião", "Contradição / confusão",         "3 níveis: Ruim/Bom/Viral"],
    ["CTA principal",    '"Dois toques, seu ingrato"',   '"Link na bio" → produto único', '"Toca aqui para me seguir"'],
    ["Duração média",    "30–60 seg",                   "45–90 seg (série)",              "< 40 seg"],
    ["Virais máximos",   "~700 mil",                    "309 mil (série)",                "8,5 milhões"],
    ["Produto",          "Análise de perfil (lead)",    "Plano do 100",                   "Código Viral"],
    ["Formato-estrela",  "Opinion + instrução",         "Série numerada (16 eps)",        "Ruim / Bom / Viral"],
    ["Vulnerabilidade",  "Estratégica e pontual",       "Central, frequente, emocional",  "Quase ausente — foca no hack"],
    ["Espiritualidade",  "Fé como ancoragem",           "Não aparece",                    "Não aparece"],
    ["Ensino",           "Imperativo, direto",          "Demonstração (meta-conteúdo)",   "Lista rítmica, Q&A acelerado"],
    ["Comunidade",       "Seguidores como 'ingratos'",  "Alunos com resultados reais",    "62k+ alunos, proof no número"],
  ];
  return new Table({
    width: { size: 8760, type: WidthType.DXA },
    columnWidths: [1800, 2320, 2320, 2320],
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          celulaHeader("Dimensão", 1800),
          celulaHeader("@afonsomolina", 2320),
          celulaHeader("@hanahfranklin", 2320),
          celulaHeader("@oneyaraujo", 2320),
        ],
      }),
      ...rows.map(([dim, af, hf, oa], i) => new TableRow({
        children: [
          celula(dim, 1800, { fill: AZUL_CLARO, bold: true }),
          celula(af, 2320, { fill: i % 2 === 0 ? BRANCO : CINZA_LINHA }),
          celula(hf, 2320, { fill: i % 2 === 0 ? BRANCO : CINZA_LINHA }),
          celula(oa, 2320, { fill: i % 2 === 0 ? BRANCO : CINZA_LINHA }),
        ],
      })),
    ],
  });
}

// ── TABELA PADRÕES REPLICÁVEIS ─────────────────────────────────────────────
const padroes = [
  ["Ruim / Bom / Viral",
   "Criar versão para o nicho de conteúdo: 'Postar qualquer coisa é ruim. Postar com consistência é bom. Postar com estratégia de viralização é viral.' Funciona com qualquer tema — arte, vidro, criação de conteúdo."],
  ["Q&A ultra-rápido",
   "Formato perguntas e respostas em sequência acelerada. 'Qual nicho para viralizar? O que você já sabe fazer. Como arrumar um hook? Começa no meio da história. Como crescer com arte? Documenta o processo.' Direto, sem enrolação."],
  ["Autorização para copiar",
   "Conteúdo subversivo: 'Quando for me copiar — copia mesmo.' Para o Augusto: 'Pode pegar meus ganchos, minha estrutura, meu formato. A única coisa que você não consegue copiar é a sua história.' Gera credibilidade e alcance."],
  ["Lista rítmica bullet",
   "8–10 dicas em menos de 40 segundos, narradas como lista. Cada item tem 1 linha. Ex: 'começa no meio da história, fica abaixo de 40 segundos, narra diferente do que está na tela'. Ritmo acelerado = retenção alta."],
  ["Polêmica de plataforma",
   "Abrir com afirmação bombástica sobre o Instagram/algoritmo: 'O Instagram mudou tudo — e ninguém te contou isso.' Para o Augusto: 'O algoritmo do Instagram não liga para a sua arte. Ele liga para o seu gancho.'"],
  ["Hack emocional com CTA de comentário",
   "'Eu vou te passar um hack que vai mudar como você vê seus seguidores.' Reveal emocional + CTA: 'Quem é o seu maior apoiador? Marca nos comentários.' Gera avalanche de engajamento qualificado."],
  ["Marco próprio como gancho",
   "Usar conquistas pessoais de forma que humaniza: '14 anos criando conteúdo, 1.5M de seguidores.' Para o Augusto: '3 anos fazendo arte com vidro, 1 vídeo que chegou a X pessoas.' O número real ancora a autoridade."],
  ["CTA de seguir embutido no ensinamento",
   "'Se você seguir só 10 perfis para aprender, e um desses for o [Augusto], já resolve sua vida.' Faz o seguir parecer a dica em si — não um pedido, mas a conclusão lógica do conteúdo."],
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
        run: { size: 36, bold: true, font: "Arial", color: AZUL },
        paragraph: { spacing: { before: 320, after: 160 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: CINZA_HEADER },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Arial", color: AZUL },
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
          border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: AZUL, space: 1 } },
          alignment: AlignmentType.RIGHT,
          spacing: { before: 0, after: 120 },
          children: [new TextRun({ text: "Dossiê de Conteúdo — @oneyaraujo", size: 18, color: "888888", font: "Arial" })],
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
        children: [new TextRun({ text: "DOSSIÊ DE CONTEÚDO", size: 52, bold: true, font: "Arial", color: AZUL })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 400 },
        children: [new TextRun({ text: "@oneyaraujo", size: 40, bold: true, font: "Arial", color: CINZA_HEADER })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: AZUL, space: 1 } },
        spacing: { before: 0, after: 300 },
        children: [new TextRun({ text: "Análise de Ganchos, Formato Ruim/Bom/Viral, Roteiros e Padrões de Viralização", size: 26, font: "Arial", color: "666666", italics: true })],
      }),
      ...espacamento(2),
      new Table({
        width: { size: 5200, type: WidthType.DXA },
        columnWidths: [2600, 2600],
        rows: [
          new TableRow({ children: [
            celula("Perfil",      2600, { fill: AZUL_CLARO, bold: true, center: true }),
            celula("@oneyaraujo", 2600, { center: true }),
          ]}),
          new TableRow({ children: [
            celula("Nome",        2600, { fill: AZUL_CLARO, bold: true, center: true }),
            celula("Oney Araújo | Marketing Viral", 2600, { center: true }),
          ]}),
          new TableRow({ children: [
            celula("Seguidores",  2600, { fill: AZUL_CLARO, bold: true, center: true }),
            celula("1,5 milhões", 2600, { center: true, bold: true, color: AZUL }),
          ]}),
          new TableRow({ children: [
            celula("Maior viral", 2600, { fill: AZUL_CLARO, bold: true, center: true }),
            celula("8,5 milhões de views", 2600, { center: true, bold: true, color: AZUL }),
          ]}),
          new TableRow({ children: [
            celula("Nicho",       2600, { fill: AZUL_CLARO, bold: true, center: true }),
            celula("Marketing viral / crescimento no Instagram", 2600, { center: true }),
          ]}),
          new TableRow({ children: [
            celula("Produto principal", 2600, { fill: AZUL_CLARO, bold: true, center: true }),
            celula("Código Viral (62k+ alunos)", 2600, { center: true }),
          ]}),
          new TableRow({ children: [
            celula("Reels analisados", 2600, { fill: AZUL_CLARO, bold: true, center: true }),
            celula("10 reels coletados / 9 transcritos", 2600, { center: true }),
          ]}),
          new TableRow({ children: [
            celula("Data da análise", 2600, { fill: AZUL_CLARO, bold: true, center: true }),
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
      p("Oney Araújo é o perfil mais viral dos três analisados. Com 1,5 milhão de seguidores e um reel com 8,5 milhões de views, ele representa o teto de performance do nicho de marketing viral / criação de conteúdo no Brasil.", { after: 160 }),
      p("Seu produto principal, o Código Viral, tem mais de 62 mil alunos declarados — o maior número entre os perfis estudados. A abordagem é 100% focada em hacks práticos e listas rítmicas, sem storytelling emocional profundo. O tom é coleguial, direto e descontraído.", { after: 200 }),

      h(HeadingLevel.HEADING_2, "1.1 Pilares de Conteúdo"),
      bullet("Formato Ruim / Bom / Viral — estrutura de 3 níveis que compara qualidade crescente"),
      bullet("Q&A ultra-rápido — perguntas e respostas em sequência acelerada"),
      bullet("Listas de dicas rítmicas — 8 a 10 princípios em menos de 40 segundos"),
      bullet("Polêmica de plataforma — afirmações fortes sobre o algoritmo do Instagram"),
      bullet("Psicologia reversa — autorização explícita para copiar, seguir, engajar"),
      bullet("Engajamento por curiosidade — perguntas simples que geram comentários em massa"),
      new Paragraph({ children: [new PageBreak()] }),

      // ── SEÇÃO 2 — REELS ANALISADOS ────────────────────────────────────
      h(HeadingLevel.HEADING_1, "2. Reels Coletados — 10 Vídeos"),
      divisor(),
      p("Os 10 reels mais recentes coletados do perfil @oneyaraujo. Os três primeiros (8,5 mi / 5,5 mi / 3,1 mi) são virais extremos que isolam o formato Ruim/Bom/Viral como o principal driver de alcance do perfil.", { after: 200 }),
      tabelaReels(),
      ...espacamento(1),
      p("Os 3 maiores virais totalizam mais de 17 milhões de views. O próximo reel da lista tem 216 mil — uma diferença de 40x. Isso confirma que o formato Ruim/Bom/Viral é o código de viralização dominante deste perfil.", { after: 200, color: "555555", italic: true }),
      new Paragraph({ children: [new PageBreak()] }),

      // ── SEÇÃO 3 — O FORMATO ESTRELA ───────────────────────────────────
      h(HeadingLevel.HEADING_1, "3. O Formato Estrela: Ruim / Bom / Viral"),
      divisor(),
      p("O maior diferencial técnico do @oneyaraujo é o formato de 3 níveis que compara qualidades crescentes de um comportamento. Ao contrário das listas comuns (bom / ruim), ele adiciona um terceiro nível que cria aspiração:", { after: 160 }),
      bullet("RUIM — o comportamento médio que a maioria tem"),
      bullet("BOM — uma melhora reconhecível"),
      bullet("VIRAL / EXCELENTE — o comportamento de quem realmente domina"),
      ...espacamento(1),
      p("O padrão rítmico é o que gera retenção: cada item da lista é curto, tem cadência igual e termina com a mesma palavra-âncora. O ouvido antecipa o próximo item.", { after: 160 }),

      h(HeadingLevel.HEADING_2, "3.1 Exemplo Real — Reel de 8,5 Milhões de Views"),
      quote("Gravar com áudio da câmera é RUIM. Com microfone na posição recomendada é BOM. Segurando o microfone perto da boca é VIRAL"),
      quote("Reels de 90 segundos é RUIM. De 60 segundos é BOM. De 40 segundos é VIRAL"),
      quote("Postar 1 reel por semana é RUIM. 4 por semana é BOM. 1 por dia é VIRAL"),
      ...espacamento(1),
      p("O mesmo padrão aparece em reels sobre Stories (5,5 mi): Ruim / Bom / Excelente — mesma estrutura, mesmo resultado.", { after: 200, color: "666666" }),

      h(HeadingLevel.HEADING_2, "3.2 Por que o Formato Funciona"),
      bullet("Clareza instantânea: a audiência entende o critério de avaliação sem precisar de contexto"),
      bullet("Aspiração progressiva: 'viral' é a promessa máxima do nicho — a última palavra de cada item"),
      bullet("Ritmo previsível: o cérebro antecipa o próximo item → menor chance de sair do vídeo"),
      bullet("Alta densidade de informação: 8 dicas em menos de 60 segundos"),
      bullet("Compartilhável: é fácil salvar ou mandar para alguém — 'preciso ver isso de novo'"),
      new Paragraph({ children: [new PageBreak()] }),

      // ── SEÇÃO 4 — PADRÕES DE GANCHO ───────────────────────────────────
      h(HeadingLevel.HEADING_1, "4. Padrões de Gancho"),
      divisor(),

      h(HeadingLevel.HEADING_2, "4.1 Hack com Promessa Emocional"),
      p("Não promete só informação — promete revelação emocional antes de entregar o hack.", { after: 120 }),
      quote("Eu vou passar um hack para você — você vai descobrir quem são seus verdadeiros amigos"),
      quote("Você vai descobrir um segredo que vai explodir a sua cabeça"),
      ...espacamento(1),

      h(HeadingLevel.HEADING_2, "4.2 Polêmica de Plataforma"),
      p("Afirmação bombástica sobre o Instagram que parece errada ou negativa — força o seguidor a ficar para entender.", { after: 120 }),
      quote("É galera, o Instagram acabou — 14 anos da minha vida e agora você com zero seguidores pode ter mais views que eu"),
      p("Reframe no meio: 'Eu não estou reclamando. Muito pelo contrário.' A polêmica vira oportunidade.", { after: 200, color: "666666" }),

      h(HeadingLevel.HEADING_2, "4.3 Psicologia Reversa — Autorização para Copiar"),
      p("Em vez de pedir para seguir, autoriza ativamente a cópia do próprio conteúdo — o que cria confiança e ironicamente aumenta o engajamento.", { after: 120 }),
      quote("Quando for me copiar, faz logo assim. Ctrl C, Ctrl V. Não é reclamação — eu estou te encorajando"),
      quote("Até concorrentes copiam meu conteúdo. Não tem problema. Mas se você me copia e não me segue — aí você está de brincadeira"),
      ...espacamento(1),

      h(HeadingLevel.HEADING_2, "4.4 CTA Embutido no Conteúdo"),
      p("O CTA de seguir não interrompe o vídeo — ele é a conclusão lógica do ensinamento.", { after: 120 }),
      quote("Se você vai seguir só 10 perfis para aprender a viralizar — e um desses for o Oney Araújo — já resolve sua vida. Toca aqui para me seguir"),
      quote("Já dá dois toques na tela que eu vou te falar um negócio que vai explodir a sua cabeça"),
      p("O 'dois toques na tela' é o mesmo CTA de @afonsomolina — confirma que é padrão do nicho, não de um criador específico.", { after: 200, color: "555555", italic: true }),
      new Paragraph({ children: [new PageBreak()] }),

      // ── SEÇÃO 5 — ANÁLISE DE ROTEIROS ─────────────────────────────────
      h(HeadingLevel.HEADING_1, "5. Análise de Roteiro — 9 Vídeos Transcritos"),
      divisor(),
      p("Os 10 reels coletados tiveram seus áudios baixados via yt-dlp e transcritos localmente com o modelo Whisper (small). O reel_04 não produziu transcrição (conteúdo visual sem narração).", { after: 200 }),
      tabelaRoteiros(),
      new Paragraph({ children: [new PageBreak()] }),

      // ── SEÇÃO 6 — COMPARATIVO 3 PERFIS ────────────────────────────────
      h(HeadingLevel.HEADING_1, "6. Comparativo: Três Perfis Analisados"),
      divisor(),
      p("Com a análise do @oneyaraujo, completa-se o mapa completo das três principais referências do nicho de marketing viral no Brasil. Cada perfil representa uma escola diferente de crescimento no Instagram.", { after: 200 }),
      tabelaComparativo(),
      ...espacamento(1),
      p("Conclusão: Afonso domina pela autoridade e consistência diária. Hanah domina pela serialização e meta-conteúdo. Oney domina pela viralização pura — o menor número de seguidores, o maior viral. O Augusto pode combinar os três: autoridade da origem + série estruturada + formato viral repetível.", { after: 0, color: "555555", italic: true }),
      new Paragraph({ children: [new PageBreak()] }),

      // ── SEÇÃO 7 — PADRÕES REPLICÁVEIS ─────────────────────────────────
      h(HeadingLevel.HEADING_1, "7. Padrões Replicáveis para Augusto Felipe"),
      divisor(),
      p("Padrões identificados em @oneyaraujo adaptados para o reposicionamento do Augusto Felipe como especialista em conteúdo viral:", { after: 200 }),
      tabelaPadroes(),
      ...espacamento(2),

      h(HeadingLevel.HEADING_2, "7.1 Formato Ruim/Bom/Viral Adaptado para o Augusto"),
      p("O mesmo formato pode ser aplicado ao nicho de criação de conteúdo com arte:", { after: 160 }),
      bullet('"Mostrar sua arte sem contexto é RUIM. Mostrar o processo é BOM. Mostrar o processo com uma história é VIRAL"'),
      bullet('"Postar uma foto da obra é RUIM. Postar um reel da obra pronta é BOM. Postar a obra quebrando e recomeçando é VIRAL"'),
      bullet('"Falar sobre vidro é RUIM. Falar sobre o que vidro representa é BOM. Falar sobre o que você aprendeu quebrando vidro é VIRAL"'),
      ...espacamento(1),
      p("Adaptação-chave: trocar o tema (Instagram) pela experiência física do vidro/espelho — o que torna o formato completamente único para o Augusto.", { after: 200, color: "555555", italic: true }),

      h(HeadingLevel.HEADING_2, "7.2 Síntese Final das 3 Referências"),
      bullet("De @afonsomolina: o hábito diário + o CTA direto + a autoridade pelo volume"),
      bullet("De @hanahfranklin: a série numerada + o meta-conteúdo + a vulnerabilidade estratégica"),
      bullet("De @oneyaraujo: o formato Ruim/Bom/Viral + a lista rítmica + a autorização para copiar"),
      ...espacamento(2),

      divisor(AZUL),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 160, after: 80 },
        children: [new TextRun({ text: "Pesquisa de referência para o reposicionamento de Augusto Felipe como especialista em conteúdo viral.", size: 18, color: "888888", italics: true, font: "Arial" })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 80 },
        children: [new TextRun({ text: "10 reels coletados via navegador + 9 transcrições por Whisper local  |  Abril de 2026", size: 18, color: "888888", font: "Arial" })],
      }),
    ],
  }],
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("E:/projeto-fidevidraceiro/instagram-analyzer/dossie_oneyaraujo.docx", buffer);
  console.log("OK: dossie_oneyaraujo.docx gerado com sucesso.");
}).catch(err => {
  console.error("ERRO:", err.message);
  process.exit(1);
});
