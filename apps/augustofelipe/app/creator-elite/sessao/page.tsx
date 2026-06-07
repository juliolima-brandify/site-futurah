import type { Metadata } from "next";
import SessionDeck from "./SessionDeck";
import { LEAD, mapLeadToDeck, type Lead, type RawLead } from "./lead-data";

export const metadata: Metadata = {
  title: "Sessão Estratégica — Creator Elite",
  description: "Deck interno de condução da Sessão Estratégica Creator Elite.",
  robots: { index: false, follow: false, nocache: true },
};

// Dados reais vêm do form de qualificação (Payload, via site-futurah). Esta
// página é dinâmica: ?ig=<handle> ou ?email=<email> carrega o lead real; sem
// param (ou se não achar/erro) cai no exemplo do LEAD.
export const dynamic = "force-dynamic";

const SITE_ID = "augustofelipe";

function lookupEndpoint(): string {
  const override = process.env.LEADS_LOOKUP_URL;
  if (override && override.length > 0) return override;
  const ingest = process.env.LEADS_INGEST_URL;
  if (ingest && ingest.includes("/ingest")) {
    return ingest.replace(/\/ingest\/?$/, "/lookup");
  }
  return "https://www.futurah.co/api/leads/lookup";
}

async function fetchLead(params: {
  ig?: string;
  email?: string;
}): Promise<Lead | null> {
  const token = process.env.LEADS_INGEST_TOKEN;
  if (!token) return null;
  if (!params.ig && !params.email) return null;

  const url = new URL(lookupEndpoint());
  url.searchParams.set("siteId", SITE_ID);
  if (params.email) url.searchParams.set("email", params.email);
  else if (params.ig) url.searchParams.set("social", params.ig);

  try {
    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { ok?: boolean; lead?: RawLead };
    if (!json.ok || !json.lead) return null;
    return mapLeadToDeck(json.lead);
  } catch {
    return null;
  }
}

export default async function CreatorEliteSessaoPage({
  searchParams,
}: {
  searchParams: Promise<{ ig?: string; email?: string }>;
}) {
  const sp = await searchParams;
  const lead = (await fetchLead({ ig: sp.ig, email: sp.email })) ?? LEAD;
  return <SessionDeck lead={lead} />;
}
