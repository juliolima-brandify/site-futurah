'use client';

import Link from 'next/link';
import { ArrowUp } from 'lucide-react';
import Container from './Container';

const footerLinks = {
  navegacao: [
    { label: 'Core features', href: '#features' },
    { label: 'Pro experience', href: '#pro' },
    { label: 'Integrations', href: '#integrations' },
  ],
  redesSociais: [
    { label: 'Blog', href: '#blog' },
    { label: 'Case studies', href: '#cases' },
    { label: 'Customer stories', href: '#stories' },
    { label: 'Best practices', href: '#practices' },
  ],
  informacoes: [
    { label: 'Contact', href: '#contato' },
    { label: 'Support', href: '#support' },
    { label: 'Legal', href: '#legal' },
  ],
};

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#F5F5F5] text-brand-title border-t border-gray-200">
      <Container className="py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Left Side - Brand */}
          <div className="lg:col-span-5 space-y-8">
            <h2 className="text-5xl lg:text-6xl font-medium text-brand-title leading-[1.1]">
              Made for<br />
              tech brands.
            </h2>
            <Link href="/">
              <img 
                src="/images/logos/logo-for-white-bg.svg" 
                alt="Futura and Co." 
                className="h-8 w-auto"
              />
            </Link>
          </div>

          {/* Right Side - Links */}
          <div className="lg:col-span-7 grid grid-cols-3 gap-8 lg:gap-12">
            {/* Navegação */}
            <div className="space-y-4">
              <h3 className="text-sm font-normal text-gray-500 mb-6">
                Navegação
              </h3>
              <ul className="space-y-3">
                {footerLinks.navegacao.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-brand-title hover:text-brand-button-hover transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Redes Sociais */}
            <div className="space-y-4">
              <h3 className="text-sm font-normal text-gray-500 mb-6">
                Redes Sociais
              </h3>
              <ul className="space-y-3">
                {footerLinks.redesSociais.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-brand-title hover:text-brand-button-hover transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Informações */}
            <div className="space-y-4">
              <h3 className="text-sm font-normal text-gray-500 mb-6">
                Informações
              </h3>
              <ul className="space-y-3">
                {footerLinks.informacoes.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-brand-title hover:text-brand-button-hover transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-300">
          <div className="flex items-center justify-center">
            <p className="text-sm text-gray-500">
              ©{new Date().getFullYear()} Futurah and Co.
            </p>
          </div>
        </div>
      </Container>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className="absolute bottom-8 right-8 w-14 h-14 bg-brand-title text-white rounded-full flex items-center justify-center hover:bg-brand-button-hover transition-all duration-300 shadow-xl hover:scale-110"
        aria-label="Voltar ao topo"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </footer>
  );
}
