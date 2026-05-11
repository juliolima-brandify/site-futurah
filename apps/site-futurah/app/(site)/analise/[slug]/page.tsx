import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { headers as nextHeaders } from "next/headers";
import { getPayload } from "payload";
import config from "@payload-config";
import { db, analises } from "@/lib/db";
import type { AnaliseData } from "@/components/proposta/types";
import { ValorNaMesaSection } from "@/components/proposta/sections/ValorNaMesaSection";
import { MaturidadeSlider } from "@/components/proposta/sections/MaturidadeSlider";
import { RadarPilares } from "@/components/proposta/sections/RadarPilares";
import { PilaresCards } from "@/components/proposta/sections/PilaresCards";
import { CtaTeaserSection } from "@/components/proposta/sections/CtaTeaserSection";
import { TeamTestimonialSection } from "@/components/sections/TeamTestimonialSection";
import { AnaliseTracker } from "./AnaliseTracker";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}

async function loadAnaliseBySlug(slug: string) {
  const rows = await db
    .select({
      slug: analises.slug,
      status: analises.status,
      conteudo: analises.conteudo,
    })
    .from(analises)
    .where(eq(analises.slug, slug))
    .limit(1);

  return rows[0] ?? null;
}

/**
 * Renderiza análise. Por padrão exige `status='publicada'` (slug é o token,
 * mas slug-guessing não vaza análises pendentes/falhas).
 *
 * Quando `?preview=1` E o request vem de um superadmin autenticado, deixa
 * passar status `pendente_revisao` — legado, usado pelo botão
 * "Pré-visualizar" do admin órfão.
 */
async function isPreviewAllowed(searchParams: { preview?: string }): Promise<boolean> {
  if (searchParams.preview !== "1") return false;
  try {
    const payload = await getPayload({ config });
    const headers = await nextHeaders();
    const { user } = await payload.auth({ headers });
    return !!user && user.role === "superadmin";
  } catch {
    return false;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const analise = await loadAnaliseBySlug(slug);
  const conteudo =
    analise?.status === "publicada" ? (analise.conteudo as AnaliseData | null) : null;

  return {
    title: conteudo?.meta.title ?? "Análise | Futurah and Co.",
    description: conteudo?.meta.description ?? "Análise estratégica personalizada.",
    robots: { index: false, follow: false },
  };
}

/**
 * Layout minimalista — sem Header, sem Footer. A análise gerada é um
 * diagnóstico focado: callout de valor na mesa → maturidade → radar →
 * cards de pilares → CTA pra Sessão Estratégica → fundadores. O plano
 * de ação completo só é apresentado na sessão (gated atrás do CTA).
 */
export default async function AnaliseSlugPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const sp = await searchParams;
  const analise = await loadAnaliseBySlug(slug);

  if (!analise || !analise.conteudo) {
    notFound();
  }

  if (analise.status !== "publicada") {
    const preview =
      analise.status === "pendente_revisao" && (await isPreviewAllowed(sp));
    if (!preview) notFound();
  }

  const data = analise.conteudo as AnaliseData;

  return (
    <main className="bg-white relative" data-analise-content>
      <AnaliseTracker
        slug={slug}
        variante={data.variante}
        modelo={data.modelo ?? "cash_on_delivery"}
      />
      {data.economiaPrevista && (
        <ValorNaMesaSection totais={data.economiaPrevista.totais} />
      )}
      {data.pilares && <MaturidadeSlider pilares={data.pilares} />}
      {data.pilares && <RadarPilares pilares={data.pilares} />}
      {data.pilares && <PilaresCards pilares={data.pilares} />}
      <CtaTeaserSection agendaUrl={data.agendaUrl} />
      <TeamTestimonialSection />
    </main>
  );
}
