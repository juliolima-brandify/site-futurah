// Captura de contexto do browser (sem PII).

export type BrowserContext = {
  url: string;
  path: string;
  title: string;
  referrer: string;
  language: string;
  timezone: string;
  screen_w: number;
  screen_h: number;
  viewport_w: number;
  viewport_h: number;
};

export function captureContext(): BrowserContext {
  if (typeof window === "undefined") {
    return {
      url: "",
      path: "",
      title: "",
      referrer: "",
      language: "",
      timezone: "",
      screen_w: 0,
      screen_h: 0,
      viewport_w: 0,
      viewport_h: 0,
    };
  }
  let timezone = "";
  try {
    timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  } catch {
    timezone = "";
  }
  return {
    url: window.location.href,
    path: window.location.pathname,
    title: typeof document !== "undefined" ? document.title : "",
    referrer: typeof document !== "undefined" ? document.referrer : "",
    language: typeof navigator !== "undefined" ? navigator.language : "",
    timezone,
    screen_w: window.screen ? window.screen.width : 0,
    screen_h: window.screen ? window.screen.height : 0,
    viewport_w: window.innerWidth || 0,
    viewport_h: window.innerHeight || 0,
  };
}
