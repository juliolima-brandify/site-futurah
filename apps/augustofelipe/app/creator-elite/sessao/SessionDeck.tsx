"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Boldonse } from "next/font/google";
import { LEAD, MENTOR, type Lead } from "./lead-data";

// Fonte display dos títulos das seções (Google Fonts), usada em caixa alta.
const boldonse = Boldonse({ subsets: ["latin"], weight: "400", display: "swap" });

// Lead atual (real, vindo do form de qualificação, ou o exemplo do LEAD).
// Disponibilizado via contexto pra cada seção ler sem prop drilling.
const LeadContext = createContext<Lead>(LEAD);
function useLead() {
  return useContext(LeadContext);
}

// -----------------------------------------------------------------------------
// Deck de VENDAS + DIAGNÓSTICO — apresentado pra lead na call (a lead VÊ a tela).
// Navegação VERTICAL, 1 seção por tela, scroll-snap. Setas ↑↓ / Espaço / scroll.
// Estrutura: Capa → Introdução → Diagnóstico → Soluções → Como funciona →
// Opções (Oferta) → Dúvidas. SEM notas internas — tudo aqui é pra lead ver.
// -----------------------------------------------------------------------------

const SECTION_LABELS = [
  "Capa",
  "Contra capa",
  "Introdução",
  "Diagnóstico",
  "Pontuação",
  "O depois",
  "Soluções",
  "Quem te guia",
  "Reels",
  "Como funciona",
  "O que você recebe",
  "Planos",
  "Dúvidas",
];

export default function SessionDeck({ lead = LEAD }: { lead?: Lead }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const goTo = useCallback((idx: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(SECTION_LABELS.length - 1, idx));
    el.scrollTo({ top: clamped * el.clientHeight, behavior: "smooth" });
  }, []);

  // Track active section on scroll.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const idx = Math.round(el.scrollTop / el.clientHeight);
        setActive(idx);
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Keyboard navigation.
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
    <div className="session-deck-root relative h-screen w-screen overflow-hidden bg-neutral-950 text-neutral-100">
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

          .session-deck-root {
            height: auto !important;
            width: 100% !important;
            overflow: visible !important;
          }

          .session-deck-topbar,
          .session-deck-progress,
          .session-deck-hint {
            display: none !important;
          }

          .session-deck-scroller {
            height: auto !important;
            overflow: visible !important;
            scroll-behavior: auto !important;
            scroll-snap-type: none !important;
          }

          .session-deck-scroller > section {
            height: 100vh !important;
            min-height: 100vh !important;
            /* No PDF (print) o breakpoint md: do Chrome não casa de forma
               confiável; força a centralização vertical do desktop aqui pra o
               PDF não herdar o items-start (base mobile). */
            align-items: center !important;
            break-after: page;
            page-break-after: always;
            scroll-snap-align: none !important;
          }

          .session-deck-scroller > section:last-child {
            break-after: auto;
            page-break-after: auto;
          }
        }
      `}</style>
      {/* Top bar: marca + progress */}
      <header className="session-deck-topbar pointer-events-none fixed inset-x-0 top-0 z-30 flex items-center justify-between px-6 py-4 text-xs text-neutral-400">
        <span className="font-semibold tracking-[0.18em] uppercase">
          Creator Elite · Diagnóstico Estratégico
        </span>
        <span className="tabular-nums">
          {String(active + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          <span className="ml-2 hidden text-neutral-500 sm:inline">
            · {SECTION_LABELS[active]}
          </span>
        </span>
      </header>

      {/* Side progress dots */}
      <nav className="session-deck-progress fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-2.5 md:flex">
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
      <div className="session-deck-hint pointer-events-none fixed bottom-6 left-1/2 z-20 -translate-x-1/2 animate-pulse text-neutral-600">
        {active < total - 1 ? "↓" : ""}
      </div>

      {/* Scroller */}
      <LeadContext.Provider value={lead}>
        <div
          ref={scrollerRef}
          className="session-deck-scroller h-full w-full overflow-y-scroll scroll-smooth md:snap-y md:snap-mandatory"
        >
          <CapaSection />
          <ContraCapaSection />
          <IntroducaoSection />
          <DiagnosticoSection />
          <ScorecardSection />
          <SonhoSection />
          <SolucoesSection />
          <ProvaSection />
          <ReelsSection />
          <ComoFuncionaSection />
          <ValueStackSection />
          <PlanosSection />
          <DuvidasSection />
        </div>
      </LeadContext.Provider>
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

function Kicker({ children }: { children: ReactNode }) {
  return (
    <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
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

function Headline({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={`${boldonse.className} text-[1.25rem] uppercase leading-[1.45] text-white md:text-[1.8rem] ${className}`}
    >
      {children}
    </h2>
  );
}

function Body2({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={`text-[13px] leading-relaxed text-neutral-400 ${className}`}>
      {children}
    </p>
  );
}

function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-neutral-700 bg-neutral-900 px-4 py-1.5 text-neutral-300">
      {children}
    </span>
  );
}

function DataCard({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 px-5 py-4">
      <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
        {label}
      </div>
      <div className="text-[15px] leading-relaxed text-neutral-200">{children}</div>
    </div>
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
      {/* Background: Augusto + bússola (espaço escuro à esquerda) — 100vh */}
      <div
        className="absolute inset-0 h-full w-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/creator-elite/capa-bg.png')" }}
      />
      {/* Reforço escuro à esquerda pra logo respirar */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/35 to-transparent" />
      {/* Coluna 1 (esquerda): logo Creator Elite */}
      <div className="relative z-10 w-full px-8 sm:px-16">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/creator-elite/logo-creator-elite.png"
          alt="Creator Elite"
          className="w-[74%] max-w-3xl object-contain drop-shadow-[0_6px_24px_rgba(0,0,0,0.7)] sm:w-[68%]"
        />
      </div>
    </section>
  );
}

// Formata contagem no estilo Instagram pt-BR (149.339 → "149 mil").
function igNum(n: number): string {
  if (n >= 1_000_000)
    return (n / 1_000_000).toFixed(1).replace(".0", "").replace(".", ",") + " mi";
  if (n >= 10_000) return Math.round(n / 1000) + " mil";
  return n.toLocaleString("pt-BR");
}

// "R$ 10.000" → "ou 12x de R$ 833" (sem juros). null se não parsear.
function parcelar12x(preco: string): string | null {
  const n = Number(preco.replace(/\D/g, ""));
  if (!n) return null;
  const parcela = (n / 12).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
  return `ou 12x de ${parcela}`;
}

// "R$ 9.000" + 12 calls → "R$ 750 / call". null se não der pra calcular.
function valorPorCall(preco: string, calls?: number): string | null {
  if (!calls || calls < 1) return null;
  const n = Number(preco.replace(/\D/g, ""));
  if (!n) return null;
  const v = Math.round(n / calls).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
  return `${v} / call`;
}

function VerifiedBadge() {
  return (
    <svg
      viewBox="0 0 40 40"
      aria-label="Verificada"
      className="inline-block h-[15px] w-[15px] shrink-0 align-text-bottom"
    >
      <path
        fill="#3897F0"
        d="M19.998 3.094 14.638 0l-2.972 5.15H5.432v6.354L0 14.64 3.094 20 0 25.359l5.432 3.137v5.905h5.975L14.638 40l5.36-3.094L25.358 40l3.232-5.6h6.162v-6.01L40 25.359 36.905 20 40 14.64l-5.248-3.03v-6.46h-6.419L25.358 0l-5.36 3.094Z"
      />
      <path
        fill="#fff"
        d="m18.404 25.677 9.149-9.149-1.768-1.768-7.381 7.381-3.234-3.234-1.768 1.768 5.002 5.002Z"
      />
    </svg>
  );
}

function InstagramProfileCard({
  perfil: p,
}: {
  perfil: NonNullable<Lead["perfil"]>;
}) {
  const stats: [string, number | null][] = [
    ["publicações", p.posts],
    ["seguidores", p.seguidores],
    ["seguindo", p.seguindo],
  ];
  return (
    <div className="mx-auto max-w-sm overflow-hidden rounded-2xl bg-white text-neutral-900 shadow-2xl ring-1 ring-neutral-200">
      {/* Barra de topo do app */}
      <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-2.5">
        <span className="text-base leading-none text-neutral-800">‹</span>
        <span className="flex items-center gap-1 text-[14px] font-semibold">
          {p.username}
          {p.verificado && <VerifiedBadge />}
        </span>
        <span className="text-lg leading-none text-neutral-800">☰</span>
      </div>

      <div className="px-4 py-4 text-left">
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Avatar com anel de stories */}
          <div className="shrink-0 rounded-full bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 p-[2.5px]">
            <div className="rounded-full bg-white p-[2px]">
              {p.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.avatar}
                  alt={p.fullName}
                  className="h-[60px] w-[60px] rounded-full object-cover sm:h-[72px] sm:w-[72px]"
                />
              ) : (
                <div className="grid h-[60px] w-[60px] place-items-center rounded-full bg-neutral-950 text-lg font-extrabold text-white sm:h-[72px] sm:w-[72px]">
                  {p.fullName
                    .split(/\s+/)
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((part) => part[0])
                    .join("")}
                </div>
              )}
            </div>
          </div>
          {/* Stats */}
          <div className="grid flex-1 grid-cols-3 gap-1 text-center">
            {stats.map(([label, n]) => (
              <div key={label}>
                <div className="text-sm font-bold leading-tight sm:text-base">
                  {n === null ? "—" : igNum(n)}
                </div>
                <div className="text-[11px] text-neutral-600">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Nome + bio + link */}
        <div className="mt-3 text-[12.5px] leading-snug">
          <div className="font-semibold">{p.fullName}</div>
          <div className="mt-0.5 whitespace-pre-line text-neutral-800">
            {p.bio}
          </div>
          {p.link && (
            <div className="mt-0.5 font-semibold text-[#00376B]">{p.link}</div>
          )}
        </div>

        {/* Botões */}
        <div className="mt-3.5 flex gap-2">
          <button className="flex-1 rounded-lg bg-[#0095F6] py-1.5 text-[12px] font-semibold text-white">
            Seguir
          </button>
          <button className="flex-1 rounded-lg bg-neutral-100 py-1.5 text-[12px] font-semibold text-neutral-900">
            Mensagem
          </button>
          <button className="rounded-lg bg-neutral-100 px-3 py-1.5 text-[12px] font-semibold text-neutral-900">
            ▾
          </button>
        </div>
      </div>
    </div>
  );
}

function ContraCapaSection() {
  const LEAD = useLead();
  const p = LEAD.perfil;
  // O gancho costuma ser "frase de impacto. elaboração." — a 1ª frase vira o
  // título (Headline) e o restante o texto descritivo (Body2).
  const [titulo, ...resto] = LEAD.gancho.split(/(?<=\.)\s+/);
  const descricao = resto.join(" ");
  return (
    <section className="flex min-h-screen w-full snap-start items-start justify-center bg-white px-5 py-10 md:h-screen md:items-center md:py-6">
      <div className="grid w-full max-w-5xl items-center gap-6 md:grid-cols-2 md:gap-8">
        {/* Esquerda: textos */}
        <div className="text-left">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-600">
            Creator Elite · Diagnóstico Estratégico
          </p>
          <Headline className="!text-neutral-900">{titulo}</Headline>
          {descricao && (
            <Body2 className="mt-4 max-w-md !text-neutral-600">
              {descricao}
            </Body2>
          )}
        </div>

        {/* Direita: mock do Instagram */}
        <div className="flex justify-center md:justify-end">
          {p ? (
            <InstagramProfileCard perfil={p} />
          ) : (
            <div className="text-center">
              <div className="text-3xl font-extrabold text-neutral-900">
                {LEAD.nome}
              </div>
              <div className="mt-2 text-lg font-medium text-neutral-400">
                @{LEAD.instagram}
              </div>
              <div className="mt-6 flex flex-wrap justify-center gap-2.5 text-sm">
                <Pill>{LEAD.seguidores} seguidores</Pill>
                <Pill>{LEAD.nicho}</Pill>
                <Pill>Fat.: {LEAD.faturamento}</Pill>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// 2 · Introdução — o que vamos fazer hoje
// -----------------------------------------------------------------------------

function IntroducaoSection() {
  const agenda = [
    {
      n: "01",
      titulo: "Diagnóstico",
      desc: "Onde seu perfil está travando hoje — com base no que você já me contou.",
    },
    {
      n: "02",
      titulo: "Soluções",
      desc: "O caminho pra destravar: as alavancas que vão te levar pro próximo nível.",
    },
    {
      n: "03",
      titulo: "Mentoria",
      desc: "Como a Creator Elite acelera esse caminho — e como você pode entrar.",
    },
  ];
  return (
    <Section>
      <Kicker>O que vamos fazer hoje</Kicker>
      <Title>Esses próximos minutos.</Title>
      <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-neutral-400">
        Sem pitch e sem enrolação. Primeiro a gente entende exatamente onde você
        está. Depois eu te mostro o caminho. No fim, você decide se faz sentido
        seguir junto.
      </p>
      <div className="mt-10 space-y-4">
        {agenda.map((a) => (
          <div key={a.n} className="flex gap-5">
            <span className="text-2xl font-extrabold tabular-nums text-amber-500/70">
              {a.n}
            </span>
            <div>
              <h3 className="text-lg font-bold text-white">{a.titulo}</h3>
              <p className="mt-1 text-[15px] leading-relaxed text-neutral-400">
                {a.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

// -----------------------------------------------------------------------------
// 3 · Diagnóstico dos problemas da lead
// -----------------------------------------------------------------------------

function DiagnosticoSection() {
  const LEAD = useLead();
  return (
    <Section className="bg-neutral-900">
      <Kicker>Diagnóstico</Kicker>
      <Title>Onde seu perfil está travando.</Title>
      <blockquote className="mt-6 border-l-2 border-amber-500 pl-6 text-base font-medium leading-relaxed text-neutral-100 md:text-lg">
        “{LEAD.dor}”
      </blockquote>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <DataCard label="Tração">{LEAD.seguidores} seguidores</DataCard>
        <DataCard label="Nicho">{LEAD.nicho}</DataCard>
        <DataCard label="Faturamento">{LEAD.faturamento}</DataCard>
        <DataCard label="Como monetiza">{LEAD.monetizacao}</DataCard>
      </div>
      {LEAD.notasPerfil.length > 0 && (
        <div className="mt-5">
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-amber-400">
            O que eu enxergo no seu perfil
          </div>
          <ul className="space-y-2">
            {LEAD.notasPerfil.map((n, i) => (
              <li key={i} className="flex gap-3 text-[13.5px] leading-relaxed text-neutral-200">
                <span className="mt-1 text-amber-500">→</span>
                <span>{n}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Section>
  );
}

// -----------------------------------------------------------------------------
// 4 · Soluções — o caminho
// -----------------------------------------------------------------------------

function SolucoesSection() {
  const LEAD = useLead();
  const alavancas = LEAD.solucoes;
  return (
    <Section className="bg-gradient-to-b from-neutral-900 to-neutral-950">
      <Kicker>Soluções</Kicker>
      <Title>Três alavancas até lá.</Title>
      <p className="mt-5 max-w-2xl text-base font-medium leading-snug text-amber-300">
        {LEAD.objetivo}
      </p>
      <div className="mt-7 space-y-3.5">
        {alavancas.map((a) => (
          <div
            key={a.n}
            className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-4 sm:p-5"
          >
            <div className="flex items-baseline gap-3">
              <span className="text-xl font-extrabold tabular-nums text-amber-500/70">
                {a.n}
              </span>
              <h3 className="text-base font-bold leading-tight text-white sm:text-lg">
                {a.titulo}
              </h3>
            </div>
            <div className="mt-2.5 space-y-2 pl-0 sm:pl-9">
              <p className="text-[13px] leading-relaxed text-neutral-500">
                <span className="font-semibold text-neutral-400">Hoje: </span>
                {a.hoje}
              </p>
              <p className="text-[13.5px] leading-relaxed text-neutral-200">
                <span className="font-semibold text-white">O movimento: </span>
                {a.movimento}
              </p>
              <p className="flex gap-2 text-[13.5px] font-medium leading-relaxed text-amber-300">
                <span aria-hidden>→</span>
                <span>{a.resultado}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

// -----------------------------------------------------------------------------
// 5 · Como funciona a mentoria
// -----------------------------------------------------------------------------

function ComoFuncionaSection() {
  const pilares = [
    {
      titulo: "Calls estratégicas",
      desc: "Sessões ao vivo com Augusto Felipe, focadas no SEU perfil — direção cirúrgica, não método genérico.",
    },
    {
      titulo: "Acesso à I.A",
      desc: "Ferramenta de I.A pra acelerar ideias, roteiros e análise de conteúdo entre as calls.",
    },
    {
      titulo: "Grupo no WhatsApp",
      desc: "Suporte contínuo pra tirar dúvidas e ajustar a rota sem esperar a próxima call.",
    },
    {
      titulo: "Diagnóstico",
      desc: "Mapa claro de onde você está e o que atacar primeiro — pra cada passo ter propósito.",
    },
  ];
  return (
    <Section>
      <Kicker>Como funciona</Kicker>
      <Title>A Creator Elite por dentro.</Title>
      <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-neutral-400">
        Acompanhamento de perto por um período pra você executar com suporte —
        exatamente o que você falou que precisa.
      </p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {pilares.map((p) => (
          <div
            key={p.titulo}
            className="rounded-xl border border-neutral-800 bg-neutral-900/60 px-5 py-4"
          >
            <h3 className="text-base font-bold text-white">{p.titulo}</h3>
            <p className="mt-1.5 text-[14px] leading-relaxed text-neutral-400">
              {p.desc}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}

// -----------------------------------------------------------------------------
// 4.2 · Pontuação do perfil (Scorecard)
// -----------------------------------------------------------------------------

function scoreColor(n: number): { bar: string; text: string } {
  if (n <= 4) return { bar: "bg-red-500", text: "text-red-400" };
  if (n < 7) return { bar: "bg-amber-400", text: "text-amber-400" };
  return { bar: "bg-lime-400", text: "text-lime-400" };
}

function ScorecardSection() {
  const LEAD = useLead();
  const s = LEAD.scorecard;
  return (
    <Section className="bg-neutral-900">
      <Kicker>Pontuação do perfil</Kicker>
      <Title>Onde seu perfil pontua hoje.</Title>

      <div className="mt-5 flex items-end gap-4">
        <div className={`text-5xl font-extrabold ${scoreColor(s.notaGeral).text}`}>
          {s.notaGeral.toFixed(1)}
          <span className="text-xl font-bold text-neutral-600">/10</span>
        </div>
        <p className="mb-1 max-w-md text-[13.5px] leading-snug text-neutral-400">
          {s.resumo}
        </p>
      </div>

      <div className="mt-6 space-y-3">
        {s.criterios.map((c) => {
          const col = scoreColor(c.nota);
          return (
            <div key={c.nome}>
              <div className="flex items-baseline justify-between text-[13.5px]">
                <span className="font-semibold text-white">{c.nome}</span>
                <span className={`font-bold tabular-nums ${col.text}`}>
                  {c.nota.toFixed(1)}
                </span>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-neutral-800">
                <div
                  className={`h-full rounded-full ${col.bar}`}
                  style={{ width: `${c.nota * 10}%` }}
                />
              </div>
              <p className="mt-1 text-[12.5px] leading-snug text-neutral-400">
                {c.porque}
              </p>
              <p className="text-[11px] italic text-neutral-600">
                Base: {c.fonte}
              </p>
            </div>
          );
        })}
      </div>

      <p className="mt-5 text-[12px] leading-snug text-neutral-500">
        <span className="font-semibold text-neutral-400">Como avaliamos: </span>
        {s.baseadoEm}
      </p>
    </Section>
  );
}

// -----------------------------------------------------------------------------
// 4.5 · O depois (Dream Outcome — Hormozi)
// -----------------------------------------------------------------------------

function SonhoSection() {
  const LEAD = useLead();
  const d = LEAD.dreamOutcome;
  return (
    <Section className="bg-gradient-to-b from-neutral-950 to-neutral-900">
      <Kicker>O depois</Kicker>
      <Title>{d.headline}</Title>
      <ul className="mt-8 space-y-3.5">
        {d.bullets.map((b, i) => (
          <li
            key={i}
            className="flex gap-3 text-[15px] leading-relaxed text-neutral-200"
          >
            <span className="mt-0.5 text-amber-400">✦</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </Section>
  );
}

// -----------------------------------------------------------------------------
// 5.2 · Quem te guia (Prova / Likelihood — Hormozi)
// -----------------------------------------------------------------------------

function ProvaSection() {
  return (
    <Section className="bg-neutral-900">
      <Kicker>Quem vai te guiar</Kicker>
      <Title className="!text-[1.8rem] md:!text-[2.7rem]">
        Não é teoria — é caminho já percorrido.
      </Title>
      <div className="mt-7 flex items-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={MENTOR.avatar}
          alt={MENTOR.nome}
          className="h-16 w-16 rounded-full object-cover ring-2 ring-amber-400/60 sm:h-20 sm:w-20"
        />
        <div>
          <div className="flex items-center gap-1.5 text-lg font-bold text-white">
            {MENTOR.nome}
            {MENTOR.verificado && <VerifiedBadge />}
          </div>
          <div className="text-sm text-neutral-400">@{MENTOR.username}</div>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {MENTOR.metricas.map((m) => (
          <div
            key={m.label}
            className="rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-4 text-center"
          >
            <div className="text-xl font-extrabold tracking-tight text-amber-400 sm:text-2xl">
              {m.valor}
            </div>
            <div className="mt-0.5 text-[12px] text-neutral-500">{m.label}</div>
          </div>
        ))}
      </div>
      <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-neutral-300">
        {MENTOR.resumo}
      </p>
    </Section>
  );
}

// -----------------------------------------------------------------------------
// 5.3 · Reels mais vistos (prova visual)
// -----------------------------------------------------------------------------

function ReelsSection() {
  return (
    <Section className="bg-neutral-950">
      <Kicker>Prova na prática</Kicker>
      <Title>Os reels que viraram alcance.</Title>
      <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-neutral-400">
        Conteúdo simples, feito do jeito certo, alcançando milhões. É exatamente
        esse sistema que entra pro seu perfil.
      </p>
      <div className="mt-5 grid grid-cols-4 gap-2.5">
        {MENTOR.reels.map((r, i) => (
          <div
            key={i}
            className="relative aspect-[3/4] overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={r.thumb}
              alt={`Reel ${i + 1}`}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/15 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-1.5">
              <div className="flex items-center gap-1 text-[12px] font-bold text-white drop-shadow">
                <svg viewBox="0 0 24 24" className="h-3 w-3 fill-white">
                  <path d="M8 5v14l11-7z" />
                </svg>
                {igNum(r.views)}
              </div>
              <div className="mt-0.5 flex items-center gap-2 text-[10px] font-medium text-neutral-200">
                <span className="flex items-center gap-0.5">
                  <svg viewBox="0 0 24 24" className="h-2.5 w-2.5 fill-amber-400">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  {igNum(r.likes)}
                </span>
                <span className="flex items-center gap-0.5">
                  <svg viewBox="0 0 24 24" className="h-2.5 w-2.5 fill-neutral-300">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                  </svg>
                  {r.comments.toLocaleString("pt-BR")}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

// -----------------------------------------------------------------------------
// 5.5 · O que você recebe (Value Stack — Hormozi)
// -----------------------------------------------------------------------------

function ValueStackSection() {
  const LEAD = useLead();
  const o = LEAD.oferta;
  return (
    <Section className="bg-neutral-950">
      <Kicker>O que você recebe</Kicker>
      <Headline>Tudo que entra na mentoria.</Headline>
      <Body2 className="mt-4 max-w-2xl">
        Um pacote de direção, diagnóstico, sistema de conteúdo e suporte para
        transformar o perfil em canal de aquisição.
      </Body2>
      <div className="mt-6 divide-y divide-neutral-800 overflow-hidden rounded-2xl border border-neutral-800">
        {o.stack.map((s, i) => (
          <div
            key={i}
            className="flex items-start justify-between gap-4 bg-neutral-900/40 px-4 py-3"
          >
            <div className="flex gap-3">
              <span className="mt-0.5 text-amber-400">✓</span>
              <div>
                <div className="text-[14px] font-semibold text-white">
                  {s.item}
                </div>
                {s.nota && (
                  <Body2 className="mt-0.5 !text-[12.5px] !leading-snug !text-neutral-500">
                    {s.nota}
                  </Body2>
                )}
              </div>
            </div>
            <div className="relative mt-0.5 inline-block shrink-0 px-1 text-[13px] font-semibold text-neutral-500">
              <span>{s.valor}</span>
              <span
                aria-hidden
                className="absolute -inset-x-0.5 top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.7)]"
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 flex items-center justify-between rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3.5">
        <span className="text-[12px] font-semibold uppercase tracking-wider text-amber-300">
          Valor total entregue
        </span>
        <span className="text-xl font-extrabold tracking-tight text-amber-300 sm:text-2xl">
          {o.valorAncora}
        </span>
      </div>
      <p className="mt-3 text-center text-[13px] text-neutral-400">
        Na sessão de hoje você não investe nem perto disso —{" "}
        <span className="font-semibold text-white">veja as opções a seguir.</span>
      </p>
    </Section>
  );
}

// -----------------------------------------------------------------------------
// 6 · Opções da mentoria (Oferta)
// -----------------------------------------------------------------------------

function PlanosSection() {
  const LEAD = useLead();
  const planos = LEAD.oferta.planos;

  // Linhas de comparação derivadas do `inclui` de cada plano (robusto a
  // variações de texto). "value" mostra o item casado; "bool" vira ✓ / —.
  const linhas: { label: string; match: RegExp; kind: "value" | "bool" }[] = [
    { label: "Calls estratégicas", match: /call/i, kind: "value" },
    { label: "Acesso à I.A", match: /i\.?\s*a\b|intelig/i, kind: "bool" },
    { label: "Curso Construindo um Viral", match: /construindo/i, kind: "bool" },
    { label: "Planejamento de conteúdo", match: /planejamento/i, kind: "bool" },
    { label: "Pautas diárias do nicho", match: /pauta/i, kind: "bool" },
    { label: "Análise de concorrentes", match: /concorrent/i, kind: "bool" },
    { label: "Grupo no WhatsApp", match: /whats/i, kind: "bool" },
    { label: "Diagnóstico do perfil", match: /diagn/i, kind: "bool" },
  ];
  const cellFor = (plano: (typeof planos)[number], l: (typeof linhas)[number]) => {
    const hit = plano.inclui.find((i) => l.match.test(i));
    if (l.kind === "value") return hit ?? "—";
    return hit ? "✓" : "—";
  };
  const gridCols = {
    gridTemplateColumns: `minmax(8rem,1.25fr) repeat(${planos.length}, minmax(0,1fr))`,
  };
  const colBg = (rec: boolean) => (rec ? "bg-amber-500/10" : "");

  return (
    <Section className="bg-neutral-900">
      <Kicker>Opções da mentoria</Kicker>
      <Title>Compare e escolha.</Title>

      <div className="mt-7 -mx-6 overflow-x-auto px-6 md:mx-0 md:overflow-visible md:px-0">
       <div className="min-w-[34rem] overflow-hidden rounded-2xl border border-neutral-800 md:min-w-0">
        {/* Cabeçalho: nome + duração de cada plano */}
        <div className="grid items-stretch" style={gridCols}>
          <div className="border-b border-neutral-800 bg-neutral-950 px-3 py-4" />
          {planos.map((plano) => {
            const rec = plano.nome === LEAD.oferta.recomendado;
            return (
              <div
                key={plano.nome}
                className={[
                  "relative border-b border-l border-neutral-800 px-3 py-4 text-center",
                  rec ? colBg(true) : "bg-neutral-950",
                ].join(" ")}
              >
                {plano.selo && (
                  <span
                    className={[
                      "absolute inset-x-0 -top-0 mx-auto block py-0.5 text-[9px] font-bold uppercase tracking-wider text-black",
                      rec ? "bg-amber-500" : "bg-lime-400",
                    ].join(" ")}
                  >
                    {plano.selo}
                  </span>
                )}
                <div className={plano.selo ? "mt-3" : ""}>
                  {plano.insignia && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={plano.insignia}
                      alt={`Insígnia ${plano.nome}`}
                      className={[
                        "mx-auto mb-2 object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]",
                        rec ? "h-16 w-16 sm:h-20 sm:w-20" : "h-12 w-12 sm:h-14 sm:w-14",
                      ].join(" ")}
                    />
                  )}
                  <div className="text-sm font-bold text-white sm:text-base">
                    {plano.nome}
                  </div>
                  <div className="mt-0.5 text-[11px] uppercase tracking-wider text-neutral-500">
                    {plano.duracao}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Linhas de comparação */}
        {linhas.map((l) => (
          <div key={l.label} className="grid items-center" style={gridCols}>
            <div className="border-b border-neutral-800/70 px-3 py-2.5 text-[12.5px] font-medium text-neutral-400">
              {l.label}
            </div>
            {planos.map((plano) => {
              const rec = plano.nome === LEAD.oferta.recomendado;
              const v = cellFor(plano, l);
              const dash = v === "—";
              const check = v === "✓";
              return (
                <div
                  key={plano.nome}
                  className={[
                    "border-b border-l border-neutral-800/70 px-2 py-2.5 text-center text-[12.5px]",
                    colBg(rec),
                    dash
                      ? "text-neutral-700"
                      : check
                        ? "text-amber-400"
                        : "font-semibold text-white",
                  ].join(" ")}
                >
                  {v}
                </div>
              );
            })}
          </div>
        ))}

        {/* Preço */}
        <div className="grid items-center" style={gridCols}>
          <div className="px-3 py-4 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
            Investimento
          </div>
          {planos.map((plano) => {
            const rec = plano.nome === LEAD.oferta.recomendado;
            return (
              <div
                key={plano.nome}
                className={[
                  "border-l border-neutral-800/70 px-2 py-4 text-center",
                  colBg(rec),
                ].join(" ")}
              >
                <span
                  className={[
                    "text-lg font-extrabold tracking-tight sm:text-2xl",
                    rec
                      ? "text-amber-400"
                      : plano.selo
                        ? "text-lime-400"
                        : "text-white",
                  ].join(" ")}
                >
                  {plano.preco}
                </span>
                {valorPorCall(plano.preco, plano.calls) && (
                  <div className="mt-1 text-[11px] font-semibold leading-tight text-neutral-300">
                    {valorPorCall(plano.preco, plano.calls)}
                  </div>
                )}
                {parcelar12x(plano.preco) && (
                  <div className="mt-0.5 text-[10.5px] font-medium leading-tight text-neutral-500">
                    {parcelar12x(plano.preco)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
       </div>
      </div>

      {LEAD.oferta.garantia && !LEAD.oferta.garantia.includes("TROCAR") && (
        <p className="mx-auto mt-5 max-w-2xl text-center text-sm text-amber-300">
          {LEAD.oferta.garantia}
        </p>
      )}
      {LEAD.oferta.urgencia && (
        <p className="mx-auto mt-2 max-w-2xl text-center text-[12.5px] text-neutral-500">
          {LEAD.oferta.urgencia}
        </p>
      )}
    </Section>
  );
}

// -----------------------------------------------------------------------------
// 7 · Dúvidas
// -----------------------------------------------------------------------------

function DuvidasSection() {
  const LEAD = useLead();
  const faq = [
    {
      q: "Em quanto tempo vejo resultado?",
      a: "Depende da execução, mas o foco é destravar o alcance e a monetização desde as primeiras semanas — com ajustes a cada call.",
    },
    {
      q: "E se eu não tiver tempo de produzir todo dia?",
      a: "A ideia é justamente o contrário: conteúdo simples que alcança, sem depender de produção gigante. Menos esforço, mais consistência.",
    },
    {
      q: "Funciona pro meu nicho?",
      a: "Sim — a mentoria é cirúrgica pro seu perfil. Nada de fórmula enlatada: a gente parte de onde você já está.",
    },
  ];
  return (
    <section className="relative flex min-h-screen w-full snap-start items-center overflow-hidden px-6 py-16 md:h-screen md:py-20">
      {/* Fundo: Augusto à esquerda, escuro à direita pra abrigar o conteúdo */}
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/creator-elite/augusto-fechamento.webp"
          alt="Augusto Felipe"
          className="h-full w-full object-cover object-left"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/75 to-black/90" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-2xl text-center">
        <Kicker>Dúvidas</Kicker>
        <Title>O que ficou no ar?</Title>
        <div className="mt-8 space-y-4">
          {faq.map((f) => (
            <div
              key={f.q}
              className="rounded-xl border border-neutral-800 bg-neutral-900/70 px-5 py-4 backdrop-blur-sm"
            >
              <h3 className="text-base font-bold text-white">{f.q}</h3>
              <p className="mt-1.5 text-[14px] leading-relaxed text-neutral-300">
                {f.a}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-10 text-lg font-semibold text-amber-300">
          Bora começar, {LEAD.primeiroNome}?
        </p>
      </div>
    </section>
  );
}
