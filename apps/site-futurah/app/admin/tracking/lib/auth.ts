import "server-only";
import { headers as nextHeaders } from "next/headers";
import { notFound } from "next/navigation";
import { getPayload } from "payload";
import config from "@payload-config";

// Auth gate do dashboard. Mantém o mesmo modelo da página antiga: só
// `role: superadmin` da Futurah passa. Quem não passa cai em 404 — não
// vazamos nem a existência da rota.
export async function requireSuperadmin(): Promise<void> {
    const payload = await getPayload({ config });
    const headers = await nextHeaders();
    const { user } = await payload.auth({ headers });
    if (!user || user.role !== "superadmin") {
        notFound();
    }
}
