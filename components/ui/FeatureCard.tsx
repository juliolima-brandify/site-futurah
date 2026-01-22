import React from 'react';
import { PointerIcon } from './Icons';

interface FeatureCardProps {
  label: string;
  className?: string;
  iconPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  drift?: { x: number; y: number };
  arrowRotation?: number;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ 
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
      style={{
        transform: `translate(${drift.x}px, ${drift.y}px)`,
      }}
    >
      <div className="relative transform transition-transform duration-500 hover:scale-105 active:scale-95">
        <div className="bg-white/90 backdrop-blur-sm border border-gray-200 px-5 py-2.5 rounded-full whitespace-nowrap shadow-[0_10px_30px_-10px_rgba(0,0,0,0.15)]">
          <span className="text-brand-title font-light text-sm md:text-base select-none">
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
