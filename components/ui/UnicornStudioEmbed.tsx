'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';

function initUnicornStudio() {
  if (typeof window === 'undefined') return;
  const u = (window as unknown as { UnicornStudio?: { init: () => void } }).UnicornStudio;
  if (u?.init) u.init();
}

export default function UnicornStudioEmbed() {
  const initCalled = useRef(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initCalled.current) return;
    const timer = setTimeout(() => {
      initUnicornStudio();
      initCalled.current = true;
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  // Esconde a marca d'água "Made with unicorn.studio" após o embed renderizar
  useEffect(() => {
    if (!wrapperRef.current) return;
    const hideWatermark = () => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;
      wrapper.querySelectorAll('a[href*="unicorn"]').forEach((el) => {
        (el as HTMLElement).style.setProperty('display', 'none', 'important');
        // Esconde só o container da marca d'água (não o que tem canvas)
        const parent = el.parentElement;
        if (parent && !parent.querySelector('canvas') && (parent.tagName === 'DIV' || parent.tagName === 'SPAN')) {
          (parent as HTMLElement).style.setProperty('display', 'none', 'important');
        }
      });
    };
    hideWatermark();
    const obs = new MutationObserver(hideWatermark);
    obs.observe(wrapperRef.current, { childList: true, subtree: true });
    const t = setTimeout(hideWatermark, 1000);
    return () => {
      obs.disconnect();
      clearTimeout(t);
    };
  }, []);

  return (
    <>
      <div
        ref={wrapperRef}
        className="unicorn-embed-wrapper relative w-[576px] h-[360px] overflow-hidden rounded-2xl [&_canvas]:!w-full [&_canvas]:!h-full [&_canvas]:!object-cover [&_a[href*='unicorn']]:!hidden"
      >
        {/* Camada do canvas (atrás) */}
        <div className="absolute inset-0 z-0">
          <div
            data-us-project="EMoQhA8wQnNXv3rSqfJh"
            className="unicorn-embed-root size-full min-w-0 min-h-0"
            style={{
              width: '100%',
              height: '100%',
            }}
          />
        </div>
        {/* Borda interna inferior – por cima do canvas */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[72px] bg-white rounded-b-2xl pointer-events-none z-10"
          aria-hidden
        />
      </div>
      <Script
        src="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.0.4/dist/unicornStudio.umd.js"
        strategy="afterInteractive"
        onLoad={initUnicornStudio}
      />
    </>
  );
}
