import type { TeseData } from "../types";

interface Props {
  data: TeseData;
}

/**
 * Converte marcação {{highlight}}...{{/highlight}} em <span class="text-brand-highlight">
 */
function renderTitulo(titulo: string) {
  const html = titulo.replace(
    /\{\{highlight\}\}(.*?)\{\{\/highlight\}\}/g,
    '<span class="text-brand-highlight">$1</span>'
  );
  return { __html: html };
}

export function TeseSection({ data }: Props) {
  return (
    <section className="w-full bg-brand-title text-white px-4 md:px-8 lg:px-12 py-16 lg:py-24">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">
        <span className="text-sm font-medium uppercase tracking-wider text-brand-highlight">
          {data.eyebrow}
        </span>
        <h2
          className="text-3xl md:text-5xl lg:text-[56px] font-medium leading-[1.1] text-white"
          dangerouslySetInnerHTML={renderTitulo(data.titulo)}
        />
        <p className="text-base md:text-lg text-white/70 font-light leading-relaxed max-w-3xl">
          {data.body}
        </p>
      </div>
    </section>
  );
}
