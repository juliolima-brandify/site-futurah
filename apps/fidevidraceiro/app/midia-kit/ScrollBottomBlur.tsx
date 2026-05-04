'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Blur progressivo no rodapé que aparece conforme o scroll.
 * Adaptado de site-brandify para escutar o scroll do container
 * .fdv-snap-container (a página tem snap-scroll interno, não usa
 * window.scrollY).
 */
export default function ScrollBottomBlur() {
  const [opacity, setOpacity] = useState(0);
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    containerRef.current = document.querySelector('.fdv-snap-container');
    const target: HTMLElement | Window = containerRef.current ?? window;

    const handleScroll = () => {
      const el = containerRef.current;
      const scrollPosition = el ? el.scrollTop : window.scrollY;
      const viewportHeight = el ? el.clientHeight : window.innerHeight;
      setOpacity(Math.min(scrollPosition / (viewportHeight * 0.3), 1));
    };

    target.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => target.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      aria-hidden
      className="fixed bottom-0 left-0 right-0 pointer-events-none transition-opacity duration-300 ease-out"
      style={{
        height: 240,
        zIndex: 100,
        opacity,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        maskImage: 'linear-gradient(to bottom, transparent 0%, black 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 100%)',
      }}
    />
  );
}
