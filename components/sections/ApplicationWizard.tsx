'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

type StepKey =
  | 'analise'
  | 'momento'
  | 'gargalo'
  | 'velocidade'
  | 'operacao'
  | 'agendamento';

const steps: { key: StepKey; label: string }[] = [
  { key: 'analise', label: 'Análise de Mercado' },
  { key: 'momento', label: 'Momento do Negócio' },
  { key: 'gargalo', label: 'Gargalo de Lucro' },
  { key: 'velocidade', label: 'Velocidade' },
  { key: 'operacao', label: 'Sua Operação Hoje' },
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

export default function ApplicationWizard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
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
  const [whatsapp, setWhatsapp] = useState('');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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

  const startAnalysis = () => {
    if (isAnalyzing) return;
    setStepIndex(0);
    setIsAnalyzing(true);
  };

  const goNext = () => setStepIndex((prev) => Math.min(prev + 1, 5));
  const goBack = () => setStepIndex((prev) => Math.max(prev - 1, 1));

  const submitAplicacao = async () => {
    if (submitting) return;
    setSubmitError(null);

    if (!siteName.trim()) {
      setSubmitError('Informe seu site ou @instagram.');
      return;
    }
    if (!email.trim()) {
      setSubmitError('Informe um e-mail para contato.');
      return;
    }
    if (!whatsapp.trim()) {
      setSubmitError('Informe um WhatsApp para contato.');
      return;
    }
    if (!momento || !gargalo || !velocidade) {
      setSubmitError('Responda todas as etapas antes de enviar.');
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
      equipe: headcount && custoFuncionario
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
                  {nameFromUrl ? (
                    <p className="text-[15px] text-black/60">
                      Olá, <span className="font-semibold text-black">{nameFromUrl}</span>. Recebemos sua solicitação.
                    </p>
                  ) : null}
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
              <div className="space-y-10">
                <div className="space-y-2">
                  <h2 className="text-[26px] md:text-[32px] font-medium tracking-tight leading-[1.2] text-[#111]">
                    Como está sua operação hoje?
                  </h2>
                  <p className="text-black/60 text-[15px] max-w-[620px]">
                    Esses dados ajudam a IA a mapear onde agentes podem
                    substituir funções humanas ou plataformas pagas — e quanto
                    isso pode economizar.
                  </p>
                </div>

                <div className="space-y-5">
                  <div className="text-[11px] tracking-[0.2em] font-bold text-black/40 uppercase">
                    Equipe
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium text-black">
                      Quantas pessoas trabalham na empresa?
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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

                  <div className="space-y-3">
                    <label className="text-sm font-medium text-black">
                      Quais cargos existem na equipe?{' '}
                      <span className="text-black/40 font-normal">
                        (marque todos que se aplicam)
                      </span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {cargosDisponiveis.map((cargo) => (
                        <ChipOption
                          key={cargo.value}
                          label={cargo.label}
                          selected={cargos.includes(cargo.value)}
                          onClick={() => toggleCargo(cargo.value)}
                        />
                      ))}
                    </div>
                    <input
                      type="text"
                      value={cargosOutros}
                      onChange={(e) => setCargosOutros(e.target.value)}
                      placeholder="Outros cargos (separe por vírgula)"
                      className="w-full px-4 py-3 rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-[#0B2FFF]/30 text-sm"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium text-black">
                      Custo médio mensal por funcionário
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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
                </div>

                <div className="space-y-5 pt-4 border-t border-black/10">
                  <div className="text-[11px] tracking-[0.2em] font-bold text-black/40 uppercase">
                    Plataformas pagas
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium text-black">
                      Quais plataformas/SaaS sua empresa paga hoje?{' '}
                      <span className="text-black/40 font-normal">
                        (marque todas que usa)
                      </span>
                    </label>
                    <div className="space-y-4">
                      {plataformasDisponiveis.map((grupo) => (
                        <div key={grupo.grupo} className="space-y-2">
                          <div className="text-[11px] font-semibold uppercase tracking-wider text-black/50">
                            {grupo.grupo}
                          </div>
                          <div className="flex flex-wrap gap-2">
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
                    <input
                      type="text"
                      value={plataformasOutras}
                      onChange={(e) => setPlataformasOutras(e.target.value)}
                      placeholder="Outras plataformas (separe por vírgula)"
                      className="w-full px-4 py-3 rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-[#0B2FFF]/30 text-sm"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium text-black">
                      Quanto paga por mês no total em plataformas?
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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

            {stepIndex === 5 ? (
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

                <div className="space-y-4 max-w-[480px]">
                  {!nameFromUrl && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-black">
                        Como prefere ser chamado?
                      </label>
                      <input
                        type="text"
                        value={nome}
                        onChange={(event) => setNome(event.target.value)}
                        placeholder="Seu nome"
                        className="w-full px-4 py-3 rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-[#0B2FFF]/30"
                      />
                    </div>
                  )}

                  {!emailFromUrl && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-black">
                        Melhor e-mail:
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="nome@empresa.com"
                        className="w-full px-4 py-3 rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-[#0B2FFF]/30"
                      />
                      <p className="text-[13px] text-black/50">
                        Enviaremos sua análise estratégica neste e-mail.
                      </p>
                    </div>
                  )}

                  <div className="space-y-2">
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
                      Para qual número nosso Consultor deve enviar os detalhes
                      da Sessão Estratégica?
                    </p>
                  </div>
                </div>

                {submitError && (
                  <p className="text-sm text-red-500">{submitError}</p>
                )}

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
                    onClick={submitAplicacao}
                    disabled={submitting}
                    className="px-6 py-3 rounded-xl bg-[#111] text-white font-medium hover:bg-[#0B2FFF] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Enviando...' : 'SOLICITAR HORÁRIO NA AGENDA ➔'}
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
