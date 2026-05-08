import "server-only";
import { headers as nextHeaders } from "next/headers";
import { notFound } from "next/navigation";
import { getPayload } from "payload";
import config from "@payload-config";

/**
 * Auth gate da revisão de análises. Mesmo modelo do dashboard `/admin/tracking`:
 * só `role: superadmin` (Futurah) passa. Quem não passa cai em 404 — não
 * vazamos nem a existência da rota.
 *
 * Retorna o user pra que endpoints possam logar quem aprovou/rejeitou
 * (ainda não há tabela de auditoria, mas já fica preparado).
 */
export async function requireSuperadmin() {
  const payload = await getPayload({ config });
  const headers = await nextHeaders();
  const { user } = await payload.auth({ headers });
  if (!user || user.role !== "superadmin") {
    notFound();
  }
  return user;
}

/**
 * Versão "soft" pra usar em route handlers: em vez de 404, retorna `null`
 * pra que o handler responda 401/403 com JSON.
 */
export async function getSuperadminOrNull() {
  const payload = await getPayload({ config });
  const headers = await nextHeaders();
  const { user } = await payload.auth({ headers });
  if (!user || user.role !== "superadmin") return null;
  return user;
}
