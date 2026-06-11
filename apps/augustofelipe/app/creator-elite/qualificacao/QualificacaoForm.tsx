"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type FormData = {
  name: string;
  email: string;
  whatsapp: string;
  instagram: string;
  seguidores: string;
  monetiza: string;
  faturamento: string;
  nicho: string;
  necessidade: string;
  travamento: string;
  investimentoAnterior: string;
  prontoParaComecar: string;
  maiorDor: string;
  porQueAugusto: string;
};

const EMPTY: FormData = {
  name: "",
  email: "",
  whatsapp: "",
  instagram: "",
  seguidores: "",
  monetiza: "",
  faturamento: "",
  nicho: "",
  necessidade: "",
  travamento: "",
  investimentoAnterior: "",
  prontoParaComecar: "",
  maiorDor: "",
  porQueAugusto: "",
};

const STORAGE_KEY = "creator-elite-qualificacao-v1";

const SEGUIDORES = [
  "Menos de 1.000",
  "1.000 a 5.000",
  "5.000 a 20.000",
  "20.000 a 100.000",
  "Mais de 100.000",
];

const MONETIZACOES = [
  "Não, ainda não monetizo",
  "Sim, de forma pontual (publi avulso, serviço esporádico)",
  "Sim, tenho receita recorrente",
];

const FATURAMENTOS = [
  "R$ 0",
  "Até R$ 5.000",
  "R$ 5.000 a R$ 20.000",
  "R$ 20.000 a R$ 50.000",
  "R$ 50.000+",
];

const NECESSIDADES = [
  "Tenho uma dúvida ou decisão específica — quero um diagnóstico e um plano pra executar sozinho",
  "Quero acompanhamento por um período curto pra executar um objetivo com suporte",
  "Quero uma transformação completa — posicionamento, conteúdo e monetização com acompanhamento de verdade",
];

const TRAVAMENTOS = [
  "Sei exatamente o que precisa mudar, só preciso de direção",
  "Tem vários problemas ao mesmo tempo que precisam de atenção",
  "Não sei bem por onde começar — tá tudo confuso",
];

const INVESTIMENTOS = [
  "Não, seria meu primeiro investimento nessa área",
  "Sim, já fiz cursos",
  "Sim, já fiz mentoria antes",
];

const PRONTIDAO = [
  "Sim, quero começar o quanto antes",
  "Sim, mas quero entender melhor antes de decidir",
  "Ainda estou avaliando",
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
    key: "seguidores",
    label: "Seguidores",
    validate: (d) => {
      const e: Errors = {};
      if (!d.seguidores) e.seguidores = "Escolha uma opção.";
      return e;
    },
  },
  {
    key: "monetiza",
    label: "Monetização",
    validate: (d) => {
      const e: Errors = {};
      if (!d.monetiza) e.monetiza = "Escolha uma opção.";
      return e;
    },
  },
  {
    key: "faturamento",
    label: "Faturamento",
    validate: (d) => {
      const e: Errors = {};
      if (!d.faturamento) e.faturamento = "Escolha uma faixa.";
      return e;
    },
  },
  {
    key: "nicho",
    label: "Nicho",
    validate: (d) => {
      const e: Errors = {};
      if (d.nicho.trim().length < 10)
        e.nicho = "Descreva seu nicho (mínimo 10 caracteres).";
      return e;
    },
  },
  {
    key: "necessidade",
    label: "O que você precisa",
    validate: (d) => {
      const e: Errors = {};
      if (!d.necessidade) e.necessidade = "Escolha uma opção.";
      return e;
    },
  },
  {
    key: "travamento",
    label: "O que está travando",
    validate: (d) => {
      const e: Errors = {};
      if (!d.travamento) e.travamento = "Escolha uma opção.";
      return e;
    },
  },
  {
    key: "investimento-anterior",
    label: "Investimento anterior",
    validate: (d) => {
      const e: Errors = {};
      if (!d.investimentoAnterior) e.investimentoAnterior = "Escolha uma opção.";
      return e;
    },
  },
  {
    key: "pronto-para-comecar",
    label: "Prontidão",
    validate: (d) => {
      const e: Errors = {};
      if (!d.prontoParaComecar) e.prontoParaComecar = "Escolha uma opção.";
      return e;
    },
  },
  {
    key: "maior-dor",
    label: "Sua maior dor",
    validate: (d) => {
      const e: Errors = {};
      if (d.maiorDor.trim().length < 30)
        e.maiorDor = "Conte com mais detalhe (mínimo 30 caracteres).";
      return e;
    },
  },
  {
    key: "por-que",
    label: "Por que o Augusto",
    validate: () => ({}),
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
  const rows = [
    { step: "Situação atual", question: "Seguidores no Instagram", value: data.seguidores },
    { step: "Situação atual", question: "Monetização atual", value: data.monetiza },
    { step: "Situação atual", question: "Faturamento mensal médio", value: data.faturamento },
    { step: "Situação atual", question: "Nicho / tema principal", value: data.nicho.trim() },
    { step: "Encaixe", question: "O que você precisa agora", value: data.necessidade },
    { step: "Encaixe", question: "O que está travando você hoje", value: data.travamento },
    { step: "Comprometimento", question: "Investimento anterior em mentoria ou curso", value: data.investimentoAnterior },
    { step: "Comprometimento", question: "Pronto para começar", value: data.prontoParaComecar },
    { step: "Contexto", question: "Maior dor com o Instagram hoje", value: data.maiorDor.trim() },
  ];
  if (data.porQueAugusto.trim()) {
    rows.push({
      step: "Contexto",
      question: "Por que busca uma mentoria com o Augusto agora",
      value: data.porQueAugusto.trim(),
    });
  }
  return rows;
}

type Phase =
  | { kind: "intro" }
  | { kind: "step"; idx: number }
  | { kind: "submitting" }
  | { kind: "success" };

export default function QualificacaoForm() {
  const [data, setData] = useState<FormData>(EMPTY);
  const [phase, setPhase] = useState<Phase>({ kind: "intro" });
  const [errors, setErrors] = useState<Errors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [restored, setRestored] = useState(false);

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
      const res = await fetch("/api/creator-elite/qualificacao", {
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
    <div className="min-h-dvh bg-black text-white flex flex-col">
      <main className="flex-1 px-6 py-16 max-w-2xl mx-auto w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/creator-elite/logo-creator-elite.png"
          alt="Creator Elite"
          className="mb-10 w-56 max-w-[72vw] object-contain"
        />
        <p className="text-xs uppercase tracking-[0.18em] text-yellow-400 font-semibold">
          Augusto Felipe · Mentoria
        </p>
        <h1 className="mt-4 text-3xl md:text-4xl font-extrabold tracking-tight leading-[1.15]">
          Que bom que você tem interesse.
          <br />
          Me conta um pouco sobre você.
        </h1>
        <p className="mt-6 text-neutral-300 text-[17px] leading-relaxed">
          Antes de marcar nossa conversa, preciso entender onde você está e o
          que você precisa. São{" "}
          <strong className="text-white">10 perguntas</strong> — leva
          menos de 5 minutos.
        </p>
        <p className="mt-3 text-neutral-300 text-[17px] leading-relaxed">
          Responda com sinceridade. Quanto mais específico, mais útil a conversa
          vai ser.
        </p>

        <ul className="mt-8 space-y-3 text-neutral-300 text-[15px]">
          <li className="flex gap-3">
            <span className="text-yellow-400 font-bold">✓</span>
            <span>Suas respostas ficam salvas no seu navegador automaticamente.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-yellow-400 font-bold">✓</span>
            <span>Você pode voltar e editar antes de enviar.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-yellow-400 font-bold">✓</span>
            <span>Tudo é confidencial — só o Augusto vai ler.</span>
          </li>
        </ul>

        {restored && (
          <div className="mt-8 rounded-xl border border-yellow-400/35 bg-yellow-400/10 px-4 py-3 text-sm text-yellow-100 flex items-start gap-3">
            <span className="font-bold">↻</span>
            <div className="flex-1">
              Encontramos respostas que você começou antes. Pode continuar de
              onde parou.
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
          className="mt-10 w-full md:w-auto px-8 py-4 rounded-2xl bg-yellow-400 text-black font-semibold text-lg hover:bg-yellow-300 transition"
        >
          {restored ? "Continuar de onde parei" : "Começar →"}
        </button>
      </main>
      <footer className="text-center text-xs text-neutral-500 py-6">
        © 2026 — augustofelipe.com
      </footer>
    </div>
  );
}

function SubmittingScreen() {
  return (
    <div className="min-h-dvh bg-black grid place-items-center px-6">
      <div className="text-center">
        <div className="mx-auto w-12 h-12 rounded-full border-4 border-neutral-800 border-t-yellow-400 animate-spin" />
        <p className="mt-6 text-neutral-200 font-medium">
          Enviando suas respostas…
        </p>
        <p className="mt-1 text-sm text-neutral-500">Não feche esta janela.</p>
      </div>
    </div>
  );
}

function SuccessScreen() {
  return (
    <div className="min-h-dvh bg-black text-white flex flex-col">
      <main className="flex-1 grid place-items-center px-6 py-16">
        <div className="max-w-xl w-full text-center">
          <div className="mx-auto w-20 h-20 rounded-full bg-yellow-400 text-black grid place-items-center text-4xl">
            ✓
          </div>
          <h1 className="mt-8 text-3xl md:text-4xl font-extrabold tracking-tight leading-tight text-white">
            Obrigado pelas respostas.
          </h1>
          <p className="mt-5 text-[17px] text-neutral-300 leading-relaxed">
            O Augusto vai entrar em contato em breve para agendar a conversa.
          </p>
        </div>
      </main>
      <footer className="text-center text-xs text-neutral-500 py-6">
        © 2026 — augustofelipe.com
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
    <div className="min-h-dvh bg-black text-white flex flex-col">
      <header className="sticky top-0 z-10 bg-black/90 backdrop-blur border-b border-neutral-800">
        <div className="h-1 w-full bg-neutral-900">
          <div
            className="h-full bg-yellow-400 transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="px-6 py-3 max-w-2xl mx-auto flex items-center justify-between text-sm">
          <button
            onClick={onBack}
            type="button"
            className="text-neutral-400 hover:text-white transition"
            aria-label="Voltar"
          >
            ← Voltar
          </button>
          <div className="text-xs text-neutral-400 font-medium tabular-nums">
            Etapa {stepIdx + 1} de {total} · {label}
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full">
        <div className="flex-1 px-6 pt-10 pb-4">
          {children}
        </div>

        <div className="px-6 pb-8">
          {submitError && (
            <p className="mb-4 text-sm text-red-300 text-center">{submitError}</p>
          )}
          <button
            onClick={onNext}
            type="button"
            className="w-full py-4 rounded-2xl bg-yellow-400 text-black font-semibold text-lg hover:bg-yellow-300 transition"
          >
            {isFinal ? "Enviar respostas" : "Continuar →"}
          </button>
          <p className="mt-3 text-center text-xs text-neutral-500">
            Dica: aperte{" "}
            <kbd className="px-1.5 py-0.5 border border-neutral-700 rounded text-[10px]">
              Enter
            </kbd>{" "}
            pra avançar (ou{" "}
            <kbd className="px-1.5 py-0.5 border border-neutral-700 rounded text-[10px]">
              Ctrl
            </kbd>
            +
            <kbd className="px-1.5 py-0.5 border border-neutral-700 rounded text-[10px]">
              Enter
            </kbd>{" "}
            nos campos longos).
          </p>
          <p className="mt-4 text-center text-xs text-neutral-500">
            Suas respostas ficam salvas automaticamente no seu navegador.
          </p>
        </div>
      </div>
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
    case "seguidores":
      return (
        <RadioStep
          title="Quantos seguidores você tem hoje?"
          name="seguidores"
          options={SEGUIDORES}
          value={data.seguidores}
          onChange={(v) => setField("seguidores", v)}
          error={errors.seguidores}
        />
      );
    case "monetiza":
      return (
        <RadioStep
          title="Você já monetiza seu Instagram?"
          name="monetiza"
          options={MONETIZACOES}
          value={data.monetiza}
          onChange={(v) => setField("monetiza", v)}
          error={errors.monetiza}
        />
      );
    case "faturamento":
      return (
        <RadioStep
          title="Qual é o seu faturamento mensal médio hoje?"
          helper="Considere só o que vem do Instagram (publi, produtos próprios, serviços, infoprodutos)."
          name="faturamento"
          options={FATURAMENTOS}
          value={data.faturamento}
          onChange={(v) => setField("faturamento", v)}
          error={errors.faturamento}
        />
      );
    case "nicho":
      return (
        <TextareaStep
          title="Qual é o seu nicho?"
          helper="Em 1 ou 2 frases — tema, público, ângulo."
          value={data.nicho}
          onChange={(v) => setField("nicho", v)}
          error={errors.nicho}
          onSubmit={onSubmit}
          minLen={10}
          maxLen={300}
          rows={4}
          placeholder="Ex: Treino funcional pra mães de bebês de até 1 ano, em casa, sem equipamento."
        />
      );
    case "necessidade":
      return (
        <RadioStep
          title="O que descreve melhor o que você precisa agora?"
          name="necessidade"
          options={NECESSIDADES}
          value={data.necessidade}
          onChange={(v) => setField("necessidade", v)}
          error={errors.necessidade}
        />
      );
    case "travamento":
      return (
        <RadioStep
          title="Como você descreveria o que está travando você hoje?"
          name="travamento"
          options={TRAVAMENTOS}
          value={data.travamento}
          onChange={(v) => setField("travamento", v)}
          error={errors.travamento}
        />
      );
    case "investimento-anterior":
      return (
        <RadioStep
          title="Já investiu em mentoria ou curso de conteúdo antes?"
          name="investimentoAnterior"
          options={INVESTIMENTOS}
          value={data.investimentoAnterior}
          onChange={(v) => setField("investimentoAnterior", v)}
          error={errors.investimentoAnterior}
        />
      );
    case "pronto-para-comecar":
      return (
        <RadioStep
          title="Você está pronto para começar agora?"
          name="prontoParaComecar"
          options={PRONTIDAO}
          value={data.prontoParaComecar}
          onChange={(v) => setField("prontoParaComecar", v)}
          error={errors.prontoParaComecar}
        />
      );
    case "maior-dor":
      return (
        <TextareaStep
          title="Qual é a sua maior dor com o Instagram hoje?"
          helper="Seja honesto. Quanto mais real, melhor a conversa vai ser."
          value={data.maiorDor}
          onChange={(v) => setField("maiorDor", v)}
          error={errors.maiorDor}
          onSubmit={onSubmit}
          minLen={30}
          maxLen={2000}
          placeholder="Ex: Estou postando consistente mas não consigo crescer. Sinto que o conteúdo está bom mas não engaja, e não sei o que mudar..."
        />
      );
    case "por-que":
      return (
        <TextareaStep
          title="Por que você procura o Augusto hoje para uma mentoria?"
          helper="Pode ser uma frase. Isso ajuda a entender se a mentoria faz sentido pra você agora."
          optional
          value={data.porQueAugusto}
          onChange={(v) => setField("porQueAugusto", v)}
          error={errors.porQueAugusto}
          onSubmit={onSubmit}
          minLen={0}
          maxLen={1000}
          placeholder="Ex: Vi um vídeo seu sobre posicionamento e me identifiquei muito com o que você falou..."
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
        Vou usar esses dados pra te identificar na conversa.
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

// -----------------------------------------------------------------------------
// Atoms
// -----------------------------------------------------------------------------

function StepTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl md:text-[28px] font-extrabold tracking-tight leading-[1.2] text-white">
      {children}
    </h2>
  );
}

function StepHelper({ children }: { children: React.ReactNode }) {
  return <p className="mt-3 text-neutral-400 text-[15px]">{children}</p>;
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
      <label className="block text-sm font-semibold text-neutral-300 mb-1.5">
        {label}
      </label>
      {children}
      {error && <p className="mt-1.5 text-sm text-red-300">{error}</p>}
    </div>
  );
}

function inputCls(hasError: boolean) {
  return [
    "w-full px-4 py-3 rounded-xl border bg-neutral-950 text-white placeholder:text-neutral-600 transition",
    "focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400",
    hasError
      ? "border-red-400 focus:ring-red-400 focus:border-red-400"
      : "border-neutral-800 hover:border-neutral-600",
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
                  ? "border-yellow-400 bg-yellow-400 text-black shadow-sm"
                  : "border-neutral-800 bg-neutral-950 text-neutral-200 hover:border-neutral-600 hover:bg-neutral-900",
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
                    ? "border-black bg-black"
                    : "border-neutral-500 bg-neutral-950",
                ].join(" ")}
                aria-hidden
              >
                {checked && (
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                )}
              </span>
              <span className="text-[15px] leading-snug">{opt}</span>
            </label>
          );
        })}
      </div>
      {error && <p className="mt-2 text-sm text-red-300">{error}</p>}
    </div>
  );
}

function RadioStep({
  title,
  helper,
  name,
  options,
  value,
  onChange,
  error,
}: {
  title: string;
  helper?: string;
  name: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <div>
      <StepTitle>{title}</StepTitle>
      {helper && <StepHelper>{helper}</StepHelper>}
      <div className="mt-8">
        <RadioGroup
          name={name}
          options={options}
          value={value}
          onChange={onChange}
          error={error}
        />
      </div>
    </div>
  );
}

function TextareaStep({
  title,
  helper,
  optional,
  value,
  onChange,
  error,
  onSubmit,
  minLen,
  maxLen,
  rows,
  placeholder,
}: {
  title: string;
  helper?: string;
  optional?: boolean;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  onSubmit: () => void;
  minLen: number;
  maxLen: number;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <div>
      <StepTitle>
        {title}
        {optional && (
          <span className="ml-2 text-base font-normal text-neutral-400">
            (opcional)
          </span>
        )}
      </StepTitle>
      {helper && <StepHelper>{helper}</StepHelper>}
      <div className="mt-8">
        <TextareaField
          label=""
          value={value}
          onChange={onChange}
          error={error}
          onSubmit={onSubmit}
          minLen={minLen}
          maxLen={maxLen}
          rows={rows ?? 7}
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

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.max(el.scrollHeight, rows * 24)}px`;
  }, [value, rows]);

  const len = value.length;
  const counterTone = useMemo(() => {
    if (len === 0) return "text-neutral-500";
    if (minLen > 0 && len < minLen) return "text-yellow-300";
    if (len > maxLen) return "text-red-300";
    return "text-emerald-300";
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
        <label className="block text-sm font-semibold text-neutral-300 mb-1.5">
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
          "w-full px-4 py-3 rounded-xl border bg-neutral-950 text-white placeholder:text-neutral-600 transition resize-none leading-relaxed",
          "focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400",
          error
            ? "border-red-400 focus:ring-red-400 focus:border-red-400"
            : "border-neutral-800 hover:border-neutral-600",
        ].join(" ")}
      />
      <div className="mt-1.5 flex items-start justify-between gap-3">
        <div className="text-sm">
          {error && <span className="text-red-300">{error}</span>}
        </div>
        <div className={`text-xs tabular-nums shrink-0 ${counterTone}`}>
          {len}/{maxLen}
          {minLen > 0 && len < minLen && len > 0 && (
            <span className="ml-1 text-neutral-500">(mín. {minLen})</span>
          )}
        </div>
      </div>
    </div>
  );
}
