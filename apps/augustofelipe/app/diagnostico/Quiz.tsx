"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { trackConversion } from "@futurah/tracker-sdk";
import { MENTOR } from "../creator-elite/sessao/lead-data";

// Formata contagem estilo Instagram (4666858 → "4,7 mi", 149339 → "149 mil").
function igNum(n: number): string {
  if (n >= 1_000_000)
    return (n / 1_000_000).toFixed(1).replace(".0", "").replace(".", ",") + " mi";
  if (n >= 10_000) return Math.round(n / 1000) + " mil";
  return n.toLocaleString("pt-BR");
}

type Step = "intro" | 1 | 2 | 3 | "lead" | "result" | "pitch" | "waitlist";

type QuizMode = "pitch" | "waitlist";

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

// Checkout do workshop "Construindo um Viral" (R$ 47) — Cakto.
const CHECKOUT_URL = "https://pay.cakto.com.br/6ffyvt6_881155";

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

// Aceita "@usuario", "usuario", "instagram.com/usuario",
// "https://www.instagram.com/usuario/" e devolve só o handle.
function normalizeInstagram(v: string) {
  return v
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/^(www\.)?instagram\.com\//i, "")
    .replace(/^@/, "")
    .replace(/\/+$/, "")
    .split(/[/?#]/)[0];
}

// Handles do Instagram: letras, números, ponto e underline; 1–30 chars.
function isValidInstagram(handle: string) {
  return /^[A-Za-z0-9._]{1,30}$/.test(handle);
}

function LeadCapture({
  answers,
  onSubmitted,
}: {
  answers: string[];
  onSubmitted: () => void;
}) {
  const [name, setName] = useState("");
  const [instagram, setInstagram] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validate = () => {
    const e: Record<string, string> = {};
    if (name.trim().length < 2) e.name = "Informe seu nome.";
    const ig = normalizeInstagram(instagram);
    if (!isValidInstagram(ig)) e.instagram = "Informe seu @ do Instagram.";
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
          instagram: normalizeInstagram(instagram),
          whatsapp: onlyDigits(whatsapp),
          email: email.trim().toLowerCase(),
          answers,
          source: "diagnostico",
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      // Conversão deduplicada pixel×CAPI (Worker reenvia server-side).
      trackConversion("Lead", {
        value: 47,
        currency: "BRL",
        email: email.trim().toLowerCase(),
        phone: onlyDigits(whatsapp),
      });
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
            Instagram
          </label>
          <input
            type="text"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-neutral-900 focus:outline-none transition"
            placeholder="@seu.usuario"
          />
          {errors.instagram && (
            <p className="mt-1 text-sm text-rose-500">{errors.instagram}</p>
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
  const DURATION = 15 * 60; // 15 min
  const [seconds, setSeconds] = useState<number | null>(null);
  useEffect(() => {
    const KEY = "cv_countdown_end";
    let end = Number(localStorage.getItem(KEY));
    if (!end || Number.isNaN(end) || end < Date.now()) {
      end = Date.now() + DURATION * 1000;
      localStorage.setItem(KEY, String(end));
    }
    const tick = () =>
      setSeconds(Math.max(0, Math.round((end - Date.now()) / 1000)));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);
  // null na 1ª render evita mismatch de hidratação.
  if (seconds === null) return null;
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return (
    <div className="bg-rose-50 text-rose-600 text-center py-3 rounded-xl font-medium text-sm">
      Preço de lançamento encerra em: {mm}:{ss}
    </div>
  );
}

function CheckoutCTA({ label }: { label: string }) {
  // Dispara InitiateCheckout (pixel×CAPI) em onPointerDown pra o evento sair
  // antes da navegação pro Cakto. O Purchase é disparado pelo próprio Cakto.
  const handleCheckout = () => {
    trackConversion("InitiateCheckout", { value: 47, currency: "BRL" });
  };
  return (
    <a
      href={CHECKOUT_URL}
      onPointerDown={handleCheckout}
      className="block w-full py-4 rounded-2xl bg-emerald-500 text-center text-white font-semibold text-lg hover:bg-emerald-600 transition"
    >
      {label} →
    </a>
  );
}

const FAQ_ITEMS = [
  {
    q: "Funciona pro meu nicho?",
    a: "Sim. O Construindo um Viral é sobre o processo por trás de um conteúdo que viraliza — e isso vale pra qualquer nicho: arte, fitness, gastronomia, negócios, construção, moda. Você aprende a adaptar pra sua realidade.",
  },
  {
    q: "Preciso de equipamento ou edição cara?",
    a: "Não. Tudo é feito com o celular que você já tem. Sem câmera profissional, sem programa caro, sem equipe.",
  },
  {
    q: "Em quanto tempo vejo resultado?",
    a: "O foco é você aplicar já nos primeiros 7 dias. O diagnóstico do seu perfil vem com um plano específico pra começar a ajustar essa semana — o resultado depende da sua execução.",
  },
  {
    q: "Como recebo o acesso?",
    a: "Assim que o pagamento é aprovado, você recebe o acesso ao workshop e ao diagnóstico. É online: assiste quando e quantas vezes quiser.",
  },
  {
    q: "O diagnóstico é genérico ou do meu perfil?",
    a: "É do SEU perfil. A gente olha seu Instagram hoje — bio, conteúdo, consistência, métricas e posicionamento — e entrega uma nota em cada ponto com um plano de 7 dias.",
  },
  {
    q: "E se eu não gostar?",
    a: "Você tem 7 dias de garantia. Se aplicar o que o Augusto ensina e sentir que não valeu os R$ 47, é só mandar uma mensagem e devolvemos tudo. Sem burocracia.",
  },
];

function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="mt-12">
      <h3 className="text-xl md:text-2xl font-extrabold text-center leading-tight">
        Perguntas frequentes
      </h3>
      <div className="mt-6 flex flex-col gap-3">
        {FAQ_ITEMS.map((item, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-xl border border-neutral-200"
          >
            <button
              type="button"
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
            >
              <span className="text-[15px] font-semibold text-neutral-900">
                {item.q}
              </span>
              <span className="shrink-0 text-xl text-neutral-400">
                {open === i ? "−" : "+"}
              </span>
            </button>
            {open === i && (
              <p className="px-4 pb-4 text-[14px] leading-relaxed text-neutral-600">
                {item.a}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function VslPlayer() {
  const [playing, setPlaying] = useState(false);
  const id = "ThYyzqhNLd4";
  return (
    <div className="mt-8 aspect-[4/5] max-w-md mx-auto rounded-2xl overflow-hidden bg-neutral-900 relative">
      {playing ? (
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0`}
          title="Como eu cheguei a 59M de views sem pagar nada"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label="Reproduzir vídeo"
          className="group absolute inset-0 h-full w-full"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://img.youtube.com/vi/${id}/maxresdefault.jpg`}
            alt="Como eu cheguei a 59M de views sem pagar nada"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 transition group-hover:bg-black/20" />
          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 grid h-14 w-14 place-items-center rounded-full bg-red-600 transition group-hover:scale-105">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}

function ReelsProof() {
  const reels = MENTOR.reels.slice(0, 6);
  return (
    <div className="mt-12">
      <h3 className="text-xl md:text-2xl font-extrabold text-center leading-tight">
        Não é sorte. É{" "}
        <span className="bg-yellow-300 px-1 box-decoration-clone">processo</span>.
      </h3>
      <p className="mt-3 text-center text-neutral-500">
        Alguns dos reels do Augusto aplicando exatamente o que ele ensina no
        workshop — sem pagar um real em anúncio.
      </p>
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {reels.map((r, i) => (
          <div
            key={i}
            className="relative aspect-[3/4] overflow-hidden rounded-xl bg-neutral-900"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={r.thumb}
              alt={`Reel ${i + 1}`}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-2">
              <div className="flex items-center gap-1 text-[13px] font-bold text-white drop-shadow">
                <svg viewBox="0 0 24 24" className="h-3 w-3 fill-white">
                  <path d="M8 5v14l11-7z" />
                </svg>
                {igNum(r.views)}
              </div>
              <div className="mt-0.5 flex items-center gap-2 text-[10px] font-medium text-neutral-200">
                <span className="flex items-center gap-0.5">
                  <svg viewBox="0 0 24 24" className="h-2.5 w-2.5 fill-rose-400">
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
    </div>
  );
}

export function PitchStep() {
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

      <VslPlayer />

      <div className="mt-6 text-center">
        <CheckoutCTA label="Quero acessar por R$ 47" />
        <p className="mt-2 text-sm text-neutral-500">
          ou 2x de{" "}
          <strong className="text-neutral-700">R$ 24,50</strong> sem juros
        </p>
      </div>

      <ReelsProof />

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
      <div className="mt-6 overflow-hidden rounded-2xl border border-neutral-200 shadow-sm bg-white">
        <Image
          src="/construindo-um-viral/exemplo-diagnostico.png"
          alt="Exemplo de diagnóstico de perfil feito pela IA do Construindo um Viral"
          width={647}
          height={748}
          className="h-auto w-full"
        />
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

      <FaqSection />

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

function WaitlistStep({ answers }: { answers: string[] }) {
  const [name, setName] = useState("");
  const [instagram, setInstagram] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (name.trim().length < 2) e.name = "Informe seu nome.";
    const ig = normalizeInstagram(instagram);
    if (!isValidInstagram(ig)) e.instagram = "Informe seu @ do Instagram.";
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
          instagram: normalizeInstagram(instagram),
          whatsapp: onlyDigits(whatsapp),
          email: email.trim().toLowerCase(),
          answers,
          source: "waitlist",
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      // Lead da lista de espera — mesma dedup pixel×CAPI.
      trackConversion("Lead", {
        value: 47,
        currency: "BRL",
        email: email.trim().toLowerCase(),
        phone: onlyDigits(whatsapp),
      });
      setDone(true);
    } catch {
      setSubmitError("Não foi possível enviar agora. Tente novamente.");
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="px-6 py-16 max-w-xl mx-auto text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 grid place-items-center text-3xl">
          ✓
        </div>
        <h2 className="mt-6 text-2xl md:text-[28px] font-extrabold tracking-tight leading-tight">
          Pronto, você está na lista.
        </h2>
        <p className="mt-4 text-neutral-600">
          Assim que o <strong className="text-neutral-900">Construindo um Viral</strong>{" "}
          sair, você vai receber o link antes de todo mundo.
        </p>
        <p className="mt-3 text-neutral-600">
          Quem está na lista paga o preço de lançamento —{" "}
          <span className="bg-yellow-300 px-1 box-decoration-clone font-semibold">
            R$ 47
          </span>{" "}
          em vez de R$ 197.
        </p>
        <p className="mt-6 text-sm text-neutral-500 italic">
          Fica de olho no email e no WhatsApp. Sem spam, só o aviso de
          lançamento.
        </p>
      </div>
    );
  }

  return (
    <div className="px-6 py-12 max-w-xl mx-auto">
      <p className="text-center text-xs uppercase tracking-widest text-neutral-500">
        Pré-lançamento
      </p>
      <h2 className="mt-3 text-2xl md:text-[28px] font-extrabold tracking-tight leading-tight text-center">
        Entre na lista de espera do{" "}
        <span className="bg-yellow-300 px-1 box-decoration-clone">
          Construindo um Viral
        </span>
      </h2>
      <p className="mt-4 text-center text-neutral-600">
        O workshop ainda não está aberto. Quem entra na lista é avisado{" "}
        <strong className="text-neutral-900">primeiro</strong> quando o curso
        sair e paga{" "}
        <strong className="text-neutral-900">preço de lançamento</strong>.
      </p>

      <ul className="mt-8 space-y-3 text-neutral-700 text-[15px]">
        <li className="flex gap-2">
          <span className="text-emerald-500 font-bold">→</span>
          <span>Aviso de lançamento por email e WhatsApp, antes de virar público</span>
        </li>
        <li className="flex gap-2">
          <span className="text-emerald-500 font-bold">→</span>
          <span>
            Acesso ao preço de lançamento:{" "}
            <span className="bg-yellow-300 px-1 box-decoration-clone font-semibold">
              R$ 47
            </span>{" "}
            (vai pra R$ 197 depois)
          </span>
        </li>
        <li className="flex gap-2">
          <span className="text-emerald-500 font-bold">→</span>
          <span>
            Bônus exclusivo da lista: diagnóstico completo do seu perfil junto
            do workshop
          </span>
        </li>
      </ul>

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
            Instagram
          </label>
          <input
            type="text"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-neutral-900 focus:outline-none transition"
            placeholder="@seu.usuario"
          />
          {errors.instagram && (
            <p className="mt-1 text-sm text-rose-500">{errors.instagram}</p>
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
          {submitting ? "Enviando..." : "Quero entrar na lista"}
        </button>
        <p className="text-xs text-neutral-400 text-center">
          Sem spam. Só o aviso de lançamento.
        </p>
      </form>
    </div>
  );
}

export default function Quiz({ mode = "pitch" }: { mode?: QuizMode } = {}) {
  const [step, setStep] = useState<Step>("intro");
  const [answers, setAnswers] = useState<string[]>([]);

  const finalStep: Step = mode === "waitlist" ? "waitlist" : "pitch";

  const stepIndex =
    step === "intro"
      ? 0
      : step === "lead"
        ? 4
        : step === "result"
          ? 5
          : step === "pitch" || step === "waitlist"
            ? 6
            : Number(step);
  const pct = Math.min(100, (stepIndex / 6) * 100);

  const handleAnswer = (answer: string) => {
    setAnswers((prev) => [...prev, answer]);
    if (step === 1) setStep(2);
    else if (step === 2) setStep(3);
    // No pitch, captura o lead (gate) antes de liberar o resultado. No waitlist
    // a captura é o próprio WaitlistStep, então pula direto pro resultado.
    else if (step === 3) setStep(mode === "waitlist" ? "result" : "lead");
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
          <ResultStep answers={answers} onContinue={() => setStep(finalStep)} />
        )}
        {step === "pitch" && <PitchStep />}
        {step === "waitlist" && <WaitlistStep answers={answers} />}
      </main>
      <footer className="text-center text-xs text-neutral-400 py-6">
        © 2026 — augustofelipe.com
      </footer>
    </div>
  );
}
