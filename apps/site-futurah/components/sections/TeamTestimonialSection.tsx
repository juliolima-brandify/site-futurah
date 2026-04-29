'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import OrbitIcon from '../ui/OrbitIcon';

const TEAM_MEMBERS = [
  {
    name: "Julio Lima",
    role: "CEO e Fundador",
    headline: "Estrategista Criativo com 10 anos de experiência em Design de Produtos Digital, Branding, UX/UI e IA.",
    image: "/images/team/julio.webp",
    bio: "Atualmente, está a frente da equipe de criação e inovação da Futurah."
  },
  {
    name: "Vinicius Costa",
    role: "CEO e Fundador",
    headline: "Especialista em Marketing e Vendas, focado em gestão de Pessoas, Vendas e LTV.",
    image: "/images/team/vinicius.webp",
    bio: "Lidera as estratégias de crescimento, vendas e gestão de pessoas da Futurah."
  }
];

export const TeamTestimonialSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');

  // Animation duration matches CSS transition
  const TRANSITION_DURATION = 500;

  const handleNext = useCallback(() => {
    if (isAnimating) return;
    setDirection('next');
    setIsAnimating(true);

    setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % TEAM_MEMBERS.length);
      // We keep isAnimating true for a brief moment to allow the new content to start in 'enter' state
      // But efficiently, we just need to wait for the exit to finish.
      // To achieve "slide in from right", we need to reset the state.

      // Let's use a small timeout to reset animating state to allow the CSS to switch from "offset" to "zero"
      setTimeout(() => {
        setIsAnimating(false);
      }, 50);
    }, TRANSITION_DURATION);
  }, [isAnimating]);

  const handlePrev = useCallback(() => {
    if (isAnimating) return;
    setDirection('prev');
    setIsAnimating(true);
    setTimeout(() => {
      setActiveIndex((prev) => (prev - 1 + TEAM_MEMBERS.length) % TEAM_MEMBERS.length);
      setTimeout(() => {
        setIsAnimating(false);
      }, 50);
    }, TRANSITION_DURATION);
  }, [isAnimating]);

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [handleNext]);

  const activeMember = TEAM_MEMBERS[activeIndex];

  // Animation Styles
  // When isAnimating is true (Exiting):
  //   Next -> Slide OUT to Left (-x)
  //   Prev -> Slide OUT to Right (+x)
  // When isAnimating is false (Entering/Idle):
  //   It normally sits at 0.
  //   BUT we need it to start from the opposite side.
  //   This "Exit -> Enter" flow requires a "mounting" phase style.
  //   Tailwind doesn't give us "mounting" phase easily without a library.

  // Alternative: Dynamic Classes based on state
  const getContentClasses = (baseClasses: string) => {
    if (isAnimating) {
      // EXITING
      return `${baseClasses} opacity-0 transition-all duration-500 ease-in-out ${direction === 'next' ? '-translate-x-8' : 'translate-x-8'}`;
    }
    // ENTERING / IDLE
    // Note: The simple boolean isn't enough to distinguish "Idle" from "Just Mounted".
    // However, the transition will happen nicely if we assume the component re-renders with the new index 
    // and the "isAnimating=false" triggers the return to 0.
    // Wait, if isAnimating is false, it goes to translate-x-0. 
    // But we need it to INSTANTLY jump to translate-x-8 (start position) BEFORE transition to 0.

    // Simplification: Just use simple fade-slide for now. 
    // To do "Slide In from Right", the distinct "Exit" phase is key.
    return `${baseClasses} opacity-100 translate-x-0 transition-all duration-500 ease-out`;
  };

  // For the Image:
  // Parallax feel: slightly different translation distance.
  const getImageClasses = (baseClasses: string) => {
    if (isAnimating) {
      // Slide image
      return `${baseClasses} opacity-0 transition-all duration-500 ease-in-out ${direction === 'next' ? '-translate-x-12' : 'translate-x-12'}`;
    }
    return `${baseClasses} opacity-100 translate-x-0 transition-all duration-500 ease-out`;
  };

  return (
    <section className="w-full px-4 md:px-8 lg:px-12 py-14 lg:py-20">
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 bg-[#0D0D0D] overflow-hidden rounded-[32px] min-h-[700px] lg:h-[800px]">
        {/* Left Column - Content */}
        <div className="p-10 md:p-16 lg:p-24 flex flex-col justify-between h-full">
          <div>
            <div className="mb-12">
              <OrbitIcon />
            </div>

            <div className="overflow-hidden min-h-[240px]">
              <h2 className={getContentClasses("text-white text-2xl md:text-[32px] lg:text-[40px] font-medium leading-[1.3] tracking-[-0.02em] max-w-[550px]")}>
                {activeMember.headline}
              </h2>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mt-12">
            <div className={`flex flex-col gap-1 overflow-hidden ${getContentClasses("")}`}>
              <span className="text-white text-lg font-medium">{activeMember.name}</span>
              <span className="text-white/60 text-sm">{activeMember.role}</span>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handlePrev}
                className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center transition-all hover:bg-white/10 group active:scale-95 z-20"
                aria-label="Previous member"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={handleNext}
                className="w-12 h-12 rounded-full bg-[#E7F99A] flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-20"
                aria-label="Next member"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Image */}
        <div className="relative h-[600px] lg:h-full overflow-hidden bg-zinc-900 group">
          {activeMember.image ? (
            <Image
              src={activeMember.image}
              alt={activeMember.name}
              fill
              // Added parallax-like transitions
              className={getImageClasses("absolute inset-0 w-full h-full object-cover filter grayscale scale-100 group-hover:scale-105 transition-transform duration-700")}
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-zinc-800 text-white/20">
              <span className="text-lg font-medium">Foto em breve</span>
            </div>
          )}

          <div className="absolute bottom-8 left-8 right-8 overflow-hidden">
            <div className={getContentClasses("backdrop-blur-md bg-black/50 border border-white/10 p-8 rounded-[24px] max-w-[480px]")}>
              <h4 className="text-white text-[32px] font-bold leading-none mb-4">
                {activeMember.name}
              </h4>
              <p className="text-white/80 text-[15px] leading-relaxed">
                {activeMember.bio}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
