import { ButtonHTMLAttributes, ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  showIcon?: boolean;
  className?: string;
}

export default function Button({ 
  children, 
  variant = 'primary', 
  showIcon = false,
  className = '',
  ...props 
}: ButtonProps) {
  return (
    <button 
      className={`
        group relative inline-flex items-center justify-center gap-3 px-8 py-4 
        rounded-full font-medium overflow-hidden
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-button-hover
        transition-all duration-300 ease-out
        ${variant === 'primary' ? 'bg-brand-button text-white' : ''}
        ${variant === 'secondary' ? 'bg-brand-highlight text-brand-title' : ''}
        ${variant === 'outline' ? 'border-2 border-brand-button text-brand-button' : ''}
        ${className}
      `}
      {...props}
    >
      {/* Efeito de preenchimento azul da esquerda para direita */}
      <span 
        className="absolute inset-0 bg-brand-button-hover transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"
        aria-hidden="true"
      />
      
      {/* Conteúdo do botão */}
      <span className="relative z-10 group-hover:text-white transition-colors duration-300">
        {children}
      </span>
      
      {/* Ícone de seta com rotação para diagonal */}
      {showIcon && (
        <span className="relative z-10 inline-flex items-center justify-center w-8 h-8 bg-white rounded-full transition-all duration-300 group-hover:bg-white">
          <ArrowRight 
            className="w-4 h-4 text-brand-button transition-transform duration-300 group-hover:rotate-[-45deg] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" 
          />
        </span>
      )}
    </button>
  );
}
