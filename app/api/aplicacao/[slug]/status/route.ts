import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, analises } from "@/lib/db";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const { slug } = await params;
    if (!slug) {
      return NextResponse.json({ error: "slug ausente" }, { status: 400 });
    }

    const [row] = await db
      .select({
        slug: analises.slug,
        status: analises.status,
        publishedAt: analises.publishedAt,
      })
      .from(analises)
      .where(eq(analises.slug, slug))
      .limit(1);

    if (!row) {
      return NextResponse.json({ error: "não encontrada" }, { status: 404 });
    }

    return NextResponse.json({
      slug: row.slug,
      status: row.status,
      publishedAt: row.publishedAt,
    });
  } catch (err) {
    console.error("[API] /aplicacao/[slug]/status:", err);
    return NextResponse.json({ error: "erro ao consultar" }, { status: 500 });
  }
}
