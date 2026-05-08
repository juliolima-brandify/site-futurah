import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { db, analises } from "@/lib/db";
import { requireSuperadmin } from "./lib/auth";
import { ActionButtons } from "./ActionButtons";
import "./analises.css";

export const dynamic = "force-dynamic";

/**
 * Revisão humana de análises geradas pela IA antes de publicar.
 *
 * Lista análises com `status='pendente_revisao'` ordenadas por created_at
 * desc. Cada uma tem botões "Aprovar"/"Rejeitar" + link de preview pra
 * `/analise/[slug]?preview=1` (renderiza não-publicada SE o gate de auth
 * passar).
 */
export default async function AnalisesAdminPage() {
  await requireSuperadmin();

  const pendentes = await db
    .select({
      id: analises.id,
      slug: analises.slug,
      email: analises.email,
      nome: analises.nome,
      instagramHandle: analises.instagramHandle,
      momento: analises.momento,
      gargalo: analises.gargalo,
      createdAt: analises.createdAt,
      status: analises.status,
    })
    .from(analises)
    .where(eq(analises.status, "pendente_revisao"))
    .orderBy(desc(analises.createdAt))
    .limit(50);

  return (
    <main className="anr-root">
      <div className="anr-container">
        <header className="anr-header">
          <div>
            <h1 className="anr-title">Revisão de análises</h1>
            <p className="anr-subtitle">
              {pendentes.length === 0
                ? "Nenhuma análise pendente."
                : `${pendentes.length} ${pendentes.length === 1 ? "análise pendente" : "análises pendentes"} de revisão.`}
            </p>
          </div>
          <nav className="anr-adminnav" aria-label="Admin">
            <Link href="/admin">Payload</Link>
            <Link href="/admin/tracking">Tracking</Link>
            <Link href="/admin/analises" data-active>
              Análises
            </Link>
          </nav>
        </header>

        <section className="anr-list">
          {pendentes.map((a) => (
            <article key={a.id} className="anr-card">
              <div className="anr-card-head">
                <div className="anr-card-meta">
                  <span className="anr-pill">@{a.instagramHandle}</span>
                  <span className="anr-card-date">
                    {a.createdAt.toLocaleString("pt-BR", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </span>
                </div>
                <h3 className="anr-card-title">
                  {a.nome ?? "(sem nome)"}{" "}
                  <span className="anr-card-email">{a.email}</span>
                </h3>
                {(a.momento || a.gargalo) && (
                  <p className="anr-card-summary">
                    {a.momento && <strong>{a.momento}</strong>}
                    {a.momento && a.gargalo ? " · " : ""}
                    {a.gargalo}
                  </p>
                )}
              </div>
              <div className="anr-card-actions">
                <Link
                  href={`/analise/${a.slug}?preview=1`}
                  target="_blank"
                  rel="noopener"
                  className="anr-btn anr-btn-secondary"
                >
                  Pré-visualizar →
                </Link>
                <ActionButtons id={a.id} slug={a.slug} />
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
