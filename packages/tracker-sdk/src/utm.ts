// Parsing de UTMs e click IDs a partir de location.search.
// Click IDs (gclid/fbclid/etc) são tratados como UTMs equivalentes para attribution.

export type UtmFields = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
};

export type ClickIds = {
  gclid?: string;
  fbclid?: string;
  ttclid?: string;
  msclkid?: string;
};

export type AttributionPayload = UtmFields & ClickIds;

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

const CLICK_ID_KEYS = ["gclid", "fbclid", "ttclid", "msclkid"] as const;

export function parseAttribution(search: string): AttributionPayload {
  const out: AttributionPayload = {};
  if (!search) return out;
  let params: URLSearchParams;
  try {
    params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  } catch {
    return out;
  }
  for (const key of UTM_KEYS) {
    const v = params.get(key);
    if (v) out[key] = v.slice(0, 200);
  }
  for (const key of CLICK_ID_KEYS) {
    const v = params.get(key);
    if (v) out[key] = v.slice(0, 200);
  }
  return out;
}

export function hasAnyAttribution(p: AttributionPayload): boolean {
  return Object.values(p).some((v) => typeof v === "string" && v.length > 0);
}
