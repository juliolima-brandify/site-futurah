'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

type StepKey =
  | 'analise'
  | 'momento'
  | 'gargalo'
  | 'velocidade'
  | 'headcount'
  | 'cargos'
  | 'custo-funcionario'
  | 'plataformas'
  | 'custo-plataformas'
  | 'nome'
  | 'email'
  | 'whatsapp';

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

const optionsHeadcount = [
  { value: 'solo', label: 'Só eu (solo)' },
  { value: '2-5', label: '2 a 5 pessoas' },
  { value: '6-10', label: '6 a 10 pessoas' },
  { value: '11-25', label: '11 a 25 pessoas' },
  { value: '26-50', label: '26 a 50 pessoas' },
  { value: '50+', label: 'Mais de 50 pessoas' },
];

const cargosDisponiveis = [
  { value: 'sdr', label: 'SDR / Pré-vendas' },
  { value: 'atendente-whatsapp', label: 'Atendente de WhatsApp' },
  { value: 'agendadora', label: 'Agendadora / Secretária' },
  { value: 'suporte-n1', label: 'Suporte / Atendimento N1' },
  { value: 'qualificador', label: 'Qualificador de leads' },
  { value: 'social-media', label: 'Social media junior' },
  { value: 'gestor-trafego', label: 'Gestor de tráfego' },
  { value: 'webdesigner', label: 'Webdesigner' },
  { value: 'financeiro-op', label: 'Financeiro operacional' },
  { value: 'recepcionista', label: 'Recepcionista' },
];

const optionsCustoFuncionario = [
  { value: 'ate-2k', label: 'Até R$ 2.000' },
  { value: '2-3.5k', label: 'R$ 2.000 – R$ 3.500' },
  { value: '3.5-5.5k', label: 'R$ 3.500 – R$ 5.500' },
  { value: '5.5-9k', label: 'R$ 5.500 – R$ 9.000' },
  { value: '9-15k', label: 'R$ 9.000 – R$ 15.000' },
  { value: '15k+', label: 'Acima de R$ 15.000' },
];

const plataformasDisponiveis: {
  grupo: string;
  itens: { value: string; label: string }[];
}[] = [
  {
    grupo: 'CRM',
    itens: [
      { value: 'rd-station', label: 'RD Station' },
      { value: 'hubspot', label: 'HubSpot' },
      { value: 'pipedrive', label: 'Pipedrive' },
      { value: 'ploomes', label: 'Ploomes' },
      { value: 'kommo', label: 'Kommo' },
    ],
  },
  {
    grupo: 'Atendimento',
    itens: [
      { value: 'zendesk', label: 'Zendesk' },
      { value: 'intercom', label: 'Intercom' },
      { value: 'tawk', label: 'Tawk' },
      { value: 'zenvia', label: 'Zenvia' },
      { value: 'take-blip', label: 'Take Blip' },
    ],
  },
  {
    grupo: 'Agendamento',
    itens: [
      { value: 'calendly', label: 'Calendly' },
      { value: 'tidycal', label: 'TidyCal' },
      { value: 'reservio', label: 'Reservio' },
    ],
  },
  {
    grupo: 'WhatsApp / Chatbot',
    itens: [
      { value: 'twilio', label: 'Twilio' },
      { value: '360dialog', label: '360dialog' },
      { value: 'z-api', label: 'Z-API' },
      { value: 'blip', label: 'Blip' },
    ],
  },
  {
    grupo: 'Email marketing',
    itens: [
      { value: 'mailchimp', label: 'Mailchimp' },
      { value: 'activecampaign', label: 'ActiveCampaign' },
    ],
  },
];

const optionsCustoPlataformas = [
  { value: 'ate-500', label: 'Até R$ 500' },
  { value: '500-1.5k', label: 'R$ 500 – R$ 1.500' },
  { value: '1.5-3k', label: 'R$ 1.500 – R$ 3.000' },
  { value: '3-8k', label: 'R$ 3.000 – R$ 8.000' },
  { value: '8k+', label: 'Acima de R$ 8.000' },
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

const ChipOption: React.FC<{
  label: string;
  selected?: boolean;
  onClick?: () => void;
}> = ({ label, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-[13px] font-medium border transition-all ${
      selected
        ? 'border-[#0B2FFF] bg-[#0B2FFF] text-white'
        : 'border-black/15 bg-white text-black/70 hover:border-black/30'
    }`}
  >
    {label}
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

export default function ApplicationWizard() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [siteName, setSiteName] = useState('');
  const [momento, setMomento] = useState('');
  const [gargalo, setGargalo] = useState('');
  const [velocidade, setVelocidade] = useState('');
  const [headcount, setHeadcount] = useState('');
  const [cargos, setCargos] = useState<string[]>([]);
  const [cargosOutros, setCargosOutros] = useState('');
  const [custoFuncionario, setCustoFuncionario] = useState('');
  const [plataformas, setPlataformas] = useState<string[]>([]);
  const [plataformasOutras, setPlataformasOutras] = useState('');
  const [custoPlataformas, setCustoPlataformas] = useState('');
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

  const stepKeys: StepKey[] = useMemo(() => {
    const base: StepKey[] = [
      'analise',
      'momento',
      'gargalo',
      'velocidade',
      'headcount',
      'cargos',
      'custo-funcionario',
      'plataformas',
      'custo-plataformas',
    ];
    const contato: StepKey[] = [];
    if (!nameFromUrl) contato.push('nome');
    if (!emailFromUrl) contato.push('email');
    contato.push('whatsapp');
    return [...base, ...contato];
  }, [nameFromUrl, emailFromUrl]);

  const [stepIndex, setStepIndex] = useState(0);
  const currentStep = stepKeys[stepIndex];
  const isLastStep = stepIndex === stepKeys.length - 1;
  const progress = useMemo(
    () => Math.round(((stepIndex + 1) / stepKeys.length) * 100),
    [stepIndex, stepKeys.length],
  );

  const canAdvance = useMemo(() => {
    switch (currentStep) {
      case 'analise':
        return siteName.trim().length > 0;
      case 'momento':
        return momento !== '';
      case 'gargalo':
        return gargalo !== '';
      case 'velocidade':
        return velocidade !== '';
      case 'headcount':
        return headcount !== '';
      case 'cargos':
        return cargos.length > 0 || cargosOutros.trim().length > 0;
      case 'custo-funcionario':
        return custoFuncionario !== '';
      case 'plataformas':
        return plataformas.length > 0 || plataformasOutras.trim().length > 0;
      case 'custo-plataformas':
        return custoPlataformas !== '';
      case 'nome':
        return nome.trim().length > 0;
      case 'email':
        return /\S+@\S+\.\S+/.test(email.trim());
      case 'whatsapp':
        return whatsapp.trim().length >= 8;
      default:
        return false;
    }
  }, [
    currentStep,
    siteName,
    momento,
    gargalo,
    velocidade,
    headcount,
    cargos,
    cargosOutros,
    custoFuncionario,
    plataformas,
    plataformasOutras,
    custoPlataformas,
    nome,
    email,
    whatsapp,
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

  const toggleCargo = (value: string) => {
    setCargos((prev) =>
      prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value],
    );
  };

  const togglePlataforma = (value: string) => {
    setPlataformas((prev) =>
      prev.includes(value) ? prev.filter((p) => p !== value) : [...prev, value],
    );
  };

  const submitAplicacao = async () => {
    if (submitting) return;
    setSubmitError(null);

    if (!canAdvance) {
      setSubmitError('Preencha o campo antes de enviar.');
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
      equipe:
        headcount && custoFuncionario
          ? {
              headcount,
              cargos,
              cargosOutros: cargosOutros.trim() || undefined,
              custoMedioFaixa: custoFuncionario,
            }
          : undefined,
      plataformas: custoPlataformas
        ? {
            items: plataformas,
            outras: plataformasOutras.trim() || undefined,
            custoTotalFaixa: custoPlataformas,
          }
        : undefined,
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
    // não avança quando estiver num textarea ou em step com input livre múltiplo
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
              <QuestionTitle eyebrow="A transição">
                {nomeFromUrlFallback(nameFromUrl)}
                Mapeando sua presença digital
              </QuestionTitle>
              <p className="text-black/60 text-[15px] text-center max-w-[520px] mx-auto">
                Cole o site ou @instagram do seu negócio. Vamos cruzar com os
                sinais de mercado antes das próximas perguntas.
              </p>

              <div className="flex flex-col gap-3 max-w-[480px] mx-auto">
                <input
                  type="text"
                  value={siteName}
                  onChange={(event) => setSiteName(event.target.value)}
                  placeholder="Cole o site ou @instagram"
                  autoFocus
                  className="w-full px-4 py-4 rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-[#0B2FFF]/30 text-[16px]"
                />
                <button
                  type="button"
                  onClick={startAnalysis}
                  disabled={isAnalyzing || !siteName.trim()}
                  className="w-full px-6 py-4 rounded-xl bg-[#111] text-white font-medium hover:bg-[#0B2FFF] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? 'Analisando...' : 'Iniciar análise'}
                </button>
              </div>

              {isAnalyzing ? (
                <div className="flex items-center justify-center gap-3 text-black/50 text-sm">
                  <div className="w-4 h-4 border-2 border-black/20 border-t-[#0B2FFF] rounded-full animate-spin" />
                  Analisando sinais de mercado e posicionamento...
                </div>
              ) : null}
            </div>
          )}

          {currentStep === 'momento' && (
            <div className="space-y-6">
              <QuestionTitle eyebrow="Pergunta 1">
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

          {currentStep === 'gargalo' && (
            <div className="space-y-6">
              <QuestionTitle eyebrow="Pergunta 2">
                O que está impedindo sua empresa de dobrar o lucro hoje?
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

          {currentStep === 'velocidade' && (
            <div className="space-y-6">
              <QuestionTitle eyebrow="Pergunta 3">
                Se desenharmos um Plano de Aceleração para os próximos 90 dias,
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

          {currentStep === 'headcount' && (
            <div className="space-y-6">
              <QuestionTitle eyebrow="Operação · 1/5">
                Quantas pessoas trabalham na sua empresa?
              </QuestionTitle>
              <div className="grid gap-3 grid-cols-1 md:grid-cols-2 max-w-[560px] mx-auto w-full">
                {optionsHeadcount.map((opt) => (
                  <OptionCard
                    key={opt.value}
                    title={opt.label}
                    selected={headcount === opt.value}
                    onClick={() => setHeadcount(opt.value)}
                  />
                ))}
              </div>
            </div>
          )}

          {currentStep === 'cargos' && (
            <div className="space-y-6">
              <QuestionTitle eyebrow="Operação · 2/5">
                Quais cargos existem na sua equipe hoje?
              </QuestionTitle>
              <p className="text-[13px] text-black/50 text-center">
                Marque todos que se aplicam. Use o campo abaixo pra cargos que
                não estão na lista.
              </p>
              <div className="flex flex-wrap gap-2 justify-center max-w-[620px] mx-auto">
                {cargosDisponiveis.map((cargo) => (
                  <ChipOption
                    key={cargo.value}
                    label={cargo.label}
                    selected={cargos.includes(cargo.value)}
                    onClick={() => toggleCargo(cargo.value)}
                  />
                ))}
              </div>
              <div className="max-w-[480px] mx-auto">
                <input
                  type="text"
                  value={cargosOutros}
                  onChange={(e) => setCargosOutros(e.target.value)}
                  placeholder="Outros cargos (separe por vírgula)"
                  className="w-full px-4 py-3 rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-[#0B2FFF]/30 text-sm"
                />
              </div>
            </div>
          )}

          {currentStep === 'custo-funcionario' && (
            <div className="space-y-6">
              <QuestionTitle eyebrow="Operação · 3/5">
                Qual o custo médio mensal por funcionário?
              </QuestionTitle>
              <div className="grid gap-3 grid-cols-1 md:grid-cols-2 max-w-[560px] mx-auto w-full">
                {optionsCustoFuncionario.map((opt) => (
                  <OptionCard
                    key={opt.value}
                    title={opt.label}
                    selected={custoFuncionario === opt.value}
                    onClick={() => setCustoFuncionario(opt.value)}
                  />
                ))}
              </div>
            </div>
          )}

          {currentStep === 'plataformas' && (
            <div className="space-y-6">
              <QuestionTitle eyebrow="Operação · 4/5">
                Quais plataformas sua empresa paga hoje?
              </QuestionTitle>
              <p className="text-[13px] text-black/50 text-center">
                Marque todas que usa — agrupadas por tipo.
              </p>
              <div className="space-y-5 max-w-[620px] mx-auto">
                {plataformasDisponiveis.map((grupo) => (
                  <div key={grupo.grupo} className="space-y-2">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-black/50 text-center">
                      {grupo.grupo}
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {grupo.itens.map((item) => (
                        <ChipOption
                          key={item.value}
                          label={item.label}
                          selected={plataformas.includes(item.value)}
                          onClick={() => togglePlataforma(item.value)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="max-w-[480px] mx-auto">
                <input
                  type="text"
                  value={plataformasOutras}
                  onChange={(e) => setPlataformasOutras(e.target.value)}
                  placeholder="Outras plataformas (separe por vírgula)"
                  className="w-full px-4 py-3 rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-[#0B2FFF]/30 text-sm"
                />
              </div>
            </div>
          )}

          {currentStep === 'custo-plataformas' && (
            <div className="space-y-6">
              <QuestionTitle eyebrow="Operação · 5/5">
                Quanto você paga por mês no total em plataformas?
              </QuestionTitle>
              <div className="grid gap-3 grid-cols-1 md:grid-cols-2 max-w-[560px] mx-auto w-full">
                {optionsCustoPlataformas.map((opt) => (
                  <OptionCard
                    key={opt.value}
                    title={opt.label}
                    selected={custoPlataformas === opt.value}
                    onClick={() => setCustoPlataformas(opt.value)}
                  />
                ))}
              </div>
            </div>
          )}

          {currentStep === 'nome' && (
            <div className="space-y-6">
              <QuestionTitle eyebrow="Contato">
                Como prefere ser chamado?
              </QuestionTitle>
              <div className="max-w-[420px] mx-auto">
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Seu nome"
                  autoFocus
                  className="w-full px-4 py-4 rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-[#0B2FFF]/30 text-[16px] text-center"
                />
              </div>
            </div>
          )}

          {currentStep === 'email' && (
            <div className="space-y-6">
              <QuestionTitle eyebrow="Contato">
                Qual o melhor e-mail pra te enviar a análise?
              </QuestionTitle>
              <div className="max-w-[420px] mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nome@empresa.com"
                  autoFocus
                  className="w-full px-4 py-4 rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-[#0B2FFF]/30 text-[16px] text-center"
                />
              </div>
            </div>
          )}

          {currentStep === 'whatsapp' && (
            <div className="space-y-6">
              <QuestionTitle eyebrow="Última etapa · Perfil pré-aprovado">
                Pra qual WhatsApp nosso consultor deve enviar os detalhes?
              </QuestionTitle>
              <div className="max-w-[420px] mx-auto space-y-3">
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="(11) 99999-9999"
                  autoFocus
                  className="w-full px-4 py-4 rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-[#0B2FFF]/30 text-[16px] text-center"
                />
                <p className="text-[13px] text-black/50 text-center">
                  Usado apenas para entregar sua análise e agendar a Sessão
                  Estratégica.
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
                {submitting ? 'Enviando...' : 'Enviar ➔'}
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
