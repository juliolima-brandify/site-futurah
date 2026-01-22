'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronRight, ChevronDown } from 'lucide-react';

const navItems = [
  { label: 'SOBRE', href: '#sobre' },
  { label: 'CONTEÚDOS', href: '#conteudos', hasDropdown: true },
  { label: 'CONTATO', href: '#contato' },
  { label: 'PARA EMPRESAS', href: '#empresas' },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Glassmorphism Background - Atrás de todos os elementos */}
      <div className="fixed top-0 left-0 right-0 z-40 h-24 bg-white/30 backdrop-blur-lg border-b border-white/20" 
           style={{ 
             background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 100%)',
             WebkitBackdropFilter: 'blur(20px)',
             backdropFilter: 'blur(20px)'
           }} 
      />

      {/* Logo Flutuante - Canto Superior Esquerdo */}
      <div className="fixed top-6 left-6 z-[60]">
        <Link href="/" className="flex-shrink-0">
          <img 
            src="/images/logos/logo-for-white-bg.svg" 
            alt="Futura and Co." 
            className="h-10 w-auto drop-shadow-2xl transition-all duration-300 hover:scale-105"
          />
        </Link>
      </div>

      {/* Botões Flutuantes - Canto Superior Direito */}
      <div className="fixed top-6 right-6 z-[60] hidden lg:flex items-center gap-3">
        {/* Ver Cursos Button */}
        <Link
          href="#cursos"
          className="inline-flex items-center gap-2 bg-[#e7f99a] text-[#191919] px-4 py-2.5 rounded-full text-xs font-medium hover:bg-[#e7f99a]/90 transition-all duration-200 shadow-xl"
        >
          Ver Cursos
          <ChevronRight className="w-3.5 h-3.5" strokeWidth={2} />
        </Link>

        {/* Language Selector */}
        <div className="flex items-center gap-2 bg-white rounded-full px-3 py-2 shadow-xl">
          <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
            <img 
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 60'%3E%3Ccircle cx='30' cy='30' r='30' fill='%230066cc'/%3E%3Cpath d='M15 30 L45 30 M30 15 L30 45 M22 22 L38 38 M22 38 L38 22' stroke='white' stroke-width='2' fill='none'/%3E%3C/svg%3E"
              alt="BR"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-xs font-medium text-brand-title">BR</span>
          <ChevronDown className="w-3 h-3 text-brand-body" />
        </div>
      </div>

      <header className="fixed top-6 left-0 right-0 z-50 px-4 sm:px-6">
        <div className="flex items-center justify-center">
          {/* Header Container - Apenas Navegação (Centralizado) */}
          <nav className="bg-[rgba(25,25,25,0.8)] backdrop-blur-md rounded-[100px] shadow-2xl px-6 py-3">
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="relative inline-flex items-center gap-1 px-3 py-2.5 text-[13px] font-light text-white/80 hover:text-white hover:bg-white/5 rounded-full transition-all duration-200 uppercase tracking-wide"
                >
                  {item.label}
                  {item.hasDropdown && (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-white hover:text-brand-highlight transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[55] bg-brand-title/95 backdrop-blur-sm">
          <div className="flex flex-col items-center justify-center h-full gap-8 px-6">
            <nav className="flex flex-col items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-xl font-medium text-white hover:text-brand-highlight transition-colors duration-200"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <Link
              href="#cursos"
              onClick={() => setIsMobileMenuOpen(false)}
              className="inline-flex items-center gap-2 bg-brand-highlight text-brand-title px-8 py-4 rounded-full text-base font-semibold hover:bg-brand-highlight/90 transition-all duration-200"
            >
              Ver Cursos
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
