"use client";

import { useEffect, useState } from "react";

type Props = {
  url: string;
  title: string;
  handle: string;
  tagline: string;
  avatarSrc: string;
};

type Target = {
  key: string;
  label: string;
  href: (u: string, t: string) => string;
  bg: string;
  fg: string;
  icon: React.ReactNode;
};

const targets: Target[] = [
  {
    key: "whatsapp",
    label: "WhatsApp",
    href: (u, t) => `https://wa.me/?text=${encodeURIComponent(`${t} ${u}`)}`,
    bg: "#25D366",
    fg: "#FFFFFF",
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden>
        <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.2s-.8 1-1 1.2c-.2.2-.4.2-.7.1-.3-.1-1.2-.5-2.3-1.4-.9-.7-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.4.5-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.7-1.7-1-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4s-1.1 1.1-1.1 2.6c0 1.6 1.1 3.1 1.3 3.3.2.2 2.2 3.4 5.3 4.7 2.6 1.1 3.2.9 3.7.8.6-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.1-1.3c1.4.8 3 1.3 4.9 1.3 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3 .8.8-2.9-.2-.3C4 14.9 3.5 13.5 3.5 12c0-4.7 3.8-8.5 8.5-8.5s8.5 3.8 8.5 8.5-3.8 8.5-8.5 8.5z" />
      </svg>
    ),
  },
  {
    key: "telegram",
    label: "Telegram",
    href: (u, t) => `https://t.me/share/url?url=${encodeURIComponent(u)}&text=${encodeURIComponent(t)}`,
    bg: "#229ED9",
    fg: "#FFFFFF",
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden>
        <path d="M22 3.4 18.7 20c-.2 1-.8 1.3-1.7.8l-4.6-3.4-2.2 2.1c-.2.2-.4.4-.9.4l.3-4.7 8.5-7.7c.4-.3-.1-.5-.6-.2L7 12.6 2.4 11.2c-1-.3-1-1 .2-1.5L20.7 2c.8-.3 1.5.2 1.3 1.4z" />
      </svg>
    ),
  },
  {
    key: "x",
    label: "X",
    href: (u, t) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(t)}&url=${encodeURIComponent(u)}`,
    bg: "#000000",
    fg: "#FFFFFF",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    key: "facebook",
    label: "Facebook",
    href: (u) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(u)}`,
    bg: "#1877F2",
    fg: "#FFFFFF",
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden>
        <path d="M22 12c0-5.5-4.5-10-10-10S2 6.5 2 12c0 5 3.7 9.1 8.4 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.7-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7C18.3 21.1 22 17 22 12z" />
      </svg>
    ),
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    href: (u) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(u)}`,
    bg: "#0A66C2",
    fg: "#FFFFFF",
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden>
        <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56zM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
      </svg>
    ),
  },
];

export function ShareButton({ url, title, handle, tagline, avatarSrc }: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [resolvedUrl, setResolvedUrl] = useState(url);

  useEffect(() => {
    if (typeof window !== "undefined") setResolvedUrl(window.location.href);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text: title, url: resolvedUrl });
        setOpen(false);
      } catch {
        /* user cancelled */
      }
    } else {
      setOpen(true);
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(resolvedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* noop */
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleNativeShare}
        aria-label="Compartilhar"
        style={{
          position: "absolute",
          top: "var(--fdv-space-3)",
          right: "var(--fdv-space-3)",
          width: 40,
          height: 40,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--fdv-bg)",
          color: "var(--fdv-primary-900)",
          border: "2px solid var(--fdv-primary-900)",
          borderRadius: "var(--fdv-radius-md)",
          boxShadow: "var(--fdv-shadow-sm)",
          cursor: "pointer",
          padding: 0,
          transition: "all 100ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M12 16V4" />
          <path d="M7 9l5-5 5 5" />
          <path d="M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" />
        </svg>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Compartilhar"
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            zIndex: 100,
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
            padding: "var(--fdv-space-4)",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="fdv-card"
            style={{
              width: "100%",
              maxWidth: 440,
              padding: "var(--fdv-space-6)",
              boxShadow: "var(--fdv-shadow-lg)",
              display: "flex",
              flexDirection: "column",
              gap: "var(--fdv-space-5)",
              marginBottom: "var(--fdv-space-8)",
            }}
          >
            {/* HEADER */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div
                style={{
                  fontFamily: "var(--fdv-font-display)",
                  fontSize: "var(--fdv-text-lg)",
                  textTransform: "uppercase",
                  letterSpacing: "-0.02em",
                }}
              >
                Compartilhar
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fechar"
                style={{
                  width: 32,
                  height: 32,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "transparent",
                  color: "var(--fdv-primary-900)",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* PREVIEW */}
            <div
              style={{
                background: "var(--fdv-orange-500)",
                border: "2px solid var(--fdv-primary-900)",
                borderRadius: "var(--fdv-radius-md)",
                padding: "var(--fdv-space-6) var(--fdv-space-4)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "var(--fdv-space-3)",
                boxShadow: "var(--fdv-shadow-sm)",
              }}
            >
              <img
                src={avatarSrc}
                alt=""
                style={{
                  width: 72,
                  height: 72,
                  objectFit: "cover",
                  borderRadius: "var(--fdv-radius-full)",
                  border: "2px solid var(--fdv-primary-900)",
                  display: "block",
                }}
              />
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontFamily: "var(--fdv-font-display)",
                    fontSize: "var(--fdv-text-lg)",
                    textTransform: "uppercase",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.05,
                    color: "var(--fdv-primary-900)",
                  }}
                >
                  {tagline}
                </div>
                <div
                  style={{
                    fontFamily: "var(--fdv-font-mono)",
                    fontSize: "var(--fdv-text-xs)",
                    textTransform: "uppercase",
                    letterSpacing: "0.14em",
                    color: "var(--fdv-primary-900)",
                    opacity: 0.75,
                    marginTop: "var(--fdv-space-1)",
                  }}
                >
                  {handle}
                </div>
              </div>
            </div>

            {/* TARGETS */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(64px, 1fr))",
                gap: "var(--fdv-space-3)",
              }}
            >
              <ShareTarget
                label={copied ? "Copiado!" : "Copiar"}
                onClick={copy}
                bg="var(--fdv-bg)"
                fg="var(--fdv-primary-900)"
                bordered
                icon={
                  copied ? (
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <rect x="9" y="9" width="11" height="11" rx="1" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  )
                }
              />

              {targets.map((t) => (
                <ShareTarget
                  key={t.key}
                  label={t.label}
                  href={t.href(resolvedUrl, title)}
                  bg={t.bg}
                  fg={t.fg}
                  icon={t.icon}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ShareTarget({
  label,
  icon,
  href,
  onClick,
  bg,
  fg,
  bordered,
}: {
  label: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
  bg: string;
  fg: string;
  bordered?: boolean;
}) {
  const Tag = href ? "a" : "button";
  return (
    <Tag
      {...(href ? { href, target: "_blank", rel: "noopener noreferrer" } : { type: "button" as const, onClick })}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "var(--fdv-space-2)",
        textDecoration: "none",
        color: "var(--fdv-primary-900)",
        background: "transparent",
        border: "none",
        cursor: "pointer",
        padding: 0,
        fontFamily: "var(--fdv-font-sans)",
      }}
    >
      <span
        style={{
          width: 56,
          height: 56,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          background: bg,
          color: fg,
          borderRadius: "var(--fdv-radius-full)",
          border: bordered ? "2px solid var(--fdv-primary-900)" : "none",
        }}
      >
        {icon}
      </span>
      <span
        style={{
          fontSize: "var(--fdv-text-xs)",
          fontWeight: 500,
          textAlign: "center",
        }}
      >
        {label}
      </span>
    </Tag>
  );
}
