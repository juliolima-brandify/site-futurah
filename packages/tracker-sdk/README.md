# @futurah/tracker-sdk

Cliente JS isomorphic do tracker Futurah. Envia eventos ao Worker de ingestão
(`packages/tracker-worker`) via `navigator.sendBeacon`.

## Uso direto (vanilla)

```ts
import { init, track } from "@futurah/tracker-sdk";

init({
  siteId: "futurah",
  endpoint: "https://t.futurah.co/e",
  debug: false,
});

track("pageview");
track("cta_click", { cta_id: "hero-primary" });
```

## Uso em Next.js (App Router)

O componente `<Tracker />` precisa estar dentro de `<Suspense>` porque hooks
como `usePathname` em Next 15 podem suspender — a documentação oficial
recomenda esse padrão para qualquer client component que dependa de URL.

```tsx
// app/(site)/layout.tsx
import { Suspense } from "react";
import { TrackerBoundary } from "@/components/tracker/TrackerBoundary";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <TrackerBoundary />
      </Suspense>
      {children}
    </>
  );
}
```

```tsx
// components/tracker/TrackerBoundary.tsx
"use client";
import { usePathname } from "next/navigation";
import { Tracker } from "@futurah/tracker-sdk/react";

export function TrackerBoundary() {
  const pathname = usePathname();
  return (
    <Tracker
      siteId="futurah"
      endpoint={process.env.NEXT_PUBLIC_TRACKER_ENDPOINT ?? ""}
      pathname={pathname}
    />
  );
}
```

## O que o SDK faz no init

- Garante cookie `_fut_aid` (UUID v4, 2 anos).
- Lê UTMs e click IDs (`gclid`, `fbclid`, `ttclid`, `msclkid`) de `location.search`.
- Persiste em cookies `_fut_first` (90d) e `_fut_last` (30d).
- Captura screen, viewport, language, timezone, referrer, title.

## Privacidade

- Nenhuma PII é capturada no client.
- Hash de IP é feito no Worker (salt rotativo diário).
- TODO(consent): adicionar gate de consent banner antes de qualquer cookie/beacon.

## Build

```bash
pnpm --filter @futurah/tracker-sdk build
```

Produz ESM + CJS + types em `dist/`. Entry point separado em `./react`.
