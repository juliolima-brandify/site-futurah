"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Boldonse } from "next/font/google";
import {
  ATIVACAO,
  BYD_BLUE,
  CAPA,
  CONDICOES,
  EXPERIENCES,
  FECHAMENTO,
  MIDIA_KIT,
  SOBRE,
} from "./proposta-data";

// Fonte display dos títulos (Google Fonts), usada em caixa alta — mesma do
// deck da Sessão Estratégica, pra manter a assinatura visual do Augusto.
const boldonse = Boldonse({ subsets: ["latin"], weight: "400", display: "swap" });

// -----------------------------------------------------------------------------
// Deck da PROPOSTA COMERCIAL Augusto Felipe × BYD (Festival Interlagos 2026).
// Navegação VERTICAL, 1 seção por tela, scroll-snap. Setas ↑↓ / Espaço / scroll.
// CSS de @media print (idêntico ao SessionDeck) → exporta 1 slide por página no
// "Salvar como PDF" do Chrome.
// -----------------------------------------------------------------------------

const SECTION_LABELS = [
  "Capa",
  "Quem assina",
  "Mídia Kit",
  "Ativação Digital",
  "Art Experiences",
  "Condições",
  "Fechamento",
];

export default function PropostaDeck() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const goTo = useCallback((idx: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(SECTION_LABELS.length - 1, idx));
    el.scrollTo({ top: clamped * el.clientHeight, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setActive(Math.round(el.scrollTop / el.clientHeight));
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = scrollerRef.current;
      if (!el) return;
      const current = Math.round(el.scrollTop / el.clientHeight);
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        goTo(current + 1);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        goTo(current - 1);
      } else if (e.key === "Home") {
        e.preventDefault();
        goTo(0);
      } else if (e.key === "End") {
        e.preventDefault();
        goTo(SECTION_LABELS.length - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo]);

  const total = SECTION_LABELS.length;

  return (
    <div
      className="proposta-deck-root relative h-screen w-screen overflow-hidden bg-neutral-950 text-neutral-100"
      style={{ "--byd": BYD_BLUE } as React.CSSProperties}
    >
      <style jsx global>{`
        @media print {
          @page {
            size: 1440px 900px;
            margin: 0;
          }
          html,
          body {
            margin: 0 !important;
            background: #0a0a0a !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .proposta-deck-root {
            height: auto !important;
            width: 100% !important;
            overflow: visible !important;
          }
          .proposta-deck-topbar,
          .proposta-deck-progress,
          .proposta-deck-hint {
            display: none !important;
          }
          .proposta-deck-scroller {
            height: auto !important;
            overflow: visible !important;
            scroll-behavior: auto !important;
            scroll-snap-type: none !important;
          }
          .proposta-deck-scroller > section {
            height: 100vh !important;
            min-height: 100vh !important;
            align-items: center !important;
            break-after: page;
            page-break-after: always;
            scroll-snap-align: none !important;
          }
          .proposta-deck-scroller > section:last-child {
            break-after: auto;
            page-break-after: auto;
          }
        }
      `}</style>

      {/* Top bar: marca + progress */}
      <header className="proposta-deck-topbar pointer-events-none fixed inset-x-0 top-0 z-30 flex items-center justify-between px-6 py-4 text-xs text-neutral-400">
        <span className="font-semibold uppercase tracking-[0.18em]">
          Augusto Felipe × BYD · Proposta Comercial
        </span>
        <span className="tabular-nums">
          {String(active + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          <span className="ml-2 hidden text-neutral-500 sm:inline">
            · {SECTION_LABELS[active]}
          </span>
        </span>
      </header>

      {/* Side progress dots */}
      <nav className="proposta-deck-progress fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-2.5 md:flex">
        {SECTION_LABELS.map((label, i) => (
          <button
            key={label}
            onClick={() => goTo(i)}
            aria-label={`Ir para ${label}`}
            title={label}
            className={[
              "h-2.5 w-2.5 rounded-full transition-all",
              i === active
                ? "scale-125 bg-amber-400"
                : "bg-neutral-700 hover:bg-neutral-500",
            ].join(" ")}
          />
        ))}
      </nav>

      {/* Hint */}
      <div className="proposta-deck-hint pointer-events-none fixed bottom-6 left-1/2 z-20 -translate-x-1/2 animate-pulse text-neutral-600">
        {active < total - 1 ? "↓" : ""}
      </div>

      {/* Scroller */}
      <div
        ref={scrollerRef}
        className="proposta-deck-scroller h-full w-full overflow-y-scroll scroll-smooth md:snap-y md:snap-mandatory"
      >
        <CapaSection />
        <SobreSection />
        <MidiaKitSection />
        <AtivacaoSection />
        <ExperiencesSection />
        <CondicoesSection />
        <FechamentoSection />
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Building blocks
// -----------------------------------------------------------------------------

function Section({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={[
        "flex min-h-screen w-full snap-start items-start justify-center px-6 py-16 md:h-screen md:items-center md:py-20",
        className,
      ].join(" ")}
    >
      <div className="mx-auto w-full max-w-3xl">{children}</div>
    </section>
  );
}

function Kicker({
  children,
  color = "text-amber-400",
}: {
  children: ReactNode;
  color?: string;
}) {
  return (
    <p
      className={`mb-4 text-xs font-semibold uppercase tracking-[0.2em] ${color}`}
    >
      {children}
    </p>
  );
}

function Title({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={`${boldonse.className} text-[1.5rem] uppercase leading-[1.5] text-white md:text-[2.25rem] ${className}`}
    >
      {children}
    </h2>
  );
}

// Wordmark BYD (SVG branco) — reusável nas seções da montadora.
function BydLogo({ className = "" }: { className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src="/proposta-byd/byd-logo.svg"
      alt="BYD"
      className={className}
    />
  );
}

// -----------------------------------------------------------------------------
// 1 · Capa
// -----------------------------------------------------------------------------

function CapaSection() {
  return (
    <section
      className="relative flex w-screen snap-start items-center justify-center overflow-hidden bg-black"
      style={{ height: "100vh" }}
    >
      {/* Glow radial de fundo (Augusto amber × BYD blue) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 30% 20%, rgba(251,191,36,0.12), transparent 70%), radial-gradient(55% 45% at 75% 85%, rgba(46,155,255,0.16), transparent 70%)",
        }}
      />
      <div className="relative z-10 mx-auto max-w-3xl px-8 text-center">
        <p className="mb-6 text-xs font-semibold uppercase tracking-[0.25em] text-amber-400">
          {CAPA.kicker}
        </p>

        {/* Lockup co-branding: Augusto × BYD */}
        <div className="flex items-center justify-center gap-5 sm:gap-8">
          <span
            className={`${boldonse.className} text-lg uppercase leading-tight text-white sm:text-2xl`}
          >
            Augusto
            <br />
            Felipe
          </span>
          <span className="text-2xl font-light text-neutral-500 sm:text-4xl">
            ×
          </span>
          <BydLogo className="h-7 w-auto sm:h-10" />
        </div>

        <h1
          className={`${boldonse.className} mt-10 text-[1.75rem] uppercase leading-[1.4] text-white sm:text-[2.75rem]`}
        >
          {CAPA.evento}
        </h1>

        <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-1.5 text-[12px] font-semibold uppercase tracking-[0.2em] text-amber-300">
          {CAPA.selo}
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// 2 · Quem assina a arte (Fi de Vidraceiro)
// -----------------------------------------------------------------------------

function SobreSection() {
  return (
    <Section className="bg-neutral-900">
      <div className="grid items-center gap-8 md:grid-cols-[auto,1fr]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={SOBRE.avatar}
          alt="Augusto Felipe"
          className="h-28 w-28 rounded-2xl object-cover ring-2 ring-amber-400/60 md:h-40 md:w-40"
        />
        <div>
          <Kicker>{SOBRE.kicker}</Kicker>
          <Title>{SOBRE.titulo}</Title>
          <div className="mt-6 space-y-4">
            {SOBRE.paragrafos.map((p, i) => (
              <p
                key={i}
                className="text-[15px] leading-relaxed text-neutral-300"
              >
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

// -----------------------------------------------------------------------------
// 3 · Mídia Kit — alcance
// -----------------------------------------------------------------------------

function MidiaKitSection() {
  return (
    <Section>
      <Kicker>{MIDIA_KIT.kicker}</Kicker>
      <Title>{MIDIA_KIT.titulo}</Title>

      {/* Destaques grandes */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {MIDIA_KIT.destaques.map((d) => (
          <div
            key={d.label}
            className="rounded-2xl border border-neutral-800 bg-neutral-900/60 px-6 py-7 text-center"
          >
            <div className="text-4xl font-extrabold tracking-tight text-amber-400 sm:text-5xl">
              {d.valor}
            </div>
            <div className="mt-1.5 text-[13px] uppercase tracking-wider text-neutral-500">
              {d.label}
            </div>
          </div>
        ))}
      </div>

      {/* Breakdown por plataforma */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        {MIDIA_KIT.plataformas.map((p) => (
          <div
            key={p.nome}
            className="rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-4 text-center"
          >
            <div className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">
              {p.valor}
            </div>
            <div className="mt-0.5 text-[12px] text-neutral-500">{p.nome}</div>
          </div>
        ))}
      </div>

      <p className="mt-6 text-[13.5px] text-neutral-400">
        <span className="font-semibold uppercase tracking-wider text-amber-400">
          Público principal:{" "}
        </span>
        {MIDIA_KIT.publico}
      </p>
    </Section>
  );
}

// -----------------------------------------------------------------------------
// 4 · Ativação Digital
// -----------------------------------------------------------------------------

function AtivacaoSection() {
  return (
    <Section className="bg-neutral-900">
      <div className="mb-4 flex items-center gap-3">
        <BydLogo className="h-5 w-auto opacity-90" />
      </div>
      <Kicker color="text-[color:var(--byd)]">{ATIVACAO.kicker}</Kicker>
      <Title>{ATIVACAO.titulo}</Title>

      <div className="mt-8 space-y-3">
        {ATIVACAO.itens.map((it) => (
          <div
            key={it.item}
            className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-950 px-5 py-4"
          >
            <span className="text-[15px] font-semibold text-white">
              {it.item}
            </span>
            <span className="text-[15px] font-bold text-neutral-300">
              {it.valor}
            </span>
          </div>
        ))}
      </div>

      {/* Combo destacado com o azul BYD */}
      <div
        className="mt-4 flex flex-col items-center justify-between gap-2 rounded-2xl border px-5 py-5 text-center sm:flex-row sm:text-left"
        style={{
          borderColor: "rgba(46,155,255,0.4)",
          background: "rgba(46,155,255,0.10)",
        }}
      >
        <span
          className="text-[12px] font-bold uppercase tracking-[0.15em]"
          style={{ color: BYD_BLUE }}
        >
          {ATIVACAO.combo.label}
        </span>
        <span className="flex items-baseline gap-3">
          <span className="relative text-[15px] font-semibold text-neutral-500">
            {ATIVACAO.combo.de}
            <span
              aria-hidden
              className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-red-500"
            />
          </span>
          <span
            className="text-2xl font-extrabold tracking-tight sm:text-3xl"
            style={{ color: BYD_BLUE }}
          >
            {ATIVACAO.combo.por}
          </span>
        </span>
      </div>
    </Section>
  );
}

// -----------------------------------------------------------------------------
// 5 · BYD Art Experiences — escada de valor
// -----------------------------------------------------------------------------

function ExperiencesSection() {
  return (
    <Section>
      <div className="mb-4 flex items-center gap-3">
        <BydLogo className="h-5 w-auto opacity-90" />
      </div>
      <Kicker color="text-[color:var(--byd)]">{EXPERIENCES.kicker}</Kicker>
      <Title>{EXPERIENCES.titulo}</Title>
      <p className="mt-4 max-w-2xl text-[14px] leading-relaxed text-neutral-400">
        {EXPERIENCES.subtitulo}
      </p>

      <div className="mt-7 grid gap-3.5 md:grid-cols-3">
        {EXPERIENCES.planos.map((p) => (
          <div
            key={p.nome}
            className="relative flex flex-col rounded-2xl border p-5"
            style={
              p.destaque
                ? {
                    borderColor: "rgba(46,155,255,0.5)",
                    background: "rgba(46,155,255,0.08)",
                  }
                : { borderColor: "rgb(38,38,38)", background: "rgba(23,23,23,0.5)" }
            }
          >
            {p.destaque && (
              <span
                className="absolute -top-2.5 left-5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-black"
                style={{ background: BYD_BLUE }}
              >
                Experiência máxima
              </span>
            )}
            <h3 className="text-[15px] font-bold leading-tight text-white">
              {p.nome}
            </h3>
            <p className="mt-1.5 flex-1 text-[13px] leading-relaxed text-neutral-400">
              {p.descricao}
            </p>
            <p className="mt-3 text-[12px] font-medium uppercase tracking-wider text-neutral-500">
              {p.entrega}
            </p>
            <div
              className="mt-3 text-2xl font-extrabold tracking-tight sm:text-[1.75rem]"
              style={{ color: p.destaque ? BYD_BLUE : "#fff" }}
            >
              {p.preco}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

// -----------------------------------------------------------------------------
// 6 · Condições comerciais
// -----------------------------------------------------------------------------

function CondicoesSection() {
  return (
    <Section className="bg-neutral-900">
      <Kicker>{CONDICOES.kicker}</Kicker>
      <Title>{CONDICOES.titulo}</Title>
      <ul className="mt-8 space-y-4">
        {CONDICOES.itens.map((it, i) => (
          <li
            key={i}
            className="flex gap-4 rounded-xl border border-neutral-800 bg-neutral-950 px-5 py-4 text-[15px] leading-relaxed text-neutral-200"
          >
            <span className="text-lg font-extrabold tabular-nums text-amber-500/70">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </Section>
  );
}

// -----------------------------------------------------------------------------
// 7 · Fechamento / CTA
// -----------------------------------------------------------------------------

function FechamentoSection() {
  return (
    <section
      className="relative flex min-h-screen w-full snap-start items-center justify-center overflow-hidden px-6 py-16 md:h-screen md:py-20"
      style={{ background: "#0a0a0a" }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 45% at 50% 30%, rgba(46,155,255,0.14), transparent 70%)",
        }}
      />
      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <Kicker>{FECHAMENTO.kicker}</Kicker>
        <Title className="!text-[1.75rem] md:!text-[2.5rem]">
          {FECHAMENTO.titulo}
        </Title>
        <div className="mt-10 flex items-center justify-center gap-5">
          <span
            className={`${boldonse.className} text-sm uppercase text-white sm:text-lg`}
          >
            Augusto Felipe
          </span>
          <span className="text-xl font-light text-neutral-500">×</span>
          <BydLogo className="h-6 w-auto sm:h-8" />
        </div>
        <p className="mt-8 text-[15px] text-neutral-400">
          {FECHAMENTO.contato}
        </p>
      </div>
    </section>
  );
}
