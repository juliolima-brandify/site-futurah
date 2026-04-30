// Enrichment server-side: parse UA simplificado (sem lib pesada) e
// normalização de campos via request.cf.

// Detecção minimalista de device_type e browser. Não substitui ua-parser-js
// em precisão, mas evita dependência runtime no Worker (CPU time grátis ~10ms).

export function parseUserAgent(ua: string): { device_type: string; browser: string } {
  const lower = (ua || "").toLowerCase();
  if (!lower) return { device_type: "unknown", browser: "unknown" };

  let device_type = "desktop";
  if (/ipad|tablet|playbook|silk|kindle/.test(lower)) {
    device_type = "tablet";
  } else if (/mobi|iphone|ipod|android.*mobile|windows phone|blackberry/.test(lower)) {
    device_type = "mobile";
  }

  let browser = "other";
  if (/edg\//.test(lower)) browser = "edge";
  else if (/opr\/|opera/.test(lower)) browser = "opera";
  else if (/chrome\/|crios/.test(lower)) browser = "chrome";
  else if (/firefox\/|fxios/.test(lower)) browser = "firefox";
  else if (/safari\//.test(lower) && !/chrome/.test(lower)) browser = "safari";
  else if (/bot|spider|crawler|headless/.test(lower)) browser = "bot";

  return { device_type, browser };
}

export function getClientIp(request: Request): string {
  return request.headers.get("CF-Connecting-IP") || request.headers.get("X-Forwarded-For") || "";
}

export function getCfMeta(request: Request): { country: string; colo: string } {
  // request.cf é populado pela CF runtime.
  const cf = (request as unknown as { cf?: { country?: string; colo?: string } }).cf;
  return {
    country: cf?.country || "XX",
    colo: cf?.colo || "",
  };
}
