const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber, LevelFormat, PageBreak
} = require("docx");
const fs = require("fs");

// ── Cores ──────────────────────────────────────────────────────────────────
const LARANJA       = "C2410C";
const LARANJA_CLARO = "FFF7ED";
const LARANJA_MEDIO = "EA580C";
const CINZA_HEADER  = "4A4A4A";
const CINZA_LINHA   = "F5F5F5";
const BRANCO        = "FFFFFF";

// ── Bordas ─────────────────────────────────────────────────────────────────
const borda = (cor = "CCCCCC") => ({ style: BorderStyle.SINGLE, size: 1, color: cor });
const bordas = (cor) => ({ top: borda(cor), bottom: borda(cor), left: borda(cor), right: borda(cor) });

function h(level, text, cor) {
  return new Paragraph({
    heading: level,
    children: [new TextRun({ text, color: cor || (level === HeadingLevel.HEADING_1 ? LARANJA : CINZA_HEADER) })],
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
    border: { left: { style: BorderStyle.SINGLE, size: 8, color: LARANJA_MEDIO, space: 1 } },
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

function divisor(cor = LARANJA) {
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
  return celula(texto, largura, { fill: LARANJA, bold: true, color: BRANCO, size: 20, center: true, borderColor: LARANJA });
}

// ── DADOS DOS REELS ────────────────────────────────────────────────────────
const reels = [
  ["Reel 01", "Entrevista de rua — O que mudaria na sua vida com R$10K/mês?",   "37,3 mil", "Humanização aspiracional — entrevista com trabalhador (gari)"],
  ["Reel 02", "Meme musical — Don't make me sad (visual puro)",                  "41,2 mil", "Humor/emoção — sem narração relevante"],
  ["Reel 03", "POV: Você achou um criativo campeão (visual puro)",               "83,1 mil", "Benchmark de criativo — sem narração"],
  ["Reel 04", "Resposta à polêmica: Tráfego pago acabou! (screenshots)",         "22,2 mil", "Defesa de autoridade contra previsões apocalípticas do nicho"],
  ["Reel 05", "Com o que você realmente aprende: Erros / Aulas / Conselhos",     "276 mil",  "100% VISUAL — 3 copos comparativos, sem narração"],
  ["Reel 06", "Como você vai ganhar dinheiro na internet — mapa mental",         "221 mil",  "100% VISUAL — Pause o vídeo e descubra"],
  ["Reel 07", "DO QUE VOCÊ MAIS TEM MEDO? — 3 opções + piada dentista",         "22,6 mil", "Medo existencial → produto → quebra cômica"],
  ["Reel 08", "SOCORROOOO — série de interrupções absurdas → CTA",               "56,8 mil", "Humor de interrupção — sequência cômica antes do CTA"],
  ["Reel 09", "A NOVA GESTÃO DE TRÁFEGO — manifesto do cassino (6.600 chars)",  "21,6 mil", "Manifesto de lançamento — metáfora cassino + C.S. Lewis"],
  ["Reel 10", "Tem que aceitar cookie primeiro — skit de humor",                 "116 mil",  "Sketch sobre burocracia da internet — entretenimento puro"],
];

function tabelaReels() {
  return new Table({
    width: { size: 8760, type: WidthType.DXA },
    columnWidths: [900, 3760, 1200, 2900],
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          celulaHeader("Reel", 900),
          celulaHeader("Formato / Hook", 3760),
          celulaHeader("Views", 1200),
          celulaHeader("Observação", 2900),
        ],
      }),
      ...reels.map(([num, formato, views, obs], i) => {
        const isTop = ["276 mil", "221 mil", "116 mil", "83,1 mil"].includes(views);
        const fill = i % 2 === 0 ? BRANCO : CINZA_LINHA;
        return new TableRow({ children: [
          celula(num, 900, { fill, center: true, bold: true }),
          celula(formato, 3760, { fill, bold: isTop }),
          celula(views, 1200, { fill, bold: isTop, color: isTop ? LARANJA : "333333", center: true }),
          celula(obs, 2900, { fill, color: "666666", italic: true }),
        ]});
      }),
    ],
  });
}

// ── TABELA ROTEIROS ────────────────────────────────────────────────────────
const roteiros = [
  ["Reel 01 — Entrevista de rua (37,3k)",
   "Hook: 'O que mudaria na sua vida se você ganhasse 10 mil reais por mês?' Entrevista com Lucio Leite, gari. Revela sonho de reformar a casa, pagar consulta para o neto. 'Sonhar não custa nada.' Pedro se apresenta no fim: 'Eu sou o Pedro, prazer.' Sem CTA de produto — conteúdo emocional puro que ancora a persona do apresentador."],
  ["Reel 02 — Meme musical (41,2k)",
   "Áudio: trecho de 'Don't make me sad' — provavelmente meme emocional/humorístico com legenda sobreposta. Conteúdo visual-driven. Whisper só capturou o trecho da música, sem narração de Pedro."],
  ["Reel 03 — POV criativo campeão (83,1k)",
   "Sem narração transcrita — conteúdo 100% visual. 'POV: Você achou um criativo campeão.' Provavelmente mostra exemplos de criativos publicitários que performam bem. Público-alvo: gestores de tráfego em busca de referências."],
  ["Reel 04 — Tráfego pago acabou (22,2k)",
   "Hook: mosaico de screenshots de pessoas prevendo o fim do tráfego pago. Tom irônico: 'Eu tenho um sonho de juntar todos esses vídeos.' Argumento: 'Toda vez que a gestão de tráfego muda, eu altero meu conteúdo e treino as novas práticas. A gente está sempre vivendo uma nova gestão de tráfego.' Sem CTA direto — conteúdo de posicionamento puro."],
  ["Reel 05 — Erros/Aulas/Conselhos (276k)",
   "Sem narração — conteúdo 100% visual. 3 copos/recipientes representando: Erros (maior), Aulas (médio), Conselhos (menor). Insight visual imediato: você aprende mais com erros do que com aulas ou conselhos. Pausável, compartilhável, sem necessidade de áudio."],
  ["Reel 06 — Mapa mental (221k)",
   "Sem narração — conteúdo 100% visual. Mapa mental com todos os nichos digitais (Social Media, Gestão de Tráfego, Design, Copywriting, Afiliação, Edição de vídeos). Instrução: 'Pause o vídeo e descubra.' Gamifica a atenção — o seguidor para o vídeo para ler. Salve orgânico altíssimo."],
  ["Reel 07 — DO QUE VOCÊ TEM MEDO (22,6k)",
   "Hook: 3 opções de medo. A) escuridão. B) falar em público. C) 'se encarar no espelho daqui a anos e perceber que não se tornou quem pensou — porque em toda oportunidade de evoluir, escolheu o conforto.' Medo C conecta ao produto: evento gratuito 'A Nova Gestão de Tráfego'. D) dentista — quebra de tensão cômica. Estrutura: tensão crescente → CTA → alívio."],
  ["Reel 08 — SOCORROOOO interrupções (56,8k)",
   "Hook humorístico com série de frases incompletas: 'Se você tá indo ler um livro, eu só queria...' 'Se você tá indo jogar...' 'Se você tá acendendo uma pizza...' Cada frase começa seriamente e é interrompida antes de completar. No fim, a única frase que termina: 'Se você não aguenta mais, quer ganhar dinheiro na internet — clica no link da bio.' O humor da repetição cria antecipação para o CTA final."],
  ["Reel 09 — Manifesto cassino (21,6k)",
   "O reel mais longo (6.600 chars). Metáfora: o algoritmo das redes é um cassino — sem relógio, sem janela, recompensa variável. Expandido: eleição como cassino (tempo e energia como apostas), medo como cassino. Referência: C.S. Lewis 'Cartas de um Diabo ao seu Aprendiz': 'O mal vence pela dispersão.' Resolução: convite para evento gratuito 'A Nova Gestão de Tráfego'. Slogan: 'Ninguém por mim e eu por todos.'"],
  ["Reel 10 — Cookie skit (116k)",
   "Sketch de humor: personagem tenta entrar num site e é barrado por cookie → CAPTCHA → novo cookie. Diálogo cômico sobre 'biciclo vs bicicleta' no CAPTCHA. Encerra com 'boa visita.' Sem produto, sem CTA — entretenimento puro sobre frustração digital do usuário. 116k com zero venda = conteúdo de topo de funil altíssimo."],
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

// ── TABELA COMPARATIVO 4 PERFIS ────────────────────────────────────────────
function tabelaComparativo() {
  const rows = [
    ["Seguidores",       "~900 mil",                      "893 mil",                        "1,5 mi",                         "2,2 mi"],
    ["Nicho",            "Crescimento no Instagram",       "Creator economy / formatos",     "Marketing viral",                "Tráfego pago / anúncios"],
    ["Tom",              "Autoritário, ordena",            "Narrativo, inspira",             "Direto, coleguial",              "Inteligente, irônico, dramático"],
    ["Gancho dominante", "Declaração forte de opinião",    "Contradição / confusão",         "3 níveis Ruim/Bom/Viral",        "Visual pausável / metáfora elaborada"],
    ["Maior viral",      "~700 mil",                      "309 mil",                        "8,5 milhões",                    "276 mil (sem narração)"],
    ["Conteúdo visual",  "Misto",                         "Série com badge visual",         "Listas rítmicas sobrepostas",    "2 virais 100% visuais (sem narração)"],
    ["Humor",            "Ironia leve",                   "Skits cotidianos",               "Psicologia reversa",             "Skits, interrupções, memes"],
    ["CTA principal",    '"Dois toques, seu ingrato"',     '"Link na bio" → produto',        '"Toca aqui para me seguir"',     '"Clica no link da bio e se cadastra"'],
    ["Produto",          "Análise de perfil",             "Plano do 100",                   "Código Viral (62k alunos)",      "Nova Gestão de Tráfego (120k alunos)"],
    ["Storytelling",     "Instrução direta",              "Série + vulnerabilidade",        "Hack + lista",                   "Manifesto com referência literária"],
    ["Entrevistas",      "Não",                           "Não",                            "Não",                            "Sim — entrevistas de rua"],
  ];
  return new Table({
    width: { size: 8760, type: WidthType.DXA },
    columnWidths: [1500, 1815, 1815, 1815, 1815],
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          celulaHeader("Dimensão", 1500),
          celulaHeader("@afonsomolina", 1815),
          celulaHeader("@hanahfranklin", 1815),
          celulaHeader("@oneyaraujo", 1815),
          celulaHeader("@pedrosobral", 1815),
        ],
      }),
      ...rows.map(([dim, af, hf, oa, ps], i) => new TableRow({
        children: [
          celula(dim, 1500, { fill: LARANJA_CLARO, bold: true }),
          celula(af, 1815, { fill: i % 2 === 0 ? BRANCO : CINZA_LINHA }),
          celula(hf, 1815, { fill: i % 2 === 0 ? BRANCO : CINZA_LINHA }),
          celula(oa, 1815, { fill: i % 2 === 0 ? BRANCO : CINZA_LINHA }),
          celula(ps, 1815, { fill: i % 2 === 0 ? BRANCO : CINZA_LINHA }),
        ],
      })),
    ],
  });
}

// ── TABELA PADRÕES REPLICÁVEIS ─────────────────────────────────────────────
const padroes = [
  ["Conteúdo 100% visual sem narração",
   "Os 2 maiores virais de Pedro são sem áudio — só texto sobreposto e visual. Para o Augusto: mostrar uma obra de vidro com 3 estágios (bruto/moldado/finalizado) e texto sobreposto 'Do que você aprende: Tentativas / Técnica / Arte'. Zero narração necessária."],
  ["'Pause o vídeo e descubra'",
   "Instrução que gamifica a atenção e multiplica o tempo de visualização. Para o Augusto: mapa mental de 'Tudo que você aprende criando conteúdo sobre arte: Paciência / Posicionamento / Propósito / Processo / Preço.' O seguidor para o vídeo para ler — salve orgânico alto."],
  ["Entrevista de rua com âncora aspiracional",
   "'O que mudaria na sua vida se você conseguisse viver de criar conteúdo?' — entrevista com artesãos, artistas de feira, pessoas que trabalham com arte mas não ganham o que merecem. O contraste humaniza e ancora o desejo da audiência de Augusto."],
  ["Manifesto com metáfora elaborada",
   "Usar uma metáfora do mundo físico para explicar algo abstrato sobre criação de conteúdo. Ex: 'Vidro temperado: parece frágil, mas quando você aprende o processo certo, não quebra mais.' Construir um reel de 60-90s que desenvolve a metáfora completa com CTA de conversão."],
  ["Defesa de autoridade contra o ceticismo do nicho",
   "'Viralizar com arte não funciona.' — Screenshot de alguém dizendo isso. 'Eu tenho um sonho: juntar todos os vídeos de quem disse que artista não consegue escalar no digital.' Posicionamento como o especialista que prova o contrário com dados próprios."],
  ["Medo existencial + CTA + alívio cômico",
   "Opção A: medo de fracassar. Opção B: medo de julgamento. Opção C: 'se encarar daqui a 5 anos e ver que você não transformou sua arte em negócio porque ficou esperando o momento perfeito.' CTA do produto. Opção D: medo de vidro — alívio cômico."],
  ["Skit de humor sobre dor da audiência",
   "Personagem tentando explicar para alguém o que faz como artista: 'Você tem emprego fixo?' 'Tenho.' 'Que emprego?' 'Criador de conteúdo.' '...Mas daí pra viver?' Sketch sobre a falta de reconhecimento do trabalho criativo — que é exatamente a dor que o curso de Augusto resolve."],
  ["3 níveis comparativos visuais (sem narração)",
   "Erros / Aulas / Conselhos do Pedro = Ruim / Bom / Viral do Oney. Para o Augusto, versão visual: 3 objetos que representam 'Como você aprende a criar conteúdo viral: Postando por impulso / Estudando teoria / Testando com método.' Texto sobreposto nos objetos — sem precisar falar nada."],
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
        run: { size: 36, bold: true, font: "Arial", color: LARANJA },
        paragraph: { spacing: { before: 320, after: 160 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: CINZA_HEADER },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Arial", color: LARANJA },
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
          border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: LARANJA, space: 1 } },
          alignment: AlignmentType.RIGHT,
          spacing: { before: 0, after: 120 },
          children: [new TextRun({ text: "Dossiê de Conteúdo — @pedrosobral", size: 18, color: "888888", font: "Arial" })],
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
        children: [new TextRun({ text: "DOSSIÊ DE CONTEÚDO", size: 52, bold: true, font: "Arial", color: LARANJA })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 400 },
        children: [new TextRun({ text: "@pedrosobral", size: 40, bold: true, font: "Arial", color: CINZA_HEADER })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: LARANJA, space: 1 } },
        spacing: { before: 0, after: 300 },
        children: [new TextRun({ text: "Análise de Formatos Visuais, Humor, Manifesto e Metáforas na Conversão por Tráfego", size: 26, font: "Arial", color: "666666", italics: true })],
      }),
      ...espacamento(2),
      new Table({
        width: { size: 5200, type: WidthType.DXA },
        columnWidths: [2600, 2600],
        rows: [
          new TableRow({ children: [
            celula("Perfil",      2600, { fill: LARANJA_CLARO, bold: true, center: true }),
            celula("@pedrosobral", 2600, { center: true }),
          ]}),
          new TableRow({ children: [
            celula("Nome",        2600, { fill: LARANJA_CLARO, bold: true, center: true }),
            celula("Pedro Sobral", 2600, { center: true }),
          ]}),
          new TableRow({ children: [
            celula("Seguidores",  2600, { fill: LARANJA_CLARO, bold: true, center: true }),
            celula("2,2 milhões", 2600, { center: true, bold: true, color: LARANJA }),
          ]}),
          new TableRow({ children: [
            celula("Alunos",      2600, { fill: LARANJA_CLARO, bold: true, center: true }),
            celula("120 mil+ (8 anos de atuação)", 2600, { center: true, bold: true, color: LARANJA }),
          ]}),
          new TableRow({ children: [
            celula("Nicho",       2600, { fill: LARANJA_CLARO, bold: true, center: true }),
            celula("Tráfego pago / anúncios / liberdade financeira", 2600, { center: true }),
          ]}),
          new TableRow({ children: [
            celula("Produto principal", 2600, { fill: LARANJA_CLARO, bold: true, center: true }),
            celula("A Nova Gestão de Tráfego (evento gratuito → curso)", 2600, { center: true }),
          ]}),
          new TableRow({ children: [
            celula("Reels analisados", 2600, { fill: LARANJA_CLARO, bold: true, center: true }),
            celula("10 reels coletados / 7 transcritos (3 visuais puros)", 2600, { center: true }),
          ]}),
          new TableRow({ children: [
            celula("Data da análise", 2600, { fill: LARANJA_CLARO, bold: true, center: true }),
            celula("Abril / 2026", 2600, { center: true }),
          ]}),
        ],
      }),
      ...espacamento(1),
      p("Pesquisa de referência para o reposicionamento de Augusto Felipe como especialista em conteúdo viral.", { center: true, color: "888888", italic: true, after: 0 }),
      new Paragraph({ children: [new PageBreak()] }),

      // ── SEÇÃO 1 — VISÃO GERAL ─────────────────────────────────────────
      h(HeadingLevel.HEADING_1, "1. Visão Geral do Perfil"),
      divisor(),
      p("Pedro Sobral é o perfil mais maduro dos quatro analisados. Com 2,2 milhões de seguidores, 120 mil alunos em 8 anos e um produto consolidado (A Nova Gestão de Tráfego), ele representa o estágio mais avançado de construção de autoridade no digital brasileiro.", { after: 160 }),
      p("Seu nicho é tráfego pago e anúncios online — adjacente ao de criação de conteúdo, mas com forte sobreposição. A audiência que quer 'faturar 10K por mês com a internet' é a mesma que busca criar conteúdo viral como estratégia. Por isso, Pedro é uma referência relevante para o posicionamento do Augusto Felipe.", { after: 200 }),

      h(HeadingLevel.HEADING_2, "1.1 O Maior Diferencial: Conteúdo Visual Sem Narração"),
      p("Dos 10 reels analisados, os dois mais virais (276 mil e 221 mil) são 100% visuais — sem narração, sem áudio relevante. Apenas texto sobreposto e visual impactante.", { after: 120 }),
      bullet("Reel 05 (276 mil): 3 copos comparativos — Erros / Aulas / Conselhos (sem narração)"),
      bullet("Reel 06 (221 mil): mapa mental de nichos digitais com 'Pause o vídeo e descubra' (sem narração)"),
      ...espacamento(1),
      p("Conclusão imediata: no feed atual, um visual forte + texto bem posicionado pode superar qualquer roteiro narrado.", { after: 200, color: "555555", italic: true }),

      h(HeadingLevel.HEADING_2, "1.2 Pilares de Conteúdo"),
      bullet("Conteúdo visual puro — texto sobreposto sem narração (maiores virais)"),
      bullet("Humor como wrapper — skits, memes, interrupções absurdas, piadas de alívio"),
      bullet("Manifesto com metáfora elaborada — cassino, C.S. Lewis, referências filosóficas"),
      bullet("Entrevistas de rua — humanização aspiracional com pessoas reais"),
      bullet("Defesa de autoridade — rebater as previsões equivocadas do nicho"),
      bullet("Medo existencial estruturado — 3 opções + CTA + alívio cômico"),
      new Paragraph({ children: [new PageBreak()] }),

      // ── SEÇÃO 2 — REELS ANALISADOS ────────────────────────────────────
      h(HeadingLevel.HEADING_1, "2. Reels Coletados — 10 Vídeos"),
      divisor(),
      p("Os 10 reels mais recentes do perfil @pedrosobral. Destaques: os 2 maiores virais são 100% visuais, e o reel de 116 mil é puro entretenimento sem produto — o que demonstra uma estratégia consciente de topo de funil.", { after: 200 }),
      tabelaReels(),
      ...espacamento(1),
      p("Padrão crítico: Pedro não tenta vender em todo reel. Ele mistura conscientemente entretenimento puro (skit, meme, entrevista) com conteúdo de conversão. A proporção aparente: 4-5 entretenimento para cada 1-2 conversão.", { after: 200, color: "555555", italic: true }),
      new Paragraph({ children: [new PageBreak()] }),

      // ── SEÇÃO 3 — O PODER DO VISUAL SEM NARRAÇÃO ──────────────────────
      h(HeadingLevel.HEADING_1, "3. O Poder do Conteúdo 100% Visual"),
      divisor(),
      p("A maior descoberta desta análise: os dois reels mais virais do recorte não têm narração. Todo o conteúdo existe apenas no frame visual.", { after: 200 }),

      h(HeadingLevel.HEADING_2, "3.1 Reel 05 — Erros / Aulas / Conselhos (276 mil)"),
      p("Três recipientes físicos (copos ou potes) de tamanhos diferentes, representando as proporções reais de como se aprende:", { after: 120 }),
      bullet("Erros — o maior recipiente (onde mais se aprende)"),
      bullet("Aulas — médio (contribuição real, mas menor do que parece)"),
      bullet("Conselhos — o menor (o menos efetivo, apesar de mais fácil de consumir)"),
      ...espacamento(1),
      p("O insight vai contra a crença popular de que 'cursos e conselhos são o caminho.' Por isso é viral — contradiz o senso comum com evidência visual imediata.", { after: 200, color: "666666" }),

      h(HeadingLevel.HEADING_2, "3.2 Reel 06 — Mapa Mental Pausável (221 mil)"),
      p("Mapa mental com todos os caminhos para ganhar dinheiro na internet (Social Media, Gestão de Tráfego, Design, Copywriting, Afiliação, Edição de vídeos). A instrução 'Pause o vídeo e descubra' força a interação ativa:", { after: 120 }),
      bullet("O seguidor para o vídeo para ler → tempo de visualização aumenta"),
      bullet("A pausa cria uma memória mais forte do que assistir passivamente"),
      bullet("O conteúdo 'incompleto' gera salvamentos orgânicos para rever depois"),
      bullet("O algoritmo registra interação ativa → distribui mais amplamente"),
      new Paragraph({ children: [new PageBreak()] }),

      // ── SEÇÃO 4 — FORMATOS DE HUMOR ───────────────────────────────────
      h(HeadingLevel.HEADING_1, "4. Humor Como Estratégia de Alcance"),
      divisor(),
      p("Pedro usa três mecanismos distintos de humor, cada um com função diferente no funil:", { after: 200 }),

      h(HeadingLevel.HEADING_2, "4.1 Skit de Situação (116 mil — topo de funil)"),
      p("Sketch sobre aceitação de cookies / CAPTCHA — sem produto, sem CTA. Puro entretenimento sobre frustração digital compartilhada.", { after: 120 }),
      quote("Tem que aceitar cookie primeiro. Tá, eu aceito. Posso entrar agora? Agora tem que verificar se você é humano."),
      p("Função: alcance orgânico puro. Quem nunca precisou vender nada — chega primeiro para a audiência antes de qualquer oferta.", { after: 200, color: "666666" }),

      h(HeadingLevel.HEADING_2, "4.2 Série de Interrupções Absurdas → CTA (56,8 mil)"),
      p("Formato: voz off começa várias frases que prometem algo e são interrompidas antes de completar. A única que completa é o CTA.", { after: 120 }),
      quote("Se você tá indo ler um livro, eu só queria te avisar... Se você tá abrindo é fire... Se você tá indo jogar um bichinho..."),
      quote("Se você não vai aguentar mais, quer ganhar dinheiro com a internet — clica no link da bio e se cadastra agora"),
      p("O humor da repetição cria antecipação. O ouvido espera a interrupção — quando o CTA finalmente completa, a audiência já está no ritmo do conteúdo.", { after: 200, color: "666666" }),

      h(HeadingLevel.HEADING_2, "4.3 Alívio Cômico após Tensão Alta (22,6 mil)"),
      p("Opções A, B, C de medo crescente (do trivial ao existencial) → CTA profundo → Opção D: dentista.", { after: 120 }),
      quote("Opção C: se encarar no espelho daqui a alguns anos e perceber que você não se tornou quem pensou que se tornaria"),
      quote("Opção D: dentista"),
      p("A quebra de tensão depois de uma afirmação muito pesada cria alívio e compartilhamento. A audiência ri do próprio medo antes de sentir culpa de não ter agido.", { after: 0 }),
      new Paragraph({ children: [new PageBreak()] }),

      // ── SEÇÃO 5 — O MANIFESTO ─────────────────────────────────────────
      h(HeadingLevel.HEADING_1, "5. O Manifesto: A Metáfora do Cassino"),
      divisor(),
      p("O reel 09 é o mais longo e sofisticado de todos os 4 perfis analisados — 6.600 caracteres de transcrição. É uma peça de lançamento disfarçada de reflexão filosófica.", { after: 200 }),

      h(HeadingLevel.HEADING_2, "5.1 Estrutura do Manifesto"),
      bullet("1. METÁFORA CENTRAL: o cassino físico (sem relógio, luz constante, sons de recompensa falsa)"),
      bullet("2. EXPANSÃO 1: o algoritmo das redes sociais = cassino no bolso"),
      bullet("3. EXPANSÃO 2: as eleições = cassino (apostas de tempo e energia)"),
      bullet("4. EXPANSÃO 3: o medo = cassino (paralisia vs. ação)"),
      bullet("5. REFERÊNCIA LITERÁRIA: C.S. Lewis 'Cartas de um Diabo ao seu Aprendiz' — 'O mal vence pela dispersão'"),
      bullet("6. CONVOCAÇÃO: 'Ninguém por mim e eu por todos' — evento gratuito"),
      ...espacamento(1),
      p("A referência a C.S. Lewis posiciona Pedro como alguém que lê, pensa e conecta ideias de contextos diferentes — diferenciação máxima em relação a criadores que apenas listam dicas.", { after: 200, color: "555555", italic: true }),

      h(HeadingLevel.HEADING_2, "5.2 Frases Mais Poderosas"),
      quote("A sua atenção é o produto. E a casa? A casa sempre vence."),
      quote("O mal vence pela dispersão — C.S. Lewis via Pedro Sobral"),
      quote("A distração não te manda uma fatura — mas daqui a um ano você vai sentir o preço"),
      quote("Eu te desejo que você nunca precise contar com ninguém — mas que todos possam contar com você"),
      new Paragraph({ children: [new PageBreak()] }),

      // ── SEÇÃO 6 — ANÁLISE DE ROTEIROS ─────────────────────────────────
      h(HeadingLevel.HEADING_1, "6. Análise de Roteiro — 10 Vídeos"),
      divisor(),
      p("Os 10 reels coletados tiveram seus áudios baixados via yt-dlp e transcritos com Whisper (small). Reels 03, 05 e 06 retornaram 0 caracteres — conteúdo 100% visual sem narração. Whisper do reel 02 capturou apenas a música de fundo.", { after: 200 }),
      tabelaRoteiros(),
      new Paragraph({ children: [new PageBreak()] }),

      // ── SEÇÃO 7 — COMPARATIVO 4 PERFIS ────────────────────────────────
      h(HeadingLevel.HEADING_1, "7. Comparativo: Os Quatro Perfis Analisados"),
      divisor(),
      p("Com @pedrosobral, completa-se o mapa das quatro principais referências do nicho de educação digital / conteúdo viral no Brasil. Cada perfil representa uma escola diferente — e juntos cobrem quase todas as dimensões de estratégia possíveis.", { after: 200 }),
      tabelaComparativo(),
      ...espacamento(1),
      p("Síntese: Afonso = volume e autoridade. Hanah = serialização e meta-conteúdo. Oney = viralização pura e formatos rítmicos. Pedro = sofisticação narrativa, visual sem narração e humor estratégico. O Augusto pode construir uma síntese única desses quatro archétipos.", { after: 0, color: "555555", italic: true }),
      new Paragraph({ children: [new PageBreak()] }),

      // ── SEÇÃO 8 — PADRÕES REPLICÁVEIS ─────────────────────────────────
      h(HeadingLevel.HEADING_1, "8. Padrões Replicáveis para Augusto Felipe"),
      divisor(),
      p("Padrões identificados em @pedrosobral adaptados para o reposicionamento do Augusto Felipe como especialista em conteúdo viral:", { after: 200 }),
      tabelaPadroes(),
      ...espacamento(2),

      h(HeadingLevel.HEADING_2, "8.1 Síntese Final — A Equação dos 4 Perfis"),
      p("O Augusto Felipe pode construir sua estratégia combinando os elementos mais fortes de cada referência:", { after: 160 }),
      bullet("De @afonsomolina: consistência diária + CTA direto + autoridade pelo volume de conteúdo"),
      bullet("De @hanahfranklin: série numerada + meta-conteúdo + vulnerabilidade estratégica da origem"),
      bullet("De @oneyaraujo: formato Ruim/Bom/Viral + lista rítmica + autorização para copiar"),
      bullet("De @pedrosobral: conteúdo 100% visual sem narração + manifesto com metáfora + humor como topo de funil"),
      ...espacamento(1),
      p("A vantagem única do Augusto: nenhum dos 4 tem o background de artista visual. Ele pode demonstrar visualmente o que ensina de um jeito que nenhum concorrente consegue replicar.", { after: 200, color: "555555", italic: true }),

      divisor(LARANJA),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 160, after: 80 },
        children: [new TextRun({ text: "Pesquisa de referência para o reposicionamento de Augusto Felipe como especialista em conteúdo viral.", size: 18, color: "888888", italics: true, font: "Arial" })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 80 },
        children: [new TextRun({ text: "10 reels coletados via navegador + 7 transcrições por Whisper local  |  Abril de 2026", size: 18, color: "888888", font: "Arial" })],
      }),
    ],
  }],
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("E:/projeto-fidevidraceiro/instagram-analyzer/dossie_pedrosobral.docx", buffer);
  console.log("OK: dossie_pedrosobral.docx gerado com sucesso.");
}).catch(err => {
  console.error("ERRO:", err.message);
  process.exit(1);
});
