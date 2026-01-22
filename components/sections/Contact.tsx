'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Zap, ChevronDown } from 'lucide-react';
import Container from '../layout/Container';

const faqItems = [
  {
    question: "What is your favorite template from BRIX Templates?",
    answer: "Placeholder answer text goes here."
  },
  {
    question: "Do you prefer using dark or light themes for your designs?",
    answer: "Placeholder answer text goes here."
  },
  {
    question: "Which design tool do you find most effective for collaboration?",
    answer: "Placeholder answer text goes here."
  },
  {
    question: "What is the most challenging aspect of your design process?",
    answer: "Placeholder answer text goes here."
  },
];

export default function Contact() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <section className="bg-brand-title text-white px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
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
                  Tem um projeto em mente?
                </h2>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    type="text"
                    placeholder="Seu nome"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/40 focus:outline-none focus:border-white/30 transition-colors text-sm"
                  />
                  <input
                    type="email"
                    placeholder="Seu e-mail"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/40 focus:outline-none focus:border-white/30 transition-colors text-sm"
                  />
                  <input
                    type="tel"
                    placeholder="DDD + Telefone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/40 focus:outline-none focus:border-white/30 transition-colors text-sm"
                  />
                  <textarea
                    placeholder="Fale sobre seu projeto"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={3}
                    className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/40 focus:outline-none focus:border-white/30 transition-colors resize-none text-sm"
                  />
                  
                  <button
                    type="submit"
                    className="w-full bg-white text-brand-title px-6 py-3 rounded-2xl font-medium hover:bg-gray-100 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    Enviar
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                {/* Terms */}
                <p className="text-xs text-white/40 leading-relaxed">
                  Ao enviar, você concorda com nossos{' '}
                  <Link href="#termos" className="underline hover:text-white/60">
                    Termos
                  </Link>{' '}
                  e{' '}
                  <Link href="#privacidade" className="underline hover:text-white/60">
                    Política de Privacidade
                  </Link>
                  .
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
                CONTATE-NOS
              </div>

              {/* Heading */}
              <h2 className="text-4xl lg:text-5xl font-medium text-white leading-[1.1]">
                Fale<br />
                Conosco
              </h2>

              {/* Description */}
              <p className="text-sm text-white/70 leading-relaxed">
                Conte-nos sobre seu projeto e vamos construir algo único para a sua marca
              </p>
            </div>

            {/* Bottom Content */}
            <div className="space-y-2 mt-6 lg:mt-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-highlight rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-brand-title" />
                </div>
                <span className="text-lg font-medium text-white">Resposta rápida</span>
              </div>
              <p className="text-sm text-white/60 leading-relaxed ml-13">
                Responderemos seu e-mail em até 24h e conversaremos melhor sobre o projeto
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
                      className={`w-4 h-4 text-brand-title transition-transform duration-200 ${
                        openFaq === index ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-5 text-white/70 text-sm leading-relaxed">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
