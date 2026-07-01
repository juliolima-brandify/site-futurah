// =============================================================================
// CONTEÚDO — Proposta Comercial Augusto Felipe × BYD · Festival Interlagos 2026
// =============================================================================
// Fonte: Proposta_BYD_Augusto_Felipe.pdf. Edite os valores/textos aqui — o
// layout (PropostaDeck.tsx) não precisa ser tocado.
//
// ⚠️ RASCUNHO: a bio "Fi de Vidraceiro" (campo `sobre`) foi escrita como
// placeholder. Ajuste com o texto oficial do Augusto quando chegar.
// =============================================================================

// Azul da marca BYD — accent secundário das seções da montadora.
export const BYD_BLUE = "#2E9BFF";

// Logo pessoal do Augusto (branco) — vindo do media kit @fidevidraceiro.
export const AUGUSTO_LOGO = "/proposta-byd/augusto-logo.svg";

export const CAPA = {
  kicker: "Proposta Comercial",
  evento: "Festival Interlagos 2026",
  selo: "Fi de Vidraceiro",
  criador: "Augusto Felipe",
  // Foto de capa do Augusto (vinda do media kit) — renderizada em P&B.
  foto: "/proposta-byd/capa-fi.png",
};

// Seção "Quem é o Augusto" — narrativa Fi de Vidraceiro (⚠️ rascunho).
export const SOBRE = {
  kicker: "Quem assina a arte",
  titulo: "Fi de vidraceiro.",
  paragrafos: [
    "Augusto Felipe começou cortando vidro na oficina do pai. A mesma precisão de quem mede duas vezes pra cortar uma vez virou a assinatura de um artista que hoje transforma superfícies em obra — e alcança milhões todo mês.",
    "Do vidro pro carro: cada ativação é uma peça única, feita à mão, pensada pra virar conteúdo que a audiência para pra assistir — e compartilha.",
  ],
  avatar: "/creator-elite/augustofelipe-avatar.jpg",
};

// Seção Mídia Kit — números de alcance (extraídos do media kit @fidevidraceiro).
export const MIDIA_KIT = {
  kicker: "Mídia Kit",
  titulo: "O alcance por trás da arte.",
  crescimento: "Crescimento orgânico de 1 milhão de seguidores em apenas 17 meses.",
  destaques: [
    { valor: "1.2M", label: "seguidores totais" },
    { valor: "59M", label: "alcance mensal" },
  ],
  // Seguidores + alcance mensal por plataforma.
  plataformas: [
    { nome: "Instagram", seguidores: "730k", alcance: "20M/mês" },
    { nome: "TikTok", seguidores: "430k", alcance: "15M/mês" },
    { nome: "Kwai", seguidores: "110k", alcance: "24M/mês" },
  ],
  publico: "52% feminino · 48% masculino · principal 25–34 anos · SP, RJ e Uberlândia",
};

// Seção Prova — credibilidade antes da oferta (marcas + reels do media kit).
export const PROVA = {
  kicker: "Quem já confia",
  titulo: "Marcas e alcance comprovado.",
  marcas: [
    { src: "/proposta-byd/marca-tekbond.png", alt: "TekBond" },
    { src: "/proposta-byd/marca-cebrace.png", alt: "Cebrace" },
    { src: "/proposta-byd/marca-bombril.png", alt: "Bombril" },
    { src: "/proposta-byd/marca-temu.png", alt: "Temu" },
    { src: "/proposta-byd/marca-vonixx.png", alt: "Vonixx" },
    { src: "/proposta-byd/marca-spotify.png", alt: "Spotify" },
    { src: "/proposta-byd/marca-cod.png", alt: "Call of Duty" },
  ],
  reels: [
    { thumb: "/proposta-byd/reel-3.png", views: "8M" },
    { thumb: "/proposta-byd/reel-4.png", views: "6,3M" },
    { thumb: "/proposta-byd/reel-2.png", views: "5,5M" },
    { thumb: "/proposta-byd/reel-1.png", views: "684k" },
  ],
};

// Seção 4 — Ativação Digital.
export const ATIVACAO = {
  kicker: "Ativação Digital",
  titulo: "Presença nas redes.",
  itens: [
    { item: "3 Stories", valor: "R$ 2.000" },
    { item: "1 Reels em collab", valor: "R$ 8.000" },
  ],
  combo: {
    label: "Combo especial BYD",
    de: "R$ 10.000",
    por: "R$ 8.000",
  },
};

// Seção 5 — Art Experiences (escada de valor). `destaque` marca o plano-âncora.
export const EXPERIENCES = {
  kicker: "BYD Art Experiences",
  titulo: "Arte que vira desejo.",
  subtitulo:
    "Ativações artísticas exclusivas sobre o carro — cada nível, uma tela maior. Todas acompanham Reels + Stories.",
  planos: [
    {
      nome: "BYD Art Experience",
      descricao: "Símbolo BYD (50cm por letra)",
      entrega: "Reels + Stories",
      preco: "R$ 20.000",
      destaque: false,
    },
    {
      nome: "BYD Wheel Experience",
      descricao: "Roda artística personalizada",
      entrega: "Reels + Stories",
      preco: "R$ 30.000",
      destaque: false,
    },
    {
      nome: "BYD Full Art Experience",
      descricao: "Carro artístico exclusivo",
      entrega: "Reels + Stories",
      preco: "R$ 85.000",
      destaque: true,
    },
  ],
};

// Seção 6 — Condições comerciais.
export const CONDICOES = {
  kicker: "Condições comerciais",
  titulo: "Como funciona.",
  itens: [
    "Valores incluem produção, gravação, postagem e operação completa.",
    "50% antecipado para produção das artes.",
    "Saldo restante conforme alinhamento comercial.",
  ],
};

// Seção 7 — Fechamento / CTA. ⚠️ preencher contato real.
export const FECHAMENTO = {
  kicker: "Vamos criar juntos",
  titulo: "Bora transformar a BYD em obra?",
  contato: "augustofelipe@futurah.co",
};
