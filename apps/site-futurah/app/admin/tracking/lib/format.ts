// Formatação determinística (server-side) — mesma saída em build e runtime,
// evita hidratação inconsistente. Tudo pt-BR.

const NF_INT = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });
const NF_PCT = new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
});

export function formatNumber(n: number | null | undefined): string {
    if (n == null || isNaN(n)) return "—";
    return NF_INT.format(n);
}

// Calcula delta em % entre dois valores. Retorna { pct, direction } —
// direction é "up" / "down" / "neutral", usada como atributo CSS.
export function computeDelta(curr: number, prev: number): {
    pct: number | null;
    direction: "up" | "down" | "neutral";
    text: string;
} {
    if (!prev || prev === 0) {
        if (!curr || curr === 0) return { pct: null, direction: "neutral", text: "—" };
        return { pct: null, direction: "up", text: "novo" };
    }
    const pct = ((curr - prev) / prev) * 100;
    if (Math.abs(pct) < 0.05) return { pct: 0, direction: "neutral", text: "0,0%" };
    const direction = pct > 0 ? "up" : "down";
    const sign = pct > 0 ? "+" : "−";
    return {
        pct,
        direction,
        text: `${sign}${NF_PCT.format(Math.abs(pct))}%`,
    };
}

export function formatDelta(curr: number, prev: number): string {
    return computeDelta(curr, prev).text;
}

// Formata um bucket vindo do Worker ("YYYY-MM-DD HH:MM:SS" UTC).
// HOUR -> "HH:00 dd/MM", DAY -> "dd/MM".
export function formatBucket(bucket: string, unit: "HOUR" | "DAY"): string {
    if (!bucket) return "";
    // Converte pra Date interpretando como UTC.
    const iso = bucket.replace(" ", "T") + "Z";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return bucket;
    const dd = String(d.getUTCDate()).padStart(2, "0");
    const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
    if (unit === "HOUR") {
        const hh = String(d.getUTCHours()).padStart(2, "0");
        return `${hh}:00 ${dd}/${mm}`;
    }
    return `${dd}/${mm}`;
}

export function shortenLabel(s: string, max = 32): string {
    if (!s) return "";
    if (s.length <= max) return s;
    return s.slice(0, max - 1) + "…";
}

// Tenta extrair domínio de uma URL completa; senão devolve label cru.
export function domainOf(label: string): string {
    if (!label) return "(direct)";
    if (!label.startsWith("http")) return label;
    try {
        return new URL(label).hostname.replace(/^www\./, "");
    } catch {
        return label;
    }
}
