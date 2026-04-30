// Envio do evento via sendBeacon com fallback fetch keepalive.
//
// Detalhe importante: usar Content-Type "text/plain;charset=UTF-8" evita
// preflight CORS no Worker — o body continua sendo JSON parseável no servidor.
// (sendBeacon com Blob faz isso automaticamente; fetch precisa explícito.)

export function sendBeacon(endpoint: string, payload: unknown): boolean {
  const json = JSON.stringify(payload);
  if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
    try {
      const blob = new Blob([json], { type: "text/plain;charset=UTF-8" });
      const ok = navigator.sendBeacon(endpoint, blob);
      if (ok) return true;
    } catch {
      // cai no fallback
    }
  }
  if (typeof fetch === "function") {
    try {
      void fetch(endpoint, {
        method: "POST",
        body: json,
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
        keepalive: true,
        credentials: "omit",
        mode: "cors",
      }).catch(() => {});
      return true;
    } catch {
      return false;
    }
  }
  return false;
}
