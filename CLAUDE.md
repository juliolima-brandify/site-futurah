# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # desenvolvimento local (Next.js, porta 3000)
npm run build    # build de produção
npm run lint     # ESLint
```

**Banco de dados (Drizzle + PostgreSQL):**
```bash
npx drizzle-kit generate   # gera migrations a partir do schema
npx drizzle-kit migrate    # aplica migrations no banco
npx drizzle-kit studio     # UI visual do banco (só schema public — Payload não aparece)
```

**Payload CLI** (sem `npx payload …` — o wrapper padrão quebra por top-level-await no `lexical`):
```bash
node --import tsx/esm ./node_modules/payload/dist/bin/index.js generate:types
node --import tsx/esm ./node_modules/payload/dist/bin/index.js generate:importmap
```

**Env vars obrigatórias** (`.env.local` em dev, painel Vercel em prod):
- `DATABASE_URL` — conn string do Postgres com permissão `CREATE SCHEMA`. Região do Supabase Pooler está em Dashboard → Settings → Database (esta instalação usa `us-west-2`).
- `PAYLOAD_SECRET` — hex 64-char (`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`). Build quebra com throw se ausente.
- `BLOB_READ_WRITE_TOKEN` — token do Vercel Blob Store (uploads de `media`). Vercel injeta automaticamente quando o Blob é conectado ao projeto.

## Arquitetura

### Deploy
O projeto é deployado na **Vercel**, team `Brandify Hub` (`team_BSOkCBupLNa1JZKNL8Yu4kka`), projeto `site-futurah` (`prj_6BuaAO5ec1tIeCyoUZGcv7CujOL8`). O `npm run build` padrão do Next.js é suficiente.

**Env vars configuradas no painel Vercel** (Production + Preview + Development):
- `DATABASE_URL` — Supabase pooler us-west-2
- `PAYLOAD_SECRET` — hex 64-char (mesmo valor do `.env.local`; **não regenerar sem coordenar**, invalida sessões)
- `BLOB_READ_WRITE_TOKEN` — injetado automaticamente pelo Vercel Blob Store `site-futurah-media` (region iad1), conectado via integration em 2026-04-23

> Os arquivos `wrangler.jsonc`, `open-next.config.ts` e os scripts `cf:build`/`deploy` no `package.json` são resquícios de uma migração anterior para Cloudflare e podem ser ignorados.

### Roteamento — Route Groups
- `app/layout.tsx` (root) — **minimalista**: só `<html lang="pt-BR"><body>{children}</body></html>`. **Não adicionar** imports de CSS, fontes ou classes aqui — vazam pro admin do Payload.
- `app/(site)/layout.tsx` — aplica `globals.css`, fontes e `inter.variable` num `<div>` wrapper. Todo CSS/font do site fica isolado neste route group.
- `app/(site)/` — páginas públicas do site (Header/Footer herdados das páginas individuais).
- `app/(payload)/layout.tsx` — layout do admin Payload (importa `@payloadcms/next/css`).
- `app/(payload)/admin/` — painel admin do Payload 3 (`/admin`). Arquivos auto-gerados — não editar à mão.
- `app/(payload)/api/` — endpoints REST e GraphQL do Payload (`/api/[...slug]`, `/api/graphql`).
- `app/api/` — rotas de API custom do site (`/api/contact`, `/api/newsletter`).

### Banco de Dados — dois schemas Postgres no mesmo Supabase

**Schema `payload.*`** (gerenciado por Payload 3 + plugin multi-tenant, push automático em dev):
- `tenants` — 1 row por cliente da agência (Futurah + próximos). O plugin injeta coluna `tenant` em `posts`, `categories`, `authors`, `leads`.
- `users` + `users_sessions` + `users_tenants` — auth + vínculo N:N user↔tenant. Role field: `superadmin` (Futurah, vê tudo) ou `tenant_admin`.
- `posts` (+ `_posts_v`/`_v_rels`/`_v_version_tags` pras drafts/versions), `posts_rels`, `posts_tags`.
- `categories`, `authors`, `media`, `leads`, `newsletter_subscribers` (esta última **global**, sem `tenant`).
- Internas: `payload_migrations`, `payload_preferences`, `payload_locked_documents`, `payload_kv`.

**Schema `public.*`** (gerenciado por Drizzle — `lib/db/schema.ts`):
- `analises` — análises geradas por leads (pipeline: `pendente_dados → scraping → gerando → pendente_revisao → publicada`).
- `analise_eventos` — tracking de leitura (open, scroll, click) de cada análise.

> `leads` e `newsletter_subscribers` foram migrados de Drizzle pra Payload — **não estão mais em `public`**. Migrations 0000 (cria) + 0001 (drop) já commitadas.

Leituras do site público vão pela Local API do Payload (`lib/content.ts` usa `getPayload({config})` + `payload.find` com `overrideAccess: true`). APIs `/api/contact` e `/api/newsletter` usam `payload.create` com `overrideAccess: true`.

**Access control — defesa em profundidade**: todas as Collections tenant-scoped (`Posts`, `Categories`, `Authors`, `Leads`) têm `read/create/update/delete` exigindo `req.user` autenticado. `Leads` e `NewsletterSubscribers` têm `create: () => false` pra bloquear POST anônimo cross-tenant via REST (criação pública só existe através das rotas `/api/contact` e `/api/newsletter` com `overrideAccess: true`). Isso fecha o vazamento onde o plugin multi-tenant não aplica filtro de tenant quando `req.user` é ausente. Posts/Categories/Authors também têm hook `beforeValidate` enforçando **slug único por tenant** (`beforeValidate` checa colisão via `payload.find` + `overrideAccess`).

### Sistema de Propostas
Propostas comerciais são páginas estáticas em `app/(site)/proposta-[cliente]/`. Toda a lógica de apresentação fica em `components/proposta/`, alimentada por um data file em `lib/proposta/[cliente]-data.ts`. Orquestração central em `components/proposta/PageProposta.tsx`.

**Para criar uma nova proposta:**
1. Criar `lib/proposta/[cliente]-data.ts` implementando `AnaliseData` (`components/proposta/types.ts`)
2. Criar `app/(site)/proposta-[cliente]/page.tsx` usando `<PageProposta data={...} />`
3. Assets (foto de perfil etc.) vão em `public/proposta-[cliente]/`
4. As seções disponíveis estão em `components/proposta/sections/`

**Estrutura de `AnaliseData`:**
- Obrigatórias: `hero`, `retrato`, `diagnostico`, `tese`, `frentes`, `bancoIdeias`, `fases`, `escopo`, `potencial`, `encerramento`
- Opcionais: `miniFaq` (se presente, renderiza `MiniFaqSection` ao final)
- `variante` (`"criador" | "empresa" | "infoprodutor"`) — variações visuais por seção
- `modelo` — tipo comercial: `"coproducao"` ou `"cash_on_delivery"`

**Lógica por modelo (em `PageProposta.tsx`):**
- `coproducao`: `FrentesSection` aparece após `TeseSection` (cedo, é a proposta); `EscopoSection` é renderizada normalmente.
- `cash_on_delivery`: `FrentesSection` vai para o final (depois de `PotencialSection`), funcionando como fechamento de oferta; `EscopoSection` é escondida (o valor comercial está em `frentes`).
- `TeamTestimonialSection` (quem somos) e `MiniFaqSection` (se o data tiver `miniFaq`) renderizam em toda proposta, independente do modelo.

**Layouts de `FrentesSection`:**
- `layout: "stack"` (default para cash_on_delivery) — cards empilhados verticalmente em 2 colunas internas (esquerda: pill + valor + título; direita: descrição + checklist).
- Sem `layout` ou `layout: "grid"` — grid 3 colunas com cards compactos (usado em coprodução).

**Conteúdo mínimo de `frentes` em cash_on_delivery com agentes de IA** (vale para `haytarzan`, `carlos-damiao` e próximas nesse formato):
- Stack 1 (implementação) deve incluir **setup de tráfego pago** (pixel, eventos de conversão, primeiras campanhas Meta/Google) — não apenas "estrutura de mídia".
- Stack 2 (operação mensal) deve deixar explícito três pontos que costumam ficar diluídos:
  1. **Gestão contínua de tráfego pago** em Meta Ads + Google Ads (criativos, públicos, lances, otimização semanal) — é uma frente de entrega, não um extra.
  2. **Supervisão humana dos agentes** — um especialista do time Futurah audita conversas, ajusta scripts e responde pela qualidade. Agentes nunca rodam "soltos".
  3. **Verba de mídia separada da mensalidade** — dito explicitamente no FAQ, pra evitar ruído comercial depois ("a Futurah opera e reporta, mas não cobra a mídia em cima").

### Design System
Tokens de cor em `tailwind.config.ts`:
- `brand-title` (#1B1B1B) — textos principais e fundos escuros
- `brand-background` (#E7E7E7) — fundos de cards e seções claras
- `brand-body` (#383838) — textos secundários
- `brand-highlight` (#DCFF69) — cor de destaque (lima)
- `brand-button-hover` (#0B2FFF) — azul de links e eyebrows

Fonte padrão: **Neue Haas Grotesk Display** (carregada localmente via `lib/fonts.ts`).

### Fluxo de Análise (pipeline interno)
`app/(site)/aplicacao/` → formulário (`ApplicationWizard`) → API → cria registro em `analises` com `status: pendente_dados` → pipeline externo faz scraping e geração via IA → status vai para `publicada` → análise disponível em `app/(site)/analise/[slug]/`.

> ⚠ **Estado atual (2026-04-24):** wizard (6 steps) → `POST /api/aplicacao` → geração OpenAI (`lib/ai/`) → `/analise/[slug]` funcionando **end-to-end**. Publica direto (sem revisão humana — TODO quando admin Fase 4 existir). Geração roda em fire-and-forget (`gerarAnaliseEmBackground`), com cálculo programático de `economiaPrevista` em cima do catálogo de substituição (`lib/ai/catalogo.ts`). **Ainda ausente**: scraping real do Instagram, admin de revisão humana, Stripe (só `express` implementado), rate-limit, tracking `analise_eventos`, troca pro `after()` do Next (risco de corte em serverless). Ver [`ANALISE_PLAN.md`](./ANALISE_PLAN.md) para auditoria completa e plano original.

## Painel admin — Payload 3 + multi-tenant

**Status (2026-04-23):** Fases 0-3 implementadas e validadas (build verde, 13/13 static pages). Fases 4-5 pendentes.

**Fases concluídas:**
- Fase 1: fundação multi-tenant (collections em `collections/`, plugin `@payloadcms/plugin-multi-tenant`, storage `@payloadcms/storage-vercel-blob`).
- Fase 2: blog migrado de Sanity → Payload (Lexical rich text). Sanity removido completamente.
- Fase 3: Leads + Newsletter migrados de Drizzle → Payload. Migration 0001 dropa as tabelas antigas de `public`.

**Fases pendentes:**
- Fase 4 — Análises: decisão 4.2 ainda **Drizzle em `public.analises`** (não migrar pra Collection Payload). Falta custom admin view em `app/(payload)/admin/custom/analises/` ou equivalente.
- Fase 5 — SEO + cleanup: `sitemap.ts`, `feed.xml`, JSON-LD `Article`, remoção dos `build_err*.log` da raiz, doc final `PAYLOAD.md`.

**Arquivos de referência:**
- [`PAYLOAD_MIGRATION.md`](./PAYLOAD_MIGRATION.md) — plano original, decisões e fallbacks (histórico).
- [`PAYLOAD_RUNBOOK.md`](./PAYLOAD_RUNBOOK.md) — runbook executável Fases 0-3 + seção **Lições aprendidas** com correções aplicadas durante o QA (imports sem extensão, `next/cache` lazy em hooks, CLI via `node --import tsx/esm`, setup de DB novo).

### Gotchas operacionais (ler antes de mexer em Payload)

1. **Imports no `payload.config.ts` são sem extensão** (`./collections/Authors`). `.ts` e `.js` quebram Next em typecheck/webpack. Consequência: o wrapper `npx payload …` quebra com `ERR_REQUIRE_ASYNC_MODULE` (TLA do `lexical`). **Usar sempre** `node --import tsx/esm ./node_modules/payload/dist/bin/index.js <cmd>`.
2. **Hooks que usam `next/cache`** precisam de `const { revalidateTag } = await import('next/cache')` dentro do callback — import top-level quebra a CLI. Ver `collections/Posts.ts`.
3. **`lib/content.ts` não silencia erros com try/catch** — erros de DB sobem para o handler do Next (500 em runtime, falha no build). Não reverter para try/catch em "proteção" — blog vazio silencioso é pior que erro visível.
4. **Schema `payload` é pushado automaticamente no primeiro boot em dev**. Se precisar recriar o schema do zero (DB novo ou sujo), seguir a sequência documentada na Lição 6 do `PAYLOAD_RUNBOOK.md` (drop + drizzle-kit migrate + `npm run dev` + `curl /admin`).
5. **`importMap.js` precisa estar populado para o `/admin` funcionar em runtime.** Se ficar vazio (`export const importMap = {}`), o `/admin` responde mas crasha em SSR com `TypeError: Cannot read properties of undefined (reading 'call')` no `webpack-runtime.js` — o plugin multi-tenant tenta consumir entries (TenantSelectionProvider, TenantSelector, etc.) e encontra `undefined`. **Fix**: rodar `npm run dev` uma vez — o próprio dev server regenera o arquivo com todas as entries necessárias (Lexical features, multi-tenant, Vercel Blob client uploads). O CLI `generate:importmap` standalone (via `node --import tsx/esm …`) tende a não popular nada; confiar no `npm run dev`.
6. **Layout split entre site e admin é obrigatório**. O root `app/layout.tsx` **não pode** importar `globals.css` nem aplicar classes globais (`dark`, fontes, etc.) — qualquer `@tailwind base` ou `body { color }` vaza pro admin e quebra a UI do Payload (inputs pretos em fundo claro, labels invisíveis). Estilos do site moram em `app/(site)/layout.tsx`, embrulhados num `<div>` com classes/fontes.
7. **Access control defensivo**: ao adicionar uma nova Collection tenant-scoped, copiar o padrão de `collections/Posts.ts`/`Categories.ts`/`Authors.ts` — `read/create/update/delete: ({req}) => !!req.user`. O filtro de tenant do plugin multi-tenant **só** é aplicado quando `req.user` existe, então `read: () => true` vaza dados entre tenants via REST anônimo. Site público sempre via Local API com `overrideAccess: true`.

### Bootstrap de DB novo (ou recriar do zero)

Se o Postgres destinatário estiver virgem (ou precisar ser limpo de tentativa anterior):

```bash
# 1. Schema payload
psql "$DATABASE_URL" -c "CREATE SCHEMA IF NOT EXISTS payload;"

# 2. Se houver resíduo de Payload em public.* (tabelas users/posts/media, payload_migrations etc), dropar:
psql "$DATABASE_URL" <<'SQL'
DROP TABLE IF EXISTS
  public.payload_locked_documents_rels, public.payload_locked_documents,
  public.payload_preferences_rels, public.payload_preferences,
  public.payload_migrations, public.payload_kv,
  public.users_sessions, public.users, public.posts, public.media, public.faq
CASCADE;
DROP SCHEMA IF EXISTS drizzle CASCADE;
SQL

# 3. Drizzle (cria analises, analise_eventos em public)
npx drizzle-kit migrate

# 4. Payload push automático: subir dev server + tocar /admin
npm run dev  # em background
curl -s http://localhost:3000/admin > /dev/null  # triggera init

# 5. Criar 1º user via wizard em http://localhost:3000/admin, depois promover:
psql "$DATABASE_URL" -c "UPDATE payload.users SET role='superadmin' RETURNING email, role;"

# 6. Logout/login no admin (JWT pega role nova), criar tenant 'futurah' (slug exato — lib/content.ts filtra por isso)
```

Em prod, o mesmo fluxo no primeiro deploy Vercel: abrir `<preview-url>/admin`, criar user, rodar o `UPDATE` via Supabase SQL Editor, criar tenant.
