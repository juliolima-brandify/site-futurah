import type { ChavePilar, PilaresData } from "../types";

interface Props {
  pilares: PilaresData;
}

const ORDEM: ChavePilar[] = [
  "maturidade",
  "aquisicao",
  "posicionamento",
  "processo-comercial",
  "capacidade-operacional",
  "stack-plataformas",
  "automacao-ia",
  "velocidade",
];

const VIEW_W = 800;
const VIEW_H = 720;
const CENTER_X = VIEW_W / 2;
const CENTER_Y = VIEW_H / 2;
const RADIUS = 200;
const LABEL_DIST = RADIUS + 32;

function corPorScore(score: number): { fill: string; stroke: string; text: string } {
  if (score <= 4) return { fill: "#FDECE9", stroke: "#E84F3D", text: "#B23A2E" };
  if (score <= 7) return { fill: "#FEF6E0", stroke: "#F2C037", text: "#9A6B0F" };
  return { fill: "#E8F5EA", stroke: "#5BB967", text: "#2F6B3B" };
}

function point(angleRad: number, dist: number, cx: number, cy: number) {
  return {
    x: cx + Math.cos(angleRad) * dist,
    y: cy + Math.sin(angleRad) * dist,
  };
}

function estimateWidth(text: string): number {
  return Math.max(72, text.length * 7.3 + 22);
}

export function RadarPilares({ pilares }: Props) {
  const ordenados = ORDEM.map(
    (chave) => pilares.pilares.find((p) => p.chave === chave),
  ).filter((p): p is NonNullable<typeof p> => Boolean(p));

  if (ordenados.length < 3) return null;

  const step = (Math.PI * 2) / ordenados.length;
  const angles = ordenados.map((_, i) => -Math.PI / 2 + step * i);

  const pontos = ordenados.map((p, i) => {
    const r = (p.score / 10) * RADIUS;
    return point(angles[i], r, CENTER_X, CENTER_Y);
  });

  const polygonStr = pontos.map((pt) => `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`).join(" ");

  const niveis = [0.25, 0.5, 0.75, 1].map((frac) =>
    angles
      .map((a) => point(a, RADIUS * frac, CENTER_X, CENTER_Y))
      .map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`)
      .join(" "),
  );

  const labelHeight = 24;
  const labelPaddingX = 12;

  return (
    <section className="w-full bg-white px-4 md:px-8 lg:px-12 py-16 md:py-20">
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-8">
        <div className="space-y-2">
          <h3 className="text-[24px] md:text-[32px] font-medium text-brand-title">
            Diagnóstico Geral
          </h3>
          <p className="text-sm md:text-base text-brand-body font-light">
            Avaliação dos principais pilares da sua operação.
          </p>
        </div>

        <div className="w-full max-w-[680px]">
          <svg
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            className="w-full h-auto"
            role="img"
            aria-label="Radar com nota de cada pilar"
          >
            {niveis.map((pts, i) => (
              <polygon
                key={i}
                points={pts}
                fill="none"
                stroke="#E5E5E5"
                strokeWidth="1"
              />
            ))}

            {angles.map((a, i) => {
              const p = point(a, RADIUS, CENTER_X, CENTER_Y);
              return (
                <line
                  key={i}
                  x1={CENTER_X}
                  y1={CENTER_Y}
                  x2={p.x}
                  y2={p.y}
                  stroke="#E5E5E5"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              );
            })}

            <polygon
              points={polygonStr}
              fill="#F2C03733"
              stroke="#F2C037"
              strokeWidth="2"
              strokeLinejoin="round"
            />

            {pontos.map((pt, i) => {
              const cor = corPorScore(ordenados[i].score);
              return (
                <circle
                  key={i}
                  cx={pt.x}
                  cy={pt.y}
                  r="6"
                  fill={cor.stroke}
                  stroke="white"
                  strokeWidth="2"
                />
              );
            })}

            {angles.map((a, i) => {
              const labelPt = point(a, LABEL_DIST, CENTER_X, CENTER_Y);
              const cor = corPorScore(ordenados[i].score);
              const nome = ordenados[i].nome;
              const width = estimateWidth(nome);
              const cosA = Math.cos(a);

              let rectX: number;
              let textX: number;
              let textAnchor: "start" | "middle" | "end";

              if (cosA > 0.3) {
                textAnchor = "start";
                rectX = labelPt.x;
                textX = labelPt.x + labelPaddingX;
              } else if (cosA < -0.3) {
                textAnchor = "end";
                rectX = labelPt.x - width;
                textX = labelPt.x - labelPaddingX;
              } else {
                textAnchor = "middle";
                rectX = labelPt.x - width / 2;
                textX = labelPt.x;
              }

              const rectY = labelPt.y - labelHeight / 2;
              const textY = labelPt.y + 4;

              return (
                <g key={i}>
                  <rect
                    x={rectX}
                    y={rectY}
                    width={width}
                    height={labelHeight}
                    rx={labelHeight / 2}
                    fill={cor.fill}
                    stroke={cor.stroke}
                    strokeWidth="1.5"
                  />
                  <text
                    x={textX}
                    y={textY}
                    fontSize="13"
                    fontWeight="500"
                    fill={cor.text}
                    textAnchor={textAnchor}
                  >
                    {nome}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </section>
  );
}
