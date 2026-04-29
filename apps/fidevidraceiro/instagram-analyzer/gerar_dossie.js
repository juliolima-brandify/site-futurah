const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber, LevelFormat, ExternalHyperlink,
  PageBreak
} = require("docx");
const fs = require("fs");

// ── Cores ──────────────────────────────────────────────────────────────────
const ROXO       = "6B3FA0";
const ROXO_CLARO = "EDE7F6";
const CINZA_HEADER = "4A4A4A";
const CINZA_LINHA  = "F5F5F5";
const BRANCO = "FFFFFF";

// ── Bordas ─────────────────────────────────────────────────────────────────
const borda = (cor = "CCCCCC") => ({ style: BorderStyle.SINGLE, size: 1, color: cor });
const bordas = (cor) => ({ top: borda(cor), bottom: borda(cor), left: borda(cor), right: borda(cor) });
const semBorda = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const semBordas = { top: semBorda, bottom: semBorda, left: semBorda, right: semBorda };

// ── Helpers ────────────────────────────────────────────────────────────────
function h(level, text, cor) {
  return new Paragraph({
    heading: level,
    children: [new TextRun({ text, color: cor || (level === HeadingLevel.HEADING_1 ? ROXO : CINZA_HEADER) })],
  });
}

function p(text, opts = {}) {
  return new Paragraph({
    alignment: opts.center ? AlignmentType.CENTER : AlignmentType.LEFT,
    spacing: { before: opts.before ?? 100, after: opts.after ?? 100 },
    children: [new TextRun({ text, size: opts.size ?? 22, bold: opts.bold, color: opts.color ?? "333333", font: "Arial" })],
  });
}

function bullet(text, lvl = 0) {
  return new Paragraph({
    numbering: { reference: "bullets", level: lvl },
    spacing: { before: 60, after: 60 },
    children: [new TextRun({ text, size: 22, color: "333333", font: "Arial" })],
  });
}

function divisor(cor = ROXO) {
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

// ── Célula de tabela ────────────────────────────────────────────────────────
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
        text: String(texto),
        size: opcoes.size ?? 20,
        bold: opcoes.bold ?? false,
        color: opcoes.color ?? "333333",
        font: "Arial",
      })],
    })],
  });
}

function celulaHeader(texto, largura) {
  return celula(texto, largura, { fill: ROXO, bold: true, color: BRANCO, size: 20, center: true, borderColor: ROXO });
}

// ── TABELA 24 REELS ────────────────────────────────────────────────────────
const reels = [
  [1,  "Eu mostrei na prática como se lida com hater",                  "28,3 mil", "Storytelling"],
  [2,  "Só aborde política no seu perfil, cê você aguenta rojão",       "45,2 mil", "Polêmica"],
  [3,  "Agenda seus posts e você terá mais alcance",                    "44,7 mil", "Instrução"],
  [4,  "Seu CPF tem que aparecer no seu CNPJ aqui na rede social",      "59,1 mil", "Metáfora"],
  [5,  "Quando for mostrar algo no story, é assim que você faz:",       "71,5 mil", "Tutorial"],
  [6,  "Eu não sou essa pessoa que vocês acham que eu sou",             "26,3 mil", "Vulnerabilidade"],
  [7,  "Pega o hábito de fazer esse vídeo com o seu café",              "45,8 mil", "Hábito"],
  [8,  "Pega o hábito de fazer esse story de terça-feira",             "102 mil",  "Hábito"],
  [9,  "Deus me falou essa frase assim que tomei meu 1° gole de café",  "46,7 mil", "Espiritual"],
  [10, "Posta esses 2 números no seu story",                            "93,8 mil", "Instrução"],
  [11, "Deus vai fazer os seus conteúdos chegar para quem importa",     "74,1 mil", "Espiritual"],
  [12, "Vou ensinar isso só uma vez",                                   "83,6 mil", "Curiosidade"],
  [13, "Não posta só o seu treino feito nos story",                     "91,4 mil", "Instrução"],
  [14, "Quando cê tiver sem ideia de conteúdo, posta esse reel aqui",   "76,8 mil", "Instrução"],
  [15, "A internet encoraja os fracassados",                            "329 mil",  "Polêmica"],
  [16, "E EU QUE DESCOBRI UMA IA QUE CRIA MUITO POST EM ALGUNS SEGUNDOS","305 mil", "Revelação"],
  [17, "Pega o hábito de toda segunda-feira postar esse story aqui",    "226 mil",  "Hábito"],
  [18, "Escutei algo agora que me marcou",                              "47,9 mil", "Curiosidade"],
  [19, "O feed virou o novo story",                                     "108 mil",  "Tendência"],
  [20, "Eu avisei que o conteúdo editado ia começar flopar",            "288 mil",  "Polêmica"],
  [21, "Eu odeio postar de domingo",                                    "60,6 mil", "Declaração"],
  [22, "Coloca seu rosto todo dia no seu perfil",                       "92 mil",   "Instrução"],
  [23, "Estamos vivendo a melhor época da história para postar vídeo",  "69,7 mil", "Tendência"],
  [24, "Pega o hábito de fazer um post de metas no domingo",            "149 mil",  "Hábito"],
];

function tabelaReels() {
  const rows = [
    new TableRow({
      tableHeader: true,
      children: [
        celulaHeader("#",      480),
        celulaHeader("Título / Hook",  5800),
        celulaHeader("Views",  1100),
        celulaHeader("Tipo",   1380),
      ],
    }),
    ...reels.map(([n, titulo, views, tipo], i) => {
      const fill = i % 2 === 0 ? BRANCO : CINZA_LINHA;
      const isTop = ["329 mil", "305 mil", "288 mil", "226 mil"].includes(views);
      return new TableRow({
        children: [
          celula(String(n), 480, { fill, center: true }),
          celula(titulo, 5800, { fill }),
          celula(views, 1100, { fill, bold: isTop, color: isTop ? ROXO : "333333", center: true }),
          celula(tipo, 1380, { fill, center: true }),
        ],
      });
    }),
  ];
  return new Table({ width: { size: 8760, type: WidthType.DXA }, columnWidths: [480, 5800, 1100, 1380], rows });
}

// ── TABELA PADRÕES REPLICÁVEIS ─────────────────────────────────────────────
const padroes = [
  ["Resultado antes da dica",
   "\"Eu viralizei fazendo arte com vidro sem saber nada de Instagram — veja o que eu fiz diferente\" → mostra número (views, seguidores ganhos) ANTES de ensinar"],
  ["Metáfora com a origem (vidro/espelho)",
   "Usar o próprio ofício como analogia: \"Conteúdo viral é como um espelho — reflete o que as pessoas já sentem, mas ainda não sabem expressar\""],
  ["Instrução + rotina do criador",
   "\"Quando você terminar de gravar hoje, faz isso antes de postar\" — ancoragem no momento de quem está começando a produzir conteúdo"],
  ["Matar objeção dentro do vídeo",
   "Antecipar o \"mas eu não tenho câmera boa\", \"mas meu nicho não viraliza\" ou \"mas eu não sou comunicativo\" — com provas da própria trajetória"],
  ["CTA de lead nos comentários",
   "\"Digita VIRAL nos comentários e eu te mostro o método que usei pra sair do zero\" — captura lead + engajamento ao mesmo tempo"],
  ["Série de hábito + dia da semana",
   "\"Pega o hábito de toda segunda-feira postar um vídeo assim\" — cria ritual, fideliza audiência e facilita produção em loop"],
  ["Vulnerabilidade da origem",
   "Contar que viralizou por acidente, sem estratégia. Humaniza e cria identificação com quem está começando do zero"],
  ["Polêmica do mercado",
   "\"A internet te ensinou errado sobre viralizar\" ou \"Você não viraliza por causa disso daqui\" — opinião forte gera compartilhamento"],
];

function tabelaPadroes() {
  return new Table({
    width: { size: 8760, type: WidthType.DXA },
    columnWidths: [3200, 5560],
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          celulaHeader("Padrão", 3200),
          celulaHeader("Como usar no nicho espiritual", 5560),
        ],
      }),
      ...padroes.map(([pad, uso], i) => new TableRow({
        children: [
          celula(pad, 3200, { fill: i % 2 === 0 ? BRANCO : CINZA_LINHA, bold: true }),
          celula(uso, 5560, { fill: i % 2 === 0 ? BRANCO : CINZA_LINHA }),
        ],
      })),
    ],
  });
}

// ── TABELA TRANSCRIÇÕES ────────────────────────────────────────────────────
const transcricoes = [
  ["Reel 1 — Como se lida com hater",
   "Abre com situação real (hater às 11h). Mostra resultado concreto (14k curtidas). Ensina: \"Expõe o hater, sua audiência vai te apoiar. Aquilo que ele fez te promoveu.\" CTA: dois toques + ingrato."],
  ["Reel 2 — Política no perfil",
   "Aviso direto: só fale de política se aguentar o rojão. Prós e contras. Opinião pessoal forte. Frase marcante: \"se você vai ficar chorando depois em posição fetal, aí nem toca nesse assunto.\""],
  ["Reel 3 — Agendamento de posts",
   "Grava às 4h30 da manhã, post entra às 15h. Demonstração ao vivo como prova. Mata objeção: \"Dia corrido não é justificativa para ficar sem postar, falta de organização é.\""],
  ["Reel 4 — CPF no CNPJ",
   "Metáfora central: CPF = vida pessoal, CNPJ = empresa. Lista o que pode aparecer (treino, família, viagens). Conclusão: \"CNPJ precisa de coisa do CPF para crescer.\""],
  ["Reel 5 — Como mostrar algo nos stories",
   "Demonstra a dica DENTRO do próprio vídeo em tempo real. \"Agora eu tô tomando um cafezinho — deixa eu te contar algo.\" Alta retenção por mostrar enquanto explica."],
  ["Reel 6 — Vulnerabilidade (sem dica)",
   "Único reel sem dica prática. Confessa falhas, ansiedade, insegurança. \"Eu não sou esse herói.\" Sem CTA comercial. Puro conteúdo de conexão emocional e espiritual."],
  ["Reel 7 — Reflexão no café",
   "Segmenta: \"para quem toma café.\" Instrução contextual: grava 60s de reflexão com o celular na mesa. Benefício: formato gostoso de assistir que gera engajamento."],
  ["Reel 8 — Hábito de terça-feira (depoimento)",
   "Pega hábito de toda terça: posta elogio de cliente no story. Passo a passo: imagem do feedback + explicação do produto no story seguinte. Promessa: \"você vai explodir de vender.\""],
  ["Reel 9 — Metáfora do barco",
   "Metáfora poética completa: barco atracado no cais. Aplicação espiritual: \"O barco é você. Deus não te fez para estar atracado.\" Sem CTA, puro conteúdo espiritual."],
  ["Reel 10 — 2 números no story",
   "Mecânica gamificada: seguidores escolhem número 1 ou 2. Quem escolhe 1 ganha desconto, quem escolhe 2 ganha brinde. Resultado prometido: pico de views + vendas diretas."],
];

function tabelaTranscricoes() {
  return new Table({
    width: { size: 8760, type: WidthType.DXA },
    columnWidths: [2600, 6160],
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          celulaHeader("Reel", 2600),
          celulaHeader("Resumo do Roteiro", 6160),
        ],
      }),
      ...transcricoes.map(([titulo, resumo], i) => new TableRow({
        children: [
          celula(titulo, 2600, { fill: i % 2 === 0 ? BRANCO : CINZA_LINHA, bold: true }),
          celula(resumo, 6160, { fill: i % 2 === 0 ? BRANCO : CINZA_LINHA }),
        ],
      })),
    ],
  });
}

// ── DOCUMENTO ─────────────────────────────────────────────────────────────
const doc = new Document({
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        }],
      },
    ],
  },
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      {
        id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, font: "Arial", color: ROXO },
        paragraph: { spacing: { before: 320, after: 160 }, outlineLevel: 0 },
      },
      {
        id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: CINZA_HEADER },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 },
      },
      {
        id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Arial", color: ROXO },
        paragraph: { spacing: { before: 180, after: 80 }, outlineLevel: 2 },
      },
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
          border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: ROXO, space: 1 } },
          alignment: AlignmentType.RIGHT,
          spacing: { before: 0, after: 120 },
          children: [new TextRun({ text: "Dossiê de Conteúdo — @afonsomolina", size: 18, color: "888888", font: "Arial" })],
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
        children: [new TextRun({ text: "DOSSIÊ DE CONTEÚDO", size: 52, bold: true, font: "Arial", color: ROXO })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 400 },
        children: [new TextRun({ text: "@afonsomolina", size: 40, bold: true, font: "Arial", color: CINZA_HEADER })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: ROXO, space: 1 } },
        spacing: { before: 0, after: 300 },
        children: [new TextRun({ text: "Análise de Ganchos, Roteiros e Padrões de Conteúdo", size: 26, font: "Arial", color: "666666", italics: true })],
      }),
      ...espacamento(2),
      new Table({
        width: { size: 5000, type: WidthType.DXA },
        columnWidths: [2500, 2500],
        rows: [
          new TableRow({ children: [
            celula("Perfil",     2500, { fill: ROXO_CLARO, bold: true, center: true }),
            celula("@afonsomolina", 2500, { center: true }),
          ]}),
          new TableRow({ children: [
            celula("Seguidores", 2500, { fill: ROXO_CLARO, bold: true, center: true }),
            celula("1,7 milhão", 2500, { center: true, bold: true, color: ROXO }),
          ]}),
          new TableRow({ children: [
            celula("Posts",      2500, { fill: ROXO_CLARO, bold: true, center: true }),
            celula("6.525",      2500, { center: true }),
          ]}),
          new TableRow({ children: [
            celula("Nicho",      2500, { fill: ROXO_CLARO, bold: true, center: true }),
            celula("Crescimento de audiência no Instagram", 2500, { center: true }),
          ]}),
          new TableRow({ children: [
            celula("Reels analisados", 2500, { fill: ROXO_CLARO, bold: true, center: true }),
            celula("24 reels coletados / 10 transcritos", 2500, { center: true }),
          ]}),
          new TableRow({ children: [
            celula("Data da análise", 2500, { fill: ROXO_CLARO, bold: true, center: true }),
            celula("Abril / 2026",    2500, { center: true }),
          ]}),
        ],
      }),
      ...espacamento(2),
      new Paragraph({ children: [new PageBreak()] }),

      // ── SEÇÃO 1 — VISÃO GERAL ─────────────────────────────────────────
      h(HeadingLevel.HEADING_1, "1. Visão Geral do Perfil"),
      divisor(),
      p("Afonso Molina é um dos maiores criadores de conteúdo sobre crescimento orgânico no Instagram no Brasil. Com 1,7 milhão de seguidores e mais de 6.500 posts, ele construiu uma audiência altamente engajada ensinando pequenos empreendedores e criadores a crescerem no Instagram sem investir em anúncios.", { after: 160 }),
      p("Seu posicionamento central é direto: \"Quem tem audiência vende qualquer coisa.\" Toda a sua estratégia de conteúdo serve a esse tema — dicas práticas de Instagram misturadas com posicionamento pessoal forte, vulnerabilidade estratégica e elementos de espiritualidade cristã.", { after: 200 }),

      h(HeadingLevel.HEADING_2, "1.1 Pilares de Conteúdo"),
      bullet("Dicas práticas de Instagram (stories, reels, feed, algoritmo)"),
      bullet("Posicionamento e mentalidade de criador"),
      bullet("Espiritualidade e fé como ancoragem pessoal"),
      bullet("Vulnerabilidade estratégica para humanizar a marca"),
      bullet("Tendências e previsões de mercado"),
      ...espacamento(1),

      new Paragraph({ children: [new PageBreak()] }),

      // ── SEÇÃO 2 — 24 REELS ────────────────────────────────────────────
      h(HeadingLevel.HEADING_1, "2. Reels Coletados — Visão Geral"),
      divisor(),
      p("Os 24 reels mais recentes do perfil foram coletados e classificados por tipo de gancho e volume de visualizações. Os destaques acima de 200 mil views estão marcados em roxo.", { after: 200 }),
      tabelaReels(),
      ...espacamento(1),

      h(HeadingLevel.HEADING_2, "2.1 Top Reels (acima de 100 mil views)"),
      bullet("A internet encoraja os fracassados — 329 mil (polêmica)"),
      bullet("E EU QUE DESCOBRI UMA IA... — 305 mil (revelação/caps lock)"),
      bullet("Eu avisei que o conteúdo editado ia começar flopar — 288 mil (profecia)"),
      bullet("Pega o hábito de toda segunda-feira... — 226 mil (hábito + dia da semana)"),
      bullet("Pega o hábito de fazer um post de metas no domingo — 149 mil (hábito)"),
      bullet("Eu avisei que o conteúdo editado ia começar flopar — 288 mil"),
      bullet("O feed virou o novo story — 108 mil (tendência)"),
      ...espacamento(1),

      new Paragraph({ children: [new PageBreak()] }),

      // ── SEÇÃO 3 — PADRÕES DE GANCHO ───────────────────────────────────
      h(HeadingLevel.HEADING_1, "3. Padrões de Gancho"),
      divisor(),

      h(HeadingLevel.HEADING_2, '3.1 Série "Pega o hábito de..." — O padrão mais recorrente'),
      p("Aparece 4 vezes nos 24 reels, sempre com uma ação + dia específico da semana. É o padrão com melhor performance média consistente (102k, 226k, 149k, 45k).", { after: 120 }),
      p("Fórmula: Pega o hábito de + [ação específica] + no/de + [dia ou momento]", { bold: true, color: ROXO, after: 120 }),
      bullet("\"Pega o hábito de fazer esse story de terça-feira\" — 102 mil"),
      bullet("\"Pega o hábito de toda segunda-feira postar esse story aqui\" — 226 mil"),
      bullet("\"Pega o hábito de fazer um post de metas no domingo\" — 149 mil"),
      p("Por que funciona: transforma uma dica em ritual. O seguidor não recebe uma instrução isolada — recebe uma identidade de criador disciplinado que tem rotina.", { after: 200, color: "666666" }),

      h(HeadingLevel.HEADING_2, "3.2 Polêmica e Opinião Forte — Os mais virais"),
      p("Os 3 reels acima de 200 mil views são todos de opinião polêmica ou declaração provocativa. A fórmula: declaração forte + argumento + posicionamento pessoal.", { after: 120 }),
      bullet("\"A internet encoraja os fracassados\" — 329 mil (provocação externa)"),
      bullet("\"Eu avisei que o conteúdo editado ia começar flopar\" — 288 mil (profecia retroativa)"),
      bullet("\"Só aborde política no seu perfil se você aguenta rojão\" — 45 mil"),
      p("Dois padrões distintos: (1) Provocação externa — \"a internet/as pessoas fazem X errado\" gera raiva + concordância = compartilhamento; (2) \"Eu avisei\" — posicionamento de especialista profético que cria autoridade retroativa.", { after: 200, color: "666666" }),

      h(HeadingLevel.HEADING_2, "3.3 Revelação e Descoberta"),
      p("Segundo tipo com maior pico individual. O reel de IA (305 mil) estava em CAPS LOCK no título, simulando urgência e euforia pessoal.", { after: 120 }),
      bullet("\"E EU QUE DESCOBRI UMA IA QUE CRIA MUITO POST EM ALGUNS SEGUNDOS\" — 305 mil"),
      bullet("\"Vou ensinar isso só uma vez\" — 83 mil"),
      bullet("\"Escutei algo agora que me marcou\" — 47 mil"),
      ...espacamento(1),

      h(HeadingLevel.HEADING_2, "3.4 Instrução Direta (Tutorial)"),
      p("Performance estável na faixa 70–95k. Dica prática + resultado implícito. Frequentemente demonstrado ao vivo dentro do próprio vídeo.", { after: 120 }),
      bullet("\"Quando for mostrar algo no story, é assim que você faz:\" — 71 mil"),
      bullet("\"Não posta só o seu treino feito nos story\" — 91 mil"),
      bullet("\"Posta esses 2 números no seu story\" — 93 mil"),
      bullet("\"Coloca seu rosto todo dia no seu perfil\" — 92 mil"),
      ...espacamento(1),

      h(HeadingLevel.HEADING_2, "3.5 Espiritualidade Misturada com Marketing"),
      p("Alcança criadores de conteúdo cristãos — sub-nicho extremamente engajado. A fé aparece como parte da personalidade, não como nicho principal.", { after: 120 }),
      bullet("\"Deus vai fazer os seus conteúdos chegar para quem importa\" — 74 mil"),
      bullet("\"Deus me falou essa frase assim que tomei meu 1° gole de café hoje\" — 46 mil"),
      ...espacamento(1),

      h(HeadingLevel.HEADING_2, "3.6 Tendência / Previsão de Mercado"),
      p("Posiciona Afonso como quem \"enxerga antes dos outros\", reforçando autoridade de especialista.", { after: 120 }),
      bullet("\"O feed virou o novo story\" — 108 mil"),
      bullet("\"Estamos vivendo a melhor época da história para postar vídeo\" — 69 mil"),
      bullet("\"Eu avisei que o conteúdo editado ia começar flopar\" — 288 mil"),
      ...espacamento(1),

      new Paragraph({ children: [new PageBreak()] }),

      // ── SEÇÃO 4 — ANÁLISE DE ROTEIRO ──────────────────────────────────
      h(HeadingLevel.HEADING_1, "4. Análise de Roteiro — 10 Vídeos Transcritos"),
      divisor(),
      p("Os 10 reels mais recentes tiveram seus áudios baixados via yt-dlp e transcritos localmente com o modelo Whisper (small). A análise revela os padrões internos de cada roteiro.", { after: 200 }),

      h(HeadingLevel.HEADING_2, "4.1 Estrutura Padrão dos Vídeos"),
      p("Quase todos os 10 reels seguem esta sequência:", { after: 120 }),
      bullet("1. GANCHO — declaração forte, história pessoal ou instrução direta"),
      bullet("2. DESENVOLVIMENTO — dica prática com demonstração ou argumento"),
      bullet("3. FRASE DE EFEITO — conclusão memorável e direta"),
      bullet("4. CTA 1 — \"dois toques na tela, seu ingrato\" (curtida)"),
      bullet("5. CTA 2 — \"digita X nos comentários\" (geração de leads)"),
      ...espacamento(1),

      h(HeadingLevel.HEADING_2, "4.2 Resumo dos Roteiros"),
      tabelaTranscricoes(),
      ...espacamento(1),

      new Paragraph({ children: [new PageBreak()] }),

      // ── SEÇÃO 5 — TÉCNICAS DE ROTEIRO ────────────────────────────────
      h(HeadingLevel.HEADING_1, "5. Técnicas de Roteiro"),
      divisor(),

      h(HeadingLevel.HEADING_2, "5.1 Matar Objeção Dentro do Conteúdo"),
      p("Ele antecipa o \"mas...\" do seguidor e responde antes que a pessoa saia do vídeo.", { after: 120 }),
      p("\"Aí eu não tenho tempo para produzir meus conteúdos, meu dia é muito corrido. Normal. Dia corrido não é justificativa para você ficar sem postar, falta de organização é.\"", { after: 160, color: "666666" }),

      h(HeadingLevel.HEADING_2, "5.2 Demonstração Ao Vivo"),
      p("No reel de stories, ele não apenas explica — demonstra a dica dentro do próprio vídeo em tempo real. Isso cria alta retenção porque o seguidor vê na prática imediatamente.", { after: 120 }),
      p("\"Agora eu tô tomando um cafezinho — você tem que fazer assim — deixa eu te contar algo...\"", { after: 200, color: "666666" }),

      h(HeadingLevel.HEADING_2, "5.3 Resultado Antes da Dica"),
      p("Em vez de apresentar a dica e depois mostrar o resultado, Afonso inverte: mostra o número primeiro (prova social), depois ensina como chegou lá.", { after: 120 }),
      p("\"Postei, deu 14 mil curtidas, 1.600 comentários... O aprendizado aqui é: quando você receber um hater, expõe esse hater.\"", { after: 200, color: "666666" }),

      h(HeadingLevel.HEADING_2, "5.4 Segmentação por Contexto de Rotina"),
      p("Ancora a dica em um momento específico da rotina do seguidor, criando a sensação de \"esse vídeo foi feito para mim agora\".", { after: 120 }),
      p("\"Para quem toma café, quando você estiver tomando seu cafézinho, coloca seu celular para gravar na mesa...\"", { after: 200, color: "666666" }),

      h(HeadingLevel.HEADING_2, "5.5 Metáfora Conceitual"),
      p("Cria analogias originais que simplificam conceitos complexos em uma frase memorável e compartilhável.", { after: 120 }),
      p("\"O CPF tem que aparecer no CNPJ aqui dentro da rede social.\" — CPF = vida pessoal, CNPJ = empresa/perfil profissional.", { after: 200, color: "666666" }),

      new Paragraph({ children: [new PageBreak()] }),

      // ── SEÇÃO 6 — ASSINATURA LINGUÍSTICA ─────────────────────────────
      h(HeadingLevel.HEADING_1, "6. Assinatura Linguística"),
      divisor(),
      p("Dois elementos aparecem como marca registrada em praticamente todos os reels e criaram uma identidade de comunidade reconhecível:", { after: 160 }),

      h(HeadingLevel.HEADING_2, "6.1 \"Dois toques na tela, seu ingrato\""),
      p("Pede a curtida de forma humorística e afetiva. \"Ingrato\" é um termo irônico carinhoso — os seguidores já esperam e se identificam com ele. Cria identidade de comunidade sem parecer que está pedindo curtida.", { after: 200 }),

      h(HeadingLevel.HEADING_2, "6.2 \"Digita X nos comentários e olha seu direct\""),
      p("CTA de lead generation embutido no reel. Gera engajamento nos comentários (o algoritmo prioriza), promete entrega de valor no direct e captura lead — tudo ao mesmo tempo. É o funil de vendas dentro do conteúdo.", { after: 200 }),

      h(HeadingLevel.HEADING_2, "6.3 Tom e Linguagem"),
      bullet("Nunca sugere — sempre ordena: \"Posta isso\", \"Coloca seu rosto\", \"Não posta só\""),
      bullet("Linguagem coloquial: \"cê\", \"rojão\", \"cafézinho\", \"flopar\""),
      bullet("Sem jargão técnico — fala como conversa de WhatsApp"),
      bullet("Humor ácido aplicado com frequência para provocar engajamento"),
      ...espacamento(1),

      new Paragraph({ children: [new PageBreak()] }),

      // ── SEÇÃO 7 — PADRÕES REPLICÁVEIS ────────────────────────────────
      h(HeadingLevel.HEADING_1, "7. Padrões Replicáveis para Augusto Felipe"),
      divisor(),
      p("Augusto Felipe viralizou organicamente produzindo artes com vidro e espelho. O objetivo é reposicioná-lo como especialista em conteúdo viral — ensinando outros criadores a crescerem no Instagram usando sua própria trajetória como prova social. Os padrões abaixo são adaptados para esse posicionamento:", { after: 200 }),
      tabelaPadroes(),
      ...espacamento(2),

      h(HeadingLevel.HEADING_2, "7.1 O Diferencial do Augusto em Relação ao @afonsomolina"),
      bullet("Afonso ensina crescimento de audiência de forma genérica — Augusto tem uma história de viralização orgânica real como prova"),
      bullet("A origem no artesanato de vidro/espelho é um gancho visual único — o conteúdo dele já tem estética diferenciada"),
      bullet("Pode usar os próprios vídeos virais de arte como exemplo do método, não só falar sobre ele"),
      bullet("Tom pode ser mais humano e menos agressivo — \"eu descobri por acidente\" ressoa mais do que \"eu avisei\""),
      ...espacamento(1),

      h(HeadingLevel.HEADING_2, "7.2 Formatos Prioritários para Testar"),
      bullet("\"Como eu viralizo fazendo [X] — e como você pode fazer o mesmo com o seu nicho\""),
      bullet("\"Pega o hábito de toda [dia] postar um vídeo assim\" — série de rituais de criação"),
      bullet("Reação ao próprio vídeo viral antigo: \"o que eu fiz sem querer que fez isso viralizar\""),
      bullet("Polêmica: \"O que os gurus de Instagram não te contam sobre viralizar\""),
      bullet("Vulnerabilidade: \"Eu não sabia nada de algoritmo quando comecei — e viralizei assim mesmo\""),
      ...espacamento(2),

      divisor(ROXO),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 160, after: 80 },
        children: [new TextRun({ text: "Pesquisa de referência para o reposicionamento de Augusto Felipe como especialista em conteúdo viral.", size: 18, color: "888888", italics: true, font: "Arial" })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 80 },
        children: [new TextRun({ text: "24 reels coletados via navegador + 10 transcrições por Whisper local.", size: 18, color: "888888", italics: true, font: "Arial" })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 0 },
        children: [new TextRun({ text: "Abril de 2026", size: 18, color: "888888", font: "Arial" })],
      }),
    ],
  }],
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("E:/instagram-analyzer/dossie_afonsomolina.docx", buffer);
  console.log("OK: dossie_afonsomolina.docx gerado com sucesso.");
}).catch(err => {
  console.error("ERRO:", err.message);
  process.exit(1);
});
