'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  WHATSAPP_FUNDADOR_DISPLAY,
  whatsappFundadorLink,
  WHATSAPP_MSG_CALL,
} from '@/lib/contato';

// Ordem do funil (validada por pesquisa de quiz funnels): abre com perguntas
// fáceis pra criar momentum, deixa os deal-breakers (investimento, prontidão)
// pro fim, e captura o contato logo antes de liberar o diagnóstico.
type StepKey =
  | 'analise'
  | 'momento'
  | 'canais'
  | 'gargalo'
  | 'volume'
  | 'resposta'
  | 'ia-hoje'
  | 'investimento'
  | 'velocidade'
  | 'perrengue'
  | 'contato';

const WHATSAPP_LINK = whatsappFundadorLink(WHATSAPP_MSG_CALL);

const optionsMomento = [
  {
    value: 'validacao',
    label: 'Fase de Validação',
    range: '< R$ 10k/mês',
    note: 'Buscando os primeiros clientes.',
  },
  {
    value: 'tracao',
    label: 'Fase de Tração',
    range: 'R$ 10k a R$ 50k/mês',
    note: 'Já vendo, mas quero crescer mais rápido.',
  },
  {
    value: 'escala',
    label: 'Fase de Escala',
    range: '> R$ 50k/mês',
    note: 'Busco processos, time e lucro previsível.',
  },
];

const optionsCanais = [
  { value: 'organico', label: 'Conteúdo orgânico / redes sociais' },
  { value: 'pago', label: 'Tráfego pago (Meta, Google)' },
  { value: 'indicacao', label: 'Indicação / boca a boca' },
  { value: 'outbound', label: 'Prospecção ativa (outbound)' },
  { value: 'nao-sei', label: 'Não sei dizer — é inconstante' },
];

const optionsGargalo = [
  {
    value: 'trafego',
    label: '“Não chegam leads suficientes.”',
    note: 'Diagnóstico: gargalo de Aquisição.',
  },
  {
    value: 'posicionamento',
    label: '“Chega gente, mas acham caro.”',
    note: 'Diagnóstico: gargalo de Posicionamento.',
  },
  {
    value: 'processo',
    label: '“Recebo leads, mas eles escapam.”',
    note: 'Diagnóstico: gargalo de Conversão.',
  },
  {
    value: 'gestao',
    label: '“Sou escravo da operação, sem tempo de crescer.”',
    note: 'Diagnóstico: gargalo de Gestão / Automação.',
  },
];

const optionsVolume = [
  { value: 'ate-10', label: 'Até 10 por mês' },
  { value: '10-50', label: '10 a 50 por mês' },
  { value: '50-200', label: '50 a 200 por mês' },
  { value: '200+', label: 'Mais de 200 por mês' },
  { value: 'nao-medido', label: 'Não meço isso' },
];

const optionsResposta = [
  { value: 'minutos', label: 'Em minutos' },
  { value: 'horas', label: 'Em algumas horas' },
  { value: 'dia-seguinte', label: 'No dia seguinte ou mais' },
  { value: 'sem-processo', label: 'Não tenho processo definido' },
];

const optionsIaHoje = [
  { value: 'nunca', label: 'Nunca usei' },
  { value: 'frustrou', label: 'Já tentei e me frustrei' },
  { value: 'pontual', label: 'Uso pontual (ChatGPT etc.)' },
  { value: 'estruturado', label: 'Uso estruturado no negócio' },
];

const optionsInvestimento = [
  { value: 'ate-2k', label: 'Até R$ 2 mil' },
  { value: '2-8k', label: 'R$ 2 mil – R$ 8 mil' },
  { value: '8-20k', label: 'R$ 8 mil – R$ 20 mil' },
  { value: '20-50k', label: 'R$ 20 mil – R$ 50 mil' },
  { value: '50k+', label: 'Acima de R$ 50 mil' },
];

const optionsVelocidade = [
  { value: 'prioridade', label: 'Sim, é prioridade total.' },
  { value: 'validar', label: 'Sim, mas preciso validar o investimento.' },
  { value: 'pesquisando', label: 'Não, estou apenas pesquisando mercado.' },
];

const OptionCard: React.FC<{
  title: string;
  description?: string;
  selected?: boolean;
  onClick?: () => void;
}> = ({ title, description, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full text-left p-5 md:p-6 rounded-2xl border transition-all ${
      selected
        ? 'border-[#0B2FFF] bg-[#F4F6FF] shadow-sm'
        : 'border-black/10 bg-white hover:border-black/20'
    }`}
  >
    <div className="text-[15px] md:text-[16px] font-medium text-[#111]">
      {title}
    </div>
    {description ? (
      <div className="mt-2 text-[13px] text-black/60">{description}</div>
    ) : null}
  </button>
);

const QuestionTitle: React.FC<{ children: React.ReactNode; eyebrow?: string }> = ({
  children,
  eyebrow,
}) => (
  <div className="space-y-3 text-center">
    {eyebrow ? (
      <div className="text-[11px] tracking-[0.2em] font-bold text-black/40 uppercase">
        {eyebrow}
      </div>
    ) : null}
    <h2 className="text-[26px] md:text-[34px] font-medium tracking-tight leading-[1.2] text-[#111] max-w-[620px] mx-auto">
      {children}
    </h2>
  </div>
);

const inputClass =
  'w-full px-4 py-4 rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-[#0B2FFF]/30 text-[16px]';

export default function ApplicationWizard() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [siteName, setSiteName] = useState('');
  const [momento, setMomento] = useState('');
  const [canais, setCanais] = useState('');
  const [gargalo, setGargalo] = useState('');
  const [volume, setVolume] = useState('');
  const [resposta, setResposta] = useState('');
  const [iaHoje, setIaHoje] = useState('');
  const [investimentoFaixa, setInvestimentoFaixa] = useState('');
  const [velocidade, setVelocidade] = useState('');
  const [perrengue, setPerrengue] = useState('');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const nameFromUrl = searchParams?.get('name') || '';
  const emailFromUrl = searchParams?.get('email') || '';

  useEffect(() => {
    const social = searchParams?.get('social') || '';
    const nameQ = searchParams?.get('name') || '';
    const emailQ = searchParams?.get('email') || '';
    if (social) setSiteName(social);
    if (nameQ) setNome(nameQ);
    if (emailQ) setEmail(emailQ);
  }, [searchParams]);

  const stepKeys: StepKey[] = useMemo(
    () => [
      'analise',
      'momento',
      'canais',
      'gargalo',
      'volume',
      'resposta',
      'ia-hoje',
      'investimento',
      'velocidade',
      'perrengue',
      'contato',
    ],
    [],
  );

  const [stepIndex, setStepIndex] = useState(0);
  const currentStep = stepKeys[stepIndex];
  const isLastStep = stepIndex === stepKeys.length - 1;
  const progress = useMemo(
    () => Math.round(((stepIndex + 1) / stepKeys.length) * 100),
    [stepIndex, stepKeys.length],
  );

  // Campos de contato que ainda faltam (nome/email podem vir da URL via home).
  const precisaNome = !nameFromUrl;
  const precisaEmail = !emailFromUrl;

  const contatoOk = useMemo(() => {
    if (precisaNome && nome.trim().length === 0) return false;
    if (precisaEmail && !/\S+@\S+\.\S+/.test(email.trim())) return false;
    return whatsapp.trim().length >= 8;
  }, [precisaNome, precisaEmail, nome, email, whatsapp]);

  const canAdvance = useMemo(() => {
    switch (currentStep) {
      case 'analise':
        return siteName.trim().length > 0;
      case 'momento':
        return momento !== '';
      case 'canais':
        return canais !== '';
      case 'gargalo':
        return gargalo !== '';
      case 'volume':
        return volume !== '';
      case 'resposta':
        return resposta !== '';
      case 'ia-hoje':
        return iaHoje !== '';
      case 'investimento':
        return investimentoFaixa !== '';
      case 'velocidade':
        return velocidade !== '';
      case 'perrengue':
        return true; // opcional — pode pular
      case 'contato':
        return contatoOk;
      default:
        return false;
    }
  }, [
    currentStep,
    siteName,
    momento,
    canais,
    gargalo,
    volume,
    resposta,
    iaHoje,
    investimentoFaixa,
    velocidade,
    contatoOk,
  ]);

  useEffect(() => {
    if (!isAnalyzing) return;
    const timer = setTimeout(() => {
      setIsAnalyzing(false);
      setStepIndex((idx) => Math.min(idx + 1, stepKeys.length - 1));
    }, 2000);
    return () => clearTimeout(timer);
  }, [isAnalyzing, stepKeys.length]);

  const startAnalysis = () => {
    if (isAnalyzing) return;
    if (!siteName.trim()) return;
    setIsAnalyzing(true);
  };

  const goNext = () => {
    if (!canAdvance) return;
    setStepIndex((idx) => Math.min(idx + 1, stepKeys.length - 1));
  };

  const goBack = () => setStepIndex((idx) => Math.max(idx - 1, 0));

  const submitAplicacao = async () => {
    if (submitting) return;
    setSubmitError(null);

    if (!canAdvance) {
      setSubmitError('Preencha os campos antes de continuar.');
      return;
    }

    const payload = {
      nome: nome.trim() || undefined,
      email: email.trim(),
      whatsapp: whatsapp.trim(),
      instagramHandle: siteName.trim(),
      momento,
      gargalo,
      velocidade,
      marketing: {
        canais,
        volume,
        conteudo: '',
        resposta,
        iaHoje,
        investimentoFaixa,
        investimentoAreas: [],
        perrengue: perrengue.trim() || undefined,
      },
    };

    setSubmitting(true);
    try {
      const res = await fetch('/api/aplicacao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSubmitError(data?.error || 'Erro ao enviar. Tente de novo.');
        return;
      }
      router.push(`/aplicacao/recebido/${data.slug}`);
    } catch {
      setSubmitError('Erro de conexão. Tente de novo.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key !== 'Enter') return;
    if (event.target instanceof HTMLTextAreaElement) return;
    if (currentStep === 'analise') {
      event.preventDefault();
      startAnalysis();
      return;
    }
    if (isLastStep) {
      event.preventDefault();
      void submitAplicacao();
      return;
    }
    if (canAdvance) {
      event.preventDefault();
      goNext();
    }
  };

  return (
    <section
      className="min-h-screen flex items-center justify-center px-4 py-10 md:py-16"
      onKeyDown={handleKeyDown}
    >
      <div className="w-full max-w-2xl">
        <div className="mb-10 md:mb-14">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] tracking-[0.2em] font-bold text-black/40 uppercase">
              Etapa {stepIndex + 1} de {stepKeys.length}
            </span>
            <span className="text-[11px] text-black/40">{progress}%</span>
          </div>
          <div className="h-1 w-full rounded-full bg-black/5 overflow-hidden">
            <div
              className="h-full bg-brand-highlight transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="space-y-8">
          {currentStep === 'analise' && (
            <div className="space-y-8">
              <QuestionTitle eyebrow="Diagnóstico de marketing">
                {nomeFromUrlFallback(nameFromUrl)}
                Vamos montar seu diagnóstico
              </QuestionTitle>
              <p className="text-black/60 text-[15px] text-center max-w-[520px] mx-auto">
                Comece pelo site ou @instagram do seu negócio. São poucas
                perguntas — no fim você vê uma prévia do seu diagnóstico e fala
                com a gente pra destravar o crescimento.
              </p>

              <div className="flex flex-col gap-3 max-w-[480px] mx-auto">
                <input
                  type="text"
                  value={siteName}
                  onChange={(event) => setSiteName(event.target.value)}
                  placeholder="Cole o site ou @instagram"
                  autoFocus
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={startAnalysis}
                  disabled={isAnalyzing || !siteName.trim()}
                  className="w-full px-6 py-4 rounded-xl bg-[#111] text-white font-medium hover:bg-[#0B2FFF] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? 'Preparando...' : 'Começar diagnóstico'}
                </button>
              </div>

              {isAnalyzing ? (
                <div className="flex items-center justify-center gap-3 text-black/50 text-sm">
                  <div className="w-4 h-4 border-2 border-black/20 border-t-[#0B2FFF] rounded-full animate-spin" />
                  Preparando seu diagnóstico...
                </div>
              ) : null}
            </div>
          )}

          {currentStep === 'momento' && (
            <div className="space-y-6">
              <QuestionTitle eyebrow="Seu momento">
                Em qual fase sua empresa se encontra hoje?
              </QuestionTitle>
              <div className="grid gap-3 max-w-[560px] mx-auto w-full">
                {optionsMomento.map((option) => (
                  <OptionCard
                    key={option.value}
                    title={`${option.range} — ${option.label}`}
                    description={option.note}
                    selected={momento === option.value}
                    onClick={() => setMomento(option.value)}
                  />
                ))}
              </div>
            </div>
          )}

          {currentStep === 'canais' && (
            <div className="space-y-6">
              <QuestionTitle eyebrow="Aquisição">
                De onde vêm seus clientes hoje?
              </QuestionTitle>
              <div className="grid gap-3 max-w-[560px] mx-auto w-full">
                {optionsCanais.map((option) => (
                  <OptionCard
                    key={option.value}
                    title={option.label}
                    selected={canais === option.value}
                    onClick={() => setCanais(option.value)}
                  />
                ))}
              </div>
            </div>
          )}

          {currentStep === 'gargalo' && (
            <div className="space-y-6">
              <QuestionTitle eyebrow="Seu maior gargalo">
                O que mais trava o crescimento da sua empresa hoje?
              </QuestionTitle>
              <div className="grid gap-3 max-w-[560px] mx-auto w-full">
                {optionsGargalo.map((option) => (
                  <OptionCard
                    key={option.value}
                    title={option.label}
                    description={option.note}
                    selected={gargalo === option.value}
                    onClick={() => setGargalo(option.value)}
                  />
                ))}
              </div>
            </div>
          )}

          {currentStep === 'volume' && (
            <div className="space-y-6">
              <QuestionTitle eyebrow="Aquisição">
                Quantos leads novos você recebe por mês?
              </QuestionTitle>
              <div className="grid gap-3 grid-cols-1 md:grid-cols-2 max-w-[560px] mx-auto w-full">
                {optionsVolume.map((option) => (
                  <OptionCard
                    key={option.value}
                    title={option.label}
                    selected={volume === option.value}
                    onClick={() => setVolume(option.value)}
                  />
                ))}
              </div>
            </div>
          )}

          {currentStep === 'resposta' && (
            <div className="space-y-6">
              <QuestionTitle eyebrow="Conversão">
                Quando um lead chega, em quanto tempo ele é respondido?
              </QuestionTitle>
              <div className="grid gap-3 grid-cols-1 md:grid-cols-2 max-w-[560px] mx-auto w-full">
                {optionsResposta.map((option) => (
                  <OptionCard
                    key={option.value}
                    title={option.label}
                    selected={resposta === option.value}
                    onClick={() => setResposta(option.value)}
                  />
                ))}
              </div>
            </div>
          )}

          {currentStep === 'ia-hoje' && (
            <div className="space-y-6">
              <QuestionTitle eyebrow="Maturidade em IA">
                Você já usa IA ou automação no seu marketing?
              </QuestionTitle>
              <p className="text-[13px] text-black/50 text-center">
                Sem julgamento. Quem já tentou e se frustrou costuma destravar
                rápido com o acompanhamento certo.
              </p>
              <div className="grid gap-3 grid-cols-1 md:grid-cols-2 max-w-[560px] mx-auto w-full">
                {optionsIaHoje.map((option) => (
                  <OptionCard
                    key={option.value}
                    title={option.label}
                    selected={iaHoje === option.value}
                    onClick={() => setIaHoje(option.value)}
                  />
                ))}
              </div>
            </div>
          )}

          {currentStep === 'investimento' && (
            <div className="space-y-6">
              <QuestionTitle eyebrow="Investimento atual">
                Quanto você investe por mês em marketing e operação comercial?
              </QuestionTitle>
              <div className="grid gap-3 grid-cols-1 md:grid-cols-2 max-w-[560px] mx-auto w-full">
                {optionsInvestimento.map((option) => (
                  <OptionCard
                    key={option.value}
                    title={option.label}
                    selected={investimentoFaixa === option.value}
                    onClick={() => setInvestimentoFaixa(option.value)}
                  />
                ))}
              </div>
            </div>
          )}

          {currentStep === 'velocidade' && (
            <div className="space-y-6">
              <QuestionTitle eyebrow="Prontidão">
                Se desenharmos um plano de crescimento para os próximos 90 dias,
                você estaria pronto para começar?
              </QuestionTitle>
              <div className="grid gap-3 max-w-[560px] mx-auto w-full">
                {optionsVelocidade.map((option) => (
                  <OptionCard
                    key={option.value}
                    title={option.label}
                    selected={velocidade === option.value}
                    onClick={() => setVelocidade(option.value)}
                  />
                ))}
              </div>
            </div>
          )}

          {currentStep === 'perrengue' && (
            <div className="space-y-6">
              <QuestionTitle eyebrow="Quase lá">
                Em uma frase, qual é o seu maior perrengue hoje?
              </QuestionTitle>
              <p className="text-[13px] text-black/50 text-center">
                Opcional — mas quanto mais específico, mais preciso fica seu
                diagnóstico.
              </p>
              <div className="max-w-[520px] mx-auto">
                <textarea
                  value={perrengue}
                  onChange={(e) => setPerrengue(e.target.value)}
                  placeholder="Ex: demoro horas pra responder lead e perco venda; meu conteúdo não engaja; gasto com anúncio e não converte..."
                  rows={4}
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-[#0B2FFF]/30 text-[15px] resize-none"
                />
              </div>
            </div>
          )}

          {currentStep === 'contato' && (
            <div className="space-y-6">
              <QuestionTitle eyebrow="Falta pouco">
                Pra onde liberamos seu diagnóstico?
              </QuestionTitle>
              <p className="text-[14px] text-black/55 text-center max-w-[460px] mx-auto">
                Vamos enviar sua prévia e o convite pra call onde fazemos o
                diagnóstico completo.
              </p>
              <div className="max-w-[440px] mx-auto space-y-3">
                {precisaNome && (
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Seu nome"
                    autoFocus
                    autoComplete="name"
                    className={inputClass}
                  />
                )}
                {precisaEmail && (
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nome@empresa.com"
                    autoFocus={!precisaNome}
                    autoComplete="email"
                    className={inputClass}
                  />
                )}
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="WhatsApp — (11) 99999-9999"
                  autoFocus={!precisaNome && !precisaEmail}
                  autoComplete="tel"
                  inputMode="numeric"
                  className={inputClass}
                />
                <p className="text-[13px] text-black/45 text-center">
                  Usamos só pra entregar seu diagnóstico e agendar a call. Sem
                  spam.
                </p>
              </div>

              <div className="max-w-[460px] mx-auto pt-4 mt-2 border-t border-black/10 text-center">
                <p className="text-[13px] text-black/50">
                  Por trás da IA, tem gente. Fale com um dos fundadores da
                  Futurah.
                </p>
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-3 px-5 py-2.5 rounded-xl border border-[#0B2FFF]/30 text-[#0B2FFF] font-medium text-[14px] hover:bg-[#F4F6FF] transition-colors"
                >
                  Chamar no WhatsApp
                </a>
                <p className="text-[12px] text-black/35 mt-2">
                  {WHATSAPP_FUNDADOR_DISPLAY}
                </p>
              </div>
            </div>
          )}

          {submitError && (
            <p className="text-sm text-red-500 text-center">{submitError}</p>
          )}
        </div>

        {currentStep !== 'analise' && (
          <div className="flex items-center justify-between pt-10 md:pt-14">
            <button
              type="button"
              onClick={goBack}
              disabled={stepIndex === 0}
              className="text-sm text-black/50 hover:text-black disabled:opacity-0 transition-opacity"
            >
              ← Voltar
            </button>
            {!isLastStep ? (
              <button
                type="button"
                onClick={goNext}
                disabled={!canAdvance}
                className="px-6 py-3 rounded-xl bg-[#111] text-white font-medium hover:bg-[#0B2FFF] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continuar
              </button>
            ) : (
              <button
                type="button"
                onClick={submitAplicacao}
                disabled={!canAdvance || submitting}
                className="px-6 py-3 rounded-xl bg-[#111] text-white font-medium hover:bg-[#0B2FFF] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? 'Gerando...' : 'Ver minha prévia ➔'}
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function nomeFromUrlFallback(nameFromUrl: string): React.ReactNode {
  if (!nameFromUrl) return null;
  return (
    <div className="text-[13px] text-black/50 mb-1">
      Olá,{' '}
      <span className="font-semibold text-black/80">{nameFromUrl}</span>.
    </div>
  );
}
