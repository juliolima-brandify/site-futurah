"use client";

import { useEffect, useState } from "react";

type Step = "intro" | 1 | 2 | 3 | "lead" | "result" | "pitch";

type Question = {
  pre: string;
  highlight: string;
  post: string;
  options: string[];
};

const QUESTIONS: Question[] = [
  {
    pre: "Qual o nível de engajamento dos",
    highlight: "seus posts",
    post: " hoje?",
    options: [
      "Muito baixo, parece que ninguém vê ou interage.",
      "Baixo para o tamanho do meu perfil.",
      "Alto, com curtidas, comentários e compartilhamentos.",
    ],
  },
  {
    pre: "O que mais te incomoda hoje no",
    highlight: "seu Instagram",
    post: "?",
    options: [
      "Poucos seguidores novos",
      "Poucas curtidas e comentários",
      "Baixo alcance nos conteúdos",
    ],
  },
  {
    pre: "Se alguém",
    highlight: "analisasse seu perfil hoje",
    post: ", você queria descobrir:",
    options: [
      "Como crescer mais",
      "O que trava meu perfil",
      "Por que não vende",
      "O que corrigir agora",
    ],
  },
];

const LETTERS = ["A", "B", "C", "D"];

function ProgressBar({ pct }: { pct: number }) {
  return (
    <div className="h-1.5 w-full bg-neutral-200">
      <div
        className="h-full bg-black transition-all duration-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function HeroIntro({ onStart }: { onStart: () => void }) {
  return (
    <div className="px-6 py-16 max-w-xl mx-auto text-center">
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
        O que está travando seu perfil de atingir 100 mil seguidores?
      </h1>
      <p className="mt-4 text-neutral-500">
        Responda{" "}
        <span className="text-rose-500 font-bold">3 perguntas</span> e descubra
        em <span className="text-emerald-600 font-bold">1 minuto</span> os
        gargalos do seu perfil.
      </p>
      <div className="mt-8 aspect-[4/3] rounded-2xl bg-neutral-900 grid place-items-center text-neutral-500 text-sm">
        [imagem hero]
      </div>
      <button
        onClick={onStart}
        className="mt-6 w-full py-4 rounded-2xl bg-emerald-500 text-white font-semibold text-lg hover:bg-emerald-600 transition"
      >
        Começar Diagnóstico
      </button>
    </div>
  );
}

function QuestionStep({
  idx,
  onAnswer,
}: {
  idx: number;
  onAnswer: (answer: string) => void;
}) {
  const q = QUESTIONS[idx];
  return (
    <div className="px-6 py-12 max-w-xl mx-auto">
      <h2 className="text-2xl md:text-[28px] font-extrabold tracking-tight leading-tight text-center">
        {q.pre}{" "}
        <span className="bg-yellow-300 px-1 box-decoration-clone">
          {q.highlight}
        </span>
        {q.post}
      </h2>
      <div className="mt-8 flex flex-col gap-3">
        {q.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => onAnswer(opt)}
            className="w-full text-left px-4 py-4 rounded-xl border border-neutral-200 hover:border-neutral-900 hover:bg-neutral-50 transition flex items-start gap-3"
          >
            <span className="inline-flex items-center justify-center w-6 h-6 border border-neutral-300 rounded-md text-xs font-semibold shrink-0 mt-0.5">
              {LETTERS[i]}
            </span>
            <span className="text-neutral-800 text-[15px]">{opt}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function onlyDigits(v: string) {
  return v.replace(/\D+/g, "");
}

function maskWhatsapp(v: string) {
  const d = onlyDigits(v).slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10)
    return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function LeadCapture({
  answers,
  onSubmitted,
}: {
  answers: string[];
  onSubmitted: () => void;
}) {
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validate = () => {
    const e: Record<string, string> = {};
    if (name.trim().length < 2) e.name = "Informe seu nome.";
    const digits = onlyDigits(whatsapp);
    if (digits.length < 10 || digits.length > 11)
      e.whatsapp = "WhatsApp inválido.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      e.email = "Email inválido.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate() || submitting) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/diagnostico/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          whatsapp: onlyDigits(whatsapp),
          email: email.trim().toLowerCase(),
          answers,
          source: "diagnostico",
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      onSubmitted();
    } catch {
      setSubmitError("Não foi possível enviar agora. Tente novamente.");
      setSubmitting(false);
    }
  };

  return (
    <div className="px-6 py-12 max-w-xl mx-auto">
      <h2 className="text-2xl md:text-[28px] font-extrabold tracking-tight leading-tight text-center">
        Falta pouco! Receba seu{" "}
        <span className="bg-yellow-300 px-1 box-decoration-clone">
          diagnóstico personalizado
        </span>
      </h2>
      <p className="mt-3 text-center text-neutral-500">
        Preencha seus dados para liberar o resultado.
      </p>
      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4" noValidate>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            Nome
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-neutral-900 focus:outline-none transition"
            placeholder="Seu nome"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-rose-500">{errors.name}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            WhatsApp
          </label>
          <input
            type="tel"
            value={whatsapp}
            onChange={(e) => setWhatsapp(maskWhatsapp(e.target.value))}
            autoComplete="tel"
            inputMode="numeric"
            className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-neutral-900 focus:outline-none transition"
            placeholder="(11) 99999-9999"
          />
          {errors.whatsapp && (
            <p className="mt-1 text-sm text-rose-500">{errors.whatsapp}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-neutral-900 focus:outline-none transition"
            placeholder="voce@email.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-rose-500">{errors.email}</p>
          )}
        </div>
        {submitError && (
          <p className="text-sm text-rose-500 text-center">{submitError}</p>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="mt-2 w-full py-4 rounded-2xl bg-emerald-500 text-white font-semibold text-lg hover:bg-emerald-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? "Enviando..." : "Ver meu diagnóstico"}
        </button>
        <p className="text-xs text-neutral-400 text-center">
          Seus dados são usados apenas para enviar seu diagnóstico. Sem spam.
        </p>
      </form>
    </div>
  );
}

function GrowthChart() {
  return (
    <svg viewBox="0 0 400 250" className="w-full" aria-label="Gráfico de crescimento">
      <defs>
        <linearGradient id="youline" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="55%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>
        <linearGradient id="youfill" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.18" />
          <stop offset="55%" stopColor="#eab308" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#22c55e" stopOpacity="0.25" />
        </linearGradient>
        <linearGradient id="compfill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#9ca3af" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#9ca3af" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      <g stroke="#e5e7eb" strokeWidth="1" strokeDasharray="3 3">
        <line x1="40" x2="380" y1="30" y2="30" />
        <line x1="40" x2="380" y1="80" y2="80" />
        <line x1="40" x2="380" y1="130" y2="130" />
        <line x1="40" x2="380" y1="180" y2="180" />
      </g>
      <g fill="#9ca3af" fontSize="11" textAnchor="end">
        <text x="35" y="34">100</text>
        <text x="35" y="84">75</text>
        <text x="35" y="134">50</text>
        <text x="35" y="184">25</text>
        <text x="35" y="214">0</text>
      </g>
      <g fill="#6b7280" fontSize="12" textAnchor="middle">
        <text x="60" y="234">Ontem</text>
        <text x="210" y="234">Hoje</text>
        <text x="360" y="234">Amanhã</text>
      </g>

      <path d="M 60 130 Q 130 100 210 90 T 360 35 L 360 210 L 60 210 Z" fill="url(#compfill)" />
      <path d="M 60 130 Q 130 100 210 90 T 360 35" fill="none" stroke="#9ca3af" strokeWidth="3" />

      <path d="M 60 205 Q 130 200 210 175 T 360 35 L 360 210 L 60 210 Z" fill="url(#youfill)" />
      <path d="M 60 205 Q 130 200 210 175 T 360 35" fill="none" stroke="url(#youline)" strokeWidth="3" />

      <circle cx="60" cy="205" r="6" fill="#ef4444" />
      <circle cx="60" cy="130" r="6" fill="#9ca3af" />
      <circle cx="210" cy="175" r="6" fill="#eab308" />
      <circle cx="210" cy="90" r="6" fill="#9ca3af" />
      <circle cx="360" cy="35" r="7" fill="#22c55e" />

      <g>
        <rect x="170" y="55" width="86" height="24" rx="6" fill="#374151" />
        <text x="213" y="71" fill="white" fontSize="12" textAnchor="middle" fontWeight="600">
          Concorrente
        </text>
      </g>
      <g>
        <rect x="180" y="148" width="60" height="22" rx="6" fill="#fbbf24" />
        <text x="210" y="164" fill="#1f2937" fontSize="12" textAnchor="middle" fontWeight="700">
          Você
        </text>
      </g>
    </svg>
  );
}

function ResultStep({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="px-6 py-12 max-w-xl mx-auto">
      <h2 className="text-2xl md:text-[26px] font-extrabold tracking-tight leading-tight text-center">
        <span className="mr-1">⚠️</span> Seu perfil está dando sinais claros de
        baixo crescimento e pouco engajamento...
      </h2>
      <p className="mt-4 text-center text-neutral-500">
        O <strong className="text-neutral-900">Diagnóstico 100K</strong> foi
        criado para encontrar exatamente o que está bloqueando seu perfil e te
        mostrar o que corrigir para atrair mais seguidores e clientes.
      </p>
      <div className="mt-8">
        <GrowthChart />
      </div>
      <p className="mt-4 text-center text-neutral-600">
        Seus concorrentes estão crescendo e você não?{" "}
        <strong className="text-neutral-900">Vamos mudar isso!</strong>
      </p>
      <button
        onClick={onContinue}
        className="mt-10 w-full py-4 rounded-2xl bg-emerald-500 text-white font-semibold text-lg hover:bg-emerald-600 transition"
      >
        Continuar
      </button>
    </div>
  );
}

function CountdownPill() {
  const [seconds, setSeconds] = useState(155);
  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return (
    <div className="bg-rose-50 text-rose-600 text-center py-3 rounded-xl font-medium text-sm">
      Resgate agora seu desconto: {mm}:{ss}
    </div>
  );
}

function PitchStep() {
  return (
    <div className="px-6 py-8 max-w-xl mx-auto">
      <CountdownPill />
      <h2 className="mt-6 text-2xl md:text-[28px] font-extrabold tracking-tight leading-tight text-center">
        Tenha um{" "}
        <span className="bg-emerald-200 px-1 box-decoration-clone">
          diagnóstico de posicionamento
        </span>{" "}
        focado em te fazer atingir 100 mil seguidores no Instagram de forma
        ACELERADA
      </h2>
      <div className="mt-6 aspect-[9/16] max-w-xs mx-auto rounded-2xl overflow-hidden bg-neutral-900 relative">
        <div className="absolute top-3 left-3 right-3 flex items-center gap-2 text-white text-sm">
          <div className="w-8 h-8 rounded-full bg-neutral-700" />
          <div>
            <div className="font-semibold leading-tight">VSL — Diagnóstico</div>
            <div className="text-neutral-400 text-xs leading-tight">
              Augusto Felipe
            </div>
          </div>
        </div>
        <div className="absolute inset-0 grid place-items-center">
          <button
            type="button"
            className="w-16 h-16 rounded-full bg-red-600 grid place-items-center hover:scale-105 transition"
            aria-label="Reproduzir vídeo"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        </div>
      </div>
      <ul className="mt-8 space-y-3 text-neutral-700 text-[15px]">
        <li className="flex gap-2">
          <span className="text-rose-500 font-bold">✗</span>
          <span>
            <strong>Chega</strong> de comprar mentorias caras que falam o óbvio.
          </span>
        </li>
        <li className="flex gap-2">
          <span className="text-rose-500 font-bold">✗</span>
          <span>
            <strong>Chega</strong> de tentar adivinhar o que está errado no seu
            Instagram.
          </span>
        </li>
        <li className="flex gap-2">
          <span className="text-rose-500 font-bold">✗</span>
          <span>
            <strong>Chega</strong> de postar conteúdos que não viralizam e não
            vendem.
          </span>
        </li>
      </ul>
      <h3 className="mt-12 text-xl md:text-2xl font-extrabold text-center leading-tight">
        Conheça o Assistente de Análise do Augusto:
      </h3>
      <p className="mt-3 text-center text-neutral-500 text-sm">
        [continuação da oferta — adicionar conteúdo da página comercial]
      </p>
    </div>
  );
}

export default function Quiz() {
  const [step, setStep] = useState<Step>("intro");
  const [answers, setAnswers] = useState<string[]>([]);

  const stepIndex =
    step === "intro"
      ? 0
      : step === "lead"
        ? 4
        : step === "result"
          ? 5
          : step === "pitch"
            ? 6
            : Number(step);
  const pct = Math.min(100, (stepIndex / 6) * 100);

  const handleAnswer = (answer: string) => {
    setAnswers((prev) => [...prev, answer]);
    if (step === 1) setStep(2);
    else if (step === 2) setStep(3);
    else if (step === 3) setStep("lead");
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col">
      <ProgressBar pct={pct} />
      <main className="flex-1">
        {step === "intro" && <HeroIntro onStart={() => setStep(1)} />}
        {(step === 1 || step === 2 || step === 3) && (
          <QuestionStep idx={Number(step) - 1} onAnswer={handleAnswer} />
        )}
        {step === "lead" && (
          <LeadCapture answers={answers} onSubmitted={() => setStep("result")} />
        )}
        {step === "result" && (
          <ResultStep onContinue={() => setStep("pitch")} />
        )}
        {step === "pitch" && <PitchStep />}
      </main>
      <footer className="text-center text-xs text-neutral-400 py-6">
        © 2026 — augustofelipe.com
      </footer>
    </div>
  );
}
