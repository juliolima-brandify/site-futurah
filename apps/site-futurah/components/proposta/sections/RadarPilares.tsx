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

const VIEW = 600;
const CENTER = VIEW / 2;
const RADIUS = 200;

function corPorScore(score: number): { fill: string; stroke: string; text: string } {
  if (score <= 4) return { fill: "#FDECE9", stroke: "#E84F3D", text: "#B23A2E" };
  if (score <= 7) return { fill: "#FEF6E0", stroke: "#F2C037", text: "#9A6B0F" };
  return { fill: "#E8F5EA", stroke: "#5BB967", text: "#2F6B3B" };
}

function point(angleRad: number, dist: number) {
  return {
    x: CENTER + Math.cos(angleRad) * dist,
    y: CENTER + Math.sin(angleRad) * dist,
  };
}

export function RadarPilares({ pilares }: Props) {
  const ordenados = ORDEM.map(
    (chave) => pilares.pilares.find((p) => p.chave === chave),
  ).filter((p): p is NonNullable<typeof p> => Boolean(p));

  if (ordenados.length < 3) return null;

  // Cada pilar tem um ângulo. Começamos no topo (-PI/2) e vamos horário.
  const step = (Math.PI * 2) / ordenados.length;
  const angles = ordenados.map((_, i) => -Math.PI / 2 + step * i);

  const pontos = ordenados.map((p, i) => {
    const r = (p.score / 10) * RADIUS;
    return point(angles[i], r);
  });

  const polygonStr = pontos.map((pt) => `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`).join(" ");

  // Grid: 4 níveis (25/50/75/100% do raio).
  const niveis = [0.25, 0.5, 0.75, 1].map((frac) => {
    const pts = angles
      .map((a) => point(a, RADIUS * frac))
      .map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`)
      .join(" ");
    return pts;
  });

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

        <div className="w-full max-w-[560px]">
          <svg
            viewBox={`0 0 ${VIEW} ${VIEW}`}
            className="w-full h-auto"
            role="img"
            aria-label="Radar com nota de cada pilar"
          >
            {/* Grid concêntrico */}
            {niveis.map((pts, i) => (
              <polygon
                key={i}
                points={pts}
                fill="none"
                stroke="#E5E5E5"
                strokeWidth="1"
              />
            ))}

            {/* Eixos dashed */}
            {angles.map((a, i) => {
              const p = point(a, RADIUS);
              return (
                <line
                  key={i}
                  x1={CENTER}
                  y1={CENTER}
                  x2={p.x}
                  y2={p.y}
                  stroke="#E5E5E5"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              );
            })}

            {/* Polígono do score */}
            <polygon
              points={polygonStr}
              fill="#F2C03733"
              stroke="#F2C037"
              strokeWidth="2"
              strokeLinejoin="round"
            />

            {/* Pontos coloridos nos vértices */}
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

            {/* Labels nos vértices */}
            {angles.map((a, i) => {
              const labelDist = RADIUS + 50;
              const pt = point(a, labelDist);
              const cor = corPorScore(ordenados[i].score);
              const nome = ordenados[i].nome;
              const isTop = Math.abs(Math.sin(a) + 1) < 0.05;
              const isBottom = Math.abs(Math.sin(a) - 1) < 0.05;
              const anchor = isTop || isBottom
                ? "middle"
                : Math.cos(a) > 0
                  ? "start"
                  : "end";
              return (
                <g key={i}>
                  <rect
                    x={pt.x - estimateWidth(nome) / 2}
                    y={pt.y - 13}
                    width={estimateWidth(nome)}
                    height="22"
                    rx="11"
                    fill={cor.fill}
                    stroke={cor.stroke}
                    strokeWidth="1.5"
                    transform={transformForAnchor(anchor, pt.x, estimateWidth(nome))}
                  />
                  <text
                    x={pt.x}
                    y={pt.y + 4}
                    fontSize="13"
                    fontWeight="500"
                    fill={cor.text}
                    textAnchor="middle"
                    transform={transformForAnchor(anchor, pt.x, estimateWidth(nome))}
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

function estimateWidth(text: string): number {
  return Math.max(72, text.length * 7.5 + 20);
}

function transformForAnchor(
  anchor: "start" | "middle" | "end",
  px: number,
  width: number,
): string {
  if (anchor === "middle") return "translate(0,0)";
  if (anchor === "start") return `translate(${width / 2 - 6}, 0)`;
  return `translate(${-width / 2 + 6}, 0)`;
}
