'use client';

import { useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Zap, ChevronDown } from 'lucide-react';
import Container from '../layout/Container';

interface FAQItem {
  question: string;
  answer: ReactNode;
}

const faqItems: FAQItem[] = [
  {
    question: "1. O que faz a Futurah & Co ser diferente de uma agência de marketing tradicional?",
    answer: (
      <>
        A maioria das agências vende &quot;entregáveis&quot; (posts, vídeos, sites). Nós vendemos potencial de lucro previsível e eficiência operacional.<br /><br />
        <strong>Nosso Motor:</strong> Não usamos apenas &quot;criatividade&quot;; usamos Inteligência Artificial e Automação para criar máquinas de vendas.<br /><br />
        <strong>O Foco:</strong> Deixamos de ser apenas &quot;executores de tarefas&quot; para sermos parceiros de negócios focados em resolver dores urgentes.<br /><br />
        <strong>Tecnologia:</strong> Implementamos Agentes de IA que trabalham 24/7, algo que agências tradicionais ainda não dominam.
      </>
    )
  },
  {
    question: "2. Quais tipos de serviços vocês oferecem?",
    answer: (
      <>
        Nossa atuação se divide em dois pilares principais: Crescimento (Marketing) e Eficiência (Tecnologia).<br /><br />
        <strong>Agentes de IA & Automação:</strong> Criação de robôs de atendimento, automação de CRM e otimização de fluxos de trabalho para reduzir custos.<br /><br />
        <strong>Tráfego & Performance:</strong> Gestão de Google Ads e Meta Ads focada em conversão (vendas/leads), pulando etapas desnecessárias de &quot;aquecimento&quot; quando possível (Funil Invertido).<br /><br />
        <strong>Consultoria de Processos:</strong> Implementação de CRM e estruturação de times de vendas para garantir que os leads gerados sejam atendidos.
      </>
    )
  },
  {
    question: "3. Vocês atendem apenas a área médica?",
    answer: (
      <>
        Não. Embora tenhamos uma profunda expertise e compliance para o setor de Saúde (Médicos e Clínicas), nossa tecnologia é agnóstica. Atendemos segmentos que necessitam de alto volume de atendimento ou vendas complexas, como:<br /><br />
        <strong>E-commerce:</strong> Consultoria de funil e otimização de vendas.<br /><br />
        <strong>Turismo e Hotelaria:</strong> Automação de reservas e atendimento.<br /><br />
        <strong>Serviços B2B:</strong> Empresas que precisam digitalizar processos e qualificar leads automaticamente.
      </>
    )
  },
  {
    question: "4. Como funciona o investimento? Vocês cobram por hora?",
    answer: (
      <>
        Não cobramos por hora, cobramos pelo valor da solução e complexidade do projeto. Trabalhamos com planos recorrentes e projetos de implementação.<br /><br />
        <strong>Ticket Mínimo:</strong> Para garantir a qualidade e a dedicação da nossa equipe sênior, nossos projetos iniciam a partir de R$ 3.000,00/mês.<br /><br />
        <strong>Viabilidade:</strong> Recomendamos que esse valor (fee da agência + verba de anúncios) represente entre 2% a 3% do seu faturamento bruto atual, para que a parceria seja sustentável para o seu caixa.
      </>
    )
  },
  {
    question: "5. Em quanto tempo verei resultados?",
    answer: (
      <>
        O marketing digital e a implementação de IA não são mágica, são processos de melhoria contínua.<br /><br />
        <strong>Curto Prazo (30-60 dias):</strong> Organização da &quot;vitrine&quot; (Google Meu Negócio, Landing Pages), implementação de automações básicas e início das campanhas de tráfego.<br /><br />
        <strong>Médio Prazo (90 dias+):</strong> Maturação das campanhas, otimização do Custo por Lead (CPL) e ajuste fino dos Agentes de IA.<br /><br />
        <strong>Atenção:</strong> Resultados rápidos dependem também da velocidade de atendimento da sua equipe comercial ao receber os leads.
      </>
    )
  },
  {
    question: "6. O que é esse &quot;Método Único&quot; que vocês mencionam?",
    answer: (
      <>
        É a nossa forma de garantir qualidade e escala. Não acreditamos em &quot;reinventar a roda&quot; para cada cliente.<br /><br />
        Nós &quot;produtizamos&quot; o serviço: aplicamos um framework validado (um &quot;McDonald&apos;s&quot; de processos de alta qualidade) para garantir que você tenha os elementos essenciais para vender (Tráfego + Criativos + Script + Automação) sem desperdício de tempo.<br /><br />
        Aplicamos a Lei de Pareto (80/20): focamos nos 20% de ações que vão gerar 80% do seu resultado financeiro.
      </>
    )
  },
  {
    question: "7. Por que contratar uma agência de IA e não apenas usar o ChatGPT internamente?",
    answer: (
      <>
        O ChatGPT é uma ferramenta, não uma estratégia.<br /><br />
        <strong>O Problema:</strong> A maioria das empresas usa IA de forma genérica (&quot;fundição de metal bruto&quot;), o que gera resultados medianos.<br /><br />
        <strong>A Nossa Solução:</strong> Nós criamos &quot;peças de precisão&quot;. Configuramos a IA para entender o contexto do seu negócio, integramos com seu CRM e criamos automações que funcionam sozinhas. Vendemos a engenharia da fábrica, não apenas o acesso à ferramenta.
      </>
    )
  }
];

export default function Contact() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    social: ''
  });
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.social) {
      return;
    }
    const params = new URLSearchParams({
      name: formData.name,
      email: formData.email,
      social: formData.social,
    });
    router.push(`/aplicacao?${params.toString()}`);
  };

  return (
    <section id="analise" className="bg-brand-title text-white px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div className="w-full">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 lg:items-stretch">
          {/* Left - Image/Mockup (30%) */}
          <div className="lg:w-[30%] flex lg:self-stretch">
            <div className="relative w-full h-full bg-white/5 rounded-3xl overflow-hidden border border-white/10">
              <img
                src="/images/cta_forms.webp"
                alt="Mockup"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Center - Form Card (45%) */}
          <div className="lg:w-[45%] flex lg:self-start">
            <div className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 lg:p-8 flex flex-col">
              <div className="space-y-4">
                {/* Logo */}
                <img
                  src="/images/logos/logo-minor.svg"
                  alt="Futura and Co."
                  className="h-7 w-auto"
                />

                {/* Heading */}
                <h2 className="text-[24px] font-medium text-white leading-tight">
                  Solicitar Diagnóstico Gratuito
                </h2>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    type="text"
                    placeholder="Como prefere ser chamado?"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/40 focus:outline-none focus:border-white/30 transition-colors text-sm"
                  />
                  <input
                    type="email"
                    placeholder="Melhor E-mail"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/40 focus:outline-none focus:border-white/30 transition-colors text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Site ou Instagram da Empresa"
                    value={formData.social || ''}
                    onChange={(e) => setFormData({ ...formData, social: e.target.value })}
                    className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/40 focus:outline-none focus:border-white/30 transition-colors text-sm"
                  />

                  <button
                    type="submit"
                    className="w-full bg-white text-brand-title px-6 py-3 rounded-2xl font-medium hover:bg-gray-100 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    QUERO RECEBER ANÁLISE
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                {/* Terms */}
                <p className="text-xs text-white/40 leading-relaxed text-center">
                  Seus dados estão seguros conosco. Zero spam.
                </p>
              </div>
            </div>
          </div>

          {/* Right - CTA (25%) */}
          <div className="lg:w-[25%] flex flex-col justify-between lg:self-stretch">
            {/* Top Content */}
            <div className="space-y-6">
              {/* Label */}
              <div className="text-sm font-medium text-white/60 uppercase tracking-wider">
                PRÓXIMOS PASSOS
              </div>

              {/* Heading */}
              <h2 className="text-4xl lg:text-5xl font-medium text-white leading-[1.1]">
                Vamos acelerar<br />
                o seu negócio?
              </h2>

              {/* Description */}
              <p className="text-sm text-white/70 leading-relaxed">
                Estratégias de IA que humanizam processos e aceleram resultados, focadas em rentabilidade e eficiência.
              </p>
            </div>

            {/* Bottom Content */}
            <div className="space-y-2 mt-6 lg:mt-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-highlight rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-brand-title" />
                </div>
                <span className="text-lg font-medium text-white">Retorno em 24h</span>
              </div>
              <p className="text-sm text-white/60 leading-relaxed ml-13">
                Nosso time sênior analisará seus dados com carinho e entrará em contato para agendar uma conversa.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Divider with scroll button */}
      <div className="relative mt-16 lg:mt-24">
        <div className="border-t border-white/10"></div>
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
          <button
            onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
            className="w-14 h-14 bg-white text-brand-title rounded-full flex items-center justify-center hover:bg-gray-100 transition-all duration-300 shadow-xl"
            aria-label="Rolar para baixo"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* FAQ Title */}
          <div className="lg:col-span-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-white/60 uppercase tracking-wider">FAQ</p>
              <h2 className="text-4xl lg:text-5xl font-medium text-white leading-tight">
                Perguntas<br />
                Frequentes
              </h2>
            </div>
          </div>

          {/* FAQ Items */}
          <div className="lg:col-span-8 space-y-4">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className="border border-white/10 rounded-2xl overflow-hidden bg-white/5"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                >
                  <span className="text-base text-white font-normal pr-4">
                    {item.question}
                  </span>
                  <div className="flex-shrink-0 w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <ChevronDown
                      className={`w-4 h-4 text-brand-title transition-transform duration-200 ${openFaq === index ? 'rotate-180' : ''
                        }`}
                    />
                  </div>
                </button>
                <div
                  className={`grid transition-all duration-300 ease-in-out ${openFaq === index ? 'grid-template-rows-[1fr]' : 'grid-template-rows-[0fr]'
                    }`}
                  style={{ gridTemplateRows: openFaq === index ? '1fr' : '0fr' }}
                >
                  <div className="overflow-hidden">
                    <div className="px-6 pt-4 pb-6 text-white/70 text-sm leading-relaxed whitespace-pre-wrap">
                      {item.answer}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
