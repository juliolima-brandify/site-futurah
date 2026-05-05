import { Space_Grotesk, Archivo_Black } from "next/font/google";
import { SectionCounter } from "../SectionCounter";
import ScrollBottomBlur from "./ScrollBottomBlur";
import NavArrows from "./NavArrows";
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
  title: "Augusto Felipe — @fidevidraceiro — Mídia Kit 2026",
};

/* =========================================================
   DADOS DO MÍDIA KIT — extraído do PDF original
   ========================================================= */

const IMG = "/midia-kit-fi";

const totals = [
  { value: "1.2 MILHÕES", label: "Seguidores totais" },
  { value: "59 MILHÕES",  label: "Alcance mensal" },
];

const platforms = [
  { code: "IG", name: "Instagram", followers: "730 MIL", monthly: "20 MILHÕES" },
  { code: "TT", name: "TikTok",    followers: "430 MIL", monthly: "15 MILHÕES" },
  { code: "KW", name: "Kwai",      followers: "110 MIL", monthly: "24 MILHÕES" },
];

function PlatformIcon({ code, size = 22 }: { code: string; size?: number }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": true } as const;
  if (code === "IG") {
    return (
      <svg {...common}>
        <path d="M12 2.16c3.2 0 3.58.012 4.85.07 1.17.054 1.8.25 2.23.413.56.218.96.478 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.43.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.43-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.43-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63a5.9 5.9 0 0 0-2.13 1.39A5.9 5.9 0 0 0 .62 4.15c-.3.76-.5 1.64-.55 2.91C.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.55 2.91a5.9 5.9 0 0 0 1.39 2.13 5.9 5.9 0 0 0 2.13 1.39c.76.3 1.64.5 2.91.55C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.05 2.15-.25 2.91-.55a6.13 6.13 0 0 0 3.52-3.52c.3-.76.5-1.64.55-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.05-1.27-.25-2.15-.55-2.91a5.9 5.9 0 0 0-1.39-2.13A5.9 5.9 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.55C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z" />
      </svg>
    );
  }
  if (code === "TT") {
    return (
      <svg {...common}>
        <path d="M19.6 6.32a5.93 5.93 0 0 1-3.6-1.21 5.93 5.93 0 0 1-1.42-1.84A5.94 5.94 0 0 1 13.94.5h-3.36v13.86a3.4 3.4 0 0 1-1.6 2.88 3.4 3.4 0 0 1-3.27.27 3.4 3.4 0 0 1-1.93-2.65 3.4 3.4 0 0 1 1.05-3 3.4 3.4 0 0 1 3.07-.86V7.6a6.78 6.78 0 0 0-5.5 1.93A6.78 6.78 0 0 0 .5 14.86a6.78 6.78 0 0 0 2.36 5.21 6.78 6.78 0 0 0 5.51 1.65 6.78 6.78 0 0 0 4.93-3.06 6.78 6.78 0 0 0 1.13-3.74V8.84a9.27 9.27 0 0 0 5.17 1.6V7.08a5.93 5.93 0 0 1-.5-.76z" />
      </svg>
    );
  }
  if (code === "KW") {
    return (
      <svg {...common}>
        <path d="M3 3h4.2v7.5L13.6 3h5.1l-6.9 8.4L19.5 21h-5.4l-5.1-7.4-1.8 2.1V21H3V3z" />
      </svg>
    );
  }
  return null;
}

const press = [
  {
    title: "Empreendedores de todo o país faturam com a moda da capivara",
    logo: `${IMG}/materia-empresas.png`,
    thumb: `${IMG}/thumb-empresas.png`,
    channel: "Pequenas Empresas & Grandes Negócios",
    duration: "0:00",
    meta: "1,2 mi de visualizações • há 1 ano",
    description:
      "Reportagem da PEGN sobre o boom da capivara nas redes — o Fí de Vidraceiro aparece como case do nicho.",
  },
  {
    title: "Jovem adota jeito bem humorado no aprendizado do ofício do pai",
    logo: `${IMG}/materia-mgtv.png`,
    thumb: `${IMG}/thumb-mgtv.png`,
    channel: "MGTV 1ª edição — Uberlândia",
    duration: "0:00",
    meta: "850 mil visualizações • há 1 ano",
    description:
      "Telejornal local mostra a história do jovem que aprende vidraçaria com o pai e viralizou com humor e arte.",
  },
  {
    title:
      "'Fi de vidraceiro' viraliza nas redes sociais ao mostrar criações inéditas na vidraçaria da família",
    logo: `${IMG}/materia-g1.png`,
    thumb: `${IMG}/thumb-g1.png`,
    channel: "g1 Triângulo Mineiro",
    duration: "0:00",
    meta: "2,4 mi de visualizações • há 1 ano",
    description:
      "Augusto Felipe, 23, transforma vidro em arte na empresa da família e se torna influenciador digital. Por Gabriel Reis, g1 Triângulo — Uberlândia.",
  },
  {
    title: "Mulheres Empreendedoras: transformar o vidro em arte",
    logo: `${IMG}/materia-band.png`,
    thumb: `${IMG}/thumb-band.png`,
    channel: "Band Mulher",
    duration: "0:00",
    meta: "620 mil visualizações • 05/06/2025",
    description:
      "Quadro Mulheres Empreendedoras (Band Triângulo) mostra como o trabalho do Fí de Vidraceiro chegou à TV.",
  },
];

const audience = {
  gender: [
    { label: "Feminino", pct: 52 },
    { label: "Masculino", pct: 48 },
  ],
  cities: ["São Paulo", "Rio de Janeiro", "Uberlândia"],
  ages: ["13 - 17 anos", "18 - 24 anos", "25 - 34 anos", "35 - 44 anos", "45 - 54 anos"],
};

const interests = ["Dicas", "Construção", "Arte", "Vidraçaria", "Decoração", "DIY"];
const contentTypes = [
  "Arte",
  "Dicas de construção e decoração",
  "Bastidores",
  "Pegadinhas",
  "Curiosidades",
  "Lifestyle",
];

const brandLogos = [
  { src: `${IMG}/page06_img01.png`, alt: "TekBond" },
  { src: `${IMG}/page06_img02.png`, alt: "Cebrace" },
  { src: `${IMG}/page06_img07.png`, alt: "Bombril" },
  { src: `${IMG}/page06_img08.png`, alt: "Temu" },
  { src: `${IMG}/page06_img09.png`, alt: "Vonixx" },
  { src: `${IMG}/page06_img13.png`, alt: "Spotify" },
  { src: `${IMG}/page06_img03.png`, alt: "Call of Duty" },
];

const pillars = [
  { title: "Estética",      desc: "Conteúdos autorais com estética artística e linguagem leve." },
  { title: "Naturalidade",  desc: "Vídeos espontâneos, com humor e autenticidade." },
  { title: "Integração",    desc: "Criações que unem a marca às minhas obras." },
  { title: "Engajamento",   desc: "Público fiel que acompanha cada fase do meu trabalho." },
  { title: "Alcance",       desc: "Seguidores diversos, da construção à arte." },
];

const formats = [
  { name: "Reels Criativos",         desc: "Com alto potencial de viralização." },
  { name: "Publipost no Feed",       desc: "Divulgação com storytelling autêntico." },
  { name: "Stories Interativos",     desc: "Enquetes, bastidores e chamadas com link." },
  { name: "Projetos Personalizados", desc: "Obras exclusivas com presença da marca." },
  { name: "Pacotes Mensais",         desc: "Campanhas com recorrência e maior alcance." },
  { name: "Sorteios e Ativações",    desc: "Ações que envolvem e engajam o público." },
  { name: "Presença em Eventos",     desc: "Ativações ao vivo e experiências artísticas." },
];

const gallery = [
  "page08_img01.png", "page08_img02.png", "page08_img03.png", "page08_img04.png",
  "page08_img05.png", "page08_img06.png", "page08_img07.png", "page08_img08.png",
  "page08_img09.png", "page08_img10.png", "page08_img11.jpeg", "page08_img12.jpeg",
  "page08_img13.jpeg", "page08_img14.jpeg", "page08_img15.png", "page08_img16.png",
].map((f) => `${IMG}/${f}`);

const reels = [
  { url: "https://www.instagram.com/reel/DABVb2RpAGP/", thumb: `${IMG}/reel_01.png`, alt: "Reel — 684 mil visualizações" },
  { url: "https://www.instagram.com/reel/C9o-WtANqcx/", thumb: `${IMG}/reel_02.png`, alt: "Reel — 5,5 milhões de visualizações" },
  { url: "https://www.instagram.com/reel/C9-pZObpe9-/", thumb: `${IMG}/reel_03.png`, alt: "Reel — 8 milhões de visualizações" },
  { url: "https://www.instagram.com/reel/DQFgPVxiTDO/", thumb: `${IMG}/reel_04.png`, alt: "Reel — 6,3 milhões de visualizações" },
];

/* =========================================================
   COMPONENTES
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

function DashboardSection({
  eyebrow,
  bandLabel = "PÚBLICO-ALVO",
  light = false,
  children,
}: {
  eyebrow: string;
  bandLabel?: string;
  light?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      className="fdv-section"
      style={{
        background: light ? "var(--fdv-bg)" : "var(--fdv-primary-900)",
        color: light ? "var(--fdv-primary-900)" : "var(--fdv-bg)",
        padding: 0,
        display: "flex",
        flexDirection: "row",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          flex: 1,
          padding: "clamp(2rem, 5vw, 3.5rem) clamp(1.5rem, 4vw, 3rem)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "clamp(1.5rem, 3vw, 2.5rem)",
          minWidth: 0,
        }}
      >
        <div className="fdv-section-eyebrow" style={{ color: light ? "var(--fdv-primary-500)" : "var(--fdv-primary-300)" }}>
          {eyebrow}
        </div>
        {children}
      </div>
      <div
        style={{
          background: "var(--fdv-orange-500)",
          width: "clamp(56px, 7vw, 88px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            fontFamily: "var(--fdv-font-display)",
            fontSize: "clamp(2rem, 5.5vw, 4.5rem)",
            letterSpacing: "-0.03em",
            textTransform: "uppercase",
            color: "var(--fdv-bg)",
            whiteSpace: "nowrap",
            lineHeight: 1,
          }}
        >
          {bandLabel}
        </span>
      </div>
    </section>
  );
}

function DashH3({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <h3
      style={{
        fontFamily: "var(--fdv-font-display)",
        fontSize: "clamp(1.5rem, 3.2vw, 2.5rem)",
        letterSpacing: "-0.03em",
        textTransform: "uppercase",
        color: "currentColor",
        marginBottom: "var(--fdv-space-3)",
        lineHeight: 1,
        ...style,
      }}
    >
      {children}
    </h3>
  );
}

function DashLegend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-2" style={{ fontSize: "var(--fdv-text-sm)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>
      <span style={{ width: 14, height: 14, background: color, display: "inline-block" }} />
      {label}
    </span>
  );
}

/* =========================================================
   PÁGINA
   ========================================================= */

export default function MidiaKit() {
  return (
    <div className={`fdv-root fdv-snap-container ${grotesk.variable} ${archivoBlack.variable}`}>
      <ScrollBottomBlur />
      <SectionCounter />
      <NavArrows />

      {/* 01 — CAPA */}
      <header
        className="fdv-section fdv-cover"
        style={{
          position: "relative",
          backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.45) 45%, rgba(0,0,0,0) 100%), url(${IMG}/cover-bg.png)`,
          backgroundSize: "cover",
          backgroundPosition: "center right",
          backgroundRepeat: "no-repeat",
          color: "var(--fdv-bg)",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 w-full" style={{ position: "relative", zIndex: 1 }}>
          <div className="flex items-center justify-between mb-12">
            <span className="fdv-badge">@FIDEVIDRACEIRO</span>
            <span className="fdv-badge fdv-badge-orange">MÍDIA KIT 2026</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7">
              <img
                src={`${IMG}/logo-white.svg`}
                alt="Augusto Felipe"
                style={{
                  width: "100%",
                  maxWidth: "512px",
                  display: "block",
                }}
              />
            </div>
          </div>
        </div>
        <div className="fdv-scroll-hint">↓ Scroll</div>
      </header>

      {/* 02 — QUEM SOU */}
      <Section eyebrow="01 / QUEM SOU" title="" noTitle>
        <div style={{ fontSize: "clamp(1.25rem, 2.2vw, 1.75rem)", lineHeight: 1.4, maxWidth: "62ch" }}>
          <p className="mb-6">
            Sou o <strong>Augusto Felipe</strong>, criador do perfil <strong>@fidevidraceiro</strong>, onde compartilho um universo criativo que vai muito além de espelhos.
          </p>
          <p className="mb-6">
            Transformo vidro em arte, dou dicas práticas e inteligentes para o dia a dia da construção civil, crio peças decorativas únicas e mostro os bastidores com leveza e bom humor.
          </p>
          <p>
            Meu conteúdo já impactou mais de <strong>1 milhão de seguidores</strong>, unindo informação, entretenimento e inspiração para quem ama ver ideias ganhando forma — tudo com autenticidade e criatividade.
          </p>
        </div>
      </Section>

      {/* 03 — ALCANCE */}
      <Section
        eyebrow="02 / ALCANCE DA MÍDIA"
        title="Em números"
        description="Crescimento orgânico de 1 milhão em apenas 17 meses desde que comecei a postar esses conteúdos originais e virais."
      >
        {/* Totals — 2 grandões */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {totals.map((t) => (
            <div key={t.label} className="fdv-card">
              <div
                style={{
                  fontFamily: "var(--fdv-font-display)",
                  fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                  lineHeight: 0.9,
                  letterSpacing: "-0.04em",
                  color: "var(--fdv-orange-500)",
                  marginBottom: "var(--fdv-space-2)",
                }}
              >
                {t.value}
              </div>
              <div className="text-sm font-bold uppercase tracking-wider">{t.label}</div>
            </div>
          ))}
        </div>

        {/* Plataformas — 3 cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {platforms.map((p) => (
            <div key={p.code} className="fdv-card">
              <div className="flex items-center justify-between mb-4">
                <span
                  style={{
                    width: 40, height: 40,
                    background: "var(--fdv-primary-900)",
                    color: "var(--fdv-bg)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    borderRadius: "var(--fdv-radius-sm)",
                  }}
                >
                  <PlatformIcon code={p.code} />
                </span>
                <span className="text-sm font-bold uppercase tracking-wider">{p.name}</span>
              </div>
              <div className="flex flex-col gap-4">
                <div>
                  <div className="text-xs uppercase tracking-wider mb-1" style={{ color: "var(--fdv-primary-500)" }}>Seguidores</div>
                  <div style={{ fontFamily: "var(--fdv-font-display)", fontSize: "clamp(1.5rem, 3.2vw, 2.25rem)", letterSpacing: "-0.03em", lineHeight: 1 }}>
                    {p.followers}
                  </div>
                </div>
                <div style={{ borderTop: "1px solid var(--fdv-primary-200)", paddingTop: "var(--fdv-space-3)" }}>
                  <div className="text-xs uppercase tracking-wider mb-1" style={{ color: "var(--fdv-primary-500)" }}>Alcance/mês</div>
                  <div style={{ fontFamily: "var(--fdv-font-display)", fontSize: "clamp(1.5rem, 3.2vw, 2.25rem)", letterSpacing: "-0.03em", lineHeight: 1, color: "var(--fdv-orange-500)" }}>
                    {p.monthly}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* 03 — PÚBLICO-ALVO (dashboard) */}
      <DashboardSection eyebrow="03 / PÚBLICO-ALVO" light>
        {/* Gênero */}
        <div>
          <DashH3>Gênero</DashH3>
          <div className="flex items-center gap-10 md:gap-16">
            <div className="flex items-center gap-4">
              <svg width="56" height="78" viewBox="0 0 50 70" aria-hidden style={{ color: "var(--fdv-orange-500)" }} fill="currentColor">
                <circle cx="25" cy="8" r="7" />
                <path d="M16 17 L34 17 L42 48 L36 48 L36 64 L29 64 L29 48 L21 48 L21 64 L14 64 L14 48 L8 48 Z" />
              </svg>
              <span style={{ fontFamily: "var(--fdv-font-display)", fontSize: "clamp(2.5rem, 7vw, 5rem)", letterSpacing: "-0.04em", lineHeight: 0.9, color: "currentColor" }}>
                52%
              </span>
            </div>
            <div className="flex items-center gap-4">
              <svg width="56" height="78" viewBox="0 0 50 70" aria-hidden style={{ color: "var(--fdv-orange-500)" }} fill="currentColor">
                <circle cx="25" cy="8" r="7" />
                <path d="M16 17 L34 17 L34 40 L31 40 L31 64 L25 64 L25 40 L19 40 L19 64 L13 64 L13 40 Z" />
              </svg>
              <span style={{ fontFamily: "var(--fdv-font-display)", fontSize: "clamp(2.5rem, 7vw, 5rem)", letterSpacing: "-0.04em", lineHeight: 0.9, color: "currentColor" }}>
                48%
              </span>
            </div>
          </div>
        </div>

        {/* Cidades */}
        <div>
          <DashH3>Principais Cidades</DashH3>
          <div className="flex flex-wrap gap-x-6 gap-y-2 mb-3">
            <DashLegend color="var(--fdv-orange-900)" label="São Paulo" />
            <DashLegend color="var(--fdv-orange-700)" label="Rio de Janeiro" />
            <DashLegend color="var(--fdv-orange-500)" label="Uberlândia" />
          </div>
          <svg viewBox="0 0 600 180" preserveAspectRatio="none" style={{ width: "100%", height: 160, display: "block" }} aria-hidden>
            <g stroke="currentColor" strokeOpacity="0.1" strokeWidth="1">
              <line x1="0" y1="30" x2="600" y2="30" />
              <line x1="0" y1="60" x2="600" y2="60" />
              <line x1="0" y1="90" x2="600" y2="90" />
              <line x1="0" y1="120" x2="600" y2="120" />
              <line x1="0" y1="150" x2="600" y2="150" />
              <line x1="0" y1="180" x2="600" y2="180" />
            </g>
            <path d="M0 145 L100 135 L200 130 L300 100 L400 75 L500 50 L600 25 L600 180 L0 180 Z" fill="var(--fdv-orange-900)" />
            <path d="M0 162 L100 158 L200 150 L300 130 L400 110 L500 92 L600 65 L600 180 L0 180 Z" fill="var(--fdv-orange-700)" />
            <path d="M0 175 L100 172 L200 168 L300 158 L400 145 L500 130 L600 105 L600 180 L0 180 Z" fill="var(--fdv-orange-500)" />
          </svg>
        </div>

        {/* Idades */}
        <div>
          <DashH3>Principais Idades</DashH3>
          <ul style={{ display: "flex", flexDirection: "column", gap: "var(--fdv-space-2)" }}>
            {[
              { label: "13 - 17 anos", width: "26%", color: "var(--fdv-orange-500)" },
              { label: "18 - 24 anos", width: "44%", color: "var(--fdv-orange-600)" },
              { label: "25 - 34 anos", width: "60%", color: "var(--fdv-orange-300)" },
              { label: "35 - 44 anos", width: "40%", color: "var(--fdv-orange-100)" },
              { label: "45 - 54 anos", width: "22%", color: "var(--fdv-orange-900)" },
            ].map((a) => (
              <li key={a.label} style={{ display: "flex", alignItems: "center", gap: "var(--fdv-space-4)" }}>
                <div style={{ width: a.width, minWidth: 60, height: 26, background: a.color, borderRadius: 9999 }} />
                <span style={{ fontFamily: "var(--fdv-font-display)", fontSize: "var(--fdv-text-base)", textTransform: "uppercase", letterSpacing: "-0.02em" }}>
                  {a.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </DashboardSection>

      {/* 04 — CONTEÚDO (dashboard) */}
      <DashboardSection eyebrow="04 / CONTEÚDO">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Interesses */}
          <div>
            <DashH3 style={{ maxWidth: "20ch" }}>Interesses do meu público</DashH3>
            <div className="grid grid-cols-3 gap-3" style={{ maxWidth: 460 }}>
              {[
                { label: "Dicas", color: "var(--fdv-orange-100)", textColor: "var(--fdv-primary-900)" },
                { label: "Construção", color: "var(--fdv-orange-500)", textColor: "var(--fdv-bg)" },
                { label: "Arte", color: "var(--fdv-orange-900)", textColor: "var(--fdv-bg)" },
                { label: "Vidraçaria", color: "var(--fdv-orange-300)", textColor: "var(--fdv-primary-900)" },
                { label: "Decoração", color: "var(--fdv-orange-600)", textColor: "var(--fdv-bg)" },
                { label: "DIY", color: "var(--fdv-orange-700)", textColor: "var(--fdv-bg)" },
              ].map((i) => (
                <div
                  key={i.label}
                  style={{
                    background: i.color,
                    color: i.textColor,
                    borderRadius: 18,
                    aspectRatio: "1 / 1",
                    padding: "var(--fdv-space-3) var(--fdv-space-3)",
                    display: "flex",
                    alignItems: "flex-start",
                    fontFamily: "var(--fdv-font-display)",
                    fontSize: "clamp(0.9rem, 1.6vw, 1.25rem)",
                    letterSpacing: "-0.02em",
                    textTransform: "uppercase",
                    lineHeight: 1,
                    overflow: "hidden",
                    wordBreak: "break-word",
                    hyphens: "auto",
                  }}
                >
                  {i.label}
                </div>
              ))}
            </div>
          </div>

          {/* Tipos de conteúdos — Bubble chart */}
          <div>
            <DashH3 style={{ maxWidth: "30ch" }}>Tipos de conteúdos e temas que abordo</DashH3>
            <div style={{ position: "relative", width: "100%", maxWidth: 520, aspectRatio: "5 / 4" }}>
              {[
                { label: "Arte", size: 38, top: "18%", left: "0%", color: "var(--fdv-orange-500)", textColor: "var(--fdv-bg)" },
                { label: "Dicas de construção e decoração", size: 35, top: "0%", left: "38%", color: "var(--fdv-orange-300)", textColor: "var(--fdv-primary-900)" },
                { label: "Bastidores", size: 30, top: "42%", left: "33%", color: "var(--fdv-orange-900)", textColor: "var(--fdv-bg)" },
                { label: "Pegadinhas", size: 22, top: "32%", left: "70%", color: "var(--fdv-orange-500)", textColor: "var(--fdv-bg)" },
                { label: "Curiosidades", size: 23, top: "60%", left: "8%", color: "var(--fdv-orange-100)", textColor: "var(--fdv-primary-900)" },
                { label: "Lifestyle", size: 17, top: "72%", left: "60%", color: "var(--fdv-orange-700)", textColor: "var(--fdv-bg)" },
              ].map((b) => (
                <div
                  key={b.label}
                  style={{
                    position: "absolute",
                    top: b.top,
                    left: b.left,
                    width: `${b.size}%`,
                    aspectRatio: "1 / 1",
                    borderRadius: "50%",
                    background: b.color,
                    color: b.textColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    padding: 8,
                    fontFamily: "var(--fdv-font-display)",
                    fontSize: b.size < 25 ? 10 : 12,
                    letterSpacing: "-0.02em",
                    textTransform: "uppercase",
                    lineHeight: 1.05,
                  }}
                >
                  {b.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </DashboardSection>

      {/* 05 — IMPRENSA */}
      <Section
        eyebrow="05 / IMPRENSA"
        title="Saiba mais nas matérias"
        description="Reportagens em portais de negócios, telejornais e veículos regionais."
      >
        <div className="fdv-press-grid">
          {press.map((p) => (
            <article key={p.thumb} className="fdv-yt-post">
              <h3 className="fdv-yt-title">{p.title}</h3>
              <div className="fdv-yt-video">
                <img src={p.thumb} alt={p.title} loading="lazy" />
                <span className="fdv-yt-play" aria-hidden>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
                <span className="fdv-yt-duration">{p.duration}</span>
              </div>
              <div className="fdv-yt-meta">
                <span className="fdv-yt-avatar">
                  <img src={p.logo} alt="" />
                </span>
                <div className="fdv-yt-meta-text">
                  <span className="fdv-yt-channel">
                    {p.channel}
                    <span className="fdv-yt-verified" aria-hidden>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                    </span>
                  </span>
                  <span className="fdv-yt-stats">{p.meta}</span>
                </div>
              </div>
              <p className="fdv-yt-description">{p.description}</p>
            </article>
          ))}
        </div>
      </Section>

      {/* 06 — MARCAS */}
      <Section eyebrow="06 / MARCAS" noTitle>
        <div style={{ textAlign: "center", marginBottom: "clamp(2.5rem, 6vw, 4.5rem)" }}>
          <h2
            style={{
              fontSize: "clamp(2rem, 5vw, 3.75rem)",
              lineHeight: 0.95,
              maxWidth: "20ch",
              margin: "0 auto var(--fdv-space-6)",
            }}
          >
            Algumas marcas que confiam no meu trabalho
          </h2>
          <p
            style={{
              fontSize: "clamp(0.875rem, 1.3vw, 1.0625rem)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "var(--fdv-text-muted)",
              maxWidth: "60ch",
              margin: "0 auto",
              lineHeight: 1.6,
              fontWeight: 400,
            }}
          >
            Cada parceria é pensada para gerar visibilidade real, conexão com o público e entrega que valoriza a marca.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            gap: "clamp(1.25rem, 3vw, 2.75rem)",
            maxWidth: "1000px",
            margin: "0 auto",
          }}
        >
          {brandLogos.map(({ src, alt }) => (
            <div
              key={src}
              style={{
                width: "clamp(120px, 22%, 200px)",
                aspectRatio: "16 / 10",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "clamp(0.5rem, 1vw, 1rem)",
              }}
            >
              <img
                src={src}
                alt={`Logo ${alt}`}
                style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", display: "block" }}
              />
            </div>
          ))}
        </div>
      </Section>

      {/* 07 — TRABALHO EM AÇÃO */}
      <Section eyebrow="07 / TRABALHO EM AÇÃO" noTitle>
        <div style={{ textAlign: "center", marginBottom: "clamp(2.5rem, 6vw, 4.5rem)" }}>
          <h2
            style={{
              fontSize: "clamp(2rem, 5vw, 3.75rem)",
              lineHeight: 0.95,
              maxWidth: "22ch",
              margin: "0 auto var(--fdv-space-6)",
            }}
          >
            Quer ver meu trabalho em ação?
          </h2>
          <p
            style={{
              fontSize: "clamp(0.875rem, 1.3vw, 1.0625rem)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "var(--fdv-text-muted)",
              maxWidth: "60ch",
              margin: "0 auto",
              lineHeight: 1.6,
              fontWeight: 400,
            }}
          >
            Acesse os links abaixo e veja como entrego resultado real para marcas
          </p>
        </div>

        <div className="fdv-reels-grid">
          {reels.map((r, i) => (
            <a
              key={`${r.url}-${i}`}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="fdv-reel-card"
              aria-label={r.alt}
            >
              <img
                src={r.thumb}
                alt={r.alt}
                loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </a>
          ))}
        </div>
      </Section>

      {/* 08 — FORMATOS */}
      <Section
        eyebrow="08 / PARCERIAS"
        title="Muito além de uma publi"
        description="Entrego arte, verdade e conexão real. Os 5 pilares de qualquer parceria comigo:"
      >
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          {pillars.map((p) => (
            <div key={p.title} className="fdv-card">
              <h3 style={{ fontSize: "var(--fdv-text-lg)" }} className="mb-2">{p.title}</h3>
              <p className="text-xs" style={{ color: "var(--fdv-text-muted)", lineHeight: 1.4 }}>
                {p.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="text-sm font-bold uppercase tracking-wider mt-8 mb-3" style={{ color: "var(--fdv-text-muted)" }}>
          Formatos criativos disponíveis
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {formats.map((f, i) => (
            <div
              key={f.name}
              className="fdv-card flex items-baseline gap-3"
              style={{ padding: "var(--fdv-space-3) var(--fdv-space-4)" }}
            >
              <code style={{ fontSize: 11, minWidth: 24 }}>{String(i + 1).padStart(2, "0")}</code>
              <div>
                <div style={{ fontFamily: "var(--fdv-font-display)", fontSize: "var(--fdv-text-base)", letterSpacing: "-0.02em", textTransform: "uppercase" }}>
                  {f.name}
                </div>
                <div className="text-xs mt-1" style={{ color: "var(--fdv-text-muted)" }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* 09 — GALERIA */}
      <Section
        eyebrow="09 / PORTFÓLIO"
        title="Reflexos do meu trabalho"
        description="Recorte de obras, instalações e bastidores recentes."
      >
        <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
          {gallery.map((src, i) => (
            <div
              key={src}
              className="fdv-card"
              style={{
                padding: 0,
                overflow: "hidden",
                aspectRatio: i === 0 ? "1 / 1" : "3 / 4",
              }}
            >
              <img
                src={src}
                alt={`Trabalho ${i + 1}`}
                loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </div>
          ))}
        </div>
      </Section>

      {/* 10 — CONTATO */}
      <footer className="fdv-section">
        <div className="max-w-6xl mx-auto px-6 w-full">
          <div className="fdv-section-eyebrow">10 / CONTATO</div>
          <h2 style={{ fontSize: "clamp(2.5rem, 8vw, 6rem)", lineHeight: 0.9 }} className="mb-12">
            E AÍ, VAMOS<br />
            TRABALHAR JUNTOS?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            <div className="fdv-card">
              <div className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: "var(--fdv-text-muted)" }}>
                WhatsApp
              </div>
              <a
                href="https://wa.me/5534996558202"
                style={{ fontFamily: "var(--fdv-font-display)", fontSize: "var(--fdv-text-xl)", letterSpacing: "-0.02em", color: "currentColor", textDecoration: "none" }}
              >
                (34) 99655-8202
              </a>
            </div>
            <div className="fdv-card">
              <div className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: "var(--fdv-text-muted)" }}>
                Email
              </div>
              <a
                href="mailto:fidevidraceiro@futurah.co"
                style={{ fontFamily: "var(--fdv-font-display)", fontSize: "var(--fdv-text-base)", letterSpacing: "-0.02em", color: "currentColor", textDecoration: "none", wordBreak: "break-all" }}
              >
                fidevidraceiro@futurah.co
              </a>
            </div>
            <div className="fdv-card">
              <div className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: "var(--fdv-text-muted)" }}>
                Instagram / TikTok / Kwai
              </div>
              <a
                href="https://instagram.com/fidevidraceiro"
                style={{ fontFamily: "var(--fdv-font-display)", fontSize: "var(--fdv-text-xl)", letterSpacing: "-0.02em", color: "currentColor", textDecoration: "none" }}
              >
                @fidevidraceiro
              </a>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <a href="https://instagram.com/fidevidraceiro" className="fdv-btn fdv-btn-vibrant">Instagram</a>
            <a href="https://tiktok.com/@fidevidraceiro" className="fdv-btn fdv-btn-primary">TikTok</a>
            <a href="https://www.kwai.com/@fidevidraceiro" className="fdv-btn fdv-btn-acid">Kwai</a>
            <a href="https://wa.me/5534996558202" className="fdv-btn fdv-btn-secondary">WhatsApp</a>
          </div>

          <div
            className="mt-16 pt-8 flex flex-col md:flex-row justify-between gap-4 items-start md:items-center"
            style={{ borderTop: "2px solid currentColor", opacity: 0.7 }}
          >
            <span style={{ fontFamily: "var(--fdv-font-display)", fontSize: "var(--fdv-text-base)", letterSpacing: "-0.02em", textTransform: "uppercase" }}>
              @fidevidraceiro
            </span>
            <div className="text-sm" style={{ color: "var(--fdv-text-muted)" }}>
              Mídia Kit 2026 — Augusto Felipe
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
