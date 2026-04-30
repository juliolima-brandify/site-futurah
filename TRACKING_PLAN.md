# Plano de Tracking/Analytics próprio na Cloudflare

> Plano vivo. Atualizar conforme decisões forem fechadas e fases concluídas.

## 1. Arquitetura

**Stack:** beacon JS no front → **Worker** de ingestão (endpoint público, ex.: `https://t.futurah.com.br`) → escreve em **Analytics Engine** (séries temporais, eventos brutos) + **D1** (sessões, identidades, conversões com schema relacional) + **KV** (config/feature flags + dedup curto). Dashboard em uma rota Next.js dos próprios sites (ou app Pages dedicado), lendo via Worker que faz `SELECT` no Analytics Engine SQL API e joins em D1. Para Fase 4 (server-side tagging), **Queues** desacopla a ingestão do envio síncrono pra Meta CAPI / Google Ads.

```
Browser (apps/site-futurah, apps/fidevidraceiro)
   │  beacon /e (sendBeacon, JSON)
   ▼
Worker `tracker-ingest`  ── KV (config, dedup 5min)
   ├─► Analytics Engine (eventos brutos)
   ├─► D1 (sessions, identities, conversions, attribution_paths)
   └─► Queue (server-side fanout) ──► Worker `ss-forwarder` ──► Meta CAPI / Google Ads
                                                                ▲
Dashboard (Next.js)  ◄── Worker `tracker-api` ── SELECT AE SQL + D1
```

**Por que não usar só Cloudflare Web Analytics:** é closed-box, não vê UTM além do referer, não suporta eventos custom, não exporta pra dashboard próprio nem alimenta Meta CAPI. Serve como sanity-check, não como sistema de atribuição.

**Por que esse stack:**
- **Analytics Engine** = "InfluxDB grátis" da CF: 25 datasets, 10M writes/dia no Workers Free, SQL HTTP API. Schema rígido (blobs/doubles/index), por isso D1 ao lado.
- **D1** (SQLite gerenciado) cabe sessão/conversão/identidade com queries relacionais. 5GB no free, suficiente pros próximos 1–2 anos.
- **KV** pra config (sample rate, allowlist, mapping UTM→canal) e dedup rápido.

**Workers Paid ($5/mês) obrigatório a partir da Fase 3** (Cron Triggers, Queues, >100k req/dia). Fases 0–2 cabem no Free.

---

## 2. Fases e estimativas

Premissa: dev fluente em TS/Next, **iniciante em Workers**. Estimativas em dias úteis de 6–7h efetivas.

### Fase 0 — Setup (1–2 dias)

**Entrega:** conta CF configurada, `wrangler` autenticado, primeiro Worker "hello world" deployado em subdomínio próprio, esqueleto `packages/tracker-worker` + `packages/tracker-sdk`.

**Tarefas:**
- Criar `packages/tracker-worker` (Worker) e `packages/tracker-sdk` (cliente JS) no monorepo Turbo.
- `wrangler.toml` com bindings: `ANALYTICS` (AE dataset), `DB` (D1), `KV` (config).
- DNS pra `t.futurah.com.br` (CNAME pro Worker route) — **mesmo apex** dos sites pra evitar ad-blocker.
- Provisionar D1 + AE dataset + KV namespace via wrangler.
- CI: GitHub Action com `wrangler deploy --dry-run` em PR e deploy em main.

**Gotchas:**
- `wrangler.jsonc` legado em `apps/site-futurah` é resquício OpenNext — **não reaproveitar**.
- Se DNS dos domínios não estiver na CF, precisa migrar nameserver ou aceitar `workers.dev` (ruim pra ad-blockers).

---

### Fase 1 — MVP UTM + Pageview (3–5 dias)

**Entrega:** beacon nos 2 sites capturando pageview com UTMs completos, gravando em AE, dashboard CSV-grade ("últimas 24h por utm_source") visível.

**Tarefas:**
- **SDK** (`packages/tracker-sdk`): `track(event, props)` via `navigator.sendBeacon` com fallback `fetch keepalive`. Captura automática: `referrer`, `title`, `screen`, `viewport`, `language`, `tz`, `utm_*`, `gclid`, `fbclid`, `ttclid`, `msclkid`. **Persiste em cookies `_fut_first` (90d) e `_fut_last` (30d)**.
- **ID anônimo:** `_fut_aid` cookie 1st-party, UUID v4, 2 anos. Sem fingerprinting.
- **Worker ingest** (`POST /e`): valida origin (allowlist KV), enriquece com `cf-ipcountry`, `cf.colo`, hash de IP (SHA-256 + salt rotativo diário em KV), UA parsed. Escreve em AE.
  - `blobs`: [event_name, url_path, utm_source, utm_medium, utm_campaign, utm_term, utm_content, referrer, country, device_type, browser]
  - `indexes`: [site_id]
  - `doubles`: [viewport_w, viewport_h]
- **Integração Next.js:** `<Tracker siteId="..." />` em `app/(site)/layout.tsx`. Hook em `usePathname` pra SPA navigation. Decidir se rastreia `app/(prototipos)/`.
- **Dashboard MVP:** rota `/admin/tracking` (server component) chamando Worker `tracker-api` com SQL no AE.

**Gotchas:**
- `sendBeacon` cap 64KB Chrome — manter payload <2KB.
- UTM em SPA: capturar **antes** do primeiro `router.replace` que remove query. Padrão: `<Suspense><TrackerInit/></Suspense>`.
- AE quotas free: 100k writes/dia. Não ligar scroll/click depth no MVP.
- **`ctx.waitUntil()`** obrigatório no Worker (mesma pegadinha do `gerarAnaliseEmBackground` que tomamos na Vercel).

---

### Fase 2 — Sessões e conversões (4–6 dias)

**Entrega:** sessionização real em D1, eventos custom (form_submit, cta_click, video_play, scroll_75), primeiro funil ("home → /aplicacao → submit → /aplicacao/recebido → /analise"), tabela de conversões em D1.

**Tarefas:**
- **`sessions` em D1:** schema `(id, anon_id, site_id, started_at, last_seen_at, first_utm_*, landing_path, country, device, ended_at, page_count, event_count)`. Worker abre sessão se `last_seen_at < now - 30min`.
- **Eventos custom** nos pontos-chave do `site-futurah`:
  - `components/sections/Contact.tsx` → `lead_submit`
  - `components/sections/ApplicationWizard.tsx` → `wizard_step_complete` + `wizard_submit`
  - `app/(site)/proposta-*/page.tsx` → `proposal_view`
  - `app/aplicacao/recebido/[slug]` → `analise_published`
- **`conversions` em D1:** `(id, session_id, anon_id, type, value, slug, attributed_utm_*)`.
- **Dashboard Fase 2:** funil visual (Recharts), top campanhas com taxa de conversão, retenção.
- **Ligação com `analise_eventos`** (Drizzle/Postgres): manter no Postgres (ANALISE_PLAN intacto) e duplicar em D1 pra atribuição via ponte HTTP do Worker → endpoint Next.

**Gotchas:**
- D1 write throughput ~50/s. Mitigar com batch via Queues ou Durable Object pra cache de sessão.
- Cardinality em AE: indexar **só** `site_id`. Path em blob.
- Sessões cross-domain: **não** tratar `site-futurah` e `fidevidraceiro` como mesmo usuário.

---

### Fase 3 — Atribuição multi-touch + dashboard real (5–8 dias)

**Entrega:** modelos first-touch, last-touch, linear, time-decay configuráveis. Dashboard com cohorts, breakdown por canal/período, comparações.

**Tarefas:**
- **`touchpoints` em D1:** cada pageview com UTM novo é touchpoint.
- **Job de atribuição:** Cron 1x/h roda Worker que busca conversões novas, monta path, aplica os 4 modelos, popula `attribution_paths`.
- **Rollups diários:** Cron agrega `daily_metrics(date, site_id, channel, source, medium, campaign, sessions, users, conversions, revenue)` em D1. Dashboard lê dessa tabela (rápido).
- **Dashboard real:** novo app `apps/dash-tracking` (Pages). Auth via Cloudflare Access (free até 50 users).

**Gotchas:**
- Workers Paid obrigatório aqui.
- AE SQL timeout 30s — não consultar bruto no dashboard.

---

### Fase 4 — Server-side tagging (4–6 dias)

**Entrega:** conversões replicadas pra Meta CAPI e Google Ads Enhanced Conversions via server, dedup com pixel client.

**Tarefas:**
- Queue `events-fanout`. Worker consumer processa em batch.
- Adapter Meta CAPI com `event_id` = conversion id pra dedup.
- Adapter Google Ads Enhanced (precisa `gclid` capturado no first-touch).
- Pixel client minimalista: PageView client-side, conversões só server-side.

**Gotchas:**
- PII: SHA-256 lowercase trim. Errar = match-rate zero.
- Token Meta: usar system user (sem expiração).

---

### Fase 5 — Polimento (3–5 dias)

- Bot filtering (heurística UA + dedup KV).
- LGPD: banner consent + modo consent-less + endpoint `DELETE /me`.
- Retenção: AE TTL 90d free / 365d paid. Archive pra R2 mensal opcional.
- Alertas: Cron 1x/h compara baseline → webhook Discord/Slack.
- Documentação interna: README + runbook de "novo evento" + "novo cliente".

---

## 3. Resumo de tempo

| Fase | Estimativa | Plano CF |
|---|---|---|
| 0 — Setup | 1–2 dias | Free |
| 1 — MVP UTM | 3–5 dias | Free |
| 2 — Sessões + conversões | 4–6 dias | Free |
| 3 — Atribuição + dashboard | 5–8 dias | **Paid ($5/mês)** |
| 4 — Server-side tagging | 4–6 dias | Paid |
| 5 — Polimento | 3–5 dias | Paid |
| **MVP útil (0+1)** | **5–7 dias** | Free |
| **Substituto GA4 (0+1+2)** | **9–13 dias** | Free |
| **Sistema completo** | **20–32 dias (~4–6 semanas)** | Paid |

---

## 4. Top 3 armadilhas técnicas

1. **Ad-blockers no subdomínio.** Use `t.futurah.com.br`, **não** `tracking.` ou `analytics.`. Mesmo assim ~15–25% de perda em audiência tech-savvy é normal (vs 40–60% do GA4).
2. **Cardinality no Analytics Engine.** Indexar **só** `site_id`. Indexar `path` ou `anon_id` quebra em semanas.
3. **`ctx.waitUntil()` obrigatório.** Sem isso, escrita em D1/AE pode ser cortada após response. Mesma classe de bug do `gerarAnaliseEmBackground` em Vercel.

**Bônus:** `sendBeacon` com `Content-Type: text/plain;charset=UTF-8` (não dispara preflight CORS).

---

## 5. Decisões em aberto

| # | Decisão | Recomendação |
|---|---|---|
| 1 | Endpoint único ou um por site | **Um por site** (`t.futurah.com.br` + `t.fidevidraceiro.com.br`) — evita CORS, ad-blockers |
| 2 | GA4/Meta Pixel em paralelo? | **Sim, 30 dias** depois da Fase 2 pra reconciliar |
| 3 | Política consent (LGPD) | Definir: opt-out total, opt-out só marketing, ou legitimate interest |
| 4 | Dashboard onde mora | **App novo `apps/dash-tracking`** (auth separada) |
| 5 | Multi-tenancy desde Fase 1 | **Sim** — `site_id` atrelado a `tenant_id` desde já |
| 6 | Importar histórico GA4 | **Não** — GA4 vira arquivo morto consultável |
| 7 | Migrar deploy `fidevidraceiro` pra CF Pages | Não obrigatório pro tracking — beacon vai pro Worker independente |

---

## 6. Status

- [x] Plano aprovado
- [ ] Decisões 1–7 fechadas
- [x] Fase 0 — Setup _(Worker `tracker-worker` deployado em CF, KV/D1/AE provisionados, secrets configurados, CNAMEs `t.futurah.co` e `t.augustofelipe.com` criados proxied, env vars no Vercel — 2026-04-29)_
- [x] Fase 1 — MVP UTM _(SDK + ingest com dedup KV + AE indexado por site_id, integração Next.js nos 2 apps via `<TrackerBoundary />`, dashboard `/admin/tracking` consumindo `GET /api/utm-summary` — 2026-04-29)_
- [ ] Fase 2 — Sessões + conversões
- [ ] Fase 3 — Atribuição + dashboard
- [ ] Fase 4 — Server-side tagging
- [ ] Fase 5 — Polimento
