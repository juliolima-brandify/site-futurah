// Cookies 1st-party do tracker.
// _fut_aid: anonymous id (UUID v4), 2 anos.
// _fut_first: first-touch attribution (90 dias).
// _fut_last: last-touch attribution (30 dias).

import type { AttributionPayload } from "./utm";

const COOKIE_AID = "_fut_aid";
const COOKIE_FIRST = "_fut_first";
const COOKIE_LAST = "_fut_last";

const DAYS = 24 * 60 * 60 * 1000;
const TWO_YEARS = 730 * DAYS;
const NINETY_DAYS = 90 * DAYS;
const THIRTY_DAYS = 30 * DAYS;

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  if (!match) return null;
  const raw = match.slice(name.length + 1);
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

function writeCookie(name: string, value: string, maxAgeMs: number): void {
  if (typeof document === "undefined") return;
  const maxAgeSec = Math.floor(maxAgeMs / 1000);
  const v = encodeURIComponent(value);
  // SameSite=Lax para permitir top-level navigations preservarem o cookie.
  // Secure só em HTTPS (browser ignora em http://localhost dev).
  const secure = typeof location !== "undefined" && location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${v}; Max-Age=${maxAgeSec}; Path=/; SameSite=Lax${secure}`;
}

function uuidV4(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  // Fallback manual (RFC 4122 v4).
  const buf = new Uint8Array(16);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(buf);
  } else {
    for (let i = 0; i < 16; i++) buf[i] = Math.floor(Math.random() * 256);
  }
  buf[6] = (buf[6] & 0x0f) | 0x40;
  buf[8] = (buf[8] & 0x3f) | 0x80;
  const hex = Array.from(buf, (b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export function getOrCreateAnonId(): string {
  const existing = readCookie(COOKIE_AID);
  if (existing && existing.length >= 32) return existing;
  const fresh = uuidV4();
  writeCookie(COOKIE_AID, fresh, TWO_YEARS);
  return fresh;
}

export function readFirstTouch(): AttributionPayload | null {
  const raw = readCookie(COOKIE_FIRST);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AttributionPayload;
  } catch {
    return null;
  }
}

export function readLastTouch(): AttributionPayload | null {
  const raw = readCookie(COOKIE_LAST);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AttributionPayload;
  } catch {
    return null;
  }
}

export function persistAttribution(current: AttributionPayload): {
  first: AttributionPayload;
  last: AttributionPayload;
} {
  const existingFirst = readFirstTouch();
  const first = existingFirst ?? current;
  if (!existingFirst) {
    writeCookie(COOKIE_FIRST, JSON.stringify(current), NINETY_DAYS);
  }
  // last-touch sempre atualiza quando há nova attribution.
  writeCookie(COOKIE_LAST, JSON.stringify(current), THIRTY_DAYS);
  return { first, last: current };
}
