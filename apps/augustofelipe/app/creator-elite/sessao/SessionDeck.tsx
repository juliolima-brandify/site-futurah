"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { LEAD } from "./lead-data";

// -----------------------------------------------------------------------------
// Deck de VENDAS + DIAGNÓSTICO — apresentado pra lead na call (a lead VÊ a tela).
// Navegação VERTICAL, 1 seção por tela, scroll-snap. Setas ↑↓ / Espaço / scroll.
// Estrutura: Capa → Introdução → Diagnóstico → Soluções → Como funciona →
// Opções (Oferta) → Dúvidas. SEM notas internas — tudo aqui é pra lead ver.
// -----------------------------------------------------------------------------

const SECTION_LABELS = [
  "Capa",
  "Introdução",
  "Diagnóstico",
  "Soluções",
  "Como funciona",
  "Planos",
  "Dúvidas",
];

export default function SessionDeck() {
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
    <div className="relative h-screen w-screen overflow-hidden bg-neutral-950 text-neutral-100">
      {/* Top bar: marca + progress */}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-30 flex items-center justify-between px-6 py-4 text-xs text-neutral-400">
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
      <nav className="fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-2.5 md:flex">
        {SECTION_LABELS.map((label, i) => (
          <button
            key={label}
            onClick={() => goTo(i)}
            aria-label={`Ir para ${label}`}
            title={label}
            className={[
              "h-2.5 w-2.5 rounded-full transition-all",
              i === active
                ? "scale-125 bg-fuchsia-400"
                : "bg-neutral-700 hover:bg-neutral-500",
            ].join(" ")}
          />
        ))}
      </nav>

      {/* Hint */}
      <div className="pointer-events-none fixed bottom-6 left-1/2 z-20 -translate-x-1/2 animate-pulse text-neutral-600">
        {active < total - 1 ? "↓" : ""}
      </div>

      {/* Scroller */}
      <div
        ref={scrollerRef}
        className="h-full w-full snap-y snap-mandatory overflow-y-scroll scroll-smooth"
      >
        <CapaSection />
        <IntroducaoSection />
        <DiagnosticoSection />
        <SolucoesSection />
        <ComoFuncionaSection />
        <PlanosSection />
        <DuvidasSection />
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
        "flex h-screen w-full snap-start items-center justify-center px-6 py-20",
        className,
      ].join(" ")}
    >
      <div className="mx-auto w-full max-w-3xl">{children}</div>
    </section>
  );
}

function Kicker({ children }: { children: ReactNode }) {
  return (
    <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-400">
      {children}
    </p>
  );
}

function Title({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-3xl font-extrabold leading-[1.15] tracking-tight text-white md:text-5xl">
      {children}
    </h2>
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
    <Section className="bg-gradient-to-b from-neutral-950 to-neutral-900">
      <div className="text-center">
        <Kicker>Creator Elite · Diagnóstico Estratégico</Kicker>
        <Title>
          {LEAD.nome}
          <span className="mt-2 block text-lg font-medium text-neutral-400">
            @{LEAD.instagram}
          </span>
        </Title>
        <div className="mx-auto mt-10 flex max-w-xl flex-wrap justify-center gap-2.5 text-sm">
          <Pill>{LEAD.seguidores} seguidores</Pill>
          <Pill>{LEAD.nicho}</Pill>
          <Pill>Fat.: {LEAD.faturamento}</Pill>
        </div>
        <p className="mx-auto mt-10 max-w-xl text-[15px] leading-relaxed text-neutral-400">
          {LEAD.gancho}
        </p>
      </div>
    </Section>
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
            <span className="text-2xl font-extrabold tabular-nums text-fuchsia-500/70">
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
  return (
    <Section className="bg-neutral-900">
      <Kicker>Diagnóstico</Kicker>
      <Title>Onde seu perfil está travando.</Title>
      <blockquote className="mt-8 border-l-2 border-fuchsia-500 pl-6 text-lg font-medium leading-relaxed text-neutral-100 md:text-xl">
        “{LEAD.dor}”
      </blockquote>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <DataCard label="Tração">{LEAD.seguidores} seguidores</DataCard>
        <DataCard label="Nicho">{LEAD.nicho}</DataCard>
        <DataCard label="Faturamento">{LEAD.faturamento}</DataCard>
        <DataCard label="Como monetiza">{LEAD.monetizacao}</DataCard>
      </div>
      <div className="mt-8">
        <div className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-fuchsia-400">
          O que eu enxergo no seu perfil
        </div>
        <ul className="space-y-2.5">
          {LEAD.notasPerfil.map((n, i) => (
            <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-neutral-200">
              <span className="mt-1 text-fuchsia-500">→</span>
              <span>{n}</span>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

// -----------------------------------------------------------------------------
// 4 · Soluções — o caminho
// -----------------------------------------------------------------------------

function SolucoesSection() {
  const alavancas = [
    {
      n: "01",
      titulo: "Ponte de conteúdo",
      desc: "Levar o conteúdo simples pra fora do nicho sem perder identidade — engajar quem ainda não te segue.",
    },
    {
      n: "02",
      titulo: "Consistência no algoritmo novo",
      desc: "Estabilizar o alcance sem depender de viral nem de produção gigante todo dia.",
    },
    {
      n: "03",
      titulo: "Monetização própria",
      desc: "Transformar audiência + autoridade em produto recorrente — parar de depender só de publi.",
    },
  ];
  return (
    <Section className="bg-gradient-to-b from-neutral-900 to-neutral-950">
      <Kicker>Soluções</Kicker>
      <Title>Três alavancas até lá.</Title>
      <p className="mt-6 max-w-2xl text-lg font-medium leading-snug text-fuchsia-300">
        {LEAD.objetivo}
      </p>
      <div className="mt-10 space-y-4">
        {alavancas.map((a) => (
          <div key={a.n} className="flex gap-5">
            <span className="text-2xl font-extrabold tabular-nums text-fuchsia-500/70">
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
// 5 · Como funciona a mentoria
// -----------------------------------------------------------------------------

function ComoFuncionaSection() {
  const pilares = [
    {
      titulo: "Calls estratégicas",
      desc: "Sessões ao vivo, comigo, focadas no SEU perfil — direção cirúrgica, não método genérico.",
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
// 6 · Opções da mentoria (Oferta)
// -----------------------------------------------------------------------------

function PlanosSection() {
  return (
    <Section className="bg-neutral-900">
      <Kicker>Opções da mentoria</Kicker>
      <Title>Três formas de entrar.</Title>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {LEAD.oferta.planos.map((plano) => {
          const rec = plano.nome === LEAD.oferta.recomendado;
          return (
            <div
              key={plano.nome}
              className={[
                "relative flex flex-col rounded-2xl border px-5 py-5",
                rec
                  ? "border-fuchsia-500 bg-fuchsia-500/10 shadow-lg shadow-fuchsia-500/10"
                  : "border-neutral-800 bg-neutral-950",
              ].join(" ")}
            >
              {rec && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-fuchsia-500 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                  Recomendado
                </span>
              )}
              <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                {plano.duracao}
              </div>
              <div className="mt-1 text-lg font-bold text-white">{plano.nome}</div>
              <div className="mt-3 text-3xl font-extrabold tracking-tight text-white">
                {plano.preco}
              </div>
              <ul className="mt-4 space-y-1.5 text-[13px] text-neutral-300">
                {plano.inclui.map((i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-emerald-400">✓</span>
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
      {LEAD.oferta.garantia && !LEAD.oferta.garantia.includes("TROCAR") && (
        <p className="mt-6 text-center text-sm text-emerald-300">
          {LEAD.oferta.garantia}
        </p>
      )}
    </Section>
  );
}

// -----------------------------------------------------------------------------
// 7 · Dúvidas
// -----------------------------------------------------------------------------

function DuvidasSection() {
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
    <Section className="bg-gradient-to-b from-neutral-950 to-black">
      <Kicker>Dúvidas</Kicker>
      <Title>O que ficou no ar?</Title>
      <div className="mt-8 space-y-4">
        {faq.map((f) => (
          <div
            key={f.q}
            className="rounded-xl border border-neutral-800 bg-neutral-900/60 px-5 py-4"
          >
            <h3 className="text-base font-bold text-white">{f.q}</h3>
            <p className="mt-1.5 text-[14px] leading-relaxed text-neutral-400">
              {f.a}
            </p>
          </div>
        ))}
      </div>
      <p className="mt-10 text-center text-lg font-semibold text-fuchsia-300">
        Bora começar, {LEAD.primeiroNome}?
      </p>
    </Section>
  );
}
