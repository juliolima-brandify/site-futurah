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

export const CAPA = {
  kicker: "Proposta Comercial",
  evento: "Festival Interlagos 2026",
  selo: "Fi de Vidraceiro",
  criador: "Augusto Felipe",
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

// Seção Mídia Kit — números de alcance.
export const MIDIA_KIT = {
  kicker: "Mídia Kit",
  titulo: "O alcance por trás da arte.",
  destaques: [
    { valor: "1.2M", label: "seguidores totais" },
    { valor: "59M", label: "alcance mensal" },
  ],
  plataformas: [
    { nome: "Instagram", valor: "730k" },
    { nome: "TikTok", valor: "430k" },
    { nome: "Kwai", valor: "110k" },
  ],
  publico: "25–34 anos",
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
