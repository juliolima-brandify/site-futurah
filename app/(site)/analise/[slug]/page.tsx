import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { eq, and } from "drizzle-orm";
import { db, analises } from "@/lib/db";
import { PageProposta } from "@/components/proposta/PageProposta";
import type { AnaliseData } from "@/components/proposta/types";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function loadAnalise(slug: string) {
  const rows = await db
    .select({
      slug: analises.slug,
      status: analises.status,
      conteudo: analises.conteudo,
    })
    .from(analises)
    .where(and(eq(analises.slug, slug), eq(analises.status, "publicada")))
    .limit(1);

  return rows[0] ?? null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const analise = await loadAnalise(slug);
  const conteudo = analise?.conteudo as AnaliseData | null;

  return {
    title: conteudo?.meta.title ?? "Análise | Futurah and Co.",
    description: conteudo?.meta.description ?? "Análise estratégica personalizada.",
    robots: { index: false, follow: false },
  };
}

export default async function AnaliseSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const analise = await loadAnalise(slug);

  if (!analise || !analise.conteudo) {
    notFound();
  }

  const data = analise.conteudo as AnaliseData;

  return <PageProposta data={data} />;
}
