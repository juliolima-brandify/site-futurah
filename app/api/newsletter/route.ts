import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db, newsletterSubscribers } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body as { email?: string };

    if (!email?.trim()) {
      return NextResponse.json(
        { error: "E-mail é obrigatório." },
        { status: 400 }
      );
    }

    const normalized = email.trim().toLowerCase();

    await db
      .insert(newsletterSubscribers)
      .values({ email: normalized })
      .onConflictDoUpdate({
        target: newsletterSubscribers.email,
        set: { subscribedAt: sql`now()`, unsubscribedAt: null },
      });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[API] newsletter:", err);
    return NextResponse.json(
      { error: "Erro ao inscrever. Tente de novo." },
      { status: 500 }
    );
  }
}
