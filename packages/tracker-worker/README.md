# @futurah/tracker-worker

Cloudflare Worker de ingestão de eventos + API de leitura. Atende ambos os
tenants (`futurah` e `fidevidraceiro`) num único deploy — separação via
`site_id` no payload e allowlists em KV.

## Endpoints

- `POST /e` — ingestão (CORS aberto pra origins da allowlist).
- `GET /api/utm-summary?site_id=&since=24h` — resumo por UTM (auth bearer).
- `GET /api/pageviews?site_id=&since=24h` — top paths (auth bearer).
- `GET /health` — sanity check.

## Bindings (wrangler.toml)

- `ANALYTICS` → Analytics Engine dataset `tracker_events`.
- `KV` → namespace de config (sites, origins, salt).
- `DB` → D1 (placeholder Fase 2).

## Vars

- `CF_ACCOUNT_ID` — id da conta CF (visível no dashboard).
- `AE_DATASET` — `tracker_events`.

## Secrets

- `API_READ_TOKEN` — bearer pra `/api/*`.
- `CF_API_TOKEN_AE` — token CF com permissão **Account → Analytics: Read**
  (usado pra rodar SQL HTTP no Analytics Engine).

## Provisionamento (rodar uma vez)

> Os comandos abaixo precisam de credenciais Cloudflare. Não rode nada antes
> de decidir a conta CF. O monorepo usa **npm**; ajuste pra `pnpm dlx` se
> migrar.

```bash
npx wrangler login

# 1. KV namespace pra config (sites, origins, salt)
npx wrangler kv namespace create tracker-config
npx wrangler kv namespace create tracker-config --preview

# Cole os ids retornados em wrangler.toml (id e preview_id).

# 2. D1 (placeholder Fase 2 — pode pular agora; rodar antes de deploy se quiser bind)
npx wrangler d1 create tracker-db

# 3. Configurar allowlists em KV
npx wrangler kv key put --binding=KV "config:sites" '["futurah","fidevidraceiro"]'
npx wrangler kv key put --binding=KV "config:allowed_origins" '["https://futurah.com.br","https://www.futurah.com.br","https://fidevidraceiro.com.br","https://www.fidevidraceiro.com.br","http://localhost:3000","http://localhost:3001"]'

# 4. Secrets
npx wrangler secret put API_READ_TOKEN     # gerar: openssl rand -hex 32
npx wrangler secret put CF_API_TOKEN_AE    # token da conta com Analytics:Read

# 5. Editar wrangler.toml: substituir CF_ACCOUNT_ID e ids do KV/D1.

# 6. Deploy
npx wrangler deploy
```

## DNS

Após o deploy, o Worker fica em `tracker-worker.<account>.workers.dev`.
Pra rotear `t.futurah.com.br` e `t.fidevidraceiro.com.br`:

1. Domínios precisam estar na zona Cloudflare (nameservers CF).
2. Criar CNAME `t` → `tracker-worker.<account>.workers.dev` (proxy on, nuvem laranja).
3. Descomentar `[[routes]]` em `wrangler.toml` e rodar `wrangler deploy` de novo.

## Schema do Analytics Engine

`tracker_events` (rígido — alterar requer dataset novo):

| Campo | Tipo | Conteúdo |
|---|---|---|
| `index1` | string | `site_id` (única coluna indexada — cardinality controlada) |
| `blob1` | string | `event_name` (`pageview`, `cta_click`, ...) |
| `blob2` | string | `path` (`/`, `/aplicacao`, ...) |
| `blob3` | string | `utm_source` |
| `blob4` | string | `utm_medium` |
| `blob5` | string | `utm_campaign` |
| `blob6` | string | `utm_term` |
| `blob7` | string | `utm_content` |
| `blob8` | string | `referrer` |
| `blob9` | string | `country` (CF country) |
| `blob10` | string | `device_type` (`desktop`/`mobile`/`tablet`) |
| `blob11` | string | `browser` |
| `double1` | number | `viewport_w` |
| `double2` | number | `viewport_h` |

## Type-check local

```bash
pnpm --filter @futurah/tracker-worker typecheck
```

## TODOs

- Cron rotação de salt (Workers Paid).
- Routes — só após DNS pronto.
- Auth do `/api/*`: hoje bearer único; trocar por per-tenant em Fase 3.
