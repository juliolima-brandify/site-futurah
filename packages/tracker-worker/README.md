# @futurah/tracker-worker

Cloudflare Worker de ingestão de eventos + API de leitura. Atende ambos os
tenants (`futurah` e `fidevidraceiro`) num único deploy — separação via
`site_id` no payload e allowlists em KV.

**Status (2026-04-29):** provisionado e em produção.

- Worker `tracker-worker` na conta `Adm.futurah@gmail.com's Account` (id `c43e22dbbaa289eade42d31408d0e3b4`).
- Routes: `t.futurah.co/*` e `t.augustofelipe.com/*` (CNAMEs proxied criados nas zonas `futurah.co` e `augustofelipe.com`).
- KV namespace `tracker-config`: `700f6793abf0433ba99601af785cd2d7` (prod) / `297465141ea34455a2dda7dc57f07904` (preview).
- D1 database `tracker-db`: `2c032f91-480a-48f6-b4fa-37b66db537f4` (placeholder Fase 2).
- Analytics Engine dataset: `tracker_events` (criado via UI; ver gotcha 3 abaixo).

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

> Já provisionado — esta seção fica como runbook pra recriar do zero ou pra um
> ambiente de outra conta CF. **Auth via OAuth do `wrangler login` é instável
> no Windows** (callback `localhost:8976` falha por firewall/AV). Caminho mais
> confiável: criar API Token custom em `https://dash.cloudflare.com/profile/api-tokens`
> com `Account → Workers Scripts: Edit`, `Workers KV Storage: Edit`, `D1: Edit`,
> `Account Analytics: Read`, `Zone → DNS: Edit (All zones)`. Exportar como
> `CLOUDFLARE_API_TOKEN` e passar `CLOUDFLARE_ACCOUNT_ID` em todos os comandos
> (ver gotcha 2 abaixo).

```bash
# Auth (preferir API token via env var em vez de wrangler login no Windows)
export CLOUDFLARE_API_TOKEN=cfat_...
export CLOUDFLARE_ACCOUNT_ID=c43e22dbbaa289eade42d31408d0e3b4
npx wrangler whoami  # confirma auth

# 1. KV namespace pra config (sites, origins, salt)
npx wrangler kv namespace create tracker-config
npx wrangler kv namespace create tracker-config --preview
# Colar os ids retornados em wrangler.toml (id e preview_id).

# 2. D1 (placeholder Fase 2 — pode pular agora)
npx wrangler d1 create tracker-db
# Colar o database_id em wrangler.toml.

# 3. Configurar allowlists em KV — NOTE o `--preview false` (gotcha 4)
npx wrangler kv key put --binding=KV --preview false "config:sites" '["futurah","fidevidraceiro"]'
npx wrangler kv key put --binding=KV --preview false "config:allowed_origins" '["https://futurah.co","https://www.futurah.co","https://fidevidraceiro.augustofelipe.com","http://localhost:3000","http://localhost:3001"]'

# 4. Secrets (stdin pra evitar prompt)
echo "$(openssl rand -hex 32)" | npx wrangler secret put API_READ_TOKEN
echo "<token-cf-com-Account-Analytics-Read>" | npx wrangler secret put CF_API_TOKEN_AE

# 5. Editar wrangler.toml: substituir CF_ACCOUNT_ID e ids do KV/D1.

# 6. Habilitar Analytics Engine (gotcha 3)
# Na UI: dashboard → Storage → Analytics Engine → Setup → criar dataset
# Dataset Name: tracker_events
# Dataset Binding: ANALYTICS
# Sem isso, deploy falha com erro 10089.

# 7. Deploy (sem routes ainda)
npx wrangler deploy
```

## DNS

Após o deploy, o Worker fica em `tracker-worker.<account-subdomain>.workers.dev`.
Pra rotear `t.futurah.co` e `t.augustofelipe.com`:

1. Domínios já estão na zona Cloudflare (`futurah.co`, `augustofelipe.com`).
2. Criar CNAME `t` → `tracker-worker.<account-subdomain>.workers.dev` em ambas as zonas, proxy on (nuvem laranja). Pode ser via API:
   ```bash
   curl -X POST "https://api.cloudflare.com/client/v4/zones/<zone-id>/dns_records" \
     -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"type":"CNAME","name":"t","content":"tracker-worker.<account>.workers.dev","proxied":true,"ttl":1}'
   ```
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

## Gotchas conhecidas

1. **Token CF custom precisa de permissões Account-level explícitas.** A UI separa "Permissions" em tipos `Account`, `Zone` e `User`. Adicionar só linhas `Zone` (DNS, WAF etc.) NÃO basta — `whoami` autentica mas qualquer write em KV/D1/Workers retorna `Authentication error [code: 10000]`. Permissões mínimas: `Account → Workers Scripts: Edit`, `Workers KV Storage: Edit`, `D1: Edit`, `Account Analytics: Read`.
2. **Token sem `User → Memberships: Read` exige `CLOUDFLARE_ACCOUNT_ID` setado em todo comando.** Sem isso, wrangler chama `/memberships` pra descobrir conta e falha com `Authentication failed (status: 400) [code: 9106]`.
3. **Analytics Engine tem feature gate manual além de criar dataset.** Erro `[code: 10089] You need to enable Analytics Engine` no `wrangler deploy` é gate beta — só desaparece criando dataset no caminho específico **Storage → Analytics Engine → Setup Analytics Engine** (nome do dataset deve bater 1:1 com `wrangler.toml`). Workaround se persistir: opt-out + opt-in em Workers Plans (caso documentado no GitHub issue cloudflare/workers-sdk#9312).
4. **`wrangler kv key put` exige `--preview false` quando `wrangler.toml` declara ambos `id` e `preview_id`.** Sem o flag o CLI aborta com "Specify --preview or --preview false".
5. **CF Analytics Engine SQL HTTP API espera SQL CRU no body.** `body: JSON.stringify({query: sql})` retorna 500. Correto: `body: sql` com `Content-Type: text/plain`. Bug que já corrigi no `src/api.ts`.

## TODOs

- Cron rotação de salt (Workers Paid).
- Auth do `/api/*`: hoje bearer único; trocar por per-tenant em Fase 3.
- Token `CF_API_TOKEN_AE` hoje reusa o token de provisionamento (account-wide). Idealmente é um token dedicado, **só** com `Account Analytics: Read`, pra reduzir blast radius do que vai dentro do Worker.
