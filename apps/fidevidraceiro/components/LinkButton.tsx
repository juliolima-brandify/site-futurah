"use client";

import { useCallback } from "react";

// Botão de link instrumentado com tracker.
// Dispara `link_click` via @futurah/tracker-sdk no pointerdown/auxclick
// (cobre clique normal + clique-do-meio + long-press), o que captura
// usuários que abrem em nova aba antes da navegação descartar a janela.
// Visual fica 100% do <a>: classes/style são passados direto.

type Props = {
  url: string;
  label: string;
  position: number;
  /** Slug interno opcional pra distinguir múltiplos botões pra mesma url. */
  target?: string;
  external?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
};

export function LinkButton({
  url,
  label,
  position,
  target,
  external,
  className,
  style,
  children,
}: Props) {
  const handleActivate = useCallback(() => {
    // Lazy import: o SDK só sai do bundle do server-rendered HTML quando o
    // usuário interage. Evita custo de hidratação extra no first paint da bio.
    import("@futurah/tracker-sdk")
      .then((m) => {
        m.trackClick({ url, label, position, target });
      })
      .catch(() => {
        // Silencioso: se o SDK quebra, o link continua funcionando.
      });
  }, [url, label, position, target]);

  return (
    <a
      href={url}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={className}
      style={style}
      onPointerDown={handleActivate}
      onAuxClick={handleActivate}
    >
      {children}
    </a>
  );
}
