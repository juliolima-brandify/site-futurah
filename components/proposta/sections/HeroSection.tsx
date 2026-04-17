import type { HeroData } from "../types";

interface Props {
  data: HeroData;
}

export function HeroSection({ data }: Props) {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center bg-white overflow-hidden pt-28 pb-20 lg:pt-36 lg:pb-28">
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center space-y-6 lg:space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-title/10 bg-brand-background">
            <span className="w-2 h-2 rounded-full bg-brand-button-hover animate-pulse" />
            <span className="text-xs font-medium uppercase tracking-wider text-brand-title">
              {data.badge}
            </span>
          </div>

          <h1
            className="text-4xl md:text-6xl lg:text-[72px] font-normal uppercase text-brand-title leading-[1.05]"
            dangerouslySetInnerHTML={{ __html: data.titulo }}
          />

          <p className="text-base md:text-lg text-brand-body leading-relaxed max-w-2xl font-light">
            {data.subtitulo}
          </p>

          <div className="flex flex-col items-center gap-3 pt-2">
            {data.ctaAncora && (
              <a
                href="#leitura"
                className="inline-flex items-center gap-2 text-sm font-medium text-brand-title underline underline-offset-4 hover:text-brand-button-hover transition-colors"
              >
                {data.ctaAncora}
              </a>
            )}
            {data.rodape && (
              <span className="text-xs text-brand-body/60">{data.rodape}</span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
