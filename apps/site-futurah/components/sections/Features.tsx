'use client';

import React, { useState, useEffect } from 'react';

// --- ÍCONE DA SETINHA (PointerIcon) ---
const PointerIcon: React.FC<{ className?: string; rotation?: number }> = ({ className = "", rotation = 0 }) => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ 
      filter: 'drop-shadow(0px 3px 6px rgba(0,0,0,0.12))',
      transform: `rotate(${rotation}deg)`
    }}
  >
    <path 
      d="M12 4.2C12.5 4.2 12.8 4.4 13.1 5.1L19.8 19.2C20.2 20.1 19.7 20.8 18.8 20.4L12 17.5L5.2 20.4C4.3 20.8 3.8 20.1 4.2 19.2L10.9 5.1C11.2 4.4 11.5 4.2 12 4.2Z" 
      fill="#DFFF01" 
      stroke="#889C00" 
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// --- BALÃOZINHO DE RECURSO (FeatureCard) ---
interface FeatureCardProps {
  label: string;
  className?: string;
  iconPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  drift?: { x: number; y: number };
  arrowRotation?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  label, 
  className = "", 
  iconPosition = 'bottom-right', 
  drift = { x: 0, y: 0 },
  arrowRotation = 0
}) => {
  const getIconPositionClass = () => {
    switch(iconPosition) {
      case 'top-left': return 'top-[-12px] left-[-12px]';
      case 'top-right': return 'top-[-12px] right-[-12px]';
      case 'bottom-left': return 'bottom-[-12px] left-[-12px]';
      default: return 'bottom-[-12px] right-[-12px]';
    }
  };

  return (
    <div 
      className={`absolute group z-20 transition-all duration-[2000ms] ease-in-out ${className}`}
      style={{ transform: `translate(${drift.x}px, ${drift.y}px)` }}
    >
      <div className="relative transform transition-transform duration-500 hover:scale-105 active:scale-95">
        <div className="bg-white/60 backdrop-blur-md border border-white/50 px-5 py-2.5 rounded-full whitespace-nowrap shadow-[0_10px_30px_-10px_rgba(0,0,0,0.15)]">
          <span className="text-slate-700 font-light text-sm md:text-base select-none">
            {label}
          </span>
        </div>
        <div className={`absolute ${getIconPositionClass()} transition-transform duration-300 group-hover:scale-125 pointer-events-none`}>
          <PointerIcon rotation={arrowRotation} />
        </div>
      </div>
    </div>
  );
};

// --- SEÇÃO PRINCIPAL (EcossistemaSection) ---
export default function Features() {
  const [drift, setDrift] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const moveInterval = setInterval(() => {
      setDrift({
        x: (Math.random() - 0.5) * 40,
        y: (Math.random() - 0.5) * 40,
      });
    }, 2000);
    return () => clearInterval(moveInterval);
  }, []);

  const getCardDrift = (mx: number, my: number) => ({ x: drift.x * mx, y: drift.y * my });

  return (
    <section className="relative w-full h-screen overflow-hidden flex items-center justify-center bg-[#e5e9f0]">
      {/* Texto de Fundo */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none px-4 text-center z-10">
        <h2 className="text-6xl md:text-[7rem] lg:text-[9rem] font-normal text-slate-400/40 leading-[0.85]">
          O Ecossistema<br />Futurah.
        </h2>
      </div>

      {/* Cards Flutuantes */}
      <div className="absolute inset-0 w-full h-full max-w-7xl mx-auto">
        <FeatureCard label="Lucro Previsível" className="top-[18%] left-[12%]" iconPosition="bottom-right" arrowRotation={135} drift={getCardDrift(0.8, 1.2)} />
        <FeatureCard label="Agentes de Venda 24h" className="top-[22%] right-[10%]" iconPosition="bottom-left" arrowRotation={225} drift={getCardDrift(-1.1, 0.9)} />
        <FeatureCard label="Liberdade Operacional" className="top-[45%] left-[5%]" iconPosition="bottom-right" arrowRotation={90} drift={getCardDrift(1.3, -0.7)} />
        <FeatureCard label="Captação Qualificada" className="top-[48%] right-[5%]" iconPosition="top-left" arrowRotation={270} drift={getCardDrift(-0.9, 1.1)} />
        <FeatureCard label="Autoridade Digital" className="bottom-[22%] left-[15%]" iconPosition="top-right" arrowRotation={45} drift={getCardDrift(-1.2, -1.0)} />
        <FeatureCard label="Reativação Automática" className="bottom-[20%] right-[12%]" iconPosition="top-left" arrowRotation={315} drift={getCardDrift(-1.4, 0.6)} />
      </div>

      {/* Overlay de Gradiente */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(229,233,240,0.5)_100%)] z-15" />
    </section>
  );
}
