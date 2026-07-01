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
  AUGUSTO_LOGO,
  BYD_BLUE,
  CAPA,
  CONDICOES,
  EXPERIENCES,
  FECHAMENTO,
  MARCAS,
  MIDIA_KIT,
  PROVA,
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
  "Marcas",
  "Vídeos",
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
        <MarcasSection />
        <ProvaSection />
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

// Logo pessoal do Augusto Felipe (branco) — usado no lockup de co-branding.
function AugustoLogo({ className = "" }: { className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={AUGUSTO_LOGO}
      alt="Augusto Felipe · Fi de Vidraceiro"
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
      className="relative flex w-screen snap-start items-center overflow-hidden bg-black"
      style={{ height: "100vh" }}
    >
      {/* Foto do Fi de Vidraceiro em preto e branco */}
      <div
        className="absolute inset-0 bg-cover bg-no-repeat"
        style={{
          backgroundImage: `url('${CAPA.foto}')`,
          backgroundPosition: "72% center",
          filter: "grayscale(1) contrast(1.05) brightness(0.95)",
        }}
      />
      {/* Overlay escuro à esquerda pra o conteúdo respirar */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(0,0,0,0.94) 0%, rgba(0,0,0,0.78) 42%, rgba(0,0,0,0.35) 100%)",
        }}
      />
      {/* Leve realce da cor da marca sobre o P&B */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(50% 60% at 16% 32%, rgba(251,191,36,0.10), transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-5xl px-8 sm:px-16">
        <div className="max-w-xl text-left">
          <p className="mb-6 text-xs font-semibold uppercase tracking-[0.25em] text-amber-400">
            {CAPA.kicker}
          </p>

          {/* Lockup co-branding: Augusto × BYD */}
          <div className="flex items-center gap-6 sm:gap-8">
            <AugustoLogo className="h-11 w-auto sm:h-16" />
            <span className="text-2xl font-light text-neutral-400 sm:text-3xl">
              ×
            </span>
            <BydLogo className="h-6 w-auto sm:h-9" />
          </div>

          <h1
            className={`${boldonse.className} mt-9 text-[1.6rem] uppercase leading-[1.4] text-white sm:text-[2.6rem]`}
          >
            {CAPA.evento}
          </h1>

          <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-1.5 text-[12px] font-semibold uppercase tracking-[0.2em] text-amber-300">
            {CAPA.selo}
          </div>
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
    <section className="flex min-h-screen w-full snap-start items-center justify-center bg-neutral-900 px-6 py-16 md:h-screen md:py-20">
      <div className="mx-auto grid w-full max-w-5xl items-center gap-8 md:grid-cols-[minmax(0,0.9fr),1fr] md:gap-12">
        {/* Foto do Augusto (blazer de espelhos) */}
        <div className="relative overflow-hidden rounded-3xl ring-1 ring-neutral-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={SOBRE.foto}
            alt="Augusto Felipe — Fi de Vidraceiro"
            className="aspect-[4/5] w-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>

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
    </section>
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
      <p className="mt-4 max-w-2xl text-[14px] leading-relaxed text-amber-300">
        {MIDIA_KIT.crescimento}
      </p>

      {/* Destaques grandes */}
      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        {MIDIA_KIT.destaques.map((d) => (
          <div
            key={d.label}
            className="rounded-2xl border border-neutral-800 bg-neutral-900/60 px-6 py-6 text-center"
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

      {/* Breakdown por plataforma: seguidores + alcance mensal */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        {MIDIA_KIT.plataformas.map((p) => (
          <div
            key={p.nome}
            className="rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-4 text-center"
          >
            <div className="text-[12px] font-semibold uppercase tracking-wider text-neutral-400">
              {p.nome}
            </div>
            <div className="mt-2 text-xl font-extrabold tracking-tight text-white sm:text-2xl">
              {p.seguidores}
            </div>
            <div className="text-[11px] text-neutral-600">seguidores</div>
            <div className="mt-2 text-base font-bold tracking-tight text-amber-400">
              {p.alcance}
            </div>
            <div className="text-[11px] text-neutral-600">alcance</div>
          </div>
        ))}
      </div>

      <p className="mt-6 text-[13px] leading-relaxed text-neutral-400">
        <span className="font-semibold uppercase tracking-wider text-amber-400">
          Público:{" "}
        </span>
        {MIDIA_KIT.publico}
      </p>
    </Section>
  );
}

// -----------------------------------------------------------------------------
// 3.5 · Marcas — social proof em seção própria de fundo branco
// -----------------------------------------------------------------------------

function MarcasSection() {
  return (
    <section className="flex min-h-screen w-full snap-start items-center justify-center bg-white px-6 py-16 md:h-screen md:py-20">
      <div className="mx-auto w-full max-w-4xl text-center">
        <Kicker color="text-amber-600">{MARCAS.kicker}</Kicker>
        <Title className="!text-neutral-900">{MARCAS.titulo}</Title>
        <p className="mx-auto mt-4 max-w-xl text-[14px] leading-relaxed text-neutral-500">
          {MARCAS.descricao}
        </p>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-12 gap-y-9">
          {MARCAS.logos.map((m) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={m.alt}
              src={m.src}
              alt={m.alt}
              className="h-9 w-auto max-w-[140px] object-contain sm:h-11"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// 3.6 · Vídeos mais assistidos — reels de alcance comprovado
// -----------------------------------------------------------------------------

function ProvaSection() {
  return (
    <Section className="bg-neutral-900">
      <Kicker>{PROVA.kicker}</Kicker>
      <Title>{PROVA.titulo}</Title>
      <p className="mt-4 max-w-2xl text-[14px] leading-relaxed text-neutral-400">
        Conteúdo simples, feito do jeito certo, alcançando milhões — é esse
        sistema que entra na ativação da BYD.
      </p>

      <div className="mt-7 grid grid-cols-4 gap-2.5">
        {PROVA.reels.map((r, i) => (
          <div
            key={i}
            className="relative aspect-[3/4] overflow-hidden rounded-lg border border-neutral-800 bg-neutral-950"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={r.thumb}
              alt={`Reel — ${r.views} views`}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-center gap-1 p-2 text-[13px] font-bold text-white drop-shadow">
              <svg viewBox="0 0 24 24" className="h-3 w-3 fill-white">
                <path d="M8 5v14l11-7z" />
              </svg>
              {r.views}
            </div>
          </div>
        ))}
      </div>
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
                className="absolute -top-2.5 left-5 z-10 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-black"
                style={{ background: BYD_BLUE }}
              >
                Experiência máxima
              </span>
            )}
            {/* Render da ativação */}
            <div className="mb-4 overflow-hidden rounded-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.foto}
                alt={p.nome}
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
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
        <div className="mt-10 flex items-center justify-center gap-6">
          <AugustoLogo className="h-8 w-auto sm:h-11" />
          <span className="text-xl font-light text-neutral-600">×</span>
          <BydLogo className="h-6 w-auto sm:h-8" />
        </div>

        {/* Botões de contato */}
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {/* E-mail */}
          <a
            href={`mailto:${FECHAMENTO.email}`}
            className="inline-flex items-center gap-2 rounded-full border border-neutral-700 bg-neutral-900 px-6 py-3 text-sm font-semibold text-white transition hover:border-neutral-500"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
              <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
            {FECHAMENTO.email}
          </a>

          {/* WhatsApp — botão verde com ícone */}
          <a
            href={FECHAMENTO.whatsapp.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-bold text-white transition hover:brightness-110"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
              <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.978-1.048zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
            </svg>
            {FECHAMENTO.whatsapp.display}
          </a>
        </div>
      </div>
    </section>
  );
}
