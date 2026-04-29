import { Space_Grotesk, Archivo_Black } from "next/font/google";
import { SectionCounter } from "./SectionCounter";
import "./styles.css";

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
  title: "Fi de Vidraceiro — Design System",
};

const palette = {
  primary: ["0", "50", "100", "200", "300", "400", "500", "700", "900"],
  orange: ["50", "100", "300", "500", "600", "700", "900"],
  acid: ["50", "100", "300", "500", "700", "900"],
};

const typeScale = [
  { name: "Display 5xl", varName: "--fdv-text-5xl", sample: "VIRAL", font: "var(--fdv-font-display)" },
  { name: "Display 4xl", varName: "--fdv-text-4xl", sample: "FILHO DE VIDRACEIRO", font: "var(--fdv-font-display)" },
  { name: "Display 3xl", varName: "--fdv-text-3xl", sample: "ARTISTA NA INTERNET", font: "var(--fdv-font-display)" },
  { name: "Display 2xl", varName: "--fdv-text-2xl", sample: "Direto da fábrica de conteúdo", font: "var(--fdv-font-display)" },
  { name: "Body xl",     varName: "--fdv-text-xl",  sample: "Lead — abre parágrafos com peso.", font: "var(--fdv-font-sans)" },
  { name: "Body lg",     varName: "--fdv-text-lg",  sample: "Subhead que sustenta a leitura.", font: "var(--fdv-font-sans)" },
  { name: "Body base",   varName: "--fdv-text-base",sample: "Texto corrente do site, descrições e cards.", font: "var(--fdv-font-sans)" },
  { name: "Body sm",     varName: "--fdv-text-sm",  sample: "Apoio, captions, legendas.", font: "var(--fdv-font-sans)" },
  { name: "Mono xs",     varName: "--fdv-text-xs",  sample: "01 / 02 / 03 — METADADOS", font: "var(--fdv-font-mono)" },
];

const spacingScale = [
  { name: "1", value: "4px", varName: "--fdv-space-1" },
  { name: "2", value: "8px", varName: "--fdv-space-2" },
  { name: "3", value: "12px", varName: "--fdv-space-3" },
  { name: "4", value: "16px", varName: "--fdv-space-4" },
  { name: "6", value: "24px", varName: "--fdv-space-6" },
  { name: "8", value: "32px", varName: "--fdv-space-8" },
  { name: "12", value: "48px", varName: "--fdv-space-12" },
  { name: "16", value: "64px", varName: "--fdv-space-16" },
  { name: "24", value: "96px", varName: "--fdv-space-24" },
];

const radiusScale = [
  { name: "sm",   value: "2px",    varName: "--fdv-radius-sm" },
  { name: "md",   value: "4px",    varName: "--fdv-radius-md" },
  { name: "lg",   value: "8px",    varName: "--fdv-radius-lg" },
  { name: "full", value: "9999px", varName: "--fdv-radius-full" },
];

const shadows = [
  { name: "sm", varName: "--fdv-shadow-sm" },
  { name: "md", varName: "--fdv-shadow-md" },
  { name: "lg", varName: "--fdv-shadow-lg" },
];

function Swatch({ varName, label, dark }: { varName: string; label: string; dark?: boolean }) {
  return (
    <div
      className="fdv-swatch"
      style={{ background: `var(${varName})`, color: dark ? "white" : "var(--fdv-primary-900)" }}
    >
      <div className="fdv-swatch-meta">{label}</div>
    </div>
  );
}

function Section({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="fdv-section">
      <div className="max-w-6xl mx-auto px-6">
        <div className="fdv-section-eyebrow">{eyebrow}</div>
        <h2 style={{ fontSize: "var(--fdv-text-2xl)" }} className="mb-3">
          {title}
        </h2>
        {description && (
          <p className="max-w-2xl mb-8" style={{ color: "var(--fdv-text-muted)", fontSize: "var(--fdv-text-base)" }}>
            {description}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}

export default function FiDeVidraceiroDesignSystem() {
  return (
    <div className={`fdv-root fdv-snap-container ${grotesk.variable} ${archivoBlack.variable}`}>
      <SectionCounter />

      {/* HERO */}
      <header className="fdv-section" style={{ position: "relative" }}>
        <div className="max-w-6xl mx-auto px-6 w-full">
          <div className="flex items-center justify-between mb-12">
            <div className="fdv-logo">
              <span className="fdv-logo-mark" />
              <span>Fi de Vidraceiro</span>
            </div>
            <span className="fdv-badge fdv-badge-acid">v0.2 — REWORK</span>
          </div>
          <h1 style={{ fontSize: "clamp(3rem, 9vw, 7.5rem)", maxWidth: "14ch", marginBottom: "var(--fdv-space-6)" }}>
            FILHO DE VIDRACEIRO. <span style={{ background: "var(--fdv-orange-500)", padding: "0 0.1em" }}>ARTISTA</span> NA INTERNET.
          </h1>
          <p style={{ fontSize: "var(--fdv-text-lg)", maxWidth: "60ch", color: "var(--fdv-text-muted)" }}>
            Sistema visual de um <strong>creator</strong> que vive na linha entre arte e produção de conteúdo. Grotesco, direto, anti-corporativo. Pra quem fala como gente, não como marca.
          </p>
        </div>
        <div className="fdv-scroll-hint">↓ Scroll</div>
      </header>

      {/* MARCA */}
      <Section eyebrow="01 / MARCA" title="Logotipo" description="Wordmark em Archivo Black + bloco preto sólido. Sem ornamento, sem gradient. A identidade é o peso da tipografia.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="fdv-card flex items-center justify-center" style={{ minHeight: 200 }}>
            <div className="fdv-logo" style={{ fontSize: "var(--fdv-text-2xl)" }}>
              <span className="fdv-logo-mark" style={{ width: 36, height: 36 }} />
              <span>Fi de Vidraceiro</span>
            </div>
          </div>
          <div className="fdv-card flex items-center justify-center" style={{ minHeight: 200, background: "var(--fdv-primary-900)", borderColor: "var(--fdv-primary-900)" }}>
            <div className="fdv-logo" style={{ fontSize: "var(--fdv-text-2xl)", color: "white" }}>
              <span className="fdv-logo-mark" style={{ width: 36, height: 36, background: "white" }} />
              <span style={{ color: "white" }}>Fi de Vidraceiro</span>
            </div>
          </div>
        </div>
      </Section>

      {/* COR */}
      <Section eyebrow="02 / COR" title="Paleta" description="Preto/branco sólido como base. Laranja vibrante = cor da marca + CTA. Lima ácido = pop secundário, alto contraste, feature destacada.">
        <div className="space-y-8">
          <div>
            <div className="text-sm mb-3 font-bold uppercase tracking-wider" style={{ color: "var(--fdv-text-muted)" }}>Primary</div>
            <div className="grid grid-cols-5 md:grid-cols-9 gap-2">
              {palette.primary.map((s) => (
                <Swatch key={s} varName={`--fdv-primary-${s}`} label={s} dark={Number(s) >= 400} />
              ))}
            </div>
          </div>
          <div>
            <div className="text-sm mb-3 font-bold uppercase tracking-wider" style={{ color: "var(--fdv-text-muted)" }}>Orange — cor da marca</div>
            <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
              {palette.orange.map((s) => (
                <Swatch key={s} varName={`--fdv-orange-${s}`} label={s} dark={Number(s) >= 500} />
              ))}
            </div>
          </div>
          <div>
            <div className="text-sm mb-3 font-bold uppercase tracking-wider" style={{ color: "var(--fdv-text-muted)" }}>Acid — pop secundário</div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {palette.acid.map((s) => (
                <Swatch key={s} varName={`--fdv-acid-${s}`} label={s} dark={Number(s) >= 700} />
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* TIPOGRAFIA */}
      <Section eyebrow="03 / TIPOGRAFIA" title="Escala" description="Archivo Black (display, pôster, MAIÚSCULAS) + Space Grotesk (UI, body, todos os pesos). Mono de sistema pra metadados. Sem serif. Sem ornamento.">
        <div className="space-y-6">
          {typeScale.map((row) => (
            <div key={row.name} className="fdv-card flex flex-col md:flex-row md:items-baseline gap-4">
              <div className="md:w-44 shrink-0">
                <div className="text-sm font-bold uppercase tracking-wider">{row.name}</div>
                <code style={{ fontSize: 11 }}>{row.varName}</code>
              </div>
              <div
                style={{
                  fontSize: `var(${row.varName})`,
                  fontFamily: row.font,
                  lineHeight: 0.95,
                  color: "var(--fdv-primary-900)",
                  letterSpacing: row.font === "var(--fdv-font-display)" ? "-0.03em" : "-0.01em",
                  overflow: "hidden",
                }}
              >
                {row.sample}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* VOZ */}
      <Section eyebrow="04 / VOZ" title="Tom da marca" description="Como o Fi escreve, fala e responde. Funciona em legenda, vídeo e DM.">
        <div className="fdv-card" style={{ padding: "var(--fdv-space-12)" }}>
          <div className="fdv-voice mb-4">
            FALA COMO <em>GENTE</em>.<br />
            NÃO COMO MARCA.
          </div>
          <ul className="text-lg mt-8 space-y-3 max-w-2xl" style={{ color: "var(--fdv-text-muted)" }}>
            <li>→ Direto. Frase curta antes da longa.</li>
            <li>→ Sem jargão. Nada de "alavancar", "potencializar", "delivery".</li>
            <li>→ Honesto. Mostra processo, não só resultado.</li>
            <li>→ Brasileiro. Gíria quando faz sentido. Sem forçar.</li>
          </ul>
        </div>
      </Section>

      {/* BOTÕES */}
      <Section eyebrow="05 / COMPONENTES" title="Botões" description="Borda preta 2px + sombra hard. Ao apertar, o botão se desloca pra dentro da sombra (efeito mecânico). Cinco variantes de hierarquia.">
        <div className="fdv-card">
          <div className="flex flex-wrap gap-4 mb-6">
            <button className="fdv-btn fdv-btn-primary">Inscrever no canal</button>
            <button className="fdv-btn fdv-btn-vibrant">Comprar agora</button>
            <button className="fdv-btn fdv-btn-acid">Lista vip</button>
            <button className="fdv-btn fdv-btn-secondary">Saber mais</button>
            <button className="fdv-btn fdv-btn-ghost">Cancelar</button>
            <button className="fdv-btn fdv-btn-primary" disabled>Esgotado</button>
          </div>
          <div className="text-sm" style={{ color: "var(--fdv-primary-500)" }}>
            <code>.fdv-btn</code> + <code>-primary</code> | <code>-vibrant</code> | <code>-acid</code> | <code>-secondary</code> | <code>-ghost</code>
          </div>
        </div>
      </Section>

      {/* INPUTS */}
      <Section eyebrow="06 / COMPONENTES" title="Inputs" description="Borda 2px sólida. Focus = sombra hard aparece (sem ring suave).">
        <div className="fdv-card grid grid-cols-1 md:grid-cols-2 gap-6">
          <label className="block">
            <span className="text-sm font-bold block mb-2 uppercase tracking-wider">Email</span>
            <input type="email" className="fdv-input" placeholder="seu@email.com" />
          </label>
          <label className="block">
            <span className="text-sm font-bold block mb-2 uppercase tracking-wider">Como conheceu</span>
            <select className="fdv-select">
              <option>Indicação</option>
              <option>YouTube</option>
              <option>Instagram</option>
              <option>Amigo me obrigou</option>
            </select>
          </label>
          <label className="block md:col-span-2">
            <span className="text-sm font-bold block mb-2 uppercase tracking-wider">Manda aí</span>
            <textarea className="fdv-textarea" rows={3} placeholder="Conta o que você quer." />
          </label>
        </div>
      </Section>

      {/* CARDS + BADGES */}
      <Section eyebrow="07 / COMPONENTES" title="Cards & badges" description="Três variantes de card: claro, dark, acid. Badge em mono uppercase, cara de etiqueta de zine.">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="fdv-card">
            <span className="fdv-badge mb-3 inline-block">Toda quarta</span>
            <h3 style={{ fontSize: "var(--fdv-text-xl)" }} className="mb-2">Vídeo no YouTube</h3>
            <p style={{ color: "var(--fdv-primary-500)" }} className="text-sm mb-4">
              Ensaio em vídeo, formato longo, profundidade que feed nenhum entrega.
            </p>
            <button className="fdv-btn fdv-btn-secondary">Ver canal</button>
          </div>
          <div className="fdv-card" style={{ background: "var(--fdv-primary-900)", color: "white", borderColor: "var(--fdv-bg)" }}>
            <span className="fdv-badge fdv-badge-orange mb-3 inline-block">Drop limitado</span>
            <h3 style={{ fontSize: "var(--fdv-text-xl)", color: "white" }} className="mb-2">Workshop ao vivo</h3>
            <p style={{ color: "var(--fdv-primary-300)" }} className="text-sm mb-4">
              Encontros fechados pra quem quer destravar processo de conteúdo. Vagas em conta.
            </p>
            <button className="fdv-btn fdv-btn-vibrant">Entrar na lista</button>
          </div>
          <div className="fdv-card" style={{ background: "var(--fdv-acid-500)" }}>
            <span className="fdv-badge fdv-badge-outline mb-3 inline-block">Toda sexta</span>
            <h3 style={{ fontSize: "var(--fdv-text-xl)" }} className="mb-2">Newsletter</h3>
            <p style={{ color: "var(--fdv-primary-700)" }} className="text-sm mb-4">
              Texto direto na caixa de entrada. Bastidor + recomendação + 1 pergunta boa.
            </p>
            <button className="fdv-btn fdv-btn-primary">Assinar</button>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          <span className="fdv-badge">Default</span>
          <span className="fdv-badge fdv-badge-orange">Orange</span>
          <span className="fdv-badge fdv-badge-acid">Acid</span>
          <span className="fdv-badge fdv-badge-outline">Outline</span>
          <span className="fdv-badge fdv-badge-success">Success</span>
          <span className="fdv-badge fdv-badge-warning">Warning</span>
          <span className="fdv-badge fdv-badge-error">Error</span>
        </div>
      </Section>

      {/* ESPAÇAMENTO */}
      <Section eyebrow="08 / TOKENS" title="Espaçamento" description="Escala base-4. Sempre múltiplo dela em padding, gap e margin.">
        <div className="fdv-card space-y-3">
          {spacingScale.map((s) => (
            <div key={s.name} className="flex items-center gap-4">
              <div className="w-12 text-sm font-bold">{s.name}</div>
              <div style={{ width: s.value, height: 16, background: "var(--fdv-primary-900)" }} />
              <code style={{ fontSize: 11 }}>{s.value}</code>
              <code style={{ fontSize: 11, marginLeft: "auto", opacity: 0.6 }}>{s.varName}</code>
            </div>
          ))}
        </div>
      </Section>

      {/* RADIUS */}
      <Section eyebrow="09 / TOKENS" title="Radius" description="Bem reto. md = 4px. lg = 8px. Sem cantos moles — moldura de pôster.">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {radiusScale.map((r) => (
            <div key={r.name} className="fdv-card text-center">
              <div
                className="mx-auto mb-3"
                style={{ width: 80, height: 80, background: "var(--fdv-primary-900)", borderRadius: r.value }}
              />
              <div className="text-sm font-bold uppercase tracking-wider">{r.name}</div>
              <code style={{ fontSize: 11, opacity: 0.6 }}>{r.value}</code>
            </div>
          ))}
        </div>
      </Section>

      {/* SHADOWS */}
      <Section eyebrow="10 / TOKENS" title="Sombras" description="Hard shadow. Preto sólido, sem blur, deslocado em x e y. Estética de pôster, não de iOS.">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {shadows.map((s) => (
            <div key={s.name} className="text-center p-12" style={{ background: "var(--fdv-bg)" }}>
              <div
                className="mx-auto mb-6"
                style={{
                  width: 140, height: 100, background: "white",
                  border: "2px solid var(--fdv-primary-900)",
                  borderRadius: "var(--fdv-radius-md)",
                  boxShadow: `var(${s.varName})`,
                }}
              />
              <div className="text-sm font-bold uppercase tracking-wider">{s.name}</div>
              <code style={{ fontSize: 11, opacity: 0.6 }}>{s.varName}</code>
            </div>
          ))}
        </div>
      </Section>

      {/* FOOTER */}
      <footer className="fdv-section">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
          <div className="fdv-logo">
            <span className="fdv-logo-mark" />
            <span>Fi de Vidraceiro</span>
          </div>
          <div style={{ color: "var(--fdv-text-muted)", fontSize: "var(--fdv-text-sm)" }}>
            Design System v0.2 — tokens em <code>app/(prototipos)/fi-de-vidraceiro/styles.css</code>
          </div>
        </div>
      </footer>
    </div>
  );
}
