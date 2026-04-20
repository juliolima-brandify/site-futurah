import { NextResponse } from "next/server";
import { db, leads } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, social } = body as {
      name?: string;
      email?: string;
      social?: string;
    };

    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json(
        { error: "Nome e e-mail são obrigatórios." },
        { status: 400 }
      );
    }

    await db.insert(leads).values({
      nome: name.trim(),
      email: email.trim().toLowerCase(),
      social: social?.trim() || null,
      origem: "contact_form",
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[API] contact:", err);
    return NextResponse.json(
      { error: "Erro ao enviar. Tente de novo." },
      { status: 500 }
    );
  }
}
