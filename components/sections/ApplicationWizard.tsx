'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';

type StepKey = 'analise' | 'momento' | 'gargalo' | 'velocidade' | 'agendamento';

const steps: { key: StepKey; label: string }[] = [
  { key: 'analise', label: 'Análise de Mercado' },
  { key: 'momento', label: 'Momento do Negócio' },
  { key: 'gargalo', label: 'Gargalo de Lucro' },
  { key: 'velocidade', label: 'Velocidade' },
  { key: 'agendamento', label: 'Agendamento' },
];

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

const optionsGargalo = [
  {
    value: 'trafego',
    label: '“Gasto com anúncios e o telefone não toca.”',
    note: 'Diagnóstico: Problema de Tráfego/Qualificação.',
  },
  {
    value: 'posicionamento',
    label: '“Chegam muitos curiosos que acham caro.”',
    note: 'Diagnóstico: Problema de Posicionamento/Branding.',
  },
  {
    value: 'processo',
    label: '“Minha equipe demora para atender e perco vendas.”',
    note: 'Diagnóstico: Problema de Processo Comercial.',
  },
  {
    value: 'gestao',
    label: '“Sou escravo da operação / Não tenho tempo.”',
    note: 'Diagnóstico: Problema de Gestão/Automação.',
  },
];

const optionsVelocidade = [
  { value: 'prioridade', label: 'Sim, é prioridade total.' },
  { value: 'validar', label: 'Sim, mas preciso validar o investimento.' },
  { value: 'pesquisando', label: 'Não, estou apenas pesquisando mercado.' },
];

const StepBadge: React.FC<{ active?: boolean; done?: boolean }> = ({
  active,
  done,
}) => (
  <div
    className={`h-2.5 w-2.5 rounded-full ${
      done ? 'bg-brand-highlight' : active ? 'bg-brand-highlight' : 'bg-black/10'
    }`}
  />
);

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

export default function ApplicationWizard() {
  const searchParams = useSearchParams();
  const [stepIndex, setStepIndex] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [siteName, setSiteName] = useState('');
  const [momento, setMomento] = useState('');
  const [gargalo, setGargalo] = useState('');
  const [velocidade, setVelocidade] = useState('');
  const [whatsapp, setWhatsapp] = useState('');

  const progress = useMemo(() => {
    return Math.round(((stepIndex + 1) / steps.length) * 100);
  }, [stepIndex]);

  useEffect(() => {
    if (!isAnalyzing) return;
    const timer = setTimeout(() => {
      setStepIndex(1);
      setIsAnalyzing(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [isAnalyzing]);

  useEffect(() => {
    const social = searchParams?.get('social') || '';
    if (social) {
      setSiteName(social);
      setIsAnalyzing(true);
    }
  }, [searchParams]);

  const startAnalysis = () => {
    if (isAnalyzing) return;
    setStepIndex(0);
    setIsAnalyzing(true);
  };

  const goNext = () => setStepIndex((prev) => Math.min(prev + 1, 4));
  const goBack = () => setStepIndex((prev) => Math.max(prev - 1, 1));

  return (
    <section className="w-full min-h-screen py-16 lg:py-24">
      <div className="w-full bg-white border border-black/5 rounded-[32px] shadow-[0_30px_80px_rgba(0,0,0,0.08)] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr]">
          <aside className="hidden lg:flex flex-col gap-6 border-r border-black/10 px-8 py-10 bg-[#2C2C2C]">
            <div className="text-[11px] tracking-[0.2em] font-bold text-white/60 uppercase">
              Etapas
            </div>
            <div className="flex flex-col gap-4">
              {steps.map((step, idx) => {
                const done = idx < stepIndex;
                const active = idx === stepIndex || (stepIndex === 0 && idx === 0);
                return (
                  <div key={step.key} className="flex items-center gap-3">
                    <StepBadge active={active} done={done} />
                    <span
                      className={`text-sm ${
                        active
                          ? 'text-white'
                          : done
                          ? 'text-white/70'
                          : 'text-white/40'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
            <img
              src="/images/logos/logo-minor.svg"
              alt="Futurah"
              className="mt-auto h-6 w-auto opacity-90 self-start"
            />
          </aside>

          <div className="px-6 md:px-10 lg:px-16 py-10 md:py-12">
            <div className="flex items-center justify-between mb-10">
              <div className="text-[11px] tracking-[0.2em] font-bold text-black/40 uppercase">
                {stepIndex === 0 ? 'A TRANSIÇÃO' : `ETAPA ${stepIndex + 1}`}
              </div>
              <div className="h-2 w-40 rounded-full bg-black/5 overflow-hidden">
                <div
                  className="h-full bg-brand-highlight transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {stepIndex === 0 ? (
              <div className="space-y-8">
                <div className="space-y-2">
                  <h2 className="text-[26px] md:text-[32px] font-medium tracking-tight leading-[1.2] text-[#111]">
                    Mapeando sua presença digital...
                  </h2>
                  <p className="text-black/60 text-[15px]">
                    Acessando dados públicos de{' '}
                    <span className="font-semibold text-black">
                      {siteName || 'seu site/Instagram'}
                    </span>
                    .
                  </p>
                  <p className="text-black/60 text-[15px] max-w-[560px]">
                    Para entregar um plano comercial viável, precisamos entender
                    o estágio atual do seu negócio.
                  </p>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                  <input
                    type="text"
                    value={siteName}
                    onChange={(event) => setSiteName(event.target.value)}
                    placeholder="Cole o site ou @instagram"
                    className="w-full md:max-w-[360px] px-4 py-3 rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-[#0B2FFF]/30"
                  />
                  <button
                    type="button"
                    onClick={startAnalysis}
                    disabled={isAnalyzing}
                    className="px-6 py-3 rounded-xl bg-[#111] text-white font-medium hover:bg-[#0B2FFF] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isAnalyzing ? 'Analisando...' : 'Iniciar análise'}
                  </button>
                </div>

                {isAnalyzing ? (
                  <div className="flex items-center gap-3 text-black/50 text-sm">
                    <div className="w-4 h-4 border-2 border-black/20 border-t-[#0B2FFF] rounded-full animate-spin" />
                    Analisando sinais de mercado e posicionamento...
                  </div>
                ) : null}
              </div>
            ) : null}

            {stepIndex === 1 ? (
              <div className="space-y-8">
                <div className="space-y-2">
                  <h2 className="text-[26px] md:text-[32px] font-medium tracking-tight leading-[1.2] text-[#111]">
                    Para alinhar a estratégia ao seu orçamento: Em qual fase sua
                    empresa se encontra hoje?
                  </h2>
                </div>
                <div className="grid gap-4">
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
                <div className="flex items-center justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setStepIndex(0)}
                    className="text-sm text-black/50 hover:text-black"
                  >
                    Voltar
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    className="px-6 py-3 rounded-xl bg-[#111] text-white font-medium hover:bg-[#0B2FFF] transition-colors"
                  >
                    Continuar
                  </button>
                </div>
              </div>
            ) : null}

            {stepIndex === 2 ? (
              <div className="space-y-8">
                <div className="space-y-2">
                  <h2 className="text-[26px] md:text-[32px] font-medium tracking-tight leading-[1.2] text-[#111]">
                    O que está impedindo sua empresa de dobrar o lucro hoje?
                  </h2>
                </div>
                <div className="grid gap-4">
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
                <div className="flex items-center justify-between pt-4">
                  <button
                    type="button"
                    onClick={goBack}
                    className="text-sm text-black/50 hover:text-black"
                  >
                    Voltar
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    className="px-6 py-3 rounded-xl bg-[#111] text-white font-medium hover:bg-[#0B2FFF] transition-colors"
                  >
                    Continuar
                  </button>
                </div>
              </div>
            ) : null}

            {stepIndex === 3 ? (
              <div className="space-y-8">
                <div className="space-y-2">
                  <h2 className="text-[26px] md:text-[32px] font-medium tracking-tight leading-[1.2] text-[#111]">
                    Se desenharmos um Plano de Aceleração para os próximos 90
                    dias, você estaria pronto para começar?
                  </h2>
                </div>
                <div className="grid gap-4">
                  {optionsVelocidade.map((option) => (
                    <OptionCard
                      key={option.value}
                      title={option.label}
                      selected={velocidade === option.value}
                      onClick={() => setVelocidade(option.value)}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between pt-4">
                  <button
                    type="button"
                    onClick={goBack}
                    className="text-sm text-black/50 hover:text-black"
                  >
                    Voltar
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    className="px-6 py-3 rounded-xl bg-[#111] text-white font-medium hover:bg-[#0B2FFF] transition-colors"
                  >
                    Continuar
                  </button>
                </div>
              </div>
            ) : null}

            {stepIndex === 4 ? (
              <div className="space-y-8">
                <div className="space-y-2">
                  <h2 className="text-[28px] md:text-[34px] font-medium tracking-tight leading-[1.2] text-[#111]">
                    Perfil Pré-Aprovado.
                  </h2>
                  <p className="text-black/60 text-[16px]">
                    Identificamos 3 alavancas de crescimento imediato para o
                    seu cenário.
                  </p>
                </div>

                <div className="space-y-3 max-w-[480px]">
                  <label className="text-sm font-medium text-black">
                    WhatsApp (DDD + Número):
                  </label>
                  <input
                    type="tel"
                    value={whatsapp}
                    onChange={(event) => setWhatsapp(event.target.value)}
                    placeholder="(11) 99999-9999"
                    className="w-full px-4 py-3 rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-[#0B2FFF]/30"
                  />
                  <p className="text-[13px] text-black/50">
                    Para qual número nosso Consultor deve enviar os detalhes da
                    Sessão Estratégica?
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <button
                    type="button"
                    onClick={goBack}
                    className="text-sm text-black/50 hover:text-black"
                  >
                    Voltar
                  </button>
                  <button
                    type="button"
                    className="px-6 py-3 rounded-xl bg-[#111] text-white font-medium hover:bg-[#0B2FFF] transition-colors"
                  >
                    SOLICITAR HORÁRIO NA AGENDA ➔
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
