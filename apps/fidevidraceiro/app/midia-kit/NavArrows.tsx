"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export default function NavArrows() {
  const [active, setActive] = useState(0);
  const [total, setTotal] = useState(0);
  const [mounted, setMounted] = useState(false);
  const sectionsRef = useRef<HTMLElement[]>([]);
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setMounted(true);

    const container = document.querySelector(".fdv-snap-container") as HTMLElement | null;
    const sections = Array.from(document.querySelectorAll(".fdv-section")) as HTMLElement[];
    if (!container || sections.length === 0) return;

    containerRef.current = container;
    sectionsRef.current = sections;
    setTotal(sections.length);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            const idx = sections.indexOf(entry.target as HTMLElement);
            if (idx >= 0) setActive(idx);
          }
        });
      },
      { root: container, threshold: [0.3, 0.5, 0.7] }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const scrollToIndex = (idx: number) => {
    const container = containerRef.current;
    const target = sectionsRef.current[idx];
    if (!container || !target) return;
    container.scrollTo({ top: target.offsetTop, behavior: "smooth" });
  };

  if (!mounted || total === 0) return null;

  const goUp = () => scrollToIndex(Math.max(0, active - 1));
  const goDown = () => scrollToIndex(Math.min(total - 1, active + 1));

  return createPortal(
    <div className="fdv-nav-arrows" aria-label="Navegação entre seções">
      <button
        type="button"
        onClick={goUp}
        disabled={active === 0}
        aria-label="Seção anterior"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter" aria-hidden>
          <polyline points="6 15 12 9 18 15" />
        </svg>
      </button>
      <button
        type="button"
        onClick={goDown}
        disabled={active === total - 1}
        aria-label="Próxima seção"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter" aria-hidden>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
    </div>,
    document.body
  );
}
