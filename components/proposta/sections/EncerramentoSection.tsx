import type { EncerramentoData } from "../types";

interface Props {
  data: EncerramentoData;
}

function renderTitulo(titulo: string) {
  const html = titulo.replace(
    /\{\{italic\}\}(.*?)\{\{\/italic\}\}/g,
    '<span class="italic">$1</span>'
  );
  return { __html: html };
}

export function EncerramentoSection({ data }: Props) {
  return (
    <section
      id="contato"
      className="w-full bg-brand-background px-4 md:px-8 lg:px-12 py-20 lg:py-28"
    >
      <div className="max-w-3xl mx-auto flex flex-col items-center text-center gap-8">
        <span className="text-sm font-medium uppercase tracking-wider text-brand-button-hover">
          {data.eyebrow}
        </span>
        <h2
          className="text-3xl md:text-5xl lg:text-[56px] font-medium text-brand-title leading-[1.1]"
          dangerouslySetInnerHTML={renderTitulo(data.titulo)}
        />
        <p className="text-base md:text-lg text-brand-body font-light leading-relaxed">
          {data.body}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <a
            href={`mailto:${data.emailContato}`}
            className="text-sm font-medium text-brand-title underline underline-offset-4 hover:text-brand-button-hover transition-colors"
          >
            {data.emailContato}
          </a>
        </div>
        {data.disclaimer && (
          <p className="text-xs text-brand-body/60 pt-10 border-t border-brand-title/10 w-full max-w-2xl">
            {data.disclaimer}
          </p>
        )}
      </div>
    </section>
  );
}
