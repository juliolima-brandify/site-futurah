"use client";

import { useEffect, useState } from "react";

export function SectionCounter() {
  const [active, setActive] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const container = document.querySelector(".fdv-snap-container") as HTMLElement | null;
    const sections = Array.from(document.querySelectorAll(".fdv-section")) as HTMLElement[];
    if (!container || sections.length === 0) return;

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

  if (total === 0) return null;

  return (
    <div className="fdv-counter">
      {String(active + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
    </div>
  );
}
