import { Space_Grotesk, Archivo_Black } from "next/font/google";
import { SectionCounter } from "../SectionCounter";
import ScrollBottomBlur from "../midia-kit/ScrollBottomBlur";
import NavArrows from "../midia-kit/NavArrows";
import "../styles.css";

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "700"],
  variable: "--fdv-grotesk",
});
const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
  variable: "--fdv-archivo",
});

export const metadata = {
  title: "Plano de Ação — @fidevidraceiro · Futurah & Co.",
  description:
    "Da viralização à monetização. Plano comercial completo, audiência consolidada e mapa de marcas refinado.",
  robots: { index: false, follow: false },
};

/* =========================================================
   DADOS — números reais consolidados
   Fontes: Instagram Insights (22 abr – 21 mai/2026),
   mídia-kit consolidado (IG + TikTok + Kwai) e CONTEXT.md.
   ========================================================= */

const insightsInstagram = [
  { value: "17,2 MI", label: "Views / 30d (IG)" },
  { value: "5,17 MI", label: "Contas alcançadas (IG)" },
  { value: "79,4%", label: "Não-seguidores" },
  { value: "+41%", label: "Crescimento MoM" },
];

const consolidado = [
  { value: "1,2 MI", label: "Seguidores totais (IG + TT + Kwai)" },
  { value: "59 MI", label: "Alcance mensal consolidado" },
  { value: "19×", label: "Ratio views/seguidor (média mercado: 4×)" },
  { value: "100%", label: "Tráfego orgânico" },
];

const provaImprensa = [
  { veiculo: "PEGN", titulo: "Pequenas Empresas & Grandes Negócios", views: "1,2 mi" },
  { veiculo: "g1 Triângulo Mineiro", titulo: "g1 / Globo", views: "2,4 mi" },
  { veiculo: "MGTV 1ª edição", titulo: "Globo Minas — Uberlândia", views: "850 mil" },
  { veiculo: "Band Mulher", titulo: "Mulheres Empreendedoras", views: "620 mil" },
];

const marcasJaTrabalhadas = [
  "TekBond",
  "Cebrace",
  "Bombril",
  "Temu",
  "Vonixx",
  "Spotify",
  "Call of Duty",
  "Whindersson Nunes",
];

const swot = {
  forcas: [
    "Alcance orgânico massivo: 59M/mês consolidado (1,2M seguidores em 3 plataformas), 100% sem tráfego pago",
    "Ratio views/seguidor de 19× — quase 5× a média do mercado (4×)",
    "Formato de processo é praticamente impossível de copiar — depende da habilidade manual rara do Augusto",
    "Prova social TV já no portfólio: PEGN, g1, MGTV, Band — total de 5,07 mi de views em mídia ganha",
    "Marcas já trabalhadas: TekBond, Cebrace, Bombril, Temu, Vonixx, Spotify, Call of Duty + colab com Whindersson Nunes",
    "Augusto 100% focado em criar; a Futurah opera marketing, vendas e produto",
  ],
  fraquezas: [
    "Gap de conversão na bio: 568 cliques em 621k visitas ao perfil (~0,09%) — atenção massiva sem captura",
    "Nenhuma captura de lead (e-mail / WhatsApp) implementada ainda na bio link",
    "Nenhum produto digital próprio no ar — só patrocínio pontual como receita",
    "Distribuição refém de algoritmos (IG, TikTok, Kwai)",
    "Linha de arte sob encomenda ainda não foi testada comercialmente — tese a validar",
  ],
  oportunidades: [
    "Arte sob encomenda + série: peça-ativo permanente para a empresa + alcance de milhões em cima",
    "Frente B2C ampla: ferramentas (Dewalt/Bosch/Makita/Tramontina), decoração, DIY, materiais criativos",
    "Produto digital de artesanato/cinematografia mobile para a audiência que salva os vídeos",
    "Multiplataforma ainda subaproveitada: Kwai entrega mais alcance/mês que o próprio Instagram",
    "Momento de pico orgânico = melhor janela possível para precificar alto e construir lista própria",
  ],
  ameacas: [
    "Mudança de algoritmo em qualquer plataforma reduz alcance da noite para o dia",
    "Surgimento de imitadores no formato (mesmo sem a mesma técnica manual)",
    "Dependência de um único criador — risco de continuidade da operação",
    "Esgotamento criativo se a produção virar refém da demanda comercial",
  ],
};

const tres_tempos = [
  {
    titulo: "ISCA — preço de custo, escolha cirúrgica",
    desc: "1 a 2 peças cobradas só no valor de custo (material + tempo + edição), em negócios fotogênicos com identidade visual forte: cafeteria de design, barbearia com pegada, decoração. O objetivo não é o dinheiro — é gerar o conteúdo-anúncio. Sempre registrar o valor de tabela em paralelo (ver Precificação) para proteger o teto futuro.",
  },
  {
    titulo: "FILA — o conteúdo viraliza, o direct enche",
    desc: "A série vai ao ar e roda. As perguntas começam a chegar sozinhas. Agora a Futurah seleciona os interessados e cobra o preço real, usando o primeiro case como prova viva. O pitch deixa de ser 'imagina se…' e vira 'olha o que aconteceu com a cafeteria X — 1,7 mi de views'.",
  },
  {
    titulo: "ESCALA — subir de porte com cases no bolso",
    desc: "Com 3–4 cases documentados, sobe-se o alvo: redes, franquias, marcas regionais e nacionais com ticket de cinco dígitos. A peça vira ativo permanente da empresa, e o preço sobe a cada case novo. O portfólio passa a abrir portas que prospecção fria jamais abriria.",
  },
];

const stack_hormozi = [
  {
    tag: "Dream Outcome",
    titulo: "Resultado dos sonhos",
    desc: "Peça de arte única + alcance de milhões + conteúdo que a empresa reposta por meses. Marketing que ninguém mais consegue entregar.",
  },
  {
    tag: "Likelihood",
    titulo: "Percepção de que funciona",
    desc: "Não é promessa: o portfólio mostra vídeos que já fizeram 1,7M de views e 8M no Reels mais visto. Aponta-se para os números reais.",
  },
  {
    tag: "Time Delay",
    titulo: "Velocidade do retorno",
    desc: "Série ao ar em semanas. E os vídeos continuam rendendo views por meses depois. Mídia que se amortiza sozinha.",
  },
  {
    tag: "Effort",
    titulo: "Esforço da empresa",
    desc: "Quase zero. A Futurah roteiriza, Augusto cria, a equipe edita e publica. A empresa só recebe e paga.",
  },
];

const frenteA = [
  { fase: "ISCA", tipo: "Cafeteria de design, restaurante autoral", motivo: "Ambiente fotogênico, público estético, vira ponto de fotos", peca: "Xícara / luminária / painel escultural" },
  { fase: "ISCA", tipo: "Barbearia / salão com identidade forte", motivo: "Cultura visual, clientela jovem urbana, ama exibir", peca: "Tesoura / navalha gigante de vidro" },
  { fase: "FILA", tipo: "Lojas de decoração e móveis", motivo: "Fit direto com audiência de casa e DIY", peca: "Peça-vitrine exclusiva da marca" },
  { fase: "FILA", tipo: "Floricultura, paisagismo, garden", motivo: "Estética natural, alto apelo visual", peca: "Flor / planta de vidro (já validado: 1,7M views)" },
  { fase: "ESCALA", tipo: "Concessionárias, redes e franquias", motivo: "Orçamento maior, querem diferenciação de marca", peca: "Logo / produto-símbolo espelhado para fachada" },
  { fase: "ESCALA", tipo: "Marcas nacionais de casa e lifestyle", motivo: "Buscam conteúdo orgânico autêntico de massa", peca: "Coleção / instalação assinada" },
];

const frenteB = [
  {
    tier: "TIER 1",
    seg: "Ferramentas e DIY",
    exemplos: "Dewalt, Bosch, Makita, Tramontina, Acrilex, Vonixx",
    racional: "SKU de consumidor final + product placement natural (ele USA no vídeo)",
    modelo: "Fixo por integração + bônus por engajamento",
  },
  {
    tier: "TIER 1",
    seg: "Decoração e casa",
    exemplos: "Tok&Stok, Westwing, Etna, MadeiraMadeira, Camicado",
    racional: "Audiência massiva de casa + interesses declarados (Decoração, Construção, DIY)",
    modelo: "Fixo + pacote mensal",
  },
  {
    tier: "TIER 2",
    seg: "Materiais criativos e tintas",
    exemplos: "Tintas decorativas, resinas, Acrilex, marcas de artesanato",
    racional: "Encaixa direto no conteúdo de processo — virou tutorial",
    modelo: "Fixo + bônus por engajamento",
  },
  {
    tier: "TIER 2",
    seg: "Presentes e personalização",
    exemplos: "Elo7, plataformas de gift, e-commerce de presente",
    racional: "48 mil salvamentos/mês são pessoas pensando em recriar / presentear",
    modelo: "CPA / comissionamento por link rastreável",
  },
  {
    tier: "TIER 3",
    seg: "Lifestyle e marketplaces de artesanato",
    exemplos: "Cursos de DIY, apps de organização, marketplaces de artesanato",
    racional: "Integração natural com o conteúdo, sem parecer publi",
    modelo: "Permuta qualificada + taxa fixa",
  },
];

const fora_do_mapa = [
  { marca: "Saint-Gobain, AGC, Guardian, Blindex, Vivix, Divinal", motivo: "Vidro plano — produto B2B-puro especificado em obra por vidraçaria/construtora/arquiteto. Ninguém na audiência compra chapa de vidro pelo nome da marca." },
  { marca: "AL Indústria, Sasazaki, Alumasa", motivo: "Ferragens e esquadrias — comprado pelo profissional via distribuidor. Sem SKU de consumidor final que justifique exposição em conteúdo viral." },
  { marca: "Vedacit, silicones estruturais", motivo: "Produto pro profissional, especificado em projeto. Brand awareness institucional não justifica o ticket para esse alcance." },
];

const precificacao_arte = [
  { fase: "Isca", oque: "Apenas o custo do projeto", faixa: "R$ 2.000 – R$ 4.000", logica: "Cobre material/tempo. Lucro é o conteúdo gerado." },
  { fase: "Fila", oque: "Projeto completo (peça + série)", faixa: "R$ 8.000 – R$ 20.000", logica: "Preço real, sustentado pelo primeiro case" },
  { fase: "Escala", oque: "Projeto premium (rede/marca grande)", faixa: "R$ 25.000 – R$ 60.000+", logica: "Ticket alto, portfólio robusto, exclusividade" },
];

const precificacao_publi = [
  { formato: "Reels integrado (15–60s)", basal: "R$ 8.000 – R$ 15.000", direitos: "R$ 10.000 – R$ 20.000" },
  { formato: "Stories (3 frames) com link", basal: "R$ 2.500 – R$ 5.000", direitos: "R$ 3.500 – R$ 7.000" },
  { formato: "Carrossel educativo", basal: "R$ 5.000 – R$ 10.000", direitos: "R$ 7.000 – R$ 13.000" },
  { formato: "Pacote mensal (2 Reels + 4 Stories)", basal: "R$ 20.000 – R$ 35.000/mês", direitos: "R$ 28.000 – R$ 45.000/mês" },
  { formato: "Dark post (uso em tráfego pago da marca)", basal: "+20% a +50% sobre o valor base", direitos: "Sempre cobrar à parte" },
];

const checklist = [
  {
    fase: "Semana 1 — Fundação",
    itens: [
      "Atualizar o mídia kit incluindo os cases já realizados (TekBond, Cebrace, Bombril, Temu, Vonixx, Spotify, Call of Duty, Whindersson)",
      "Adicionar bloco de imprensa (PEGN, g1, MGTV, Band) com totais de views",
      "Definir o valor de tabela âncora e o preço de custo da fase isca",
      "Selecionar 1–2 negócios-isca fotogênicos para a primeira peça",
      "Desenhar a isca de captura de lead na bio (lead magnet + e-mail/WhatsApp)",
    ],
  },
  {
    fase: "Semana 2 — Primeiros contatos",
    itens: [
      "Montar lista de 10 empresas (Frente A — arte) e 10 marcas (Frente B — publi)",
      "Abordar os negócios-isca selecionados com o Script 1",
      "Enviar 5 primeiros contatos de publi tradicional (Script 3) priorizando ferramentas e decoração",
      "Fechar o primeiro projeto-isca e definir cronograma de gravação",
    ],
  },
  {
    fase: "Semana 3–4 — Produção e prova",
    itens: [
      "Roteirizar a série de conteúdo da peça-isca (estrutura de processo viral)",
      "Gravar e publicar a série; capturar métricas nas primeiras 72h",
      "Documentar o case (antes/depois, números, depoimento do negócio)",
      "Responder com Script 2 quem chegar pelo direct perguntando sobre o projeto",
      "Meta do mês: 1 projeto-isca publicado + 1 publi ou projeto pago em negociação",
    ],
  },
];

/* =========================================================
   COMPONENTES — Section / Eyebrow / Stats
   ========================================================= */

function Section({
  eyebrow,
  title,
  description,
  children,
  noTitle,
}: {
  eyebrow: string;
  title?: string;
  description?: string;
  children: React.ReactNode;
  noTitle?: boolean;
}) {
  return (
    <section className="fdv-section">
      <div className="max-w-6xl mx-auto px-6 w-full">
        <div className="fdv-section-eyebrow">{eyebrow}</div>
        {!noTitle && title && (
          <h2 style={{ fontSize: "var(--fdv-text-2xl)" }} className="mb-3">
            {title}
          </h2>
        )}
        {description && (
          <p
            className="max-w-2xl mb-8"
            style={{ color: "var(--fdv-text-muted)", fontSize: "var(--fdv-text-base)" }}
          >
            {description}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}

function StatGrid({ items }: { items: { value: string; label: string }[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map((s) => (
        <div key={s.label} className="fdv-card">
          <div
            style={{
              fontFamily: "var(--fdv-font-display)",
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              letterSpacing: "-0.04em",
              lineHeight: 0.95,
              color: "var(--fdv-orange-500)",
              marginBottom: "var(--fdv-space-2)",
            }}
          >
            {s.value}
          </div>
          <div
            style={{
              fontFamily: "var(--fdv-font-sans)",
              fontSize: "var(--fdv-text-xs)",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              lineHeight: 1.3,
            }}
          >
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}

function SwotBox({
  badge,
  title,
  items,
  tone,
}: {
  badge: string;
  title: string;
  items: string[];
  tone: "s" | "w" | "o" | "t";
}) {
  const palette = {
    s: { bg: "var(--fdv-acid-100)", badge: "var(--fdv-acid-500)" },
    w: { bg: "var(--fdv-orange-100)", badge: "var(--fdv-orange-500)" },
    o: { bg: "var(--fdv-bg)", badge: "var(--fdv-primary-900)" },
    t: { bg: "var(--fdv-primary-100)", badge: "var(--fdv-primary-700)" },
  }[tone];

  return (
    <div
      className="fdv-card"
      style={{ background: palette.bg, color: "var(--fdv-primary-900)" }}
    >
      <div className="flex items-center gap-3 mb-4">
        <span
          className="fdv-badge"
          style={{ background: palette.badge, color: tone === "o" || tone === "t" ? "var(--fdv-bg)" : "var(--fdv-primary-900)" }}
        >
          {badge}
        </span>
        <h3 style={{ fontSize: "var(--fdv-text-lg)", fontWeight: 700, letterSpacing: "-0.01em" }}>
          {title}
        </h3>
      </div>
      <ul style={{ display: "flex", flexDirection: "column", gap: "var(--fdv-space-3)" }}>
        {items.map((i) => (
          <li
            key={i}
            style={{
              paddingLeft: 22,
              position: "relative",
              fontSize: "var(--fdv-text-sm)",
              lineHeight: 1.5,
            }}
          >
            <span
              style={{
                position: "absolute",
                left: 0,
                top: 9,
                width: 10,
                height: 10,
                background: palette.badge,
                transform: "rotate(45deg)",
              }}
            />
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Step({ idx, titulo, desc }: { idx: number; titulo: string; desc: string }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "auto 1fr",
        gap: "var(--fdv-space-6)",
        padding: "var(--fdv-space-6) 0",
        borderTop: "2px solid currentColor",
      }}
    >
      <div
        style={{
          fontFamily: "var(--fdv-font-display)",
          fontSize: "clamp(3rem, 7vw, 5rem)",
          color: "var(--fdv-orange-500)",
          letterSpacing: "-0.04em",
          lineHeight: 1,
          minWidth: 84,
        }}
      >
        {String(idx).padStart(2, "0")}
      </div>
      <div>
        <h3
          style={{
            fontFamily: "var(--fdv-font-display)",
            fontSize: "clamp(1.25rem, 2.4vw, 1.875rem)",
            textTransform: "uppercase",
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
            marginBottom: "var(--fdv-space-3)",
          }}
        >
          {titulo}
        </h3>
        <p style={{ fontSize: "var(--fdv-text-base)", lineHeight: 1.55, color: "var(--fdv-text-muted)" }}>
          {desc}
        </p>
      </div>
    </div>
  );
}

function ScriptBox({
  label,
  subject,
  children,
}: {
  label: string;
  subject: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="fdv-card"
      style={{
        background: "var(--fdv-primary-900)",
        color: "var(--fdv-bg)",
        borderColor: "var(--fdv-primary-900)",
      }}
    >
      <div
        style={{
          fontFamily: "var(--fdv-font-mono)",
          fontSize: "var(--fdv-text-xs)",
          textTransform: "uppercase",
          letterSpacing: "0.16em",
          color: "var(--fdv-orange-300)",
          marginBottom: "var(--fdv-space-3)",
          fontWeight: 700,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontWeight: 700,
          fontSize: "var(--fdv-text-base)",
          paddingBottom: "var(--fdv-space-3)",
          marginBottom: "var(--fdv-space-4)",
          borderBottom: "1px solid var(--fdv-primary-500)",
        }}
      >
        {subject}
      </div>
      <div style={{ fontSize: "var(--fdv-text-base)", lineHeight: 1.6, color: "var(--fdv-primary-200)" }}>
        {children}
      </div>
    </div>
  );
}

function Hl({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ color: "var(--fdv-orange-300)", fontWeight: 700 }}>{children}</span>
  );
}

function Callout({ tag, children }: { tag: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "var(--fdv-acid-100)",
        border: "2px solid var(--fdv-primary-900)",
        borderRadius: "var(--fdv-radius-md)",
        padding: "var(--fdv-space-6)",
        boxShadow: "var(--fdv-shadow-sm)",
      }}
    >
      <span
        style={{
          fontFamily: "var(--fdv-font-mono)",
          fontSize: "var(--fdv-text-xs)",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          color: "var(--fdv-primary-900)",
          display: "block",
          marginBottom: "var(--fdv-space-2)",
        }}
      >
        {tag}
      </span>
      <div style={{ fontSize: "var(--fdv-text-base)", lineHeight: 1.55, color: "var(--fdv-primary-900)" }}>
        {children}
      </div>
    </div>
  );
}

/* =========================================================
   PÁGINA
   ========================================================= */

export default function PlanoDeAcao() {
  return (
    <div className={`fdv-root fdv-snap-container ${grotesk.variable} ${archivoBlack.variable}`}>
      <ScrollBottomBlur />
      <SectionCounter />
      <NavArrows />

      {/* 01 — CAPA */}
      <header
        className="fdv-section fdv-cover"
        style={{
          background: "var(--fdv-primary-900)",
          color: "var(--fdv-bg)",
          position: "relative",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 w-full" style={{ position: "relative", zIndex: 1 }}>
          <div className="flex items-center justify-between mb-12">
            <span className="fdv-badge fdv-badge-orange">PLANO DE AÇÃO · 2026</span>
            <span className="fdv-badge" style={{ background: "var(--fdv-bg)", color: "var(--fdv-primary-900)" }}>
              USO INTERNO
            </span>
          </div>

          <h1
            style={{
              fontFamily: "var(--fdv-font-display)",
              fontSize: "clamp(2.75rem, 9vw, 7rem)",
              letterSpacing: "-0.04em",
              lineHeight: 0.92,
              textTransform: "uppercase",
              marginBottom: "var(--fdv-space-6)",
            }}
          >
            Da viralização à{" "}
            <span style={{ background: "var(--fdv-orange-500)", color: "var(--fdv-primary-900)", padding: "0 0.15em" }}>
              monetização.
            </span>
          </h1>

          <p
            style={{
              fontSize: "clamp(1.125rem, 2vw, 1.5rem)",
              maxWidth: "62ch",
              lineHeight: 1.45,
              color: "var(--fdv-primary-200)",
              marginBottom: "var(--fdv-space-12)",
            }}
          >
            Plano comercial para transformar <strong style={{ color: "var(--fdv-bg)" }}>59 milhões de alcance/mês</strong> em receita previsível — usando uma linha de negócio que ninguém mais no Brasil consegue oferecer: arte sob encomenda + série de conteúdo viral.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6" style={{ borderTop: "2px solid var(--fdv-primary-500)" }}>
            {[
              { k: "1,2 MI", l: "Seguidores totais" },
              { k: "59 MI", l: "Alcance / mês" },
              { k: "19×", l: "Views por seguidor" },
              { k: "100%", l: "Orgânico" },
            ].map((m) => (
              <div key={m.l}>
                <div
                  style={{
                    fontFamily: "var(--fdv-font-display)",
                    fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
                    color: "var(--fdv-orange-500)",
                    letterSpacing: "-0.04em",
                    lineHeight: 1,
                  }}
                >
                  {m.k}
                </div>
                <div
                  style={{
                    fontSize: "var(--fdv-text-xs)",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginTop: 6,
                    color: "var(--fdv-primary-300)",
                  }}
                >
                  {m.l}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="fdv-scroll-hint">↓ Scroll</div>
        <div className="fdv-scroll-icon-mobile" aria-hidden>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </header>

      {/* 02 — DIAGNÓSTICO: NÚMEROS */}
      <Section
        eyebrow="01 / DIAGNÓSTICO — NÚMEROS REAIS"
        title="O que a operação realmente entrega"
        description="Dois recortes: o último mês no Instagram (22 abr – 21 mai/2026) e a visão consolidada com TikTok e Kwai juntos. A leitura completa muda a estratégia."
      >
        <div className="mb-6">
          <div className="fdv-section-eyebrow" style={{ marginBottom: 12 }}>INSTAGRAM — ÚLTIMO MÊS</div>
          <StatGrid items={insightsInstagram} />
        </div>
        <div>
          <div className="fdv-section-eyebrow" style={{ marginBottom: 12 }}>CONSOLIDADO — IG + TIKTOK + KWAI</div>
          <StatGrid items={consolidado} />
        </div>

        <div className="mt-8">
          <Callout tag="⚠ A insight que muda tudo">
            <strong>O Kwai entrega mais alcance/mês que o próprio Instagram</strong> (24M vs 20M). Qualquer plano comercial que olhe só pro IG está deixando 60% do alcance real fora da conta. Mídia kit consolidado é o argumento de venda.
          </Callout>
        </div>
      </Section>

      {/* 03 — PROVA SOCIAL */}
      <Section
        eyebrow="02 / PROVA SOCIAL — ATIVOS QUE JÁ TEMOS"
        title="A prospecção não parte do zero"
        description="Marcas que já contrataram, veículos que já cobriram e colaborações de peso. Tudo isso entra no primeiro contato comercial."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="fdv-card">
            <h3 style={{ fontFamily: "var(--fdv-font-display)", fontSize: "var(--fdv-text-xl)", textTransform: "uppercase", letterSpacing: "-0.02em", marginBottom: "var(--fdv-space-4)" }}>
              Marcas já trabalhadas
            </h3>
            <div className="flex flex-wrap gap-2">
              {marcasJaTrabalhadas.map((m) => (
                <span
                  key={m}
                  style={{
                    background: "var(--fdv-orange-500)",
                    color: "var(--fdv-primary-900)",
                    padding: "8px 14px",
                    fontFamily: "var(--fdv-font-sans)",
                    fontWeight: 700,
                    fontSize: "var(--fdv-text-sm)",
                    border: "2px solid var(--fdv-primary-900)",
                    borderRadius: "var(--fdv-radius-sm)",
                    boxShadow: "var(--fdv-shadow-sm)",
                  }}
                >
                  {m}
                </span>
              ))}
            </div>
            <p style={{ marginTop: "var(--fdv-space-4)", fontSize: "var(--fdv-text-sm)", color: "var(--fdv-text-muted)" }}>
              Inclui colab com <strong>Whindersson Nunes</strong> — uma das maiores referências de comédia do país.
            </p>
          </div>

          <div className="fdv-card">
            <h3 style={{ fontFamily: "var(--fdv-font-display)", fontSize: "var(--fdv-text-xl)", textTransform: "uppercase", letterSpacing: "-0.02em", marginBottom: "var(--fdv-space-4)" }}>
              Imprensa ganha
            </h3>
            <ul style={{ display: "flex", flexDirection: "column", gap: "var(--fdv-space-3)" }}>
              {provaImprensa.map((p) => (
                <li
                  key={p.veiculo}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "var(--fdv-space-3)",
                    paddingBottom: "var(--fdv-space-3)",
                    borderBottom: "1px solid var(--fdv-primary-200)",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "var(--fdv-text-base)" }}>{p.veiculo}</div>
                    <div style={{ fontSize: "var(--fdv-text-sm)", color: "var(--fdv-text-muted)" }}>{p.titulo}</div>
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--fdv-font-display)",
                      fontSize: "var(--fdv-text-lg)",
                      color: "var(--fdv-orange-500)",
                      letterSpacing: "-0.02em",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {p.views}
                  </div>
                </li>
              ))}
            </ul>
            <p style={{ marginTop: "var(--fdv-space-4)", fontSize: "var(--fdv-text-sm)", color: "var(--fdv-text-muted)" }}>
              <strong>5,07 mi de views em mídia ganha</strong> — sem pagar um real de assessoria.
            </p>
          </div>
        </div>
      </Section>

      {/* 04 — O GAP */}
      <Section
        eyebrow="03 / O GAP CENTRAL"
        title="Atenção massiva, conversão quase zero"
        description="A operação atrai milhões. Quase ninguém atravessa pra fora do Instagram. Esse gap é a oportunidade inteira."
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[
            { v: "5,17 MI", l: "contas alcançadas (IG/mês)" },
            { v: "621 MIL", l: "visitas ao perfil (IG/mês)" },
            { v: "568", l: "cliques no link da bio" },
          ].map((s) => (
            <div key={s.l} className="fdv-card" style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: "var(--fdv-font-display)",
                  fontSize: "clamp(2rem, 5vw, 3.25rem)",
                  letterSpacing: "-0.04em",
                  color: "var(--fdv-orange-500)",
                  lineHeight: 0.95,
                  marginBottom: 8,
                }}
              >
                {s.v}
              </div>
              <div style={{ fontSize: "var(--fdv-text-sm)", fontWeight: 600 }}>{s.l}</div>
            </div>
          ))}
        </div>
        <Callout tag="A conta que ninguém quer ver">
          <strong>0,09% das visitas ao perfil clicam no link.</strong> Não é só falta de captura — é ausência de qualquer destino que valha o clique. Resolver isso (lead magnet + captura na bio + produto à venda) é a alavanca de receita mais rápida do projeto.
        </Callout>
      </Section>

      {/* 05 — SWOT */}
      <Section
        eyebrow="04 / ANÁLISE SWOT"
        title="O tabuleiro honesto"
        description="O que jogamos a favor e o que precisamos blindar — com os ativos reais já no portfólio."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SwotBox badge="FORÇAS" title="O que temos de melhor" items={swot.forcas} tone="s" />
          <SwotBox badge="FRAQUEZAS" title="O que trava hoje" items={swot.fraquezas} tone="w" />
          <SwotBox badge="OPORTUNIDADES" title="Onde está o dinheiro" items={swot.oportunidades} tone="o" />
          <SwotBox badge="AMEAÇAS" title="O que vigiar" items={swot.ameacas} tone="t" />
        </div>
      </Section>

      {/* 06 — TESE CENTRAL */}
      <Section
        eyebrow="05 / TESE CENTRAL"
        title="Arte sob encomenda como motor de demanda invertida"
        description="O coração da estratégia. Não é só publi. É um ativo que se vende sozinho."
      >
        <div
          className="fdv-card"
          style={{
            background: "var(--fdv-orange-500)",
            color: "var(--fdv-primary-900)",
            fontSize: "clamp(1.125rem, 1.8vw, 1.375rem)",
            lineHeight: 1.45,
            marginBottom: "var(--fdv-space-8)",
          }}
        >
          O Augusto cria uma <strong>peça de arte exclusiva em vidro para uma empresa</strong> — uma tesoura escultural para uma barbearia, um carro espelhado para uma concessionária, uma xícara para uma cafeteria — e transforma o processo inteiro numa <strong>série de Reels virais</strong>. A peça fica fisicamente no cliente para sempre. A série roda para milhões.
        </div>

        <h3 style={{ fontFamily: "var(--fdv-font-display)", fontSize: "var(--fdv-text-xl)", textTransform: "uppercase", letterSpacing: "-0.02em", marginBottom: "var(--fdv-space-4)" }}>
          A oferta pela ótica do Hormozi
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stack_hormozi.map((s) => (
            <div key={s.tag} className="fdv-card">
              <span
                style={{
                  fontFamily: "var(--fdv-font-mono)",
                  fontSize: "var(--fdv-text-xs)",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--fdv-orange-500)",
                  display: "block",
                  marginBottom: "var(--fdv-space-2)",
                }}
              >
                {s.tag}
              </span>
              <h4 style={{ fontFamily: "var(--fdv-font-sans)", fontSize: "var(--fdv-text-base)", fontWeight: 700, marginBottom: "var(--fdv-space-2)" }}>
                {s.titulo}
              </h4>
              <p style={{ fontSize: "var(--fdv-text-sm)", color: "var(--fdv-text-muted)", lineHeight: 1.5 }}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>

        <Callout tag="Mecânica de demanda invertida">
          Quando milhões assistem o Augusto criando uma peça para uma cafeteria, <strong>todo dono de negócio com olho para marketing pensa: "e se fosse a minha?".</strong> A pergunta chega sozinha no direct. Saímos de "vendedor perseguindo cliente" para "lista de espera escolhendo cliente". O conteúdo é o vendedor.
        </Callout>
      </Section>

      {/* 07 — 3 TEMPOS */}
      <Section
        eyebrow="06 / O MODELO EM 3 TEMPOS"
        title="Como a isca vira fila e a fila vira escala"
        description="A primeira empresa não é a fonte de lucro — é a isca. Ela cobre o custo enquanto o conteúdo gerado atrai as próximas, que pagam o lucro real."
      >
        <div>
          {tres_tempos.map((s, i) => (
            <Step key={s.titulo} idx={i + 1} titulo={s.titulo} desc={s.desc} />
          ))}
          <div style={{ borderTop: "2px solid currentColor", marginTop: "var(--fdv-space-2)" }} />
        </div>

        <div className="mt-8">
          <Callout tag="O detalhe que protege o preço futuro">
            Mesmo cobrando a preço de custo na largada, <strong>registre sempre o valor de tabela</strong> no contrato/conversa ("o valor deste projeto é R$ 15k; esta é uma condição especial de primeira parceria"). Sem isso, a segunda empresa descobre o preço da primeira e quer pagar o mesmo — e você nunca sobe.
          </Callout>
        </div>
      </Section>

      {/* 08 — MAPA DE MARCAS — FRENTE A */}
      <Section
        eyebrow="07 / MAPA DE MARCAS — FRENTE A"
        title="Arte sob encomenda — quem prospectar"
        description="Negócios fotogênicos com identidade visual forte que se beneficiam de uma peça-ativo permanente + série viral."
      >
        <div
          style={{
            overflowX: "auto",
            border: "2px solid var(--fdv-primary-900)",
            borderRadius: "var(--fdv-radius-md)",
            boxShadow: "var(--fdv-shadow-sm)",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "var(--fdv-text-sm)", minWidth: 720 }}>
            <thead>
              <tr style={{ background: "var(--fdv-primary-900)", color: "var(--fdv-bg)" }}>
                <th style={{ padding: "12px 16px", textAlign: "left", fontFamily: "var(--fdv-font-mono)", fontSize: "var(--fdv-text-xs)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Fase</th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontFamily: "var(--fdv-font-mono)", fontSize: "var(--fdv-text-xs)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Tipo de negócio</th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontFamily: "var(--fdv-font-mono)", fontSize: "var(--fdv-text-xs)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Por que encaixa</th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontFamily: "var(--fdv-font-mono)", fontSize: "var(--fdv-text-xs)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Peça-conceito</th>
              </tr>
            </thead>
            <tbody>
              {frenteA.map((r, i) => (
                <tr key={i} style={{ borderTop: "1px solid var(--fdv-primary-200)" }}>
                  <td style={{ padding: "12px 16px", verticalAlign: "top" }}>
                    <span className="fdv-badge fdv-badge-orange">{r.fase}</span>
                  </td>
                  <td style={{ padding: "12px 16px", verticalAlign: "top", fontWeight: 700 }}>{r.tipo}</td>
                  <td style={{ padding: "12px 16px", verticalAlign: "top", color: "var(--fdv-text-muted)" }}>{r.motivo}</td>
                  <td style={{ padding: "12px 16px", verticalAlign: "top" }}>{r.peca}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* 09 — MAPA DE MARCAS — FRENTE B */}
      <Section
        eyebrow="08 / MAPA DE MARCAS — FRENTE B"
        title="Publi tradicional — só onde a audiência COMPRA"
        description="Critério único: a audiência do Augusto compra o produto da marca? Se não compra, fica fora — não importa o ticket."
      >
        <div
          style={{
            overflowX: "auto",
            border: "2px solid var(--fdv-primary-900)",
            borderRadius: "var(--fdv-radius-md)",
            boxShadow: "var(--fdv-shadow-sm)",
            marginBottom: "var(--fdv-space-8)",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "var(--fdv-text-sm)", minWidth: 720 }}>
            <thead>
              <tr style={{ background: "var(--fdv-primary-900)", color: "var(--fdv-bg)" }}>
                <th style={{ padding: "12px 16px", textAlign: "left", fontFamily: "var(--fdv-font-mono)", fontSize: "var(--fdv-text-xs)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Tier</th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontFamily: "var(--fdv-font-mono)", fontSize: "var(--fdv-text-xs)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Segmento</th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontFamily: "var(--fdv-font-mono)", fontSize: "var(--fdv-text-xs)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Exemplos</th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontFamily: "var(--fdv-font-mono)", fontSize: "var(--fdv-text-xs)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Por que cabe</th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontFamily: "var(--fdv-font-mono)", fontSize: "var(--fdv-text-xs)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Modelo</th>
              </tr>
            </thead>
            <tbody>
              {frenteB.map((r, i) => (
                <tr key={i} style={{ borderTop: "1px solid var(--fdv-primary-200)" }}>
                  <td style={{ padding: "12px 16px", verticalAlign: "top" }}>
                    <span
                      className="fdv-badge"
                      style={{
                        background: r.tier === "TIER 1" ? "var(--fdv-acid-500)" : r.tier === "TIER 2" ? "var(--fdv-orange-300)" : "var(--fdv-primary-200)",
                        color: "var(--fdv-primary-900)",
                      }}
                    >
                      {r.tier}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", verticalAlign: "top", fontWeight: 700 }}>{r.seg}</td>
                  <td style={{ padding: "12px 16px", verticalAlign: "top", color: "var(--fdv-text-muted)" }}>{r.exemplos}</td>
                  <td style={{ padding: "12px 16px", verticalAlign: "top", color: "var(--fdv-text-muted)" }}>{r.racional}</td>
                  <td style={{ padding: "12px 16px", verticalAlign: "top" }}>{r.modelo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 style={{ fontFamily: "var(--fdv-font-display)", fontSize: "var(--fdv-text-xl)", textTransform: "uppercase", letterSpacing: "-0.02em", marginBottom: "var(--fdv-space-4)" }}>
          Fora do mapa — e por quê
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {fora_do_mapa.map((f, i) => (
            <div
              key={i}
              className="fdv-card"
              style={{ background: "var(--fdv-primary-50)", borderColor: "var(--fdv-primary-300)" }}
            >
              <div
                style={{
                  fontFamily: "var(--fdv-font-mono)",
                  fontSize: "var(--fdv-text-xs)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "var(--fdv-error)",
                  fontWeight: 700,
                  marginBottom: "var(--fdv-space-2)",
                }}
              >
                ✕ FORA
              </div>
              <div style={{ fontWeight: 700, fontSize: "var(--fdv-text-base)", marginBottom: "var(--fdv-space-2)" }}>
                {f.marca}
              </div>
              <p style={{ fontSize: "var(--fdv-text-sm)", color: "var(--fdv-text-muted)", lineHeight: 1.5 }}>
                {f.motivo}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Callout tag="O filtro de ouro">
            <strong>A audiência do Augusto compra esse produto?</strong> Se a resposta for "não — quem compra é a vidraçaria que assiste o conteúdo dele", é brand awareness corporativo. Ticket imprevisível, ROI difícil de medir. Fica fora até existir um pacote institucional dedicado.
          </Callout>
        </div>
      </Section>

      {/* 10 — SCRIPTS */}
      <Section
        eyebrow="09 / SCRIPTS DE ABORDAGEM"
        title="O que dizer, palavra por palavra"
        description="Personalize sempre nome e referência ao negócio. Templates são ponto de partida, nunca cópia cega."
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--fdv-space-6)" }}>
          <ScriptBox label="SCRIPT 1 · ABORDAGEM DA EMPRESA-ISCA" subject="WhatsApp / DM — tom direto e pessoal">
            <p>Oi [Nome], tudo bem? Aqui é [Nome], da Futurah — a gente cuida do <Hl>@fidevidraceiro, criador de arte em vidro com 1,2 milhão de seguidores somando todas as redes e 59 milhões de alcance por mês</Hl>.</p>
            <p>Tô montando um projeto novo e o [nome do negócio] me chamou atenção pela identidade de vocês. A ideia: o Augusto cria <Hl>uma peça de arte exclusiva em vidro pra vocês</Hl> — algo que vira símbolo da marca — e a gente grava todo o processo numa série de vídeos que vai pros perfis dele.</p>
            <p>Vocês ganham uma peça única que fica aí pra sempre + exposição pra milhões de pessoas. Como é um dos primeiros projetos dessa linha, tô com uma <Hl>condição especial de lançamento</Hl>. Te explico em 10 minutos?</p>
          </ScriptBox>

          <ScriptBox label="SCRIPT 2 · EMPRESA QUE CHEGOU PELO CONTEÚDO" subject="Resposta a quem perguntou no direct">
            <p>Que ótimo que curtiu o vídeo da [referência ao case]! Funciona assim: o Augusto cria uma peça de arte exclusiva em vidro pro seu negócio, e a gente documenta o processo inteiro numa série de Reels.</p>
            <p>A série da [case] fez <Hl>[X] milhões de views</Hl> e o movimento lá aumentou bastante depois. A peça fica permanente no espaço de vocês, virando ponto de foto e marca registrada.</p>
            <p>O investimento do projeto completo é <Hl>a partir de R$ [valor real]</Hl>, incluindo a criação da peça e toda a série de conteúdo. Posso te mandar o portfólio com os outros cases?</p>
          </ScriptBox>

          <ScriptBox label="SCRIPT 3 · E-MAIL PARA MARCA (PUBLI TRADICIONAL)" subject="Assunto: 59 mi de alcance/mês em conteúdo de arte e DIY — parceria com @fidevidraceiro">
            <p>Olá [Nome],</p>
            <p>Sou [Nome], da Futurah & Co. Gerenciamos o @fidevidraceiro — criador de arte em vidro com <Hl>1,2 milhão de seguidores e 59 milhões de alcance mensal</Hl> entre Instagram, TikTok e Kwai. O perfil já trabalhou com TekBond, Cebrace, Bombril, Temu, Vonixx, Spotify e Call of Duty, e foi pauta em PEGN, g1, MGTV e Band.</p>
            <p>O conteúdo de processo criativo tem altíssima retenção e <Hl>48 mil salvamentos por mês no Instagram</Hl> — gente que quer voltar e fazer igual. Encaixa diretamente com [Marca] porque [motivo específico — produto que ele usaria no vídeo].</p>
            <p>Tenho um formato de integração que conversa naturalmente com a linguagem do perfil, sem parecer publi. Posso enviar o mídia kit?</p>
          </ScriptBox>
        </div>
      </Section>

      {/* 11 — PRECIFICAÇÃO */}
      <Section
        eyebrow="10 / PRECIFICAÇÃO"
        title="Como cobrar o que o trabalho vale"
        description="Valores de referência. Ajuste por custo real de material, complexidade da peça e porte da empresa."
      >
        <h3 style={{ fontFamily: "var(--fdv-font-display)", fontSize: "var(--fdv-text-xl)", textTransform: "uppercase", letterSpacing: "-0.02em", marginBottom: "var(--fdv-space-4)" }}>
          Linha "arte sob encomenda + série"
        </h3>
        <div
          style={{
            overflowX: "auto",
            border: "2px solid var(--fdv-primary-900)",
            borderRadius: "var(--fdv-radius-md)",
            boxShadow: "var(--fdv-shadow-sm)",
            marginBottom: "var(--fdv-space-8)",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "var(--fdv-text-sm)", minWidth: 720 }}>
            <thead>
              <tr style={{ background: "var(--fdv-primary-900)", color: "var(--fdv-bg)" }}>
                <th style={{ padding: "12px 16px", textAlign: "left", fontFamily: "var(--fdv-font-mono)", fontSize: "var(--fdv-text-xs)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Fase</th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontFamily: "var(--fdv-font-mono)", fontSize: "var(--fdv-text-xs)", textTransform: "uppercase", letterSpacing: "0.08em" }}>O que cobrar</th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontFamily: "var(--fdv-font-mono)", fontSize: "var(--fdv-text-xs)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Faixa de referência</th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontFamily: "var(--fdv-font-mono)", fontSize: "var(--fdv-text-xs)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Lógica</th>
              </tr>
            </thead>
            <tbody>
              {precificacao_arte.map((r) => (
                <tr key={r.fase} style={{ borderTop: "1px solid var(--fdv-primary-200)" }}>
                  <td style={{ padding: "12px 16px", verticalAlign: "top" }}>
                    <span className="fdv-badge fdv-badge-orange">{r.fase}</span>
                  </td>
                  <td style={{ padding: "12px 16px", verticalAlign: "top", fontWeight: 700 }}>{r.oque}</td>
                  <td style={{ padding: "12px 16px", verticalAlign: "top", fontFamily: "var(--fdv-font-mono)" }}>{r.faixa}</td>
                  <td style={{ padding: "12px 16px", verticalAlign: "top", color: "var(--fdv-text-muted)" }}>{r.logica}</td>
                </tr>
              ))}
              <tr style={{ borderTop: "2px solid var(--fdv-primary-900)", background: "var(--fdv-acid-100)" }}>
                <td colSpan={2} style={{ padding: "12px 16px", verticalAlign: "top", fontWeight: 700 }}>Âncora de preço (sempre registrar)</td>
                <td style={{ padding: "12px 16px", verticalAlign: "top", fontFamily: "var(--fdv-font-mono)", fontWeight: 700 }}>"Tabela: a partir de R$ 15.000"</td>
                <td style={{ padding: "12px 16px", verticalAlign: "top" }}>Protege o teto desde o primeiro projeto</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 style={{ fontFamily: "var(--fdv-font-display)", fontSize: "var(--fdv-text-xl)", textTransform: "uppercase", letterSpacing: "-0.02em", marginBottom: "var(--fdv-space-4)" }}>
          Publi tradicional
        </h3>
        <div
          style={{
            overflowX: "auto",
            border: "2px solid var(--fdv-primary-900)",
            borderRadius: "var(--fdv-radius-md)",
            boxShadow: "var(--fdv-shadow-sm)",
            marginBottom: "var(--fdv-space-8)",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "var(--fdv-text-sm)", minWidth: 720 }}>
            <thead>
              <tr style={{ background: "var(--fdv-primary-900)", color: "var(--fdv-bg)" }}>
                <th style={{ padding: "12px 16px", textAlign: "left", fontFamily: "var(--fdv-font-mono)", fontSize: "var(--fdv-text-xs)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Formato</th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontFamily: "var(--fdv-font-mono)", fontSize: "var(--fdv-text-xs)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Preço basal</th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontFamily: "var(--fdv-font-mono)", fontSize: "var(--fdv-text-xs)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Com direitos (30d)</th>
              </tr>
            </thead>
            <tbody>
              {precificacao_publi.map((r) => (
                <tr key={r.formato} style={{ borderTop: "1px solid var(--fdv-primary-200)" }}>
                  <td style={{ padding: "12px 16px", verticalAlign: "top", fontWeight: 700 }}>{r.formato}</td>
                  <td style={{ padding: "12px 16px", verticalAlign: "top", fontFamily: "var(--fdv-font-mono)" }}>{r.basal}</td>
                  <td style={{ padding: "12px 16px", verticalAlign: "top", fontFamily: "var(--fdv-font-mono)", color: "var(--fdv-orange-700)" }}>{r.direitos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Callout tag="A fórmula que sustenta qualquer preço">
          <strong>Preço = Mídia (CPM × views esperadas) + Produção (tempo de roteiro, gravação, edição) + Imagem (autoridade no nicho).</strong> Nunca precifique só por seguidores — o ratio de 19× views/seguidor torna o alcance real muito maior que o de perfis comparáveis. Esse é o argumento contra qualquer tentativa de negociar para baixo com tabela genérica.
        </Callout>
      </Section>

      {/* 12 — CHECKLIST */}
      <Section
        eyebrow="11 / CHECKLIST DE EXECUÇÃO"
        title="O plano dos próximos 30 dias"
        description="Ordem de execução. Cada semana fecha entregáveis específicos."
      >
        {checklist.map((bloco) => (
          <div key={bloco.fase} style={{ marginBottom: "var(--fdv-space-8)" }}>
            <h3
              style={{
                fontFamily: "var(--fdv-font-display)",
                fontSize: "clamp(1.25rem, 2.2vw, 1.75rem)",
                textTransform: "uppercase",
                letterSpacing: "-0.02em",
                marginBottom: "var(--fdv-space-3)",
                color: "var(--fdv-orange-500)",
              }}
            >
              {bloco.fase}
            </h3>
            <ul style={{ display: "flex", flexDirection: "column", gap: "var(--fdv-space-2)" }}>
              {bloco.itens.map((item) => (
                <li
                  key={item}
                  className="fdv-card"
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "var(--fdv-space-3)",
                    padding: "var(--fdv-space-4)",
                  }}
                >
                  <span
                    style={{
                      width: 22,
                      height: 22,
                      border: "2px solid var(--fdv-primary-900)",
                      borderRadius: 4,
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  />
                  <span style={{ fontSize: "var(--fdv-text-base)", lineHeight: 1.45 }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Section>

      {/* 13 — FOOTER */}
      <footer
        className="fdv-section"
        style={{ background: "var(--fdv-primary-900)", color: "var(--fdv-bg)", textAlign: "center" }}
      >
        <div className="max-w-6xl mx-auto px-6 w-full">
          <div
            style={{
              fontFamily: "var(--fdv-font-display)",
              fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
              textTransform: "uppercase",
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              marginBottom: "var(--fdv-space-6)",
            }}
          >
            O conteúdo está funcionando<br />
            melhor do que nunca.<br />
            <span style={{ color: "var(--fdv-orange-500)" }}>Falta o sistema comercial em cima.</span>
          </div>
          <p style={{ color: "var(--fdv-primary-300)", maxWidth: "60ch", margin: "0 auto var(--fdv-space-8)" }}>
            Este plano é o sistema. Agora é executar com disciplina, semana a semana, sem fugir do checklist.
          </p>
          <div
            style={{
              fontFamily: "var(--fdv-font-mono)",
              fontSize: "var(--fdv-text-xs)",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "var(--fdv-primary-500)",
              borderTop: "1px solid var(--fdv-primary-700)",
              paddingTop: "var(--fdv-space-6)",
            }}
          >
            Futurah & Co. · Documento confidencial · Uso interno · 2026
            <br />
            Dados: Instagram Insights (22 abr – 21 mai/2026), mídia-kit consolidado, CONTEXT.md (06/mai/2026)
          </div>
        </div>
      </footer>
    </div>
  );
}
