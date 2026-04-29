const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber, LevelFormat, PageBreak
} = require("docx");
const fs = require("fs");

// ── Cores ──────────────────────────────────────────────────────────────────
const INDIGO        = "3730A3";
const INDIGO_CLARO  = "EEF2FF";
const INDIGO_MEDIO  = "6366F1";
const CINZA_HEADER  = "4A4A4A";
const CINZA_LINHA   = "F5F5F5";
const BRANCO        = "FFFFFF";

// Cores dos 5 perfis
const COR_AFONSO    = "7C3AED";
const COR_HANAH     = "1B6B3A";
const COR_ONEY      = "1E3A8A";
const COR_PEDRO     = "C2410C";
const COR_LEANDRO   = "0F766E";

const SIM           = "2D6A2D";  // verde para checkmarks
const NAO           = "999999";  // cinza para ausências

// ── Bordas ─────────────────────────────────────────────────────────────────
const borda = (cor = "CCCCCC") => ({ style: BorderStyle.SINGLE, size: 1, color: cor });
const bordas = (cor) => ({ top: borda(cor), bottom: borda(cor), left: borda(cor), right: borda(cor) });

function h(level, text, cor) {
  return new Paragraph({
    heading: level,
    children: [new TextRun({ text, color: cor || (level === HeadingLevel.HEADING_1 ? INDIGO : CINZA_HEADER) })],
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
    border: { left: { style: BorderStyle.SINGLE, size: 8, color: INDIGO_MEDIO, space: 1 } },
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

function divisor(cor = INDIGO) {
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

function celulaHeader(texto, largura, cor) {
  return celula(texto, largura, { fill: cor ?? INDIGO, bold: true, color: BRANCO, size: 20, center: true, borderColor: cor ?? INDIGO });
}

// ════════════════════════════════════════════════════════════════════════════
// SEÇÃO 1 — PANORAMA QUANTITATIVO
// ════════════════════════════════════════════════════════════════════════════

function tabelaPanorama() {
  const rows = [
    ["@afonsomolina",   COR_AFONSO,  "~900 mil",  "10",  "~700 mil",    "Lista/instrução direta",          "Análise de perfil",         "Crescimento IG"],
    ["@hanahfranklin",  COR_HANAH,   "893 mil",   "22",  "696 mil",     "Visual puro sem texto",           "Plano do 100",              "Creator economy"],
    ["@oneyaraujo",     COR_ONEY,    "1,5 mi",    "10",  "8,5 mi",      "Ruim/Bom/Viral — lista rítmica",  "Código Viral (62k alunos)", "Marketing viral"],
    ["@pedrosobral",    COR_PEDRO,   "2,2 mi",    "10",  "276 mil",     "Visual puro (3 copos)",           "Nova Gestão de Tráfego",    "Tráfego pago"],
    ["@leandroladeiran",COR_LEANDRO, "2,1 mi",    "10",  "5,1 mi",      "Lifestyle puro — família",        "VTSD (R$150M+)",            "Produto digital"],
  ];
  return new Table({
    width: { size: 8760, type: WidthType.DXA },
    columnWidths: [1600, 900, 800, 1360, 1400, 1700, 1000],
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          celulaHeader("Perfil", 1600),
          celulaHeader("Seguidores", 900),
          celulaHeader("Reels", 800),
          celulaHeader("Maior Viral", 1360),
          celulaHeader("Tipo do Maior Viral", 1400),
          celulaHeader("Produto Principal", 1700),
          celulaHeader("Nicho", 1000),
        ],
      }),
      ...rows.map(([perfil, cor, seg, reels, viral, tipo, produto, nicho], i) =>
        new TableRow({ children: [
          celula(perfil, 1600, { fill: i % 2 === 0 ? BRANCO : CINZA_LINHA, bold: true, color: cor }),
          celula(seg,    900,  { fill: i % 2 === 0 ? BRANCO : CINZA_LINHA, center: true }),
          celula(reels,  800,  { fill: i % 2 === 0 ? BRANCO : CINZA_LINHA, center: true }),
          celula(viral,  1360, { fill: i % 2 === 0 ? BRANCO : CINZA_LINHA, bold: true, center: true }),
          celula(tipo,   1400, { fill: i % 2 === 0 ? BRANCO : CINZA_LINHA }),
          celula(produto,1700, { fill: i % 2 === 0 ? BRANCO : CINZA_LINHA }),
          celula(nicho,  1000, { fill: i % 2 === 0 ? BRANCO : CINZA_LINHA, color: "666666", italic: true }),
        ]})
      ),
    ],
  });
}

// ════════════════════════════════════════════════════════════════════════════
// SEÇÃO 2 — MATRIZ DOS MAIORES VIRAIS
// ════════════════════════════════════════════════════════════════════════════

function tabelaMaioresVirais() {
  const rows = [
    ["@oneyaraujo",      "8,5 mi",  "Ruim/Bom/Viral — Áudio, Duração, Horário",       "Instrução formatada em lista rítmica",    "SIM — o formato mais característico do perfil",   "Formato-estrela = maior viral"],
    ["@leandroladeiran", "5,1 mi",  "Família no jardim/piscina — zero narração",       "Lifestyle puro — conteúdo aspiracional",  "NÃO — o perfil é de marketing/produto digital",   "Inverso: vida comum > conteúdo técnico"],
    ["@hanahfranklin",   "696 mil", "Vídeo avulso sem texto sobreposto",               "Visual puro — nenhuma instrução",         "NÃO — o perfil é de educação em formatos",        "Inversão: vídeo sem formato > série formatada"],
    ["@afonsomolina",    "~700 mil","Instrução direta sobre crescimento",              "Opinião + instrução direta",              "SIM — o formato mais consistente do perfil",      "Consistência gera o maior viral"],
    ["@pedrosobral",     "276 mil", "3 copos: Erros/Aulas/Conselhos (sem narração)",   "Visual puro com texto sobreposto",        "PARCIAL — é um dos formatos do perfil",           "Visual > narração mesmo no perfil de narração"],
  ];
  return new Table({
    width: { size: 8760, type: WidthType.DXA },
    columnWidths: [1500, 900, 1960, 1400, 1900, 1100],
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          celulaHeader("Perfil", 1500),
          celulaHeader("Views", 900),
          celulaHeader("Conteúdo do Maior Viral", 1960),
          celulaHeader("Tipo", 1400),
          celulaHeader("É o formato dominante?", 1900),
          celulaHeader("Insight", 1100),
        ],
      }),
      ...rows.map(([perfil, views, conteudo, tipo, dominante, insight], i) =>
        new TableRow({ children: [
          celula(perfil,    1500, { fill: i % 2 === 0 ? BRANCO : CINZA_LINHA, bold: true }),
          celula(views,     900,  { fill: i % 2 === 0 ? BRANCO : CINZA_LINHA, bold: true, center: true, color: INDIGO }),
          celula(conteudo,  1960, { fill: i % 2 === 0 ? BRANCO : CINZA_LINHA }),
          celula(tipo,      1400, { fill: i % 2 === 0 ? BRANCO : CINZA_LINHA, italic: true, color: "555555" }),
          celula(dominante, 1900, { fill: i % 2 === 0 ? BRANCO : CINZA_LINHA }),
          celula(insight,   1100, { fill: i % 2 === 0 ? BRANCO : CINZA_LINHA, italic: true, color: "777777" }),
        ]})
      ),
    ],
  });
}

// ════════════════════════════════════════════════════════════════════════════
// SEÇÃO 3 — TIPOLOGIA DE GANCHOS (MATRIZ CRUZADA)
// ════════════════════════════════════════════════════════════════════════════

function tabelaGanchos() {
  // ✓✓ = formato principal | ✓ = usa ocasionalmente | — = não usa
  const rows = [
    ["Lista rítmica (Ruim/Bom/Viral)",   "✓",   "—",   "✓✓",  "—",   "—"  ],
    ["Contradição / paradoxo verbal",    "✓",   "✓✓",  "—",   "—",   "—"  ],
    ["Visual 100% sem narração",         "—",   "✓",   "—",   "✓✓",  "—"  ],
    ["Lifestyle aspiracional",           "—",   "—",   "—",   "—",   "✓✓" ],
    ["Q&A Stories → reel resposta",      "—",   "—",   "✓",   "—",   "✓"  ],
    ["Polêmica de plataforma/nicho",     "✓",   "—",   "✓",   "✓",   "—"  ],
    ["Humor / skit / interrupção",       "—",   "✓",   "✓",   "✓✓",  "—"  ],
    ["Manifesto com referência literária","—",  "—",   "—",   "✓✓",  "—"  ],
    ["Entrevista de rua",                "—",   "—",   "—",   "✓",   "—"  ],
    ["Psicologia reversa / autorização", "—",   "—",   "✓✓",  "—",   "—"  ],
    ["Série numerada multi-episódio",    "—",   "✓✓",  "—",   "—",   "—"  ],
    ["Newsjacking / figura viral",       "—",   "—",   "—",   "—",   "✓"  ],
    ["Live longa salva como reel",       "—",   "—",   "—",   "—",   "✓✓" ],
    ["Fé / âncora espiritual",           "✓✓",  "—",   "—",   "—",   "—"  ],
    ["Prova social por número de alunos","✓",   "✓",   "✓✓",  "✓",   "✓"  ],
    ["Marco pessoal como gancho",        "—",   "✓",   "✓",   "—",   "✓"  ],
    ["Medo existencial + alívio cômico", "—",   "—",   "—",   "✓✓",  "—"  ],
    ["Instrução direta imperativa",      "✓✓",  "—",   "✓",   "—",   "—"  ],
  ];
  const W = [2560, 840, 840, 840, 840, 840];
  return new Table({
    width: { size: 8760, type: WidthType.DXA },
    columnWidths: W,
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          celulaHeader("Tipo de Gancho", W[0]),
          celulaHeader("Afonso", W[1], COR_AFONSO),
          celulaHeader("Hanah", W[2], COR_HANAH),
          celulaHeader("Oney", W[3], COR_ONEY),
          celulaHeader("Pedro", W[4], COR_PEDRO),
          celulaHeader("Leandro", W[5], COR_LEANDRO),
        ],
      }),
      ...rows.map(([tipo, af, ha, oa, ps, ll], i) => {
        const fill = i % 2 === 0 ? BRANCO : CINZA_LINHA;
        const c = (val) => val === "✓✓" ? SIM : val === "✓" ? "4A90D9" : NAO;
        return new TableRow({ children: [
          celula(tipo, W[0], { fill, bold: false }),
          celula(af,   W[1], { fill, center: true, bold: af === "✓✓", color: c(af) }),
          celula(ha,   W[2], { fill, center: true, bold: ha === "✓✓", color: c(ha) }),
          celula(oa,   W[3], { fill, center: true, bold: oa === "✓✓", color: c(oa) }),
          celula(ps,   W[4], { fill, center: true, bold: ps === "✓✓", color: c(ps) }),
          celula(ll,   W[5], { fill, center: true, bold: ll === "✓✓", color: c(ll) }),
        ]});
      }),
    ],
  });
}

// ════════════════════════════════════════════════════════════════════════════
// SEÇÃO 4 — PADRÕES UNIVERSAIS
// ════════════════════════════════════════════════════════════════════════════

function tabelaUniversais() {
  const rows = [
    ["CTA embutido no conteúdo",
     "Nenhum perfil pede o follow de forma isolada no final. O CTA é sempre a conclusão lógica do que foi ensinado. 'Se você vai seguir 10 perfis e um for o Oney...' / 'Dois toques, seu ingrato' / 'Link na bio'.",
     "Para Augusto: o CTA deve ser a evidência de que ele já está entregando o que ensina. Ex: 'Se você usou essa técnica hoje, já é um criador de conteúdo com método — não um amador. Me segue aqui.'"],
    ["Prova social com número específico",
     "Todos usam números concretos: 62k alunos (Oney), 120k alunos em 8 anos (Pedro), R$150M+ (Leandro), 7k pessoas postando no desafio (Hanah), volume de posts diários (Afonso).",
     "Para Augusto: em qualquer fase, usar o número que tem. 1 aluno com resultado concreto > 100 alunos sem nome. '3 artistas que aplicaram isso aqui tiveram X views em menos de 7 dias.'"],
    ["Tom conversacional — sem formalidade",
     "Nenhum fala como professor de faculdade. Todos usam 'você', gírias, pausas naturais, e tratam o seguidor como alguém que está na mesma jornada — não como aluno.",
     "Para Augusto: o ateliê é o ambiente mais natural possível para isso. Falar enquanto trabalha no vidro, sem olhar para câmera, cria exatamente o tom que todos os 5 perfis usam."],
    ["Produto único por fase",
     "Cada perfil tem 1 produto sendo promovido por período. Não há dispersão. Afonso: análise de perfil. Hanah: Plano do 100. Oney: Código Viral. Pedro: NGT. Leandro: VTSD.",
     "Para Augusto: definir 1 produto antes de criar conteúdo. Todo reel aponta para o mesmo lugar — seja uma mentoria, um curso, ou uma lista VIP."],
    ["Ensinamento + insight memorável",
     "Todos entregam uma ideia que o seguidor pode carregar para fora do vídeo. 'Consistência vence talento.' 'Encontre um formato e repita infinitamente.' 'Você prefere 160 leads ou 1M views?'",
     "Para Augusto: cada reel precisa de 1 frase que o seguidor possa repetir para alguém. 'Vidro não quebra onde é forte — quebra onde foi maltratado. Conteúdo é assim.'"],
  ];
  return new Table({
    width: { size: 8760, type: WidthType.DXA },
    columnWidths: [1600, 3580, 3580],
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          celulaHeader("Padrão Universal", 1600),
          celulaHeader("Como aparece nos 5 perfis", 3580),
          celulaHeader("Como Augusto Felipe aplica", 3580),
        ],
      }),
      ...rows.map(([padrao, nos5, augusto], i) =>
        new TableRow({ children: [
          celula(padrao,  1600, { fill: INDIGO_CLARO, bold: true }),
          celula(nos5,    3580, { fill: i % 2 === 0 ? BRANCO : CINZA_LINHA }),
          celula(augusto, 3580, { fill: i % 2 === 0 ? BRANCO : CINZA_LINHA, italic: true, color: "444444" }),
        ]})
      ),
    ],
  });
}

// ════════════════════════════════════════════════════════════════════════════
// SEÇÃO 5 — PADRÕES EXCLUSIVOS
// ════════════════════════════════════════════════════════════════════════════

function tabelaExclusivos() {
  const rows = [
    ["@afonsomolina",   "Fé como âncora de identidade",
     "Único dos 5 que integra crença espiritual ao conteúdo de marketing. Cria um diferencial de identificação com a audiência religiosa — que é a maioria do mercado brasileiro de infoprodutos.",
     "Augusto pode ter o ateliê como âncora equivalente: um lugar físico com significado emocional. 'Eu fui de vidro quebrado a ateliê próprio — e agora ensino outros a construírem o mesmo.'"],
    ["@hanahfranklin",  "Série multi-episódio com meta-conteúdo",
     "Único a criar uma série numerada onde cada episódio demonstra o próprio formato que ensina. A série funciona como produto freemium: 16 dias de conteúdo gratuito que convertem para 1 produto pago.",
     "Augusto pode criar: 'Desafio Arte Viral — 10 formatos que viralizaram usando minha arte como base.' Cada episódio demonstra o formato ao vivo no ateliê. Episódio 10 = abertura do produto."],
    ["@oneyaraujo",     "Formato Ruim/Bom/Viral de 3 níveis",
     "Único a usar o terceiro nível ('viral') como palavra-âncora no final de cada item. Cria um ritmo auditivo previsível onde o cérebro antecipa a conclusão — retenção máxima em menos de 40s.",
     "Augusto adapta para arte: 'Postar foto da obra é RUIM. Postar reel do processo é BOM. Postar o processo com a história por trás é VIRAL.' Zero edição necessária — só ritmo."],
    ["@pedrosobral",    "Conteúdo 100% visual sem narração como top performer",
     "Único cujos 2 maiores virais não têm narração — só texto sobreposto e visual forte. Demonstra que no feed atual, um insight visual bem posicionado supera qualquer roteiro narrado.",
     "Augusto tem a vantagem do objeto físico: o vidro, o espelho, as etapas do processo. '3 peças de vidro: Rascunho / Molde / Arte — o que a maioria de quem cria conteúdo ainda está fazendo.' Sem falar nada."],
    ["@leandroladeiran", "Live longa (1h+) salva como reel + newsjacking",
     "Único a transformar uma live de 1 hora diretamente em reel sem edição. O custo de produção é zero e a autoridade transmitida por 1h de conteúdo não-editado é impossível de fingir. Também único em aproveitar figuras virais do momento (Caneta Azul, 162k).",
     "Augusto: live de 30-45min no ateliê mostrando o processo de criação de uma obra do zero. Sem edição. 'Hoje vou criar um painel ao vivo — e vou explicar tudo o que penso enquanto trabalho.' Autoridade máxima, custo zero."],
  ];
  return new Table({
    width: { size: 8760, type: WidthType.DXA },
    columnWidths: [1500, 1800, 2730, 2730],
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          celulaHeader("Perfil", 1500),
          celulaHeader("Padrão Exclusivo", 1800),
          celulaHeader("Por que funciona", 2730),
          celulaHeader("Como Augusto aplica", 2730),
        ],
      }),
      ...rows.map(([perfil, padrao, porque, augusto], i) =>
        new TableRow({ children: [
          celula(perfil,  1500, { fill: INDIGO_CLARO, bold: true }),
          celula(padrao,  1800, { fill: i % 2 === 0 ? BRANCO : CINZA_LINHA, bold: true }),
          celula(porque,  2730, { fill: i % 2 === 0 ? BRANCO : CINZA_LINHA }),
          celula(augusto, 2730, { fill: i % 2 === 0 ? BRANCO : CINZA_LINHA, italic: true, color: "444444" }),
        ]})
      ),
    ],
  });
}

// ════════════════════════════════════════════════════════════════════════════
// SEÇÃO 6 — ANÁLISE DE CTAs E CONVERSÃO
// ════════════════════════════════════════════════════════════════════════════

function tabelaCTAs() {
  const rows = [
    ["@afonsomolina",    "Dois toques na tela, seu ingrato",       "Análise de perfil",          "Lead magnet / diagnóstico",    "Irônico e imperativo — o apelido 'ingrato' cria intimidade e urgência ao mesmo tempo"],
    ["@hanahfranklin",   "Link na bio",                            "Plano do 100",               "Conversão direta via funil série", "Simples e direto — a série já aqueceu tanto que o CTA não precisa de contexto"],
    ["@oneyaraujo",      "Toca aqui para me seguir + Código Viral","Código Viral (62k alunos)",  "Seguir + produto juntos",      "O produto é o próprio Oney — primeiro converte para seguidor, depois para aluno"],
    ["@pedrosobral",     "Clica no link da bio e se cadastra agora","Evento gratuito → curso",    "Funil de evento (webinário)",  "O evento gratuito é o produto real — o curso pago é consequência de quem aparece"],
    ["@leandroladeiran", "Evento gratuito VTSD",                   "Venda Todo Santo Dia (VTSD)","Perpétuo — sem abertura/fechamento", "O evento gratuito alimenta um produto em vendas contínuas — sem urgência artificial"],
  ];
  return new Table({
    width: { size: 8760, type: WidthType.DXA },
    columnWidths: [1500, 1960, 1400, 1800, 2100],
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          celulaHeader("Perfil", 1500),
          celulaHeader("Frase do CTA", 1960),
          celulaHeader("Produto", 1400),
          celulaHeader("Mecanismo", 1800),
          celulaHeader("Por que funciona", 2100),
        ],
      }),
      ...rows.map(([perfil, cta, produto, mec, porq], i) =>
        new TableRow({ children: [
          celula(perfil,  1500, { fill: INDIGO_CLARO, bold: true }),
          celula(cta,     1960, { fill: i % 2 === 0 ? BRANCO : CINZA_LINHA, italic: true, color: "555555" }),
          celula(produto, 1400, { fill: i % 2 === 0 ? BRANCO : CINZA_LINHA }),
          celula(mec,     1800, { fill: i % 2 === 0 ? BRANCO : CINZA_LINHA, bold: true }),
          celula(porq,    2100, { fill: i % 2 === 0 ? BRANCO : CINZA_LINHA, color: "666666" }),
        ]})
      ),
    ],
  });
}

// ════════════════════════════════════════════════════════════════════════════
// SEÇÃO 7 — GAPS: O QUE NENHUM FAZ
// ════════════════════════════════════════════════════════════════════════════

function tabelaGaps() {
  const rows = [
    ["Demonstração com objeto físico como metáfora ao vivo",
     "Hanah usou prato + pote numa metáfora pontual. Pedro usa copos em imagem estática. Nenhum dos 5 usa sistematicamente objetos físicos do próprio ofício para demonstrar conceitos ao vivo enquanto trabalha.",
     "O ateliê de vidro e espelho é o cenário mais diferenciado possível neste nicho. Augusto pode demonstrar 'como moldar seu posicionamento' literalmente cortando vidro na câmera. Nenhum concorrente consegue replicar isso."],
    ["Arte como veículo de ensino (não como tema)",
     "Nenhum dos 5 é artista ou usa processo criativo físico como método de ensino. Todos ensinam marketing falando sobre marketing. O Augusto pode ensinar criação de conteúdo criando arte.",
     "'Vou criar uma obra do zero enquanto te ensino os 3 princípios do conteúdo viral.' O processo da arte é a aula. A obra pronta é a prova do método. Formato único no mercado brasileiro."],
    ["Conteúdo antes + depois com obra real",
     "Pedro mostra 'Erros vs Aulas vs Conselhos' com copos abstratos. Nenhum mostra um objeto físico real se transformando. Antes/depois de obras físicas com narração de aprendizado é um formato intocado.",
     "'Essa obra levou 3 tentativas e 2 quebras. Meu primeiro reel viral também.' Paralelo entre o processo artístico e o processo de crescimento no Instagram. Extremamente shareable."],
    ["Live no ambiente de trabalho físico",
     "Leandro faz lives no sofá, no aeroporto. Nenhum dos 5 tem um ambiente de trabalho físico e visual como o ateliê. A live no ateliê é visualmente mais rica e mais diferente do padrão.",
     "'Live de criação ao vivo — do risco ao corte final, com bate-papo.' Audiência vê algo que raramente aparece num feed de marketing digital: um artista trabalhando em tempo real."],
    ["Prova de conceito com resultados de arte viral",
     "Todos os 5 ensinam sobre conteúdo viral, mas nenhum virou authority a partir de conteúdo de arte visual que viralizou. A origem de artista que descobriu os princípios do viral é inédita.",
     "O posicionamento único do Augusto: 'Não sou um especialista em marketing que também faz arte. Sou um artista que descobriu o código do viral — e os princípios são os mesmos para qualquer nicho.'"],
  ];
  return new Table({
    width: { size: 8760, type: WidthType.DXA },
    columnWidths: [1900, 3430, 3430],
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          celulaHeader("Gap Identificado", 1900),
          celulaHeader("O que os 5 perfis fazem (ou não fazem)", 3430),
          celulaHeader("Oportunidade exclusiva para Augusto Felipe", 3430),
        ],
      }),
      ...rows.map(([gap, o5, augusto], i) =>
        new TableRow({ children: [
          celula(gap,    1900, { fill: INDIGO_CLARO, bold: true }),
          celula(o5,     3430, { fill: i % 2 === 0 ? BRANCO : CINZA_LINHA }),
          celula(augusto,3430, { fill: i % 2 === 0 ? BRANCO : CINZA_LINHA, italic: true, color: "333333" }),
        ]})
      ),
    ],
  });
}

// ════════════════════════════════════════════════════════════════════════════
// SEÇÃO 8 — ANATOMIA DO VIRAL (ESTRUTURA RECORRENTE)
// ════════════════════════════════════════════════════════════════════════════

function tabelaAnatomiaDosVirais() {
  const rows = [
    ["Segundo 0–3", "GANCHO",
     "Contradição, revelação inesperada, visual forte, número impactante, lifestyle aspiracional ou pergunta simples com resposta não-óbvia.",
     "Os primeiros 3 segundos são o único conteúdo que garante distribuição. O algoritmo mede retenção aqui — se o vídeo sobrevive aos 3s, ele é distribuído. Se não, morreu."],
    ["Segundo 3–15", "TENSÃO / PROMESSA",
     "Desenvolvimento do gancho que cria necessidade de ver o resto. Não entrega ainda — só aprofunda a promessa. O seguidor precisa saber 'como isso termina'.",
     "Leandro usa a live inteira como desenvolvimento. Oney usa o ritmo da lista. Hanah usa a confusão antes do reveal. Pedro usa a escalada de medo."],
    ["Segundo 15–40", "ENTREGA DO VALOR",
     "O conteúdo central que justifica o tempo do seguidor. Pode ser 1 dica, uma lista de 5, uma metáfora revelada, um dado surpresa ou uma demonstração visual.",
     "Nos virais de 40s ou menos: a entrega é quase simultânea com o gancho. Nos virais longos (live de Leandro): a entrega se estende por 1h com múltiplos picos."],
    ["Último segundo", "INSIGHT MEMORÁVEL + CTA",
     "Uma frase que o seguidor consegue repetir para alguém. Seguida imediatamente (ou antes, embutida) do CTA — que não interrompe o insight, é a conclusão lógica dele.",
     "Oney: 'toca aqui para me seguir' como conclusão lógica de 'se você seguir só 10 perfis'. Hanah: 'link na bio' após o reveal do resultado do aluno. Leandro: 'prefiro 160 na live a 1M de views'."],
  ];
  return new Table({
    width: { size: 8760, type: WidthType.DXA },
    columnWidths: [1200, 1100, 3230, 3230],
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          celulaHeader("Momento", 1200),
          celulaHeader("Função", 1100),
          celulaHeader("O que aparece nos virais analisados", 3230),
          celulaHeader("Por que essa estrutura funciona", 3230),
        ],
      }),
      ...rows.map(([momento, funcao, aparece, porq], i) =>
        new TableRow({ children: [
          celula(momento, 1200, { fill: INDIGO_CLARO, bold: true, center: true }),
          celula(funcao,  1100, { fill: INDIGO_CLARO, bold: true, color: INDIGO }),
          celula(aparece, 3230, { fill: i % 2 === 0 ? BRANCO : CINZA_LINHA }),
          celula(porq,    3230, { fill: i % 2 === 0 ? BRANCO : CINZA_LINHA, color: "555555", italic: true }),
        ]})
      ),
    ],
  });
}

// ════════════════════════════════════════════════════════════════════════════
// SEÇÃO 9 — O MODELO DO AUGUSTO (PLANO INTEGRADO)
// ════════════════════════════════════════════════════════════════════════════

function tabelaPlanoAugusto() {
  const rows = [
    ["Semanas 1–2",  "ONEY",    "Ruim / Bom / Viral — arte e conteúdo",
     "Posta 5 reels no formato de 3 níveis adaptado para arte. Ex: 'Postar foto da obra é RUIM. Postar o processo é BOM. Postar o processo com a história por trás é VIRAL.' Ritmo acelerado, < 40s, zero edição sofisticada.",
     "Testar qual versão do formato ressoa mais com a audiência existente antes de estruturar a série."],
    ["Semanas 3–5",  "HANAH",   "Série: 10 Formatos que Usei para Viralizar com Arte",
     "Uma série de 10 episódios com badge numerado. Cada episódio demonstra o próprio formato que ensina (meta-conteúdo). Ex: episódio sobre 'formato processo' mostra o processo real de uma obra. Episódio 10 = abertura do produto.",
     "A série cria comprometimento da audiência por episódio e aquece progressivamente para conversão no episódio final."],
    ["Semanas 6–7",  "PEDRO",   "Visual puro — obra como insight sem narração",
     "3 reels 100% visuais. Ex: 3 pedaços de vidro em estágios — 'Ideia / Rascunho / Arte: onde você está?' Texto sobreposto, zero narração, objeto físico como metáfora visual. Instrução para pausar e refletir.",
     "Testar a capacidade do ateliê de gerar virais sem narração — o formato mais escalável e menos dependente de roteiro."],
    ["Semanas 8–9",  "AFONSO",  "Consistência diária + CTA de seguir embutido",
     "Postar 1 reel por dia durante 2 semanas. Tom imperativo direto: 'Você está criando ou se ocupando? São coisas diferentes.' CTA embutido: 'Se você cria 1 reel por dia como arte — me segue aqui, porque é exatamente disso que falo.'",
     "Volume de consistência cria autoridade que nenhum viral isolado constrói. Afonso é a prova: ~700k de viral mas autoridade por volume diário."],
    ["Semanas 10–11","LEANDRO", "Live no ateliê + Q&A técnico de Stories",
     "1 live de 30-45min no ateliê, ao vivo, sem edição — mostra uma obra sendo criada do risco ao corte final, com conversa sobre conteúdo. Antes: coletar dúvidas via Stories e responder 3 delas em reels curtos (Q&A técnico).",
     "A live transfere autoridade que reel editado não tem. O Q&A usa dores reais da audiência — cada resposta é conteúdo de demanda comprovada."],
    ["Semana 12+",   "TODOS",   "Síntese: os 5 formatos em rotação semanal",
     "Com a audiência aquecida pelas 11 semanas: 1 reel Ruim/Bom/Viral por semana (Oney), 1 visual puro por semana (Pedro), 1 episódio de série avançada por semana (Hanah), 1 instrução direta com CTA (Afonso), 1 live mensal ou Q&A (Leandro).",
     "Diversidade de formatos mantém o algoritmo distribuindo para audiências diferentes. Cada formato tem uma função: alcance (visual), conversão (série), autoridade (live), engajamento (Q&A), viralização (lista rítmica)."],
  ];
  return new Table({
    width: { size: 8760, type: WidthType.DXA },
    columnWidths: [900, 900, 1560, 2700, 2700],
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          celulaHeader("Período", 900),
          celulaHeader("Arquétipo", 900),
          celulaHeader("Formato", 1560),
          celulaHeader("O que fazer", 2700),
          celulaHeader("Por que neste momento", 2700),
        ],
      }),
      ...rows.map(([periodo, arq, fmt, oque, porq], i) =>
        new TableRow({ children: [
          celula(periodo, 900,  { fill: INDIGO_CLARO, bold: true, center: true }),
          celula(arq,     900,  { fill: INDIGO_CLARO, bold: true, center: true, color: INDIGO }),
          celula(fmt,     1560, { fill: INDIGO_CLARO, bold: true }),
          celula(oque,    2700, { fill: i % 2 === 0 ? BRANCO : CINZA_LINHA }),
          celula(porq,    2700, { fill: i % 2 === 0 ? BRANCO : CINZA_LINHA, italic: true, color: "555555" }),
        ]})
      ),
    ],
  });
}

// ════════════════════════════════════════════════════════════════════════════
// DOCUMENTO
// ════════════════════════════════════════════════════════════════════════════

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
        run: { size: 36, bold: true, font: "Arial", color: INDIGO },
        paragraph: { spacing: { before: 320, after: 160 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: CINZA_HEADER },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Arial", color: INDIGO },
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
          border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: INDIGO, space: 1 } },
          alignment: AlignmentType.RIGHT,
          spacing: { before: 0, after: 120 },
          children: [new TextRun({ text: "Dossiê Master — Análise Cruzada 5 Perfis", size: 18, color: "888888", font: "Arial" })],
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

      // ── CAPA ──────────────────────────────────────────────────────────────
      ...espacamento(3),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 120 },
        children: [new TextRun({ text: "DOSSIÊ MASTER", size: 56, bold: true, font: "Arial", color: INDIGO })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 200 },
        children: [new TextRun({ text: "ANÁLISE CRUZADA — 5 PERFIS", size: 40, bold: true, font: "Arial", color: CINZA_HEADER })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: INDIGO, space: 1 } },
        spacing: { before: 0, after: 300 },
        children: [new TextRun({ text: "Padrões Universais, Exclusivos, Gaps e o Modelo Completo para Augusto Felipe", size: 24, font: "Arial", color: "666666", italics: true })],
      }),
      ...espacamento(1),
      new Table({
        width: { size: 7200, type: WidthType.DXA },
        columnWidths: [2400, 4800],
        rows: [
          new TableRow({ children: [
            celula("Perfis analisados",      2400, { fill: INDIGO_CLARO, bold: true, center: true }),
            new TableCell({
              borders: bordas("CCCCCC"),
              width: { size: 4800, type: WidthType.DXA },
              shading: { fill: BRANCO, type: ShadingType.CLEAR },
              margins: { top: 100, bottom: 100, left: 150, right: 150 },
              verticalAlign: VerticalAlign.CENTER,
              children: [new Paragraph({
                children: [
                  new TextRun({ text: "@afonsomolina", size: 20, font: "Arial", color: COR_AFONSO, bold: true }),
                  new TextRun({ text: "  @hanahfranklin", size: 20, font: "Arial", color: COR_HANAH, bold: true }),
                  new TextRun({ text: "  @oneyaraujo", size: 20, font: "Arial", color: COR_ONEY, bold: true }),
                  new TextRun({ text: "  @pedrosobral", size: 20, font: "Arial", color: COR_PEDRO, bold: true }),
                  new TextRun({ text: "  @leandroladeiran", size: 20, font: "Arial", color: COR_LEANDRO, bold: true }),
                ],
              })],
            }),
          ]}),
          new TableRow({ children: [
            celula("Total de reels",         2400, { fill: INDIGO_CLARO, bold: true, center: true }),
            celula("62 reels coletados (10+22+10+10+10)",  4800, { center: false }),
          ]}),
          new TableRow({ children: [
            celula("Transcrições realizadas",2400, { fill: INDIGO_CLARO, bold: true, center: true }),
            celula("30+ reels transcritos por Whisper local (modelo small, sem API)", 4800),
          ]}),
          new TableRow({ children: [
            celula("Seguidores combinados",  2400, { fill: INDIGO_CLARO, bold: true, center: true }),
            celula("~8,3 milhões de seguidores acumulados nos 5 perfis", 4800),
          ]}),
          new TableRow({ children: [
            celula("Views combinados (top 50)", 2400, { fill: INDIGO_CLARO, bold: true, center: true }),
            celula("Estimativa: 20M+ views nos reels coletados", 4800),
          ]}),
          new TableRow({ children: [
            celula("Objetivo",               2400, { fill: INDIGO_CLARO, bold: true, center: true }),
            celula("Modelar a estratégia de conteúdo de Augusto Felipe como especialista em conteúdo viral", 4800),
          ]}),
          new TableRow({ children: [
            celula("Data",                   2400, { fill: INDIGO_CLARO, bold: true, center: true }),
            celula("Abril de 2026", 4800),
          ]}),
        ],
      }),
      ...espacamento(2),
      new Paragraph({ children: [new PageBreak()] }),

      // ── SEÇÃO 1 — PANORAMA ────────────────────────────────────────────────
      h(HeadingLevel.HEADING_1, "1. Panorama Quantitativo — Os 5 Perfis"),
      divisor(),
      p("Visão consolidada dos dados coletados nos cinco perfis analisados. Os números de seguidores e views são as métricas coletadas via DOM do Instagram em Abril/2026.", { after: 200 }),
      tabelaPanorama(),
      ...espacamento(1),
      p("Insight imediato: @pedrosobral tem o maior número de seguidores (2,2mi) mas o menor viral do recorte (276k). @oneyaraujo tem o menor número de seguidores (1,5mi) mas o maior viral (8,5mi). Seguidores não determinam alcance — formato determina.", { after: 0, color: "555555", italic: true }),
      new Paragraph({ children: [new PageBreak()] }),

      // ── SEÇÃO 2 — MAIORES VIRAIS ──────────────────────────────────────────
      h(HeadingLevel.HEADING_1, "2. A Matriz dos Maiores Virais"),
      divisor(),
      p("A descoberta mais contraintuitiva da análise: em 3 dos 5 perfis, o maior viral NÃO é o conteúdo mais representativo do criador. Isso revela que viralização segue lógicas distintas da construção de autoridade.", { after: 200 }),
      tabelaMaioresVirais(),
      ...espacamento(1),
      h(HeadingLevel.HEADING_2, "2.1 O Paradoxo do Maior Viral"),
      p("Leandro faz conteúdo de marketing digital — mas vira com família no jardim. Hanah ensina formatos de Instagram — mas vira com vídeo sem formato nenhum. Pedro narra, entrevista e manifesta — mas vira com 3 copos sem narração.", { after: 120 }),
      p("A leitura correta não é 'esqueça o seu conteúdo e poste só lifestyle'. É:", { after: 120 }),
      bullet("A autoridade construída pelo conteúdo técnico é o que faz o lifestyle converter"),
      bullet("O algoritmo distribui conteúdo de INTERESSE — e interesse muda de acordo com contexto"),
      bullet("Um criador com autoridade acumulada pode viralizar com qualquer formato"),
      bullet("Para Augusto: construir autoridade técnica primeiro, lifestyle amplifica depois"),
      new Paragraph({ children: [new PageBreak()] }),

      // ── SEÇÃO 3 — PADRÕES UNIVERSAIS ──────────────────────────────────────
      h(HeadingLevel.HEADING_1, "3. Padrões Universais — O Que Todos Fazem"),
      divisor(),
      p("Os 5 padrões abaixo aparecem em todos os perfis analisados, independentemente de nicho, tom ou formato. São a base mínima para crescimento sustentável no Instagram.", { after: 200 }),
      tabelaUniversais(),
      ...espacamento(1),
      p("Conclusão da seção: qualquer criador que executa esses 5 padrões com consistência tem um piso de desempenho garantido — mesmo antes de escolher o formato ideal.", { after: 0, color: "555555", italic: true }),
      new Paragraph({ children: [new PageBreak()] }),

      // ── SEÇÃO 4 — PADRÕES EXCLUSIVOS ──────────────────────────────────────
      h(HeadingLevel.HEADING_1, "4. Padrões Exclusivos — O Que Só Um Faz"),
      divisor(),
      p("Cada perfil tem 1 mecanismo de diferenciação que nenhum outro usa com a mesma consistência. Esses padrões são os mais difíceis de copiar — porque dependem de identidade, não apenas de técnica.", { after: 200 }),
      tabelaExclusivos(),
      ...espacamento(1),
      p("O insight crítico: a diferenciação não vem de fazer mais do que os outros fazem. Vem de fazer 1 coisa que só você consegue fazer — seja pela origem, pelo ambiente, ou pela perspectiva.", { after: 0, color: "555555", italic: true }),
      new Paragraph({ children: [new PageBreak()] }),

      // ── SEÇÃO 5 — TIPOLOGIA DE GANCHOS ────────────────────────────────────
      h(HeadingLevel.HEADING_1, "5. Tipologia de Ganchos — Matriz Cruzada"),
      divisor(),
      p("Mapeamento de todos os tipos de gancho identificados na análise cruzada. ✓✓ = formato principal do perfil | ✓ = usa ocasionalmente | — = não usa.", { after: 200 }),
      tabelaGanchos(),
      ...espacamento(1),
      h(HeadingLevel.HEADING_2, "5.1 Leituras da Matriz"),
      bullet("Os ganchos mais utilizados em mais perfis: prova social por número (5/5), polêmica de plataforma (3/5), humor (3/5)"),
      bullet("Ganchos exclusivos de 1 perfil: lista rítmica 3 níveis (Oney), série multi-episódio (Hanah), manifesto literário (Pedro), live longa (Leandro), fé (Afonso)"),
      bullet("Ganchos com maior potencial para Augusto: visual puro (Pedro + Hanah), contradição (Hanah), série (Hanah), Q&A (Oney + Leandro)"),
      bullet("Gancho que nenhum usa: demonstração com objeto físico ao vivo — o maior gap disponível"),
      new Paragraph({ children: [new PageBreak()] }),

      // ── SEÇÃO 6 — ANATOMIA DO VIRAL ───────────────────────────────────────
      h(HeadingLevel.HEADING_1, "6. Anatomia do Viral — Estrutura Interna dos Top Performers"),
      divisor(),
      p("Analisando os reels com mais de 100k views nos 5 perfis, uma estrutura de 4 momentos se repete com variações. Entender essa anatomia é mais valioso do que copiar qualquer formato específico.", { after: 200 }),
      tabelaAnatomiaDosVirais(),
      ...espacamento(1),
      h(HeadingLevel.HEADING_2, "6.1 A Exceção: Conteúdo 100% Visual"),
      p("Os virais 100% visuais de Pedro (276k e 221k) e de Hanah (696k) não têm narração — logo a estrutura acima não se aplica literalmente. Nesses casos, a anatomia funciona assim:", { after: 120 }),
      bullet("Frame 1: visual que para o scroll (o 'gancho' é visual, não auditivo)"),
      bullet("Frame 2-5: desenvolvimento do insight por composição de elementos na tela"),
      bullet("Texto sobreposto: instrução de interação ('pause o vídeo', 'qual é o seu?')"),
      bullet("Ausência de CTA verbal: o salvar/compartilhar é o CTA implícito"),
      p("Para Augusto: os virais visuais exigem um objeto físico forte. O vidro em diferentes estágios de processamento é o mais forte disponível neste nicho.", { after: 0, color: "555555", italic: true }),
      new Paragraph({ children: [new PageBreak()] }),

      // ── SEÇÃO 7 — CTAs E CONVERSÃO ────────────────────────────────────────
      h(HeadingLevel.HEADING_1, "7. CTAs e Mecanismos de Conversão"),
      divisor(),
      p("Os 5 perfis usam 5 mecanismos de conversão distintos. Nenhum pede o follow ou a compra de forma isolada — o CTA é sempre consequência do conteúdo, nunca interrupção dele.", { after: 200 }),
      tabelaCTAs(),
      ...espacamento(1),
      h(HeadingLevel.HEADING_2, "7.1 O CTA Para Augusto"),
      p("Com base nos 5 modelos, o CTA inicial para Augusto deve:", { after: 120 }),
      bullet("Ser uma consequência lógica do último ensinamento — não uma adição"),
      bullet("Apontar para 1 lugar único (bio, lista VIP, evento) — não para múltiplas opções"),
      bullet("Ter uma frase própria, memorável, que não seja 'segue aqui' genérico"),
      bullet("Exemplos possíveis: 'Se você quer viralizar sem perder sua essência — me acompanha aqui' | 'É assim que artista cresce no digital — segue se você quer aprender'"),
      new Paragraph({ children: [new PageBreak()] }),

      // ── SEÇÃO 8 — GAPS E OPORTUNIDADES ────────────────────────────────────
      h(HeadingLevel.HEADING_1, "8. Gaps — O Que Nenhum dos 5 Faz"),
      divisor(),
      p("Estes são os espaços não ocupados por nenhum dos 5 perfis analisados. Para o Augusto Felipe, cada gap é uma oportunidade de diferenciação genuína — impossível de copiar porque depende da sua origem como artista.", { after: 200 }),
      tabelaGaps(),
      ...espacamento(1),
      p("Síntese dos gaps: o ateliê físico + background artístico é o maior diferencial disponível no nicho de educação digital brasileiro em 2026. Nenhum dos 5 maiores criadores do nicho tem isso. É uma janela.", { after: 0, color: "555555", italic: true }),
      new Paragraph({ children: [new PageBreak()] }),

      // ── SEÇÃO 9 — O MODELO DO AUGUSTO ────────────────────────────────────
      h(HeadingLevel.HEADING_1, "9. O Modelo do Augusto — Plano Integrado 12 Semanas"),
      divisor(),
      p("Síntese final: a combinação dos 5 arquétipos em uma sequência estratégica, construída para que cada fase prepare o terreno para a próxima. Não é um calendário rígido — é uma lógica de progressão.", { after: 200 }),
      tabelaPlanoAugusto(),
      ...espacamento(2),

      h(HeadingLevel.HEADING_2, "9.1 Os 5 Arquétipos Integrados"),
      p("O posicionamento final do Augusto Felipe combina o que há de mais forte em cada referência:", { after: 160 }),
      bullet("A consistência de volume de @afonsomolina — sem volume não há autoridade"),
      bullet("A serialização e o meta-conteúdo de @hanahfranklin — a série cria funil automático"),
      bullet("O formato Ruim/Bom/Viral de @oneyaraujo — o padrão de lista mais replicável do nicho"),
      bullet("O conteúdo visual puro de @pedrosobral — o vidro como objeto visual é superior aos copos"),
      bullet("A live longa como autoridade de @leandroladeiran — o ateliê como set permanente"),
      ...espacamento(1),

      h(HeadingLevel.HEADING_2, "9.2 A Vantagem Competitiva Incopiável"),
      p("O Augusto Felipe é o único criador neste nicho que tem:", { after: 120 }),
      bullet("Um ateliê físico como cenário — visual diferente de todo conteúdo do mercado"),
      bullet("Um processo artístico manual como demonstração ao vivo do que ensina"),
      bullet("Uma origem de artista que descobriu os princípios do viral por acidente"),
      bullet("A possibilidade de ensinar marketing digital usando vidro e espelho como metáfora"),
      ...espacamento(1),
      quote("Não sou um especialista em marketing que também faz arte. Sou um artista que descobriu o código do viral — e os princípios são os mesmos para qualquer nicho."),
      ...espacamento(1),
      p("Esse posicionamento é a síntese de tudo o que foi pesquisado nos 5 dossiês. Nenhum dos perfis analisados pode afirmar o mesmo — porque nenhum tem a origem.", { after: 0, color: "555555", italic: true }),

      divisor(INDIGO),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 160, after: 80 },
        children: [new TextRun({ text: "Pesquisa de referência para o reposicionamento de Augusto Felipe como especialista em conteúdo viral.", size: 18, color: "888888", italics: true, font: "Arial" })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 80 },
        children: [new TextRun({ text: "62 reels coletados · 30+ transcrições Whisper · 5 dossiês individuais · Cruzamento final  |  Abril de 2026", size: 18, color: "888888", font: "Arial" })],
      }),
    ],
  }],
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("E:/projeto-fidevidraceiro/instagram-analyzer/dossie_cruzado.docx", buffer);
  console.log("OK: dossie_cruzado.docx gerado com sucesso.");
}).catch(err => {
  console.error("ERRO:", err.message);
  process.exit(1);
});
