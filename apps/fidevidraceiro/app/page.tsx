import { Space_Grotesk, Archivo_Black } from "next/font/google";
import "./styles.css";
import { ShareButton } from "./ShareButton";

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "700"],
  variable: "--fdv-grotesk",
});
const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
  variable: "--fdv-archivo",
});

export const metadata = {
  title: "Augusto Felipe — @fidevidraceiro",
  description: "Vidro vira arte. Construção vira conteúdo. Bastidor vira show.",
};

type Variant = "primary" | "vibrant" | "acid" | "secondary";
type IconKey = "youtube" | "email";

type LinkItem = {
  label: string;
  hint?: string;
  url: string;
  variant: Variant;
  external?: boolean;
  image?: string;
  icon?: IconKey;
};

const links: LinkItem[] = [
  { label: "YouTube", icon: "youtube", url: "https://youtube.com/@fidevidraceiro", variant: "primary", external: true, image: "/links/youtube-thumb.webp" },
  { label: "Parcerias", icon: "email", hint: "fidevidraceiro@futurah.co", url: "mailto:fidevidraceiro@futurah.co", variant: "secondary" },
];

function Icon({ name }: { name: IconKey }) {
  const common = { width: 22, height: 22, "aria-hidden": true as const, style: { flexShrink: 0 } };
  if (name === "youtube") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" {...common}>
        <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...common}>
      <rect x="3" y="5" width="18" height="14" rx="1" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}

export default function LinksPage() {
  return (
    <div
      className={`fdv-root ${grotesk.variable} ${archivoBlack.variable}`}
      style={{
        minHeight: "100dvh",
        background: "var(--fdv-primary-900)",
        padding: "var(--fdv-space-8) var(--fdv-space-4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: "url('/links/augusto-hero.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: "grayscale(100%) contrast(1.05) brightness(0.55)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      <main
        className="fdv-card"
        style={{
          width: "100%",
          maxWidth: 480,
          padding: "var(--fdv-space-12) var(--fdv-space-6) var(--fdv-space-8)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "var(--fdv-space-6)",
          boxShadow: "var(--fdv-shadow-lg)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <ShareButton
          url="https://fidevidraceiro.augustofelipe.com"
          title="Augusto Felipe — @fidevidraceiro"
          handle="@fidevidraceiro"
          tagline="Augusto Felipe"
          avatarSrc="/links/augusto-hero.webp"
        />

        {/* HERO */}
        <div
          style={{
            width: 160,
            height: 160,
            borderRadius: "var(--fdv-radius-full)",
            border: "2px solid var(--fdv-primary-900)",
            boxShadow: "var(--fdv-shadow-md)",
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          <img
            src="/links/augusto-hero.webp"
            alt="Augusto Felipe gravando na vidraçaria"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "30% 35%",
              transform: "scale(1.5)",
              transformOrigin: "30% 35%",
              display: "block",
            }}
          />
        </div>

        {/* HANDLE + NOME */}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontFamily: "var(--fdv-font-mono)",
              fontSize: "var(--fdv-text-sm)",
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              color: "var(--fdv-primary-500)",
              marginBottom: "var(--fdv-space-2)",
            }}
          >
            @fidevidraceiro
          </div>
          <h1
            style={{
              fontSize: "clamp(1.5rem, 6vw, 2.25rem)",
              lineHeight: 1.05,
            }}
          >
            AUGUSTO FELIPE
          </h1>
        </div>

        {/* LINKS */}
        <nav
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "var(--fdv-space-3)",
            marginTop: "var(--fdv-space-4)",
          }}
        >
          {links.map((l) => (
            <a
              key={l.url}
              href={l.url}
              target={l.external ? "_blank" : undefined}
              rel={l.external ? "noopener noreferrer" : undefined}
              className={`fdv-btn fdv-btn-${l.variant}`}
              style={{
                width: "100%",
                flexDirection: l.image ? "column" : "row",
                justifyContent: "space-between",
                alignItems: l.image ? "stretch" : "center",
                gap: l.image ? "var(--fdv-space-3)" : "var(--fdv-space-2)",
                padding: l.image
                  ? "var(--fdv-space-3) var(--fdv-space-3) var(--fdv-space-4)"
                  : "var(--fdv-space-4) var(--fdv-space-6)",
                textTransform: "none",
                textDecoration: "none",
                letterSpacing: "-0.01em",
              }}
            >
              {l.image && (
                <img
                  src={l.image}
                  alt=""
                  style={{
                    width: "100%",
                    aspectRatio: "16 / 9",
                    objectFit: "cover",
                    border: "2px solid var(--fdv-primary-900)",
                    borderRadius: "var(--fdv-radius-md)",
                    display: "block",
                  }}
                />
              )}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  alignItems: "center",
                  gap: "var(--fdv-space-1)",
                  padding: l.image ? "0 var(--fdv-space-3)" : 0,
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "var(--fdv-space-2)",
                    fontFamily: "var(--fdv-font-display)",
                    fontSize: "var(--fdv-text-lg)",
                    letterSpacing: "-0.02em",
                    textTransform: "uppercase",
                  }}
                >
                  {l.icon && <Icon name={l.icon} />}
                  {l.label}
                </span>
                {l.hint && (
                  <span
                    style={{
                      fontFamily: "var(--fdv-font-mono)",
                      fontSize: "var(--fdv-text-xs)",
                      opacity: 0.75,
                      textTransform: "none",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {l.hint}
                  </span>
                )}
              </div>
            </a>
          ))}
        </nav>

        {/* FOOTER */}
        <div
          style={{
            marginTop: "var(--fdv-space-12)",
            paddingTop: "var(--fdv-space-6)",
            borderTop: "2px solid var(--fdv-primary-900)",
            width: "100%",
            textAlign: "center",
            fontFamily: "var(--fdv-font-sans)",
            fontSize: "var(--fdv-text-xs)",
            color: "var(--fdv-primary-500)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--fdv-space-2)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "var(--fdv-space-3)",
              flexWrap: "wrap",
            }}
          >
            <a href="/politica-de-privacidade" style={{ color: "inherit", textDecoration: "underline" }}>
              Política de privacidade
            </a>
            <span aria-hidden>·</span>
            <a href="/termos-de-uso" style={{ color: "inherit", textDecoration: "underline" }}>
              Termos de uso
            </a>
          </div>
          <div
            style={{
              color: "var(--fdv-primary-200)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.35em",
            }}
          >
            <span>Feito com amor</span>
            <svg
              viewBox="0 0 24 24"
              width="12"
              height="12"
              fill="currentColor"
              aria-hidden
              style={{ flexShrink: 0 }}
            >
              <path d="M12 21s-7.5-4.6-9.6-9.3C.7 7.9 3.2 4 6.8 4c2 0 3.6 1 5.2 3 1.6-2 3.2-3 5.2-3 3.6 0 6.1 3.9 4.4 7.7C19.5 16.4 12 21 12 21z" />
            </svg>
            <span>por Futurah & Co.</span>
          </div>
        </div>
      </main>
    </div>
  );
}
