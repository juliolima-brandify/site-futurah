"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type FormData = {
  name: string;
  email: string;
  whatsapp: string;
  instagram: string;

  nichoCategoria: string;
  nichoCategoriaOutro: string;
  nichoDescricao: string;

  posicionamento: string;

  // Etapa 2 — Diagnóstico Estratégico Profundo
  diagPerfil: string;
  diagBio: string;
  diagConcorrentes: string;
  diagNichoFunciona: string;
  diagPadroesVirais: string;
  diagOportunidades: string;
  diagFormatosAlta: string;
  diagRetencao: string;
  diagLinguagem: string;
  diagFormatos: string;
  diagDiferenciacao: string;

  monetizacaoTipo: string;
  monetizacaoTipoOutro: string;
  faturamento: string;

  percepcao: string;
  dores: string;
  bloqueios: string;

  objetivoMeta: string;
  objetivoPrazo: string;
};

const EMPTY: FormData = {
  name: "",
  email: "",
  whatsapp: "",
  instagram: "",
  nichoCategoria: "",
  nichoCategoriaOutro: "",
  nichoDescricao: "",
  posicionamento: "",
  diagPerfil: "",
  diagBio: "",
  diagConcorrentes: "",
  diagNichoFunciona: "",
  diagPadroesVirais: "",
  diagOportunidades: "",
  diagFormatosAlta: "",
  diagRetencao: "",
  diagLinguagem: "",
  diagFormatos: "",
  diagDiferenciacao: "",
  monetizacaoTipo: "",
  monetizacaoTipoOutro: "",
  faturamento: "",
  percepcao: "",
  dores: "",
  bloqueios: "",
  objetivoMeta: "",
  objetivoPrazo: "",
};

const STORAGE_KEY = "creator-elite-onboarding-v1";

const NICHOS = [
  "Negócios / Empreendedorismo",
  "Estilo de vida",
  "Educação",
  "Fitness / Saúde",
  "Gastronomia",
  "Moda / Beleza",
  "Arte / Cultura",
  "Outro",
];

const POSICIONAMENTOS = [
  "Ainda não tenho um posicionamento claro",
  "Tenho ideia mas ainda não está consolidado",
  "Está consolidado e quero amplificar",
  "Está consolidado mas não está convertendo",
];

const MONETIZACOES = [
  "Ainda não monetizo",
  "Publi pontual com marcas",
  "Produto / serviço próprio",
  "Combo (publi + produto próprio)",
  "Outro",
];

const FATURAMENTOS = [
  "R$ 0",
  "Até R$ 5.000",
  "R$ 5.000 a R$ 20.000",
  "R$ 20.000 a R$ 50.000",
  "R$ 50.000 a R$ 100.000",
  "R$ 100.000+",
  "Prefiro não dizer",
];

const PRAZOS = [
  "Até 30 dias",
  "Em 60 dias",
  "Em 90 dias",
  "Mais de 90 dias",
];

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

function normalizeInstagram(v: string) {
  return v
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/^(www\.)?instagram\.com\//i, "")
    .replace(/^@/, "")
    .replace(/\/+$/, "")
    .split(/[/?#]/)[0];
}

function isValidInstagram(handle: string) {
  return /^[A-Za-z0-9._]{1,30}$/.test(handle);
}

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

type Errors = Partial<Record<keyof FormData, string>>;

type Step = {
  key: string;
  label: string;
  validate: (data: FormData) => Errors;
};

const STEPS: Step[] = [
  {
    key: "identificacao",
    label: "Identificação",
    validate: (d) => {
      const e: Errors = {};
      if (d.name.trim().length < 2) e.name = "Informe seu nome completo.";
      if (!isValidEmail(d.email)) e.email = "Email inválido.";
      const digits = onlyDigits(d.whatsapp);
      if (digits.length < 10 || digits.length > 11)
        e.whatsapp = "WhatsApp inválido — inclua DDD.";
      if (!isValidInstagram(normalizeInstagram(d.instagram)))
        e.instagram = "Informe seu @ do Instagram.";
      return e;
    },
  },
  {
    key: "nicho",
    label: "Nicho",
    validate: (d) => {
      const e: Errors = {};
      if (!d.nichoCategoria) e.nichoCategoria = "Escolha uma opção.";
      if (d.nichoCategoria === "Outro" && d.nichoCategoriaOutro.trim().length < 2)
        e.nichoCategoriaOutro = "Descreva o nicho.";
      if (d.nichoDescricao.trim().length < 20)
        e.nichoDescricao = "Descreva o ângulo do seu perfil (mínimo 20 caracteres).";
      return e;
    },
  },
  {
    key: "posicionamento",
    label: "Posicionamento",
    validate: (d) => {
      const e: Errors = {};
      if (!d.posicionamento) e.posicionamento = "Escolha uma opção.";
      return e;
    },
  },
  {
    key: "diag-perfil",
    label: "Perfil & bio",
    validate: (d) => {
      const e: Errors = {};
      if (d.diagPerfil.trim().length < 30)
        e.diagPerfil = "Descreva com mais detalhe (mínimo 30 caracteres).";
      if (d.diagBio.trim().length < 5)
        e.diagBio = "Cole sua bio atual.";
      return e;
    },
  },
  {
    key: "diag-concorrentes",
    label: "Concorrentes",
    validate: (d) => {
      const e: Errors = {};
      if (d.diagConcorrentes.trim().length < 6)
        e.diagConcorrentes = "Liste pelo menos um perfil de referência.";
      if (d.diagNichoFunciona.trim().length < 10)
        e.diagNichoFunciona = "Conte o que funciona no nicho (mínimo 10 caracteres).";
      if (d.diagPadroesVirais.trim().length < 10)
        e.diagPadroesVirais = "Descreva os padrões virais (mínimo 10 caracteres).";
      if (d.diagOportunidades.trim().length < 10)
        e.diagOportunidades = "Aponte ao menos uma oportunidade (mínimo 10 caracteres).";
      if (d.diagFormatosAlta.trim().length < 10)
        e.diagFormatosAlta = "Liste os formatos em alta (mínimo 10 caracteres).";
      return e;
    },
  },
  {
    key: "diag-conteudo",
    label: "Conteúdo & diferenciação",
    validate: (d) => {
      const e: Errors = {};
      if (d.diagRetencao.trim().length < 10)
        e.diagRetencao = "Conte como está sua retenção (mínimo 10 caracteres).";
      if (d.diagLinguagem.trim().length < 10)
        e.diagLinguagem = "Descreva sua linguagem / tom (mínimo 10 caracteres).";
      if (d.diagFormatos.trim().length < 10)
        e.diagFormatos = "Liste os formatos que mais usa (mínimo 10 caracteres).";
      if (d.diagDiferenciacao.trim().length < 20)
        e.diagDiferenciacao = "Conte o que te diferencia (mínimo 20 caracteres).";
      return e;
    },
  },
  {
    key: "monetizacao",
    label: "Monetização",
    validate: (d) => {
      const e: Errors = {};
      if (!d.monetizacaoTipo) e.monetizacaoTipo = "Escolha uma opção.";
      if (d.monetizacaoTipo === "Outro" && d.monetizacaoTipoOutro.trim().length < 2)
        e.monetizacaoTipoOutro = "Descreva.";
      if (!d.faturamento) e.faturamento = "Escolha uma faixa.";
      return e;
    },
  },
  {
    key: "percepcao",
    label: "Percepção atual",
    validate: (d) => {
      const e: Errors = {};
      if (d.percepcao.trim().length < 30)
        e.percepcao = "Conte com mais detalhe (mínimo 30 caracteres).";
      return e;
    },
  },
  {
    key: "dores",
    label: "Dores",
    validate: (d) => {
      const e: Errors = {};
      if (d.dores.trim().length < 30)
        e.dores = "Conte com mais detalhe (mínimo 30 caracteres).";
      return e;
    },
  },
  {
    key: "bloqueios",
    label: "Bloqueios",
    validate: (d) => {
      const e: Errors = {};
      if (d.bloqueios.trim().length < 30)
        e.bloqueios = "Conte com mais detalhe (mínimo 30 caracteres).";
      return e;
    },
  },
  {
    key: "objetivo",
    label: "Objetivos",
    validate: (d) => {
      const e: Errors = {};
      if (d.objetivoMeta.trim().length < 40)
        e.objetivoMeta = "Seja específico — número, marco, faturamento (mínimo 40 caracteres).";
      if (!d.objetivoPrazo) e.objetivoPrazo = "Escolha um prazo.";
      return e;
    },
  },
];

type Persisted = { data: FormData; step: number };

function loadPersisted(): Persisted | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Persisted>;
    if (!parsed || typeof parsed !== "object") return null;
    const data = { ...EMPTY, ...(parsed.data ?? {}) } as FormData;
    const step = typeof parsed.step === "number" ? parsed.step : -1;
    return { data, step };
  } catch {
    return null;
  }
}

function buildAnswers(data: FormData) {
  const nicho =
    data.nichoCategoria === "Outro"
      ? `Outro: ${data.nichoCategoriaOutro.trim()}`
      : data.nichoCategoria;
  const monet =
    data.monetizacaoTipo === "Outro"
      ? `Outro: ${data.monetizacaoTipoOutro.trim()}`
      : data.monetizacaoTipo;
  return [
    { step: "Nicho", question: "Nicho / temática", value: nicho },
    {
      step: "Nicho",
      question: "Ângulo específico do perfil",
      value: data.nichoDescricao.trim(),
    },
    {
      step: "Posicionamento",
      question: "Como descreveria seu posicionamento hoje?",
      value: data.posicionamento,
    },
    {
      step: "Diagnóstico Estratégico Profundo",
      question: "Como o perfil está hoje (primeira impressão, foto, destaques)",
      value: data.diagPerfil.trim(),
    },
    {
      step: "Diagnóstico Estratégico Profundo",
      question: "Bio atual (texto exato)",
      value: data.diagBio.trim(),
    },
    {
      step: "Diagnóstico Estratégico Profundo",
      question: "Instagram dos concorrentes (@)",
      value: data.diagConcorrentes.trim(),
    },
    {
      step: "Diagnóstico Estratégico Profundo",
      question: "O que funciona no nicho",
      value: data.diagNichoFunciona.trim(),
    },
    {
      step: "Diagnóstico Estratégico Profundo",
      question: "Padrões virais percebidos",
      value: data.diagPadroesVirais.trim(),
    },
    {
      step: "Diagnóstico Estratégico Profundo",
      question: "Oportunidades / brechas no nicho",
      value: data.diagOportunidades.trim(),
    },
    {
      step: "Diagnóstico Estratégico Profundo",
      question: "Formatos em alta no nicho",
      value: data.diagFormatosAlta.trim(),
    },
    {
      step: "Diagnóstico Estratégico Profundo",
      question: "Retenção (as pessoas assistem até o fim? salvam?)",
      value: data.diagRetencao.trim(),
    },
    {
      step: "Diagnóstico Estratégico Profundo",
      question: "Linguagem / tom de voz",
      value: data.diagLinguagem.trim(),
    },
    {
      step: "Diagnóstico Estratégico Profundo",
      question: "Formatos que mais usa",
      value: data.diagFormatos.trim(),
    },
    {
      step: "Diagnóstico Estratégico Profundo",
      question: "Diferenciação (o que te separa dos outros perfis)",
      value: data.diagDiferenciacao.trim(),
    },
    {
      step: "Monetização",
      question: "Como monetiza seu Instagram hoje?",
      value: monet,
    },
    {
      step: "Monetização",
      question: "Faturamento mensal médio (últimos 3 meses)",
      value: data.faturamento,
    },
    {
      step: "Percepção atual",
      question: "O que está funcionando e o que está travado?",
      value: data.percepcao.trim(),
    },
    {
      step: "Dores",
      question: "Maior dor / frustração que te trouxe pra mentoria",
      value: data.dores.trim(),
    },
    {
      step: "Bloqueios",
      question: "O que já tentou e não funcionou? Por quê?",
      value: data.bloqueios.trim(),
    },
    {
      step: "Objetivos",
      question: "Objetivo concreto nos próximos 90 dias",
      value: data.objetivoMeta.trim(),
    },
    {
      step: "Objetivos",
      question: "Prazo desejado pra atingir o objetivo",
      value: data.objetivoPrazo,
    },
  ];
}

type Phase =
  | { kind: "intro" }
  | { kind: "step"; idx: number }
  | { kind: "submitting" }
  | { kind: "success" };

export default function OnboardingForm() {
  const [data, setData] = useState<FormData>(EMPTY);
  const [phase, setPhase] = useState<Phase>({ kind: "intro" });
  const [errors, setErrors] = useState<Errors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [restored, setRestored] = useState(false);

  // Restore from localStorage on mount (and only on mount).
  useEffect(() => {
    const persisted = loadPersisted();
    if (persisted) {
      setData(persisted.data);
      if (persisted.step >= 0 && persisted.step < STEPS.length) {
        setPhase({ kind: "step", idx: persisted.step });
        setRestored(true);
      }
    }
  }, []);

  // Autosave to localStorage. Skips intro/submitting/success.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (phase.kind !== "step") return;
    try {
      const payload: Persisted = { data, step: phase.idx };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // ignore quota / disabled storage
    }
  }, [data, phase]);

  const clearPersisted = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const setField = useCallback(
    <K extends keyof FormData>(key: K, value: FormData[K]) => {
      setData((d) => ({ ...d, [key]: value }));
      setErrors((e) => {
        if (!(key in e)) return e;
        const next = { ...e };
        delete next[key];
        return next;
      });
    },
    [],
  );

  const handleNext = useCallback(() => {
    if (phase.kind !== "step") return;
    const step = STEPS[phase.idx];
    const stepErrors = step.validate(data);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    if (phase.idx + 1 < STEPS.length) {
      setPhase({ kind: "step", idx: phase.idx + 1 });
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    } else {
      void submit();
    }
  }, [phase, data]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleBack = useCallback(() => {
    if (phase.kind !== "step") return;
    setErrors({});
    if (phase.idx === 0) {
      setPhase({ kind: "intro" });
      return;
    }
    setPhase({ kind: "step", idx: phase.idx - 1 });
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [phase]);

  const submit = useCallback(async () => {
    setPhase({ kind: "submitting" });
    setSubmitError(null);
    try {
      const res = await fetch("/api/creator-elite/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name.trim(),
          email: data.email.trim().toLowerCase(),
          whatsapp: onlyDigits(data.whatsapp),
          instagram: normalizeInstagram(data.instagram),
          answers: buildAnswers(data),
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      clearPersisted();
      setPhase({ kind: "success" });
    } catch {
      setSubmitError(
        "Não conseguimos enviar agora. Confira sua conexão e tente novamente.",
      );
      setPhase({ kind: "step", idx: STEPS.length - 1 });
    }
  }, [data, clearPersisted]);

  const startFromIntro = useCallback(() => {
    setPhase({ kind: "step", idx: 0 });
  }, []);

  const restart = useCallback(() => {
    setData(EMPTY);
    setErrors({});
    clearPersisted();
    setPhase({ kind: "intro" });
  }, [clearPersisted]);

  const totalSteps = STEPS.length;

  if (phase.kind === "intro") {
    return (
      <IntroScreen
        restored={restored}
        onStart={startFromIntro}
        onRestart={restart}
      />
    );
  }

  if (phase.kind === "submitting") {
    return <SubmittingScreen />;
  }

  if (phase.kind === "success") {
    return <SuccessScreen />;
  }

  const step = STEPS[phase.idx];

  return (
    <FormShell
      stepIdx={phase.idx}
      total={totalSteps}
      label={step.label}
      onBack={handleBack}
      onNext={handleNext}
      submitError={submitError}
      isFinal={phase.idx === totalSteps - 1}
    >
      <StepBody
        stepKey={step.key}
        data={data}
        errors={errors}
        setField={setField}
        onSubmit={handleNext}
      />
    </FormShell>
  );
}

// -----------------------------------------------------------------------------
// Shell + screens
// -----------------------------------------------------------------------------

function IntroScreen({
  restored,
  onStart,
  onRestart,
}: {
  restored: boolean;
  onStart: () => void;
  onRestart: () => void;
}) {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col">
      <main className="flex-1 px-6 py-16 max-w-2xl mx-auto w-full">
        <p className="text-xs uppercase tracking-[0.18em] text-neutral-500 font-semibold">
          Creator Elite · Onboarding
        </p>
        <h1 className="mt-4 text-3xl md:text-4xl font-extrabold tracking-tight leading-[1.15]">
          Bem-vindo à mentoria.
          <br />
          Antes da sua call, preciso te conhecer.
        </h1>
        <p className="mt-6 text-neutral-600 text-[17px] leading-relaxed">
          Esse questionário cobre a <strong className="text-neutral-900">Etapa 1</strong>{" "}
          (seu contexto) e o <strong className="text-neutral-900">Diagnóstico
          Estratégico Profundo (Etapa 2)</strong>. As suas respostas vão direto
          pro Augusto e são a base da sua sessão estratégica.
        </p>
        <p className="mt-3 text-neutral-600 text-[17px] leading-relaxed">
          Reserve uns <strong className="text-neutral-900">15 a 20 minutos</strong>{" "}
          e responda com sinceridade — quanto mais específico, mais útil.
        </p>

        <ul className="mt-8 space-y-3 text-neutral-700 text-[15px]">
          <li className="flex gap-3">
            <span className="text-emerald-500 font-bold">✓</span>
            <span>Suas respostas ficam salvas no seu navegador automaticamente.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-emerald-500 font-bold">✓</span>
            <span>Você pode voltar e editar antes de enviar.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-emerald-500 font-bold">✓</span>
            <span>Tudo é confidencial — só o Augusto e o time vão ler.</span>
          </li>
        </ul>

        {restored && (
          <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 flex items-start gap-3">
            <span className="font-bold">↻</span>
            <div className="flex-1">
              Encontramos respostas que você começou antes. Pode continuar de onde
              parou.
              <button
                onClick={onRestart}
                className="ml-2 underline underline-offset-2 hover:no-underline"
                type="button"
              >
                Ou começar do zero
              </button>
            </div>
          </div>
        )}

        <button
          onClick={onStart}
          type="button"
          className="mt-10 w-full md:w-auto px-8 py-4 rounded-2xl bg-neutral-900 text-white font-semibold text-lg hover:bg-neutral-800 transition"
        >
          {restored ? "Continuar de onde parei" : "Começar →"}
        </button>
      </main>
      <footer className="text-center text-xs text-neutral-400 py-6">
        © 2026 — augustofelipe.com · Creator Elite
      </footer>
    </div>
  );
}

function SubmittingScreen() {
  return (
    <div className="min-h-screen bg-neutral-50 grid place-items-center px-6">
      <div className="text-center">
        <div className="mx-auto w-12 h-12 rounded-full border-4 border-neutral-200 border-t-neutral-900 animate-spin" />
        <p className="mt-6 text-neutral-700 font-medium">
          Enviando suas respostas pro Augusto…
        </p>
        <p className="mt-1 text-sm text-neutral-500">Não feche esta janela.</p>
      </div>
    </div>
  );
}

function SuccessScreen() {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <main className="flex-1 grid place-items-center px-6 py-16">
        <div className="max-w-xl w-full text-center">
          <div className="mx-auto w-20 h-20 rounded-full bg-emerald-100 grid place-items-center text-4xl">
            ✓
          </div>
          <h1 className="mt-8 text-3xl md:text-4xl font-extrabold tracking-tight leading-tight text-neutral-900">
            Obrigado por preencher o formulário.
          </h1>
          <p className="mt-5 text-[17px] text-neutral-600 leading-relaxed">
            E seja bem-vindo à mentoria{" "}
            <span className="font-semibold text-neutral-900">Creator Elite</span>.
          </p>
          <p className="mt-3 text-sm text-neutral-500">
            Suas respostas foram enviadas pro Augusto. Em breve você recebe os
            próximos passos.
          </p>
        </div>
      </main>
      <footer className="text-center text-xs text-neutral-400 py-6">
        © 2026 — augustofelipe.com · Creator Elite
      </footer>
    </div>
  );
}

function FormShell({
  stepIdx,
  total,
  label,
  onBack,
  onNext,
  submitError,
  isFinal,
  children,
}: {
  stepIdx: number;
  total: number;
  label: string;
  onBack: () => void;
  onNext: () => void;
  submitError: string | null;
  isFinal: boolean;
  children: React.ReactNode;
}) {
  const pct = ((stepIdx + 1) / total) * 100;

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col">
      <header className="sticky top-0 z-10 bg-neutral-50/90 backdrop-blur border-b border-neutral-200">
        <div className="h-1 w-full bg-neutral-200">
          <div
            className="h-full bg-neutral-900 transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="px-6 py-3 max-w-2xl mx-auto flex items-center justify-between text-sm">
          <button
            onClick={onBack}
            type="button"
            className="text-neutral-500 hover:text-neutral-900 transition"
            aria-label="Voltar"
          >
            ← Voltar
          </button>
          <div className="text-xs text-neutral-500 font-medium tabular-nums">
            Etapa {stepIdx + 1} de {total} · {label}
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-10 max-w-2xl mx-auto w-full">
        {children}

        {submitError && (
          <p className="mt-6 text-sm text-rose-600 text-center">{submitError}</p>
        )}

        <button
          onClick={onNext}
          type="button"
          className="mt-10 w-full py-4 rounded-2xl bg-neutral-900 text-white font-semibold text-lg hover:bg-neutral-800 transition"
        >
          {isFinal ? "Enviar respostas" : "Continuar →"}
        </button>
        <p className="mt-3 text-center text-xs text-neutral-400">
          Dica: aperte <kbd className="px-1.5 py-0.5 border border-neutral-300 rounded text-[10px]">Enter</kbd>{" "}
          pra avançar (ou <kbd className="px-1.5 py-0.5 border border-neutral-300 rounded text-[10px]">Ctrl</kbd>+
          <kbd className="px-1.5 py-0.5 border border-neutral-300 rounded text-[10px]">Enter</kbd> nos campos longos).
        </p>
      </main>

      <footer className="text-center text-xs text-neutral-400 py-6">
        Suas respostas ficam salvas automaticamente no seu navegador.
      </footer>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Step bodies
// -----------------------------------------------------------------------------

function StepBody({
  stepKey,
  data,
  errors,
  setField,
  onSubmit,
}: {
  stepKey: string;
  data: FormData;
  errors: Errors;
  setField: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
  onSubmit: () => void;
}) {
  switch (stepKey) {
    case "identificacao":
      return (
        <IdentificacaoStep
          data={data}
          errors={errors}
          setField={setField}
          onSubmit={onSubmit}
        />
      );
    case "nicho":
      return (
        <NichoStep
          data={data}
          errors={errors}
          setField={setField}
          onSubmit={onSubmit}
        />
      );
    case "posicionamento":
      return (
        <PosicionamentoStep
          data={data}
          errors={errors}
          setField={setField}
        />
      );
    case "diag-perfil":
      return (
        <DiagPerfilStep
          data={data}
          errors={errors}
          setField={setField}
          onSubmit={onSubmit}
        />
      );
    case "diag-concorrentes":
      return (
        <DiagConcorrentesStep
          data={data}
          errors={errors}
          setField={setField}
          onSubmit={onSubmit}
        />
      );
    case "diag-conteudo":
      return (
        <DiagConteudoStep
          data={data}
          errors={errors}
          setField={setField}
          onSubmit={onSubmit}
        />
      );
    case "monetizacao":
      return (
        <MonetizacaoStep
          data={data}
          errors={errors}
          setField={setField}
          onSubmit={onSubmit}
        />
      );
    case "percepcao":
      return (
        <TextareaStep
          title="Como você enxerga seu perfil hoje?"
          helper="O que está funcionando e o que está travado. Pode listar tópicos ou escrever corrido."
          value={data.percepcao}
          onChange={(v) => setField("percepcao", v)}
          error={errors.percepcao}
          onSubmit={onSubmit}
          minLen={30}
          maxLen={2000}
          placeholder="Ex: Tenho boa retenção nos Reels mas comentário é zero. As pessoas curtem mas não salvam. Faz 6 meses que estou em ~12k seguidores sem sair do lugar..."
        />
      );
    case "dores":
      return (
        <TextareaStep
          title="Qual é a maior dor que te trouxe pra Creator Elite?"
          helper="Seja honesto. Quanto mais real, melhor a gente consegue te ajudar."
          why="Isso define a prioridade número 1 do seu plano. Se for genérico, o plano vai ser genérico."
          value={data.dores}
          onChange={(v) => setField("dores", v)}
          error={errors.dores}
          onSubmit={onSubmit}
          minLen={30}
          maxLen={2000}
          placeholder="Ex: Eu sinto que estou ficando para trás. Vejo gente do meu nicho crescendo e eu paro de produzir porque me bate uma sensação de que não vai dar..."
        />
      );
    case "bloqueios":
      return (
        <TextareaStep
          title="O que você JÁ tentou pra resolver isso?"
          helper="Cursos, mentorias, métodos, ajustes. E por que você acha que não funcionou."
          why="Saber o que já falhou evita que o Augusto te indique algo que você já tentou."
          value={data.bloqueios}
          onChange={(v) => setField("bloqueios", v)}
          error={errors.bloqueios}
          onSubmit={onSubmit}
          minLen={30}
          maxLen={2000}
          placeholder="Ex: Tentei seguir o método do X, comprei o curso do Y. Acho que não funcionou porque..."
        />
      );
    case "objetivo":
      return (
        <ObjetivoStep
          data={data}
          errors={errors}
          setField={setField}
          onSubmit={onSubmit}
        />
      );
    default:
      return null;
  }
}

// -- Identificação --

function IdentificacaoStep({
  data,
  errors,
  setField,
  onSubmit,
}: {
  data: FormData;
  errors: Errors;
  setField: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
  onSubmit: () => void;
}) {
  const onKeyDown = (ev: React.KeyboardEvent<HTMLInputElement>) => {
    if (ev.key === "Enter") {
      ev.preventDefault();
      onSubmit();
    }
  };

  return (
    <div>
      <StepTitle>Antes de tudo — como te encontro?</StepTitle>
      <StepHelper>
        Vou usar esses dados pra te identificar na call e nos materiais.
      </StepHelper>

      <div className="mt-8 flex flex-col gap-5">
        <Field label="Nome completo" error={errors.name}>
          <input
            type="text"
            value={data.name}
            onChange={(e) => setField("name", e.target.value)}
            onKeyDown={onKeyDown}
            autoComplete="name"
            autoFocus
            placeholder="Seu nome"
            className={inputCls(!!errors.name)}
          />
        </Field>

        <Field label="Melhor email" error={errors.email}>
          <input
            type="email"
            inputMode="email"
            value={data.email}
            onChange={(e) => setField("email", e.target.value)}
            onKeyDown={onKeyDown}
            autoComplete="email"
            autoCapitalize="none"
            placeholder="voce@email.com"
            className={inputCls(!!errors.email)}
          />
        </Field>

        <Field label="WhatsApp (com DDD)" error={errors.whatsapp}>
          <input
            type="tel"
            value={data.whatsapp}
            onChange={(e) => setField("whatsapp", maskWhatsapp(e.target.value))}
            onKeyDown={onKeyDown}
            autoComplete="tel"
            inputMode="numeric"
            placeholder="(11) 99999-9999"
            className={inputCls(!!errors.whatsapp)}
          />
        </Field>

        <Field label="Seu @ do Instagram" error={errors.instagram}>
          <input
            type="text"
            value={data.instagram}
            onChange={(e) => setField("instagram", e.target.value)}
            onKeyDown={onKeyDown}
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="@seu.usuario"
            className={inputCls(!!errors.instagram)}
          />
        </Field>
      </div>
    </div>
  );
}

// -- Nicho --

function NichoStep({
  data,
  errors,
  setField,
  onSubmit,
}: {
  data: FormData;
  errors: Errors;
  setField: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
  onSubmit: () => void;
}) {
  return (
    <div>
      <StepTitle>Qual é o seu nicho?</StepTitle>
      <StepHelper>
        Comece com a categoria mais próxima — e depois descreva seu ângulo
        específico.
      </StepHelper>

      <div className="mt-8">
        <RadioGroup
          name="nichoCategoria"
          options={NICHOS}
          value={data.nichoCategoria}
          onChange={(v) => setField("nichoCategoria", v)}
          error={errors.nichoCategoria}
        />
        {data.nichoCategoria === "Outro" && (
          <div className="mt-4">
            <Field label="Qual nicho?" error={errors.nichoCategoriaOutro}>
              <input
                type="text"
                value={data.nichoCategoriaOutro}
                onChange={(e) => setField("nichoCategoriaOutro", e.target.value)}
                autoFocus
                placeholder="Descreva em poucas palavras"
                className={inputCls(!!errors.nichoCategoriaOutro)}
              />
            </Field>
          </div>
        )}
      </div>

      <div className="mt-10">
        <TextareaField
          label="Descreva em 1-2 frases o ângulo específico do seu perfil"
          helper="Não basta dizer 'fitness'. Qual o recorte? Pra quem? Como?"
          value={data.nichoDescricao}
          onChange={(v) => setField("nichoDescricao", v)}
          error={errors.nichoDescricao}
          onSubmit={onSubmit}
          minLen={20}
          maxLen={400}
          rows={3}
          placeholder="Ex: Treino funcional pra mães de bebês de até 1 ano, em casa, sem equipamento."
        />
      </div>
    </div>
  );
}

// -- Posicionamento --

function PosicionamentoStep({
  data,
  errors,
  setField,
}: {
  data: FormData;
  errors: Errors;
  setField: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
}) {
  return (
    <div>
      <StepTitle>Como está seu posicionamento HOJE?</StepTitle>
      <StepHelper>
        Posicionamento = a percepção que o seu público tem sobre quem você é e
        sobre o que você fala.
      </StepHelper>

      <div className="mt-8">
        <RadioGroup
          name="posicionamento"
          options={POSICIONAMENTOS}
          value={data.posicionamento}
          onChange={(v) => setField("posicionamento", v)}
          error={errors.posicionamento}
        />
      </div>
    </div>
  );
}

// -- Etapa 2 · Diagnóstico Estratégico Profundo --

function DiagKicker() {
  return (
    <p className="text-xs uppercase tracking-[0.18em] text-fuchsia-600 font-semibold mb-3">
      Etapa 2 · Diagnóstico Estratégico Profundo
    </p>
  );
}

function DiagPerfilStep({
  data,
  errors,
  setField,
  onSubmit,
}: {
  data: FormData;
  errors: Errors;
  setField: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
  onSubmit: () => void;
}) {
  return (
    <div>
      <DiagKicker />
      <StepTitle>Vamos olhar pro seu perfil de perto.</StepTitle>
      <StepHelper>
        Esse é o ponto de partida do diagnóstico. Descreva como seu perfil está
        hoje e cole sua bio do jeitinho que ela aparece.
      </StepHelper>

      <div className="mt-8">
        <TextareaField
          label="Como seu perfil está hoje?"
          helper="Primeira impressão de quem chega: foto, nome, destaques, feed. Seja crítico."
          value={data.diagPerfil}
          onChange={(v) => setField("diagPerfil", v)}
          error={errors.diagPerfil}
          onSubmit={onSubmit}
          minLen={30}
          maxLen={1000}
          rows={5}
          placeholder="Ex: Foto boa, mas o nome não diz o que eu faço. Destaques desorganizados. Feed sem identidade visual clara..."
          autoFocus
        />
      </div>

      <div className="mt-10">
        <TextareaField
          label="Cole sua bio atual"
          helper="O texto exato que está na sua bio do Instagram hoje."
          value={data.diagBio}
          onChange={(v) => setField("diagBio", v)}
          error={errors.diagBio}
          onSubmit={onSubmit}
          minLen={5}
          maxLen={400}
          rows={3}
          placeholder="Ex: 🏋️‍♀️ Treino em casa pra mães | Sem equipamento | Link do app ↓"
        />
      </div>
    </div>
  );
}

function DiagConcorrentesStep({
  data,
  errors,
  setField,
  onSubmit,
}: {
  data: FormData;
  errors: Errors;
  setField: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
  onSubmit: () => void;
}) {
  return (
    <div>
      <DiagKicker />
      <StepTitle>Quem é referência no seu nicho?</StepTitle>
      <StepHelper>
        Liste os perfis e anote o que você observa neles. Quanto mais afiada a
        sua leitura do nicho, mais preciso o diagnóstico.
      </StepHelper>

      <div className="mt-8">
        <TextareaField
          label="Instagram dos concorrentes (@)"
          helper="Cole o @ (ou o link) de 2 a 4 perfis do seu nicho que você admira ou compete diretamente."
          value={data.diagConcorrentes}
          onChange={(v) => setField("diagConcorrentes", v)}
          error={errors.diagConcorrentes}
          onSubmit={onSubmit}
          minLen={6}
          maxLen={600}
          rows={3}
          placeholder="Ex: @perfil1, @perfil2, @perfil3"
          autoFocus
        />
      </div>

      <div className="mt-10 grid gap-6">
        <TextareaField
          label="O que funciona no nicho?"
          value={data.diagNichoFunciona}
          onChange={(v) => setField("diagNichoFunciona", v)}
          error={errors.diagNichoFunciona}
          onSubmit={onSubmit}
          minLen={10}
          maxLen={600}
          rows={2}
          placeholder="O tipo de conteúdo que sempre engaja nesse nicho."
        />
        <TextareaField
          label="Padrões virais que você percebe"
          value={data.diagPadroesVirais}
          onChange={(v) => setField("diagPadroesVirais", v)}
          error={errors.diagPadroesVirais}
          onSubmit={onSubmit}
          minLen={10}
          maxLen={600}
          rows={2}
          placeholder="Ganchos, temas ou formatos que se repetem nos vídeos que estouram."
        />
        <TextareaField
          label="Oportunidades / brechas"
          value={data.diagOportunidades}
          onChange={(v) => setField("diagOportunidades", v)}
          error={errors.diagOportunidades}
          onSubmit={onSubmit}
          minLen={10}
          maxLen={600}
          rows={2}
          placeholder="O que ninguém está fazendo direito e você poderia ocupar."
        />
        <TextareaField
          label="Formatos em alta no nicho"
          value={data.diagFormatosAlta}
          onChange={(v) => setField("diagFormatosAlta", v)}
          error={errors.diagFormatosAlta}
          onSubmit={onSubmit}
          minLen={10}
          maxLen={600}
          rows={2}
          placeholder="Ex: Reels de bastidores, carrossel de listas, lives semanais..."
        />
      </div>
    </div>
  );
}

function DiagConteudoStep({
  data,
  errors,
  setField,
  onSubmit,
}: {
  data: FormData;
  errors: Errors;
  setField: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
  onSubmit: () => void;
}) {
  return (
    <div>
      <DiagKicker />
      <StepTitle>Seu conteúdo e o que te torna único.</StepTitle>
      <StepHelper>
        Responda cada campo com sinceridade. A diferenciação é a peça-chave do
        diagnóstico — capricha nela.
      </StepHelper>

      <div className="mt-8 grid gap-6">
        <TextareaField
          label="Retenção"
          helper="As pessoas assistem até o fim? Salvam? Compartilham? O que você percebe."
          value={data.diagRetencao}
          onChange={(v) => setField("diagRetencao", v)}
          error={errors.diagRetencao}
          onSubmit={onSubmit}
          minLen={10}
          maxLen={800}
          rows={2}
          placeholder="Ex: Boa retenção nos primeiros 3s, mas cai forte no meio do vídeo."
          autoFocus
        />
        <TextareaField
          label="Linguagem / tom de voz"
          value={data.diagLinguagem}
          onChange={(v) => setField("diagLinguagem", v)}
          error={errors.diagLinguagem}
          onSubmit={onSubmit}
          minLen={10}
          maxLen={800}
          rows={2}
          placeholder="Ex: Direto e provocador / acolhedor e didático / bem-humorado..."
        />
        <TextareaField
          label="Formatos que mais usa"
          value={data.diagFormatos}
          onChange={(v) => setField("diagFormatos", v)}
          error={errors.diagFormatos}
          onSubmit={onSubmit}
          minLen={10}
          maxLen={800}
          rows={2}
          placeholder="Ex: 70% Reels, 20% carrossel, stories diários."
        />
      </div>

      <div className="mt-10">
        <TextareaField
          label="O que te diferencia dos outros perfis do nicho?"
          why="Sem diferenciação clara você vira mais um. É daqui que sai o seu posicionamento."
          value={data.diagDiferenciacao}
          onChange={(v) => setField("diagDiferenciacao", v)}
          error={errors.diagDiferenciacao}
          onSubmit={onSubmit}
          minLen={20}
          maxLen={1000}
          rows={4}
          placeholder="Ex: Sou a única que mostra o treino com o bebê no colo, em tempo real, sem edição perfeitinha."
        />
      </div>
    </div>
  );
}

// -- Monetização --

function MonetizacaoStep({
  data,
  errors,
  setField,
  onSubmit: _onSubmit,
}: {
  data: FormData;
  errors: Errors;
  setField: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
  onSubmit: () => void;
}) {
  return (
    <div>
      <StepTitle>Como você monetiza hoje?</StepTitle>
      <StepHelper>
        Duas perguntas rápidas — modelo de monetização e faixa de faturamento.
      </StepHelper>

      <div className="mt-8">
        <div className="text-sm font-semibold text-neutral-700 mb-3">
          Como monetiza seu Instagram hoje?
        </div>
        <RadioGroup
          name="monetizacaoTipo"
          options={MONETIZACOES}
          value={data.monetizacaoTipo}
          onChange={(v) => setField("monetizacaoTipo", v)}
          error={errors.monetizacaoTipo}
        />
        {data.monetizacaoTipo === "Outro" && (
          <div className="mt-4">
            <Field label="Conta como" error={errors.monetizacaoTipoOutro}>
              <input
                type="text"
                value={data.monetizacaoTipoOutro}
                onChange={(e) =>
                  setField("monetizacaoTipoOutro", e.target.value)
                }
                autoFocus
                placeholder="Descreva em uma frase"
                className={inputCls(!!errors.monetizacaoTipoOutro)}
              />
            </Field>
          </div>
        )}
      </div>

      <div className="mt-10">
        <div className="text-sm font-semibold text-neutral-700 mb-1">
          Faturamento mensal médio nos últimos 3 meses
        </div>
        <p className="text-xs text-neutral-500 mb-3">
          Considere só o que veio do Instagram (publi, produtos próprios, infoprodutos, etc).
        </p>
        <RadioGroup
          name="faturamento"
          options={FATURAMENTOS}
          value={data.faturamento}
          onChange={(v) => setField("faturamento", v)}
          error={errors.faturamento}
        />
      </div>
    </div>
  );
}

// -- Objetivo --

function ObjetivoStep({
  data,
  errors,
  setField,
  onSubmit,
}: {
  data: FormData;
  errors: Errors;
  setField: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
  onSubmit: () => void;
}) {
  return (
    <div>
      <StepTitle>Qual é o seu objetivo na mentoria?</StepTitle>
      <StepHelper>
        Quanto mais específico (número, marco, faturamento), mais útil o plano
        do Augusto vai ser.
      </StepHelper>

      <div className="mt-8">
        <TextareaField
          label="Objetivo concreto nos próximos 90 dias"
          why="Sem objetivo específico não dá pra medir progresso — fica só sensação."
          value={data.objetivoMeta}
          onChange={(v) => setField("objetivoMeta", v)}
          error={errors.objetivoMeta}
          onSubmit={onSubmit}
          minLen={40}
          maxLen={1500}
          rows={4}
          placeholder="Ex: Sair de 8k pra 30k seguidores qualificados e fechar 5 vendas/mês do meu mentoria pra mulheres 30+."
        />
      </div>

      <div className="mt-10">
        <div className="text-sm font-semibold text-neutral-700 mb-3">
          Em quanto tempo você quer atingir?
        </div>
        <RadioGroup
          name="objetivoPrazo"
          options={PRAZOS}
          value={data.objetivoPrazo}
          onChange={(v) => setField("objetivoPrazo", v)}
          error={errors.objetivoPrazo}
        />
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Atoms
// -----------------------------------------------------------------------------

function StepTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl md:text-[28px] font-extrabold tracking-tight leading-[1.2] text-neutral-900">
      {children}
    </h2>
  );
}

function StepHelper({ children }: { children: React.ReactNode }) {
  return <p className="mt-3 text-neutral-600 text-[15px]">{children}</p>;
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
        {label}
      </label>
      {children}
      {error && <p className="mt-1.5 text-sm text-rose-600">{error}</p>}
    </div>
  );
}

function inputCls(hasError: boolean) {
  return [
    "w-full px-4 py-3 rounded-xl border bg-white text-neutral-900 transition",
    "focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900",
    hasError
      ? "border-rose-400 focus:ring-rose-400 focus:border-rose-400"
      : "border-neutral-300 hover:border-neutral-400",
  ].join(" ");
}

function RadioGroup({
  name,
  options,
  value,
  onChange,
  error,
}: {
  name: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <div>
      <div className="flex flex-col gap-2.5" role="radiogroup">
        {options.map((opt) => {
          const checked = value === opt;
          return (
            <label
              key={opt}
              className={[
                "flex items-start gap-3 px-4 py-4 rounded-xl border cursor-pointer transition",
                checked
                  ? "border-neutral-900 bg-neutral-900 text-white shadow-sm"
                  : "border-neutral-300 bg-white text-neutral-800 hover:border-neutral-500 hover:bg-neutral-100",
              ].join(" ")}
            >
              <input
                type="radio"
                name={name}
                value={opt}
                checked={checked}
                onChange={() => onChange(opt)}
                className="sr-only"
              />
              <span
                className={[
                  "shrink-0 mt-0.5 w-5 h-5 rounded-full border-2 grid place-items-center",
                  checked
                    ? "border-white bg-white"
                    : "border-neutral-400 bg-white",
                ].join(" ")}
                aria-hidden
              >
                {checked && (
                  <span className="w-2.5 h-2.5 rounded-full bg-neutral-900" />
                )}
              </span>
              <span className="text-[15px] leading-snug">{opt}</span>
            </label>
          );
        })}
      </div>
      {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}
    </div>
  );
}

function TextareaStep({
  title,
  helper,
  why,
  value,
  onChange,
  error,
  onSubmit,
  minLen,
  maxLen,
  placeholder,
}: {
  title: string;
  helper?: string;
  why?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  onSubmit: () => void;
  minLen: number;
  maxLen: number;
  placeholder?: string;
}) {
  return (
    <div>
      <StepTitle>{title}</StepTitle>
      {helper && <StepHelper>{helper}</StepHelper>}
      <div className="mt-8">
        <TextareaField
          label=""
          why={why}
          value={value}
          onChange={onChange}
          error={error}
          onSubmit={onSubmit}
          minLen={minLen}
          maxLen={maxLen}
          rows={7}
          placeholder={placeholder}
          autoFocus
        />
      </div>
    </div>
  );
}

function TextareaField({
  label,
  helper,
  why,
  value,
  onChange,
  error,
  onSubmit,
  minLen,
  maxLen,
  rows = 5,
  placeholder,
  autoFocus,
}: {
  label: string;
  helper?: string;
  why?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  onSubmit: () => void;
  minLen: number;
  maxLen: number;
  rows?: number;
  placeholder?: string;
  autoFocus?: boolean;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  // Auto-resize on content change.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.max(el.scrollHeight, rows * 24)}px`;
  }, [value, rows]);

  const len = value.length;
  const counterTone = useMemo(() => {
    if (len === 0) return "text-neutral-400";
    if (len < minLen) return "text-amber-600";
    if (len > maxLen) return "text-rose-600";
    return "text-emerald-600";
  }, [len, minLen, maxLen]);

  const onKeyDown = (ev: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (ev.key === "Enter" && (ev.ctrlKey || ev.metaKey)) {
      ev.preventDefault();
      onSubmit();
    }
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
          {label}
        </label>
      )}
      {helper && <p className="text-xs text-neutral-500 mb-3">{helper}</p>}
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, maxLen))}
        onKeyDown={onKeyDown}
        rows={rows}
        autoFocus={autoFocus}
        placeholder={placeholder}
        className={[
          "w-full px-4 py-3 rounded-xl border bg-white text-neutral-900 transition resize-none leading-relaxed",
          "focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900",
          error
            ? "border-rose-400 focus:ring-rose-400 focus:border-rose-400"
            : "border-neutral-300 hover:border-neutral-400",
        ].join(" ")}
      />
      <div className="mt-1.5 flex items-start justify-between gap-3">
        <div className="text-sm">
          {error ? (
            <span className="text-rose-600">{error}</span>
          ) : why ? (
            <span className="text-neutral-500 text-xs">
              <span className="font-semibold text-neutral-600">
                Por que pergunto:
              </span>{" "}
              {why}
            </span>
          ) : null}
        </div>
        <div className={`text-xs tabular-nums shrink-0 ${counterTone}`}>
          {len}/{maxLen}
          {len < minLen && len > 0 && (
            <span className="ml-1 text-neutral-400">(mín. {minLen})</span>
          )}
        </div>
      </div>
    </div>
  );
}
