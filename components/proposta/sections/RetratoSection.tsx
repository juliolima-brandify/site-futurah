import Image from "next/image";
import type { RetratoData } from "../types";

interface Props {
  data: RetratoData;
}

export function RetratoSection({ data }: Props) {
  return (
    <section
      id="leitura"
      className="w-full bg-white px-4 md:px-8 lg:px-12 pb-16 lg:pb-24 border-t border-brand-title/5"
    >
      <div className="max-w-6xl mx-auto pt-16 lg:pt-24 flex flex-col gap-10">
        <div className="flex flex-col gap-4 max-w-3xl">
          <span className="text-sm font-medium uppercase tracking-wider text-brand-button-hover">
            {data.eyebrow}
          </span>
          <h2 className="text-4xl lg:text-[56px] font-medium text-brand-title leading-[1.05]">
            {data.titulo}
          </h2>
          <p className="text-base md:text-lg text-brand-body font-light leading-relaxed">
            {data.subtitulo}
          </p>
        </div>

        {data.instagramMock && (
          <div className="bg-black rounded-[24px] p-6 md:p-10 lg:p-12 text-white border border-white/10 shadow-2xl">
            <div className="flex flex-col sm:flex-row items-start gap-6 md:gap-10 lg:gap-14">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 md:w-36 md:h-36 lg:w-44 lg:h-44 rounded-full overflow-hidden ring-1 ring-white/10 shadow-xl">
                  <Image
                    src={data.instagramMock.avatarUrl}
                    alt={data.instagramMock.displayName}
                    width={176}
                    height={176}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
              </div>

              <div className="flex-1 w-full min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <h3 className="text-xl md:text-2xl lg:text-[28px] font-normal text-white">
                    {data.instagramMock.handle}
                  </h3>
                  {data.instagramMock.verified && (
                    <svg
                      className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0"
                      viewBox="0 0 40 40"
                      aria-hidden="true"
                    >
                      <path
                        d="M19.998 3.094 14.638 0l-2.972 5.15H5.432v6.354L0 14.64 3.094 20 0 25.359l5.432 3.137v6.354h6.234L14.638 40l5.36-3.094L25.358 40l2.972-5.15h6.234v-6.354L40 25.359 36.905 20 40 14.641l-5.432-3.137V5.15h-6.234L25.358 0l-5.36 3.094Z"
                        fill="#0095f6"
                      />
                      <path
                        d="m11 20.5 5.5 5.5 12.5-12.5"
                        stroke="#fff"
                        strokeWidth="3.5"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                  <span className="text-white/40 text-xl leading-none ml-1">···</span>
                </div>

                <p className="text-sm text-white/70 mb-4">
                  {data.instagramMock.displayName}
                </p>

                <div className="flex flex-wrap gap-x-5 gap-y-2 mb-5 text-sm md:text-[15px]">
                  <span>
                    <strong className="font-semibold text-white">
                      {data.instagramMock.stats.posts}
                    </strong>{" "}
                    <span className="text-white/70">posts</span>
                  </span>
                  <span>
                    <strong className="font-semibold text-white">
                      {data.instagramMock.stats.seguidores}
                    </strong>{" "}
                    <span className="text-white/70">seguidores</span>
                  </span>
                  <span>
                    <strong className="font-semibold text-white">
                      {data.instagramMock.stats.seguindo}
                    </strong>{" "}
                    <span className="text-white/70">seguindo</span>
                  </span>
                </div>

                <div className="text-sm leading-relaxed space-y-0.5">
                  {data.instagramMock.bio.map((linha, i) => (
                    <p
                      key={i}
                      className={
                        i === 0
                          ? "text-white/60"
                          : i === 1
                          ? "font-medium text-white"
                          : "text-white/85"
                      }
                    >
                      {linha}
                    </p>
                  ))}
                  <p className="text-[#0095f6] font-medium flex items-center gap-1.5 pt-0.5">
                    <span aria-hidden>🔗</span>
                    <span>{data.instagramMock.linkExterno}</span>
                  </p>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-white/30 mt-8 pt-4 border-t border-white/5">
              Mock visual baseado no perfil público · Instagram
            </p>
          </div>
        )}

        <div
          className={`grid grid-cols-1 ${
            data.stats.length === 4 ? "md:grid-cols-4" : "md:grid-cols-3"
          } gap-4`}
        >
          {data.stats.map((s) => (
            <div
              key={s.label}
              className="bg-brand-background rounded-[24px] p-6 flex flex-col gap-2"
            >
              <span className="text-3xl md:text-4xl font-medium text-brand-title leading-none">
                {s.num}
              </span>
              <span className="text-xs md:text-sm text-brand-body font-light leading-snug">
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {data.fechamento && (
          <p
            className="text-sm text-brand-body/70 font-light max-w-3xl"
            dangerouslySetInnerHTML={{ __html: data.fechamento }}
          />
        )}
      </div>
    </section>
  );
}
