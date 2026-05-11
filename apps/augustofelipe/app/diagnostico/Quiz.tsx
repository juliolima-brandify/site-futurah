"use client";

import Image from "next/image";
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
      <div className="mt-8 relative aspect-video rounded-2xl overflow-hidden bg-neutral-900">
        <Image
          src="/diagnostico-hero.png"
          alt="Augusto Felipe analisando perfis do Instagram"
          fill
          priority
          sizes="(min-width: 768px) 576px, 100vw"
          className="object-cover"
        />
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

function EngagementBars() {
  return (
    <svg viewBox="0 0 400 250" className="w-full" aria-label="Engajamento — agora vs. com ajuste vs. potencial">
      <defs>
        <linearGradient id="barLow" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#fca5a5" />
        </linearGradient>
        <linearGradient id="barMid" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#fde68a" />
        </linearGradient>
        <linearGradient id="barHigh" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#86efac" />
        </linearGradient>
      </defs>

      <g stroke="#e5e7eb" strokeWidth="1" strokeDasharray="3 3">
        <line x1="40" x2="380" y1="40" y2="40" />
        <line x1="40" x2="380" y1="100" y2="100" />
        <line x1="40" x2="380" y1="160" y2="160" />
        <line x1="40" x2="380" y1="200" y2="200" />
      </g>

      <rect x="80" y="170" width="60" height="30" rx="6" fill="url(#barLow)" />
      <text x="110" y="158" fill="#374151" fontSize="12" textAnchor="middle" fontWeight="600">
        Agora
      </text>
      <text x="110" y="225" fill="#9ca3af" fontSize="11" textAnchor="middle">
        baixo
      </text>

      <rect x="180" y="105" width="60" height="95" rx="6" fill="url(#barMid)" />
      <text x="210" y="93" fill="#374151" fontSize="12" textAnchor="middle" fontWeight="600">
        Com ajuste
      </text>
      <text x="210" y="225" fill="#9ca3af" fontSize="11" textAnchor="middle">
        médio
      </text>

      <rect x="280" y="45" width="60" height="155" rx="6" fill="url(#barHigh)" />
      <text x="310" y="33" fill="#374151" fontSize="12" textAnchor="middle" fontWeight="600">
        Potencial
      </text>
      <text x="310" y="225" fill="#9ca3af" fontSize="11" textAnchor="middle">
        alto
      </text>
    </svg>
  );
}

function ReachIndicator() {
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 flex items-start gap-3">
        <span className="text-lg leading-none">🔴</span>
        <div className="text-sm">
          <div className="font-semibold text-rose-700">Alcance atual</div>
          <div className="text-rose-600">
            quase zero fora dos seus seguidores
          </div>
        </div>
      </div>
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 flex items-start gap-3">
        <span className="text-lg leading-none">🟢</span>
        <div className="text-sm">
          <div className="font-semibold text-emerald-700">Potencial</div>
          <div className="text-emerald-700">
            65%+ de alcance para não seguidores
          </div>
        </div>
      </div>
    </div>
  );
}

type Variant = "seguidores" | "engajamento" | "alcance";

// A copy do pré-diagnóstico é determinada pela resposta da pergunta sobre
// "o que mais te incomoda" (índice 1 do array de respostas).
function variantFromAnswers(answers: string[]): Variant {
  const a = (answers[1] ?? "").toLowerCase();
  if (a.includes("seguidor")) return "seguidores";
  if (a.includes("curtid") || a.includes("comentár")) return "engajamento";
  if (a.includes("alcance")) return "alcance";
  return "seguidores";
}

function ResultStep({
  answers,
  onContinue,
}: {
  answers: string[];
  onContinue: () => void;
}) {
  const variant = variantFromAnswers(answers);

  if (variant === "seguidores") {
    return (
      <div className="px-6 py-12 max-w-xl mx-auto">
        <h2 className="text-2xl md:text-[26px] font-extrabold tracking-tight leading-tight text-center">
          <span className="mr-1">⚠️</span> Seu perfil está crescendo abaixo do
          potencial.
        </h2>
        <p className="mt-4 text-neutral-600">
          Com base nas suas respostas, seu principal bloqueio é a aquisição de
          novos seguidores. Você posta, mas o algoritmo não está empurrando seu
          conteúdo para novas pessoas.
        </p>
        <p className="mt-3 text-neutral-900 font-semibold">
          Isso não é falta de qualidade. É falta de processo.
        </p>
        <div className="mt-8">
          <GrowthChart />
        </div>
        <p className="mt-4 text-center text-neutral-600 italic">
          Seus concorrentes estão crescendo. Você ainda não.
        </p>
        <p className="mt-6 text-neutral-600">
          O <strong className="text-neutral-900">Diagnóstico Viral</strong> vai
          identificar exatamente o que está impedindo novos seguidores de te
          encontrar — e o que ajustar pra mudar isso essa semana.
        </p>
        <button
          onClick={onContinue}
          className="mt-8 w-full py-4 rounded-2xl bg-emerald-500 text-white font-semibold text-lg hover:bg-emerald-600 transition"
        >
          Ver como resolver isso →
        </button>
      </div>
    );
  }

  if (variant === "engajamento") {
    return (
      <div className="px-6 py-12 max-w-xl mx-auto">
        <h2 className="text-2xl md:text-[26px] font-extrabold tracking-tight leading-tight text-center">
          <span className="mr-1">⚠️</span> Seu perfil tem um problema silencioso.
        </h2>
        <p className="mt-4 text-neutral-600">
          Com base nas suas respostas, você tem seguidores — mas eles não estão
          reagindo ao seu conteúdo. Poucos comentários, poucas curtidas, baixa
          interação.
        </p>
        <p className="mt-3 text-neutral-600">
          Sabe o que isso sinaliza pro algoritmo? Que seu conteúdo não é
          relevante. E quando o algoritmo pensa isso, ele para de distribuir.
        </p>
        <p className="mt-3 text-neutral-900 font-semibold">
          Isso tem solução. E é mais simples do que parece.
        </p>
        <div className="mt-8">
          <EngagementBars />
        </div>
        <p className="mt-6 text-neutral-600">
          O <strong className="text-neutral-900">Diagnóstico Viral</strong> vai
          mostrar o que está matando a interação do seu conteúdo — e o que fazer
          nos próximos 7 dias pra reverter isso.
        </p>
        <button
          onClick={onContinue}
          className="mt-8 w-full py-4 rounded-2xl bg-emerald-500 text-white font-semibold text-lg hover:bg-emerald-600 transition"
        >
          Quero resolver o engajamento →
        </button>
      </div>
    );
  }

  return (
    <div className="px-6 py-12 max-w-xl mx-auto">
      <h2 className="text-2xl md:text-[26px] font-extrabold tracking-tight leading-tight text-center">
        <span className="mr-1">⚠️</span> Seus vídeos estão morrendo antes de
        chegar em alguém.
      </h2>
      <p className="mt-4 text-neutral-600">
        Com base nas suas respostas, o problema não é o conteúdo em si — é que
        ele não está chegando em novas pessoas. Você posta e as views ficam só
        na sua base atual. Às vezes nem isso.
      </p>
      <p className="mt-3 text-neutral-600">
        Isso é um sinal claro: o algoritmo não está reconhecendo o seu conteúdo
        como relevante o suficiente pra distribuir.
      </p>
      <p className="mt-3 text-neutral-900 font-semibold">
        Mas existe um padrão específico que faz o algoritmo mudar de ideia.
      </p>
      <div className="mt-8">
        <ReachIndicator />
      </div>
      <p className="mt-6 text-neutral-600">
        O <strong className="text-neutral-900">Diagnóstico Viral</strong>{" "}
        identifica os bloqueios que impedem o algoritmo de distribuir seu
        conteúdo — e entrega um plano de 7 dias pra você começar a viralizar.
      </p>
      <button
        onClick={onContinue}
        className="mt-8 w-full py-4 rounded-2xl bg-emerald-500 text-white font-semibold text-lg hover:bg-emerald-600 transition"
      >
        Quero alcançar mais pessoas →
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
      Preço de lançamento encerra em: {mm}:{ss}
    </div>
  );
}

function CheckoutCTA({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="w-full py-4 rounded-2xl bg-emerald-500 text-white font-semibold text-lg hover:bg-emerald-600 transition"
    >
      {label} →
    </button>
  );
}

function PitchStep() {
  return (
    <div className="px-6 py-8 max-w-xl mx-auto">
      <CountdownPill />

      <h2 className="mt-8 text-2xl md:text-[28px] font-extrabold tracking-tight leading-tight text-center">
        Aprenda o processo de quem chegou a{" "}
        <span className="bg-emerald-200 px-1 box-decoration-clone">
          59 milhões de views por mês
        </span>{" "}
        sem pagar tráfego — e construa seu primeiro viral ainda essa semana.
      </h2>
      <p className="mt-4 text-center text-neutral-500">
        Chega de postar no escuro. Chega de adivinhar o que funciona.
      </p>

      <div className="mt-8 aspect-video max-w-md mx-auto rounded-2xl overflow-hidden bg-neutral-900 relative">
        <div className="absolute inset-0 grid place-items-center px-6 text-center text-white">
          <div>
            <p className="text-xs uppercase tracking-widest text-neutral-400">
              VSL · Augusto Felipe · ~5 min
            </p>
            <p className="mt-2 font-semibold leading-tight">
              Como eu cheguei a 59M de views sem pagar nada
            </p>
          </div>
        </div>
        <button
          type="button"
          aria-label="Reproduzir vídeo"
          className="absolute bottom-4 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-red-600 grid place-items-center hover:scale-105 transition"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      </div>

      <h3 className="mt-12 text-xl md:text-2xl font-extrabold text-center leading-tight">
        Chega de...
      </h3>
      <ul className="mt-5 space-y-3 text-neutral-700 text-[15px]">
        <li className="flex gap-2">
          <span className="text-rose-500 font-bold">✗</span>
          <span>Chega de comprar curso que não entrega resultado.</span>
        </li>
        <li className="flex gap-2">
          <span className="text-rose-500 font-bold">✗</span>
          <span>Chega de postar todo dia e ver zero crescimento.</span>
        </li>
        <li className="flex gap-2">
          <span className="text-rose-500 font-bold">✗</span>
          <span>
            Chega de adivinhar se o erro tá no áudio, no horário ou no
            algoritmo.
          </span>
        </li>
        <li className="flex gap-2">
          <span className="text-rose-500 font-bold">✗</span>
          <span>
            Chega de ver criadores do seu nicho viralizando enquanto você fica
            parado.
          </span>
        </li>
      </ul>

      <h3 className="mt-12 text-xl md:text-2xl font-extrabold text-center leading-tight">
        Conheça o{" "}
        <span className="bg-yellow-300 px-1 box-decoration-clone">
          Construindo um Viral
        </span>
      </h3>
      <p className="mt-4 text-neutral-700">
        Um workshop direto ao ponto com tudo que você precisa pra criar o seu
        primeiro viral — do processo criativo até a publicação.
      </p>
      <p className="mt-3 text-neutral-700">
        Não é teoria. É o processo real de quem chegou a 59 milhões de views
        por mês partindo do zero, sem agência, sem equipamento caro e sem pagar
        um centavo em anúncio.
      </p>
      <p className="mt-6 font-semibold text-neutral-900">
        No workshop você vai aprender:
      </p>
      <ul className="mt-3 space-y-2.5 text-neutral-700 text-[15px]">
        <li className="flex gap-2">
          <span className="text-emerald-500 font-bold">→</span>
          <span>
            Como eu penso um vídeo antes de gravar — do zero ao roteiro em 10
            minutos
          </span>
        </li>
        <li className="flex gap-2">
          <span className="text-emerald-500 font-bold">→</span>
          <span>Como montar um perfil que o algoritmo reconhece e distribui</span>
        </li>
        <li className="flex gap-2">
          <span className="text-emerald-500 font-bold">→</span>
          <span>
            Como analisar vídeos virais e identificar o padrão que faz eles
            explodirem
          </span>
        </li>
        <li className="flex gap-2">
          <span className="text-emerald-500 font-bold">→</span>
          <span>Como gravar do jeito certo só com o celular que você já tem</span>
        </li>
        <li className="flex gap-2">
          <span className="text-emerald-500 font-bold">→</span>
          <span>
            Como editar rápido e publicar hoje — sem precisar de nada além do
            que você já tem
          </span>
        </li>
      </ul>

      <h3 className="mt-12 text-xl md:text-2xl font-extrabold text-center leading-tight">
        Bônus — Diagnóstico completo do perfil
      </h3>
      <p className="mt-4 text-neutral-700">
        E além do workshop, você ainda vai receber uma análise completa e
        individual do seu perfil.
      </p>
      <p className="mt-3 text-neutral-700">
        Vamos olhar pro seu Instagram hoje — bio, conteúdo, consistência,
        métricas e posicionamento — e entregar um diagnóstico com nota em cada
        ponto e um plano de 7 dias específico pra você.
      </p>
      <p className="mt-3 text-neutral-900 font-semibold">
        Não é uma análise genérica. É do seu perfil. Do jeito que ele está
        agora.
      </p>
      <div className="mt-6 aspect-[4/3] rounded-2xl bg-neutral-100 grid place-items-center text-neutral-400 text-sm">
        [print de exemplo de diagnóstico]
      </div>

      <h3 className="mt-12 text-xl md:text-2xl font-extrabold text-center leading-tight">
        Para quem é esse workshop
      </h3>
      <ul className="mt-5 space-y-2.5 text-neutral-700 text-[15px]">
        <li className="flex gap-2">
          <span className="text-emerald-500 font-bold">✅</span>
          <span>
            Para quem quer criar conteúdo do zero e não sabe por onde começar
          </span>
        </li>
        <li className="flex gap-2">
          <span className="text-emerald-500 font-bold">✅</span>
          <span>
            Para quem já posta mas não consegue viralizar de forma consistente
          </span>
        </li>
        <li className="flex gap-2">
          <span className="text-emerald-500 font-bold">✅</span>
          <span>
            Para quem quer entender o que de verdade faz um vídeo explodir
          </span>
        </li>
        <li className="flex gap-2">
          <span className="text-emerald-500 font-bold">✅</span>
          <span>
            Para qualquer nicho — arte, gastronomia, fitness, negócios,
            construção, moda
          </span>
        </li>
        <li className="flex gap-2 pt-2">
          <span className="text-rose-500 font-bold">❌</span>
          <span>Não é pra quem quer resultado sem fazer nada</span>
        </li>
        <li className="flex gap-2">
          <span className="text-rose-500 font-bold">❌</span>
          <span>
            Não é pra quem já tem um método que funciona e quer só escalar
          </span>
        </li>
      </ul>

      <div className="mt-12 rounded-2xl border border-neutral-200 p-6 text-center">
        <p className="text-sm font-semibold text-neutral-900">
          Workshop + Diagnóstico do Perfil
        </p>
        <p className="mt-3 text-neutral-400 line-through text-sm">De R$ 197</p>
        <p className="mt-1 text-5xl font-extrabold text-neutral-900">R$ 47</p>
        <p className="mt-1 text-sm text-neutral-500 italic">
          ou 2x R$ 24,50 sem juros
        </p>
        <div className="mt-6">
          <CheckoutCTA label="Quero construir meu viral" />
        </div>
        <p className="mt-3 text-xs text-neutral-500">
          🔒 Pagamento seguro · Pix, cartão ou boleto
        </p>
        <p className="mt-2 text-xs text-neutral-400 italic">
          Preço de lançamento. Em breve sobe para R$ 197.
        </p>
      </div>

      <div className="mt-8 rounded-2xl bg-neutral-50 p-5 border border-neutral-200">
        <h4 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
          <span>🛡️</span> Garantia de 7 dias
        </h4>
        <p className="mt-2 text-neutral-700 text-sm">
          Se você assistir o workshop, aplicar o que eu ensino nos primeiros 7
          dias e sentir que não valeu R$ 47 — me manda uma mensagem e eu
          devolvo tudo. Sem burocracia, sem pergunta.
        </p>
        <p className="mt-2 text-neutral-700 text-sm">
          Eu só peço uma coisa: tenta de verdade antes de pedir o reembolso.
        </p>
      </div>

      <div className="mt-12 text-center">
        <p className="text-neutral-700">
          Se você chegou até aqui, você já sabe que o problema do seu perfil tem
          solução.
        </p>
        <p className="mt-3 text-neutral-700">
          A única diferença entre você hoje e você com o primeiro viral é
          esse passo.
        </p>
        <p className="mt-3 text-neutral-700">
          Clica no botão, garante o workshop e o diagnóstico do seu perfil, e
          começa hoje.
        </p>
        <div className="mt-6">
          <CheckoutCTA label="Quero construir meu viral" />
        </div>
        <p className="mt-3 text-xs text-neutral-500 italic">
          R$ 47 · Acesso imediato · Garantia de 7 dias
        </p>
      </div>
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
    // LeadCapture desativado por enquanto — pula direto pro resultado.
    else if (step === 3) setStep("result");
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
          <ResultStep answers={answers} onContinue={() => setStep("pitch")} />
        )}
        {step === "pitch" && <PitchStep />}
      </main>
      <footer className="text-center text-xs text-neutral-400 py-6">
        © 2026 — augustofelipe.com
      </footer>
    </div>
  );
}
