const {
  Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel, BorderStyle,
} = require("docx");
const fs = require("fs");

// ── Cores ──────────────────────────────────────────────────────────────────
const ROXO = "6B3FA0";
const CINZA = "4A4A4A";
const TEXTO = "333333";

// ── Helpers ──────────────────────────────────────────────────────────────────
function titulo(text) {
  return new Paragraph({
    spacing: { before: 240, after: 120 },
    children: [new TextRun({ text, bold: true, size: 44, color: ROXO, font: "Arial" })],
  });
}
function secao(text) {
  return new Paragraph({
    spacing: { before: 300, after: 120 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: ROXO, space: 2 } },
    children: [new TextRun({ text, bold: true, size: 30, color: ROXO, font: "Arial" })],
  });
}
function pautaTitulo(n, text) {
  return new Paragraph({
    spacing: { before: 200, after: 40 },
    children: [new TextRun({ text: `${n}. ${text}`, bold: true, size: 24, color: CINZA, font: "Arial" })],
  });
}
function campo(label, value) {
  return new Paragraph({
    spacing: { before: 20, after: 20 },
    children: [
      new TextRun({ text: `${label} `, bold: true, size: 21, color: ROXO, font: "Arial" }),
      new TextRun({ text: value, size: 21, color: TEXTO, font: "Arial" }),
    ],
  });
}
function intro(text) {
  return new Paragraph({
    spacing: { before: 60, after: 200 },
    children: [new TextRun({ text, italics: true, size: 20, color: CINZA, font: "Arial" })],
  });
}

// ── Dados ──────────────────────────────────────────────────────────────────
const SECOES = [
  {
    titulo: "🔥 Em alta",
    pautas: [
      { t: '"Pare de pedir like. Peça isto."', g: '"O like virou a métrica mais inútil do Instagram em 2026 — e eu provo."', p: "o algoritmo passou a pesar compartilhamento no DM 3 a 5× mais que like (100 likes valem menos que 10 envios no direct)." },
      { t: '"O Instagram te deu o controle — e isso destruiu seu alcance"', g: '"Tem um botão novo que o seu seguidor usou contra você sem perceber."', p: 'o recurso "Your Algorithm for Reels" (dez/2025) deixa o usuário escolher o que quer ver — postar muito e abusar de hashtag não força mais entrada no feed.' },
      { t: 'Entrar no formato "Será que o algoritmo prefere?"', g: '"Edição caprichada vs. câmera parada na cara: qual o Instagram entrega mais? Comenta seu palpite."', p: 'o formato "Seeing if the Algorithm Prefers" está 2 semanas no topo e ainda subindo — gera comentário (que é distribuição).' },
      { t: "Surfar o áudio do momento (Charli XCX / MJ)", g: 'abertura visual no "stuck frame" do "Rock Music" da Charli XCX, ou o trend "I Am Home" do "Beat It" (cinebiografia do MJ).', p: "são os áudios em ascensão esta semana — janela curta de surf." },
      { t: '"Por que seu repost do TikTok não cresce no Reels"', g: '"O Instagram sabe quando o vídeo não nasceu aqui — e te pune por isso."', p: "o maior boost de 2026 vai pra conteúdo nativo (gravado e editado pra plataforma); reupload com marca d'água perde." },
    ],
  },
  {
    titulo: "💊 Verdades difíceis de engolir",
    pautas: [
      { t: '"Viralizar não paga suas contas"', g: '"Mais da metade dos creators ganham menos de R$80 mil por ano. Views não é dinheiro."', p: "+50% dos creators faturam menos de US$15k/ano; só os com monetização estruturada escapam." },
      { t: '"Você está construindo sua renda no terreno do inimigo"', g: '"Se 100% do seu dinheiro vem do Instagram, você não tem um negócio — tem um aluguel."', p: "68,8% da renda dos creators vem de brand deals, não do pagamento da plataforma. Múltiplas fontes é regra de sobrevivência." },
      { t: '"Postar todo dia parou de funcionar"', g: '"Constância virou desculpa de quem não quer pensar em relevância."', p: 'com o "Your Algorithm", frequência não fura mais o feed — quem decide é o seguidor. Relevância > volume.' },
      { t: '"Seu Reel está clinicamente morto"', g: '"100 likes e zero compartilhamento no DM? O algoritmo já te enterrou."', p: "encaixa na mudança de peso do DM share — confronta a métrica de vaidade que todo mundo persegue." },
      { t: '"Você só faz Reel porque dá menos trabalho"', g: '"O carrossel engaja 12% mais — e você o ignora por preguiça."', p: "dado de 2026 (Reels = +36% alcance, mas carrossel = +12% engajamento). Cutuca o acomodamento." },
    ],
  },
  {
    titulo: "⚡ Dica prática (resultado na hora)",
    pautas: [
      { t: "O mix de formatos que você ajusta hoje", g: '"A receita exata: 60-70% Reels, 20-30% carrossel, 10% estático. Reorganize sua semana agora."', p: "proporção ótima de 2026 — acionável em 5 minutos no planner." },
      { t: "A troca de CTA que dobra seu alcance", g: `"Troque 'deixa o like' por 'manda pra alguém que precisa ver' — e veja o DM share explodir."`, p: "ataca o sinal que hoje pesa 3-5× (compartilhamento no direct). Resultado mensurável no próximo post." },
      { t: "Transforme seu Reel campeão em carrossel", g: '"Seu melhor Reel do mês ainda tem 1 carrossel escondido dentro dele. Te mostro como extrair."', p: "reaproveita o que já validou + pega o engajamento maior do carrossel. Zero esforço criativo novo." },
      { t: "O hook de 3 segundos que faz salvar", g: '"Os 3 primeiros segundos não são pra prender atenção — são pra fazer salvar."', p: "salvamento e share são os sinais que distribuem em 2026; ensinar o gancho dá ganho imediato." },
      { t: "Grave nativo em 1 take (sem app externo)", g: `"Pare de exportar do CapCut com marca d'água. Grave e edite dentro do Instagram."`, p: "conteúdo nativo é premiado; dica executável no próximo vídeo, sem comprar nada." },
    ],
  },
  {
    titulo: "📈 Google Trends — carona no que bomba agora (Copa 2026)",
    pautas: [
      { t: '"O Neymar viralizou sem chutar uma bola"', g: '"O assunto mais buscado do Brasil hoje não foi um gol — foi um corte de cabelo."', p: "o novo visual do Neymar pra Copa explodiu no Trends/Instagram antes do time entrar em campo. Um detalhe visual vira conteúdo." },
      { t: '"Como pegar carona na Copa mesmo que seu nicho não tenha NADA a ver com futebol"', g: '"Daqui a 30 dias o feed inteiro vai ser Copa. Te mostro como surfar isso sem falar de futebol."', p: "a Copa 2026 é o maior pico de busca do ano e vai dominar o feed por um mês — masterclass de newsjacking." },
      { t: '"A Copa vai engolir o feed — 3 jeitos de não sumir"', g: '"Enquanto todo mundo posta jogo, tem 3 brechas de alcance abertas. Anota."', p: "durante megaeventos o feed satura de um tema só — quem entende a brecha cresce na contramão." },
    ],
  },
];

// ── Montagem ──────────────────────────────────────────────────────────────────
const children = [
  titulo("Banco de Pautas — Augusto Felipe"),
  intro("Pautas geradas a partir de tendências do Instagram/creator economy + Google Trends ao vivo. Gerado em 10/jun/2026. Todos os formatos: Reel."),
];

let n = 0;
for (const sec of SECOES) {
  children.push(secao(sec.titulo));
  for (const pa of sec.pautas) {
    n++;
    children.push(pautaTitulo(n, pa.t));
    children.push(campo("🎣 Gancho:", pa.g));
    children.push(campo("📌 Por que agora:", pa.p));
    children.push(campo("🎬 Formato:", "Reel"));
  }
}

const doc = new Document({
  sections: [{ properties: {}, children }],
});

Packer.toBuffer(doc).then((buf) => {
  const out = "Banco-de-Pautas-Augusto-Felipe.docx";
  fs.writeFileSync(out, buf);
  console.log("OK -> " + out);
});
