import { Space_Grotesk, Archivo_Black } from "next/font/google";
import { SectionCounter } from "../SectionCounter";
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

const press = [
  `${IMG}/page03_img01.png`,
  `${IMG}/page03_img02.png`,
  `${IMG}/page03_img05.png`,
  `${IMG}/page03_img06.png`,
  `${IMG}/page03_img07.png`,
  `${IMG}/page03_img08.png`,
  `${IMG}/page03_img03.png`,
  `${IMG}/page03_img04.png`,
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
  `${IMG}/page06_img01.png`,
  `${IMG}/page06_img02.png`,
  `${IMG}/page06_img07.png`,
  `${IMG}/page06_img08.png`,
  `${IMG}/page06_img09.png`,
  `${IMG}/page06_img13.png`,
  `${IMG}/page06_img03.png`,
];

const campaignPrints = [
  `${IMG}/page06_img10.png`,
  `${IMG}/page06_img11.png`,
  `${IMG}/page06_img12.png`,
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

/* =========================================================
   PÁGINA
   ========================================================= */

export default function MidiaKit() {
  return (
    <div className={`fdv-root fdv-snap-container ${grotesk.variable} ${archivoBlack.variable}`}>
      <SectionCounter />

      {/* 01 — CAPA */}
      <header className="fdv-section" style={{ position: "relative" }}>
        <div className="max-w-6xl mx-auto px-6 w-full">
          <div className="flex items-center justify-between mb-12">
            <span className="fdv-badge">@FIDEVIDRACEIRO</span>
            <span className="fdv-badge fdv-badge-orange">MÍDIA KIT 2026</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7">
              <h1 style={{ fontSize: "clamp(3rem, 10vw, 8rem)", lineHeight: 0.88, marginBottom: "var(--fdv-space-6)" }}>
                AUGUSTO<br />
                <span style={{ background: "var(--fdv-orange-500)", padding: "0 0.08em" }}>FELIPE</span>
              </h1>
              <p style={{ fontSize: "var(--fdv-text-lg)", maxWidth: "44ch", color: "var(--fdv-text-muted)" }}>
                Vidro vira arte. Construção vira conteúdo. Bastidor vira show.
              </p>
            </div>
            <div className="md:col-span-5">
              <img
                src={`${IMG}/page01_img01.png`}
                alt="Augusto Felipe"
                style={{
                  width: "100%",
                  aspectRatio: "3 / 4",
                  objectFit: "cover",
                  border: "2px solid var(--fdv-primary-900)",
                  borderRadius: "var(--fdv-radius-md)",
                  boxShadow: "var(--fdv-shadow-md)",
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
                    fontFamily: "var(--fdv-font-display)",
                    fontSize: "var(--fdv-text-base)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    borderRadius: "var(--fdv-radius-sm)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {p.code}
                </span>
                <span className="text-sm font-bold uppercase tracking-wider">{p.name}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div style={{ fontFamily: "var(--fdv-font-display)", fontSize: "var(--fdv-text-2xl)", letterSpacing: "-0.03em", lineHeight: 1 }}>
                    {p.followers}
                  </div>
                  <div className="text-xs uppercase tracking-wider mt-1" style={{ color: "var(--fdv-primary-500)" }}>Seguidores</div>
                </div>
                <div>
                  <div style={{ fontFamily: "var(--fdv-font-display)", fontSize: "var(--fdv-text-2xl)", letterSpacing: "-0.03em", lineHeight: 1 }}>
                    {p.monthly}
                  </div>
                  <div className="text-xs uppercase tracking-wider mt-1" style={{ color: "var(--fdv-primary-500)" }}>Alcance/mês</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* 04 — IMPRENSA */}
      <Section
        eyebrow="03 / IMPRENSA"
        title="Saiba mais nas matérias"
        description="Reportagens em portais de negócios, telejornais e veículos regionais."
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {press.map((src) => (
            <div
              key={src}
              className="fdv-card"
              style={{ padding: 0, overflow: "hidden", aspectRatio: "16 / 10" }}
            >
              <img
                src={src}
                alt="Matéria de imprensa"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </div>
          ))}
        </div>
      </Section>

      {/* 05 — PÚBLICO */}
      <Section
        eyebrow="04 / PÚBLICO-ALVO"
        title="Quem assiste"
        description="Recorte agregado dos canais principais. Maioria adulto-jovem, urbano, com forte presença Sudeste."
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Gênero */}
          <div className="fdv-card">
            <div className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: "var(--fdv-text-muted)" }}>Gênero</div>
            <div className="space-y-4">
              {audience.gender.map((g) => (
                <div key={g.label}>
                  <div style={{ fontFamily: "var(--fdv-font-display)", fontSize: "var(--fdv-text-3xl)", letterSpacing: "-0.03em", lineHeight: 1, color: "var(--fdv-orange-500)" }}>
                    {g.pct}%
                  </div>
                  <div className="text-sm font-bold uppercase tracking-wider mt-1">{g.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Cidades */}
          <div className="fdv-card">
            <div className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: "var(--fdv-text-muted)" }}>Principais cidades</div>
            <ol className="space-y-3">
              {audience.cities.map((c, i) => (
                <li key={c} className="flex items-baseline gap-3">
                  <code style={{ fontSize: 11, minWidth: 22 }}>{String(i + 1).padStart(2, "0")}</code>
                  <span style={{ fontFamily: "var(--fdv-font-display)", fontSize: "var(--fdv-text-lg)", letterSpacing: "-0.02em", textTransform: "uppercase" }}>
                    {c}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {/* Idades */}
          <div className="fdv-card">
            <div className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: "var(--fdv-text-muted)" }}>Principais idades</div>
            <ul className="space-y-2">
              {audience.ages.map((a, i) => (
                <li
                  key={a}
                  className="flex items-center gap-3 py-2"
                  style={{ borderBottom: i < audience.ages.length - 1 ? "1px solid var(--fdv-primary-200)" : "none" }}
                >
                  <span style={{ width: 24, height: 8, background: "var(--fdv-orange-500)", flexShrink: 0, borderRadius: 1 }} />
                  <span className="text-sm font-medium uppercase tracking-wider">{a}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* 06 — INTERESSES + CONTEÚDO */}
      <Section
        eyebrow="05 / CONTEÚDO"
        title="Interesses do público & temas que abordo"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: "var(--fdv-text-muted)" }}>
              Interesses do meu público
            </div>
            <div className="flex flex-wrap gap-2">
              {interests.map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontFamily: "var(--fdv-font-display)",
                    fontSize: "var(--fdv-text-xl)",
                    textTransform: "uppercase",
                    letterSpacing: "-0.02em",
                    background: "var(--fdv-orange-500)",
                    color: "var(--fdv-primary-900)",
                    padding: "var(--fdv-space-2) var(--fdv-space-4)",
                    borderRadius: "var(--fdv-radius-md)",
                    border: "2px solid var(--fdv-primary-900)",
                    boxShadow: "var(--fdv-shadow-sm)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: "var(--fdv-text-muted)" }}>
              Tipos de conteúdos e temas que abordo
            </div>
            <ul className="space-y-2">
              {contentTypes.map((t, i) => (
                <li
                  key={t}
                  className="fdv-card"
                  style={{
                    padding: "var(--fdv-space-3) var(--fdv-space-4)",
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--fdv-space-3)",
                  }}
                >
                  <code style={{ fontSize: 11, minWidth: 22 }}>{String(i + 1).padStart(2, "0")}</code>
                  <span style={{ fontFamily: "var(--fdv-font-display)", fontSize: "var(--fdv-text-base)", letterSpacing: "-0.02em", textTransform: "uppercase" }}>
                    {t}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* 07 — MARCAS */}
      <Section
        eyebrow="06 / MARCAS"
        title="Algumas marcas que confiam no meu trabalho"
        description="Cada parceria é pensada pra gerar visibilidade real, conexão com o público e entrega que valoriza a marca."
      >
        {/* Logos */}
        <div className="grid grid-cols-3 md:grid-cols-7 gap-3 mb-6">
          {brandLogos.map((src) => (
            <div
              key={src}
              className="fdv-card flex items-center justify-center"
              style={{
                background: "var(--fdv-bg)",
                aspectRatio: "1 / 1",
                padding: "var(--fdv-space-3)",
              }}
            >
              <img
                src={src}
                alt="Logo de marca parceira"
                style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", display: "block" }}
              />
            </div>
          ))}
        </div>

        {/* Prints de campanhas */}
        <div>
          <div className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: "var(--fdv-text-muted)" }}>
            Quer ver meu trabalho em ação?
          </div>
          <div className="grid grid-cols-3 gap-3">
            {campaignPrints.map((src) => (
              <div
                key={src}
                className="fdv-card"
                style={{ padding: 0, overflow: "hidden", aspectRatio: "9 / 16" }}
              >
                <img
                  src={src}
                  alt="Print de campanha"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* 08 — FORMATOS */}
      <Section
        eyebrow="07 / PARCERIAS"
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
        eyebrow="08 / PORTFÓLIO"
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
          <div className="fdv-section-eyebrow">09 / CONTATO</div>
          <h2 style={{ fontSize: "clamp(2.5rem, 8vw, 6rem)", lineHeight: 0.9 }} className="mb-12">
            E AÍ, VAMOS<br />
            <span style={{ background: "var(--fdv-orange-500)", padding: "0 0.08em" }}>TRABALHAR JUNTOS</span>?
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
                href="mailto:fidevidraceiro@outlook.com"
                style={{ fontFamily: "var(--fdv-font-display)", fontSize: "var(--fdv-text-base)", letterSpacing: "-0.02em", color: "currentColor", textDecoration: "none", wordBreak: "break-all" }}
              >
                fidevidraceiro@outlook.com
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
