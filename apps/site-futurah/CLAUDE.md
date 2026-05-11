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
- `AI_GATEWAY_API_KEY` — chave do **Vercel AI Gateway** usada pelo pipeline de geração (`lib/ai/`). Em deploy Vercel, o gateway autentica via OIDC token automaticamente — esta var só é obrigatória em **dev local**. Sem ela em dev, `POST /api/aplicacao` aceita a submissão mas a geração falha e a análise termina em `status='falhou'`. Pegar a chave em Vercel Dashboard → AI Gateway.
- `AI_GATEWAY_MODEL` — opcional. Default `openai/gpt-4.1-mini`. Precisa do prefixo do provider (ex: `anthropic/claude-sonnet-4-6`, `openai/gpt-4o`). Trocar provider/modelo é só editar esta var.
- `NEXT_PUBLIC_AGENDA_URL` — **opcional**. URL da agenda comercial (Calendly, Cal.com etc.) usada nos CTAs da página `/analise/[slug]`. **Afeta APENAS análises geradas em runtime** (lida em `lib/ai/gerar.ts` e gravada como snapshot imutável em `conteudo.agendaUrl` — trocar a var depois NÃO altera análises antigas). **Não afeta propostas estáticas** (`/proposta-haytarzan`, `/proposta-augusto-felipe`, `/proposta-carlos-damiao`): elas precisam setar `cta.href` no data file (`lib/proposta/[cliente]-data.ts`) — sem isso, o CTA cai em `mailto:contato@futurah.co`. Sem ela em análises geradas: CTA de Encerramento cai em `mailto:contato@futurah.co` e CTA de Economia usa o `cta.href` do schema.
- `RESEND_API_KEY` — **opcional**. API key do Resend pra disparo de email quando análise é aprovada no admin. Sem ela, aprovação segue funcionando mas o lead só recebe a análise se acessar o link direto. Pegar em https://resend.com/api-keys.
- `RESEND_FROM_EMAIL` — **opcional**. Endereço/nome do remetente (ex: `Futurah <analise@futurah.co>`). Default: `Futurah <analise@futurah.co>`. Domínio precisa estar verificado no Resend.
- `CALENDLY_PERSONAL_ACCESS_TOKEN` — **opcional** (não consumido por código ainda — reservado para webhook de "agendamento criado", scheduling links únicos com prefill, e listagem de eventos no admin). Token tem escopo `webhooks:write`, `scheduled_events:read/write`, `scheduling_links:write`, etc. Rotacionar em https://calendly.com/integrations/api_webhooks. Setado em todos os 3 envs do Vercel.

## Arquitetura

### Deploy
O projeto é deployado na **Vercel**, team `admbrandify-gmailcoms-projects` (`team_BSOkCBupLNa1JZKNL8Yu4kka`, ex-"Brandify Hub"), projeto `site-futurah`. Build é orquestrado pelo Turbo (root `turbo.json`). Site em `https://futurah.co`.

**Env vars configuradas no painel Vercel** (Production + Preview + Development):
- `DATABASE_URL` — Supabase pooler us-west-2
- `PAYLOAD_SECRET` — hex 64-char (mesmo valor do `.env.local`; **não regenerar sem coordenar**, invalida sessões)
- `BLOB_READ_WRITE_TOKEN` — injetado automaticamente pelo Vercel Blob Store `site-futurah-media` (region iad1), conectado via integration em 2026-04-23
- `AI_GATEWAY_API_KEY` — **opcional em produção** (OIDC do Vercel autentica o gateway sozinho dentro do deploy). Setar só se quiser usar a mesma chave em dev local. Pegar em Vercel Dashboard → AI Gateway. Rotacionar lá e fazer Redeploy se quiser invalidar a antiga.
- `AI_GATEWAY_MODEL` — opcional. Default `openai/gpt-4.1-mini`. Sem custo de redeploy pra trocar provider — só editar a var (env é lida em runtime).
- `NEXT_PUBLIC_TRACKER_ENDPOINT` — `https://t.futurah.co/e` (consumido pelo `<TrackerBoundary />` do site).
- `TRACKER_API_URL` — `https://t.futurah.co` (consumido pelo dashboard `/admin/tracking` server-side).
- `TRACKER_API_TOKEN` — bearer pra ler `/api/utm-summary` no Worker (sincronizado com o secret `API_READ_TOKEN` no Worker via `wrangler secret put`).
- `LEADS_INGEST_TOKEN` — bearer fixo aceito por `/api/leads/ingest`. **Mesmo valor** está setado no projeto `augustofelipe` (que escreve). Rotacionar = atualizar nos dois projetos em sincronia. Listar/checar com `npx vercel env ls --scope=admbrandify-gmailcoms-projects`.
- `NEXT_PUBLIC_AGENDA_URL` — opcional. URL da agenda do CTA da análise. Coberto pelo wildcard `NEXT_PUBLIC_*` no `turbo.json` (não precisa listar individualmente).
- `RESEND_API_KEY` + `RESEND_FROM_EMAIL` — opcionais. Email transacional pra notificar lead quando análise é aprovada no admin (`/admin/analises`).
- `CALENDLY_PERSONAL_ACCESS_TOKEN` — opcional. PAT pra futuro webhook de "agendamento criado" + scheduling links únicos com prefill. Já provisionado nos 3 envs (2026-05-08); ainda sem código consumindo.

**Gotchas do build em monorepo Turbo 2 strict** (já consertados no repo, ler antes de mexer):
- `package.json` raiz precisa de `"packageManager"` (Turbo 2 strict). Sem isso: `Could not resolve workspaces`.
- `turbo.json` precisa listar **todas** as env vars usadas pelo build em `tasks.build.env` (`NEXT_PUBLIC_*`, `PAYLOAD_SECRET`, `DATABASE_URL`, `BLOB_READ_WRITE_TOKEN`, `AI_GATEWAY_API_KEY`, `AI_GATEWAY_MODEL`, `TRACKER_API_URL`, `TRACKER_API_TOKEN`, `NEXTJS_ENV`). Sem isso, vars existem no Vercel mas não chegam dentro do build → falha em runtime "PAYLOAD_SECRET nao definido" durante "Collecting page data".
- Next 15 strict typecheck atravessa todo `*.ts` no projeto, mesmo arquivos não importados — qualquer resíduo (ex: `open-next.config.ts` que importava pacote desinstalado) quebra build. Manter o tree limpo.

### Roteamento — Route Groups
- `app/layout.tsx` (root) — **minimalista**: só `<html lang="pt-BR"><body>{children}</body></html>`. **Não adicionar** imports de CSS, fontes ou classes aqui — vazam pro admin do Payload.
- `app/(site)/layout.tsx` — aplica `globals.css`, fontes e `inter.variable` num `<div>` wrapper. Todo CSS/font do site fica isolado neste route group.
- `app/(site)/` — páginas públicas do site (Header/Footer herdados das páginas individuais).
- `app/(payload)/layout.tsx` — layout do admin Payload (importa `@payloadcms/next/css`).
- `app/(payload)/admin/` — painel admin do Payload 3 (`/admin`). Arquivos auto-gerados — não editar à mão.
- `app/(payload)/api/` — endpoints REST e GraphQL do Payload (`/api/[...slug]`, `/api/graphql`).
- `app/(prototipos)/layout.tsx` — sandbox **isolado** pra protótipos de cliente. Importa só `./prototipos.css` (Tailwind cru + `box-sizing`), **não** importa `app/(site)/globals.css`. Sem fonte Neue Haas automática, sem cor de body Futurah, sem reset agressivo, sem scrollbar custom — cada protótipo decide sua própria identidade visual. `noindex/nofollow` por padrão (URL é o token).
- `app/(prototipos)/[nome-do-proto]/page.tsx` — cada protótipo é uma pasta. URL = nome da pasta. **Subrotas funcionam** (`{nome}/midia-kit/page.tsx` → `/{nome}/midia-kit`). Pra criar do zero: duplicar `proto-exemplo/`. Pode importar fontes (`next/font/google`) e CSS próprio (`./styles.css`).
- `app/(prototipos)/fi-de-vidraceiro/` — protótipo pro creator **Augusto Felipe** (@fidevidraceiro, vidraceiro-artista, 1.2M seguidores). Estética brutalist/grotesca: **Space Grotesk** (UI) + **Archivo Black** (display, MAIÚSCULAS), paleta preto/branco/laranja vibrante (#FF6B1A) + lima ácido (#C7F840), bordas pretas 2px, sombras hard sem blur, alternância branco/preto via `:nth-child(even)`, snap scroll (`.fdv-snap-container` = 1 seção por tela com `scroll-snap-type: y mandatory`). Estrutura:
  - `page.tsx` — design system público (tokens, componentes, exemplos)
  - `midia-kit/page.tsx` — mídia kit pra distribuir pra marcas (10 telas em snap, conteúdo extraído do PDF original)
  - `SectionCounter.tsx` — client component com IntersectionObserver pra counter `01/10` fixo no topo
  - `styles.css` — fonte da verdade dos tokens (`--fdv-*`); reset `--fdv-text-muted` dentro de `.fdv-card` pra cards funcionarem em qualquer seção
  - assets do mídia kit em `public/midia-kit-fi/` (46 imagens extraídas do PDF do cliente)

**Extração de PDF de cliente** (caso outro cliente entregue brief em PDF que precise virar página): **pymupdf já instalado** nesta máquina (`python -m pip install pymupdf` se em outra). Padrão de extração:
1. **Copiar PDF pra path ASCII primeiro** (`Copy-Item -LiteralPath` no PowerShell). Importante: pymupdf via Python no Windows quebra com `Í`, `@`, acentos no caminho — encoding cp1252 do stdin trunca o nome.
2. Script de extração: abrir PDF com `fitz.open()`, iterar páginas, salvar texto via `page.get_text("text")` num JSON, e imagens embutidas via `doc.extract_image(xref)` em `public/{prototipo}-.../`. Ver `tmp/extract_pdf.py` se ainda existir (gitignored — pode ter sido limpo).
3. Renderizar páginas como PNG via `page.get_pixmap(matrix=fitz.Matrix(1.5, 1.5))` em `tmp/page-thumbs/` pra eu inspecionar visualmente o layout antes de codar (uso o Read tool nos PNGs).
4. Texto em UTF-8 fica no JSON (não no console — `print` em PowerShell mostra `?` pra acentos por causa de cp1252; sempre ler o JSON pra ter texto correto).
- `app/api/` — rotas de API custom do site:
  - `/api/contact`, `/api/newsletter` — ingestão Payload (Leads, NewsletterSubscribers). Usa lookup por `host → tenant.domain` com fallback `tenant.slug='futurah'`.
  - `/api/leads/ingest` (POST) — endpoint server-to-server pra outros apps do monorepo (`augustofelipe`, `fidevidraceiro`) inserirem leads no Payload central com tenant scope correto. Bearer fixo (`LEADS_INGEST_TOKEN`, mesmo valor nos dois projetos Vercel). Body: `{siteId, name, email, whatsapp, source, answers}`. Lookup `siteId → tenant.id` em `payload.tenants.siteId`. Idempotente por `(tenant, email)`. Sem unique global em email — cliente B pode ter o mesmo lead que cliente A; dedup só dentro do tenant. Token rotation: gerar novo via `[Convert]::ToHexString(...)` ou `openssl rand -hex 32`, atualizar nos dois projetos Vercel (`site-futurah` + `augustofelipe`) em production+preview+development. Worker `/lead` no D1 foi removido (migration `0002_drop_leads.sql`); este é o único caminho de ingestão cross-app.
  - `/api/aplicacao` (POST) — ingestão do wizard de análise + dispara geração em background.
  - `/api/aplicacao/[slug]/status` (GET) — polling consumido por `/aplicacao/recebido/[slug]`.

### Banco de Dados — dois schemas Postgres no mesmo Supabase

**Schema `payload.*`** (gerenciado por Payload 3 + plugin multi-tenant, push automático em dev):
- `tenants` — 1 row por cliente da agência. Campo `siteId` (text unique) mapeia 1:1 com o `site_id` do tracker e com os apps (`futurah`, `augustofelipe`, `fidevidraceiro`). É a chave usada por `/api/leads/ingest` pra resolver `siteId → tenant.id`. O plugin injeta coluna `tenant` em `posts`, `categories`, `authors`, `leads`.
- `users` + `users_sessions` + `users_tenants` — auth + vínculo N:N user↔tenant. Role field: `superadmin` (Futurah, vê tudo) ou `tenant_admin`.
- `posts` (+ `_posts_v`/`_v_rels`/`_v_version_tags` pras drafts/versions), `posts_rels`, `posts_tags`.
- `categories`, `authors`, `media`, `leads`, `newsletter_subscribers` (esta última **global**, sem `tenant`).
- `leads`: `nome, email, social, whatsapp (digitos), source, origem (deprecated, mantido p/ compat), answers (json), receivedAt, tenant`. Source-of-truth para captura via formulário público (`/api/contact`) e via apps externos do monorepo (`/api/leads/ingest`).
- Internas: `payload_migrations`, `payload_preferences`, `payload_locked_documents`, `payload_kv`.

**Schema `public.*`** (gerenciado por Drizzle — `lib/db/schema.ts`):
- `analises` — análises geradas por leads (pipeline: `pendente_dados → scraping → gerando → pendente_revisao → publicada`). Colunas do wizard: `instagram_handle`, `email`, `nome`, `whatsapp`, `momento`, `gargalo`, `velocidade`, `equipe` (jsonb), `plataformas` (jsonb). Colunas geradas: `dados_scraped` (jsonb), `conteudo` (jsonb, shape `AnaliseData`).
- `analise_eventos` — tracking de leitura (open, scroll, click) de cada análise. **Ainda não populada** — tabela existe, endpoint de tracking (`H4` do gap plan) está TODO.

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

**Estado (2026-05-11):** fluxo **end-to-end funcional, publicação direta sem revisão humana** — wizard estilo typeform → API → AI Gateway → `/analise/[slug]` numa **página única enxuta** (callout de valor na mesa + slider de maturidade + radar de pilares + cards + CTA + fundadores). Sem Header, sem Footer. Resultado aparece na própria página de espera após ~10-30s, sem email.

#### Entradas (dois caminhos)
1. **Home** → `components/sections/Contact.tsx` coleta `nome + email + site/@` → `POST /api/contact` (grava em `leads` do Payload) → `router.push('/aplicacao?name=&email=&social=')`.
2. **Direto** em `/aplicacao` sem query params — nome e email são coletados no próprio wizard, em steps dedicados.

#### Wizard (`components/sections/ApplicationWizard.tsx`)
Layout **typeform** (uma pergunta por tela, centralizado, sem sidebar). Steps dinâmicos via `useMemo` (9-12 telas conforme caminho):

1. `analise` — site/@instagram + animação fake de 2s
2. `momento` — fase do negócio (validação/tração/escala)
3. `gargalo` — dor principal (tráfego/posicionamento/processo/gestão)
4. `velocidade` — prontidão
5. `headcount` — tamanho da equipe (Operação 1/5)
6. `cargos` — multi-select com catálogo + campo livre (Operação 2/5)
7. `custo-funcionario` — faixa de custo médio (Operação 3/5)
8. `plataformas` — multi-select agrupado (CRM/Atendimento/Agendamento/WhatsApp/Email) + campo livre (Operação 4/5)
9. `custo-plataformas` — faixa de custo total mensal (Operação 5/5)
10. `nome` *(só caminho 2)*
11. `email` *(só caminho 2)*
12. `whatsapp` + submit

Enter avança, `autoFocus` nos inputs. Validação por step em `canAdvance` — botão "Continuar" fica desabilitado sem resposta.

#### Ingestão — `POST /api/aplicacao` (`app/api/aplicacao/route.ts`)
Valida `email` e `instagramHandle`, normaliza handle (remove `@`/URL), gera `slug` via `nanoid(22)`, INSERT em `analises` (status `pendente_dados`, tipo `express`), agenda `gerarAnaliseEmBackground(id)` via **`after()`** do `next/server` (roda fora do response cycle mas dentro do budget da função serverless — sem `after()`, Vercel pode cortar antes do gateway responder). Retorna `{ id, slug }`. Wizard redireciona para `/aplicacao/recebido/[slug]`.

#### Geração — `lib/ai/gerar.ts`
Orquestrador assíncrono. Fluxo:
1. Lê a row; se já tem `conteudo`, é idempotente (skip).
2. Muda status → `gerando`.
3. Monta prompt (`lib/ai/prompt-analise.ts`) descrevendo o lead com labels humanas e o shape esperado de `AnaliseData` (inclui o briefing dos 6 pilares — ver "Pilares" abaixo).
4. Chama o **Vercel AI Gateway** via `generateObject({ model: gateway('openai/gpt-4.1-mini'), schema: analiseGeradaSchema, … })`. Modelo configurável via `AI_GATEWAY_MODEL` (precisa do prefixo do provider). O zod schema (`lib/ai/schema.ts`) valida o output em runtime — não há mais `JSON.parse` manual.
5. **Calcula `economiaPrevista` programaticamente** em `lib/ai/economia.ts` — cruza `equipe.cargos` e `plataformas.items` com o catálogo (`lib/ai/catalogo.ts`) para produzir a tabela "custo atual vs projetado + total de economia". Não delega números à IA (evita alucinação).
6. **Deriva 2 pilares comportamentais** (Maturidade, Velocidade) programaticamente a partir de `momento` / `velocidade` do wizard — sem IA, sem alucinação. Merge com os 6 pilares gerados pela IA → total de 8 pilares em `conteudo.pilares.pilares`.
7. Salva `conteudo` + status → `publicada` direto (`publishedAt = now()`). **Sem revisão humana no caminho.**

Se falhar em qualquer etapa, grava `status='falhou'` + `revisorNotas` com a mensagem.

#### Espera + entrega
- `/aplicacao/recebido/[slug]` — client component com polling a cada 3s em `/api/aplicacao/[slug]/status`. Copy adaptativa por status (`pendente_dados`/`scraping`/`gerando`/`publicada`/`falhou`). Quando `publicada`, redireciona pra `/analise/[slug]`. Polling segue até `publicada` ou `falhou` — desde 2026-05-11, `pendente_revisao` não acontece mais no caminho normal.
- `/analise/[slug]` — server component que `SELECT WHERE slug=$1 AND status='publicada'`. **Não usa `PageProposta`** — monta seu próprio `<main>` enxuto, sem Header e sem Footer. `noindex` via robots meta (slug é o token).

#### Layout da `/analise/[slug]`
Página única, focada em diagnóstico + abertura comercial. Não importa Header nem Footer (o `(site)/layout.tsx` também não monta esses chrome — eles só vêm via `PageProposta` em propostas estáticas).

Ordem fixa:
1. `AnaliseTracker` — client component invisível (`siteId='futurah'`, dispara `analise_view` + `analise_scroll_50/90` via IntersectionObserver e seta `window.__FUTURAH_ANALISE_SLUG__` pra os CTAs).
2. `ValorNaMesaSection` — callout vermelho "Sua operação está deixando R$ X,XX na mesa todos os meses" (lê `economiaPrevista.totais.economiaMensal`).
3. `MaturidadeSlider` — slider gradiente vermelho→amarelo→verde, posição = score do pilar `maturidade`.
4. `RadarPilares` — radar SVG octogonal de 8 vértices. viewBox 800x720, raio 200, labels com pílula colorida por faixa de score (≤4 vermelho, 5-7 amarelo, ≥8 verde). Sem libs externas — SVG inline server-rendered.
5. `PilaresCards` — lista de 8 cards (bolinha + nome + descrição curta + pill `N/10`).
6. `CtaTeaserSection` — bloco escuro "O plano de ação completo está pronto" com CTA pra `agendaUrl`. Instrumentado via `AnaliseCTA location="teaser"`.
7. `TeamTestimonialSection` — fundadores (Julio + Vinicius).

Todos os componentes de proposta tradicionais (`Hero`, `Retrato`, `Diagnostico`, `Tese`, `Frentes`, `BancoIdeias`, `Fases`, `Escopo`, `Potencial`, `Economia` detalhada, `Encerramento`, `MiniFaq`) **continuam existindo** mas só são usados pelas propostas estáticas via `PageProposta`. Análise gerada não toca neles.

#### O que ainda falta
- **Scraping real do Instagram**: IA hoje só tem os dados do wizard; `dados_scraped` fica `null`. Pipeline externo (n8n/worker Python) ainda não existe — B3 do gap plan.
- **Stripe** pra `tipo='completa'` — B7. Hoje só `express` é gerado (grátis).
- **`tenant_id` em `analises`** — B6. Schema atual é sem tenant; análises não são isoladas por cliente da agência.
- **Tracking em `analise_eventos`** — H4 (Postgres). Tabela + índice existem mas não populadas; tracking real vai pro Analytics Engine via tracker-worker.

Ver [`ANALISE_PLAN.md`](./ANALISE_PLAN.md) para o plano priorizado completo.

### Pipeline de IA (`lib/ai/`)

Todo o código de geração fica aqui, server-only.

| Arquivo | Responsabilidade |
|---|---|
| `gateway.ts` | Cliente do **Vercel AI Gateway** via `@ai-sdk/gateway`. Exporta `analiseModel()` + `ANALISE_MODEL`. Em prod (deploy Vercel) autentica via OIDC; em dev local exige `AI_GATEWAY_API_KEY`. |
| `schema.ts` | Schema **zod** do `AnaliseData` (sem `economiaPrevista`, calculado em código). Inclui `pilaresSchema` — 6 pilares com enum estrito de chaves (`aquisicao`, `posicionamento`, `processo-comercial`, `capacidade-operacional`, `stack-plataformas`, `automacao-ia`), score 0-10 inteiro, descrição curta. Maturidade/Velocidade NÃO estão no schema — são derivados em `gerar.ts`. Source-of-truth do output da IA — usado pelo `generateObject` pra estruturar a chamada e validar runtime. |
| `catalogo.ts` | **Catálogo de substituição** — source of truth do "o que a Futurah substitui". Dois maps: `CATALOGO_CARGOS` (10 cargos: sdr, atendente-whatsapp, agendadora, suporte-n1, qualificador, social-media, gestor-trafego, webdesigner, financeiro-op, recepcionista) e `CATALOGO_PLATAFORMAS` (19 SaaS agrupados em CRM/Atendimento/Agendamento/WhatsApp/Email). Cada entry tem `{ label, substituivel: boolean, como/alternativa: string }`. Também `CUSTO_ESTIMADO_CARGO` e `CUSTO_ESTIMADO_PLATAFORMA` (pontos de referência em R$). |
| `economia.ts` | `calcularEconomia(equipe, plataformas)` determinístico — monta `EconomiaPrevistaData` cruzando respostas do wizard com o catálogo. Fator de escala por headcount e ajuste por faixa de custo. Totaliza `custoAtualMensal`/`custoProjetadoMensal`/`economiaMensal`/`economiaAnual` + CTA para Sessão Estratégica. |
| `prompt-analise.ts` | `buildPrompt(input)` retorna `{ system, user }`. System = persona Futurah + regras editoriais + `PILARES_BRIEF` (critérios de calibração por gargalo/momento pra cada um dos 6 pilares — força que ≥1 pilar de "dor" fique ≤4 e automação-IA sempre ≤5, pra criar abertura comercial). User = dados do lead com labels humanizadas. O **shape** vem do zod schema (`schema.ts`), não do prompt. |
| `gerar.ts` | `gerarAnaliseEmBackground(id)` — orquestrador. Inclui `derivarPilaresComportamentais(momento, velocidade)` que produz 2 pilares âncora sem IA (Maturidade: validação=3/tração=6/escala=8; Velocidade: pesquisando=2/validar=6/prioridade=9). Merge com 6 pilares da IA → 8 totais. Publica direto com `status='publicada'` (sem revisão humana). |

**Como estender o catálogo** (ex: adicionar o cargo "copywriter"):
1. Adicionar entry em `CATALOGO_CARGOS` (`lib/ai/catalogo.ts`) com `substituivel`/`como`.
2. Adicionar estimativa em `CUSTO_ESTIMADO_CARGO`.
3. Adicionar opção em `cargosDisponiveis` (`components/sections/ApplicationWizard.tsx`) para aparecer no wizard.
4. Pronto — `calcularEconomia` pega automaticamente.

Mesmo fluxo para plataformas.

## Painel `/admin/analises` — revisão humana de análises (órfão desde 2026-05-11)

> **Status (2026-05-11):** desde a mudança pra publicação direta, este painel **saiu do caminho crítico**. Análises geradas via `/aplicacao` publicam direto (não passam mais por `pendente_revisao`). O painel segue funcional, mas a fila fica vazia exceto por rows legadas. Endpoints `aprovar`/`rejeitar` continuam operacionais pra essas legadas. Decisão: manter como código stand-by, sem remover.

Server-rendered (RSC), gated por `requireSuperadmin()` (Payload). Lista análises com `status='pendente_revisao'` ordenadas por `created_at desc`. Cada uma tem botões "Aprovar" / "Rejeitar" e link de pré-visualização (`/analise/[slug]?preview=1`).

**Fluxo antigo (até 2026-05-10):** wizard → `POST /api/aplicacao` → `gerarAnaliseEmBackground` salva como `pendente_revisao` → admin entra em `/admin/analises`, revisa e aprova/rejeita → `POST /api/admin/analises/[id]/aprovar` muda status pra `publicada` + dispara email Resend pro lead; rejeitar grava `revisor_notas` e marca `falhou`.

**Fluxo atual (desde 2026-05-11):** wizard → `POST /api/aplicacao` → `gerarAnaliseEmBackground` salva direto como `publicada` (sem passar por revisão). Resultado aparece na própria `/aplicacao/recebido/[slug]` após polling detectar `publicada` (~10-30s). Email Resend não dispara mais no fluxo normal.

**Estrutura** (`app/admin/analises/`):
- `page.tsx` — lista server-rendered.
- `ActionButtons.tsx` — client component, dispara as transições.
- `lib/auth.ts` — `requireSuperadmin()` (404 silencioso) + `getSuperadminOrNull()` (401 JSON).
- `analises.css` — estilos escopados em `.anr-*` (mesmo padrão do dashboard tracking).

**Endpoints** (todos `POST`, exigem superadmin):
- `/api/admin/analises/[id]/aprovar` — `pendente_revisao → publicada`, dispara email transacional.
- `/api/admin/analises/[id]/rejeitar` — `pendente_revisao → falhou`, body opcional `{ nota }` salvo em `revisor_notas`.

**Pré-visualização**: `/analise/[slug]?preview=1` aceita `pendente_revisao` somente quando o request vem de superadmin autenticado (gate por `payload.auth({ headers })`). Slug-guessing público continua bloqueado.

**Lead** vê `/aplicacao/recebido/[slug]` → polling para em `pendente_revisao` com copy explicando que vai chegar email. Quando admin aprova, email Resend chega com link pra `/analise/[slug]`.

> O link pra `/admin/analises` aparece dentro do nav do `/admin/tracking` (não na sidebar nativa do Payload). Adicionar à sidebar do Payload exige `admin.components.afterNavLinks` + regen do `importMap.js` — fica como TODO.

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

## Leads — UI

Não há mais dashboard custom de leads. A interface é a UI nativa do Payload em `/admin/collections/leads`, que respeita o tenant scope automaticamente (superadmin vê todos via switcher, tenant_admin vê só os do próprio tenant). O dashboard custom em `/admin/leads` (que lia D1 via Worker) foi removido junto com a tabela `leads` do D1 e o endpoint `/lead` do Worker — fonte autoritativa agora é só `payload.leads`.

## Dashboard de tracking — `/admin/tracking`

Server-rendered (RSC), gated por `requireSuperadmin()` (Payload). Lê do Worker `tracker-worker` (em `t.futurah.co` / `t.augustofelipe.com`) via `TRACKER_API_URL` + `TRACKER_API_TOKEN`. Cache `next: { revalidate: 60, tags: ['tracker:<siteId>'] }`. Nada bate o Worker direto do browser.

**Estrutura** (`app/admin/tracking/`):
- `layout.tsx` + `dashboard.css` — CSS escopado em `.trk-*` (sem Tailwind, isolamento intencional pra não vazar pro Payload admin).
- `lib/{auth,types,format,ctx,tracker-client}.ts` — RSC fetchers tipados, `import 'server-only'`, fallback `{rows:[], error: true}` em falha (UI degrada, não quebra).
- `components/`:
  - `KPIGrid` (Pageviews, Visitors ≈ via `count(DISTINCT)`, PV/dia, Sessions=proxy) com delta vs janela anterior.
  - `TimeseriesChart` — SVG inline RSC, ~150 LOC, `<title>` nativo pra tooltip, **zero JS no client**.
  - `BreakdownTable` (genérico) × 7 instâncias: paths, UTMs, campaign, referrer (com domain extraction), country, device, browser.
  - `EventBreakdownTable` + `EventNameSelector` (Fase 1.6) — seção dedicada a eventos custom (`link_click` etc.); dropdown lista event names distintos, default `link_click`.
  - `WindowSelector` (presets 24h/7d/30d/90d + `<details>` pra range custom `from`/`to`), `SiteSelector` (futurah / fidevidraceiro), `DataState` (empty/error padrão).

**Endpoints consumidos** (todos via Read API do Worker, `Bearer ${TRACKER_API_TOKEN}`):
- `/api/utm-summary`, `/api/pageviews` — legados, mantidos por compat.
- `/api/timeseries`, `/api/kpis`, `/api/breakdown?dim={campaign,referrer,country,device,browser}` — Fase 1.5.
- `/api/events?event=&dim={url,label,target,path}`, `/api/event-names` — Fase 1.6.

**Para instrumentar cliques em qualquer página** (padrão estabelecido): client component que importa lazy o SDK e chama `trackClick({url, label, position})` em `onPointerDown` + `onAuxClick` (cobre clique do meio, antecipa unload). Exemplo de referência: `apps/fidevidraceiro/components/LinkButton.tsx`. Promoted keys (`url`, `label`, `target`, `position`, `value`) viram colunas queryable; outras chaves caem em `blob16` (rest_json) sem agregação direta.

**Ao adicionar novo widget**: criar fetcher em `lib/tracker-client.ts` no mesmo padrão (server-only, revalidate 60s, fallback erro vazio); criar tipo em `lib/types.ts`; criar componente RSC em `components/`; envolver em `<Suspense>` no `page.tsx` (cada widget streama independente). Não importar Tailwind — usar classes `.trk-*` ou estender `dashboard.css`.

### Gotchas operacionais (ler antes de mexer em Payload)

1. **Imports no `payload.config.ts` são sem extensão** (`./collections/Authors`). `.ts` e `.js` quebram Next em typecheck/webpack. Consequência: o wrapper `npx payload …` quebra com `ERR_REQUIRE_ASYNC_MODULE` (TLA do `lexical`). **Usar sempre** `node --import tsx/esm ./node_modules/payload/dist/bin/index.js <cmd>`.
2. **Hooks que usam `next/cache`** precisam de `const { revalidateTag } = await import('next/cache')` dentro do callback — import top-level quebra a CLI. Ver `collections/Posts.ts`.
3. **`lib/content.ts` não silencia erros com try/catch** — erros de DB sobem para o handler do Next (500 em runtime, falha no build). Não reverter para try/catch em "proteção" — blog vazio silencioso é pior que erro visível.
4. **Schema `payload` é pushado automaticamente no primeiro boot em dev**. Se precisar recriar o schema do zero (DB novo ou sujo), seguir a sequência documentada na Lição 6 do `PAYLOAD_RUNBOOK.md` (drop + drizzle-kit migrate + `npm run dev` + `curl /admin`).
5. **`importMap.js` precisa estar populado para o `/admin` funcionar em runtime.** Se ficar vazio (`export const importMap = {}`), o `/admin` responde mas crasha em SSR com `TypeError: Cannot read properties of undefined (reading 'call')` no `webpack-runtime.js` — o plugin multi-tenant tenta consumir entries (TenantSelectionProvider, TenantSelector, etc.) e encontra `undefined`. **Fix**: rodar `npm run dev` uma vez — o próprio dev server regenera o arquivo com todas as entries necessárias (Lexical features, multi-tenant, Vercel Blob client uploads). O CLI `generate:importmap` standalone (via `node --import tsx/esm …`) tende a não popular nada; confiar no `npm run dev`.
6. **Layout split entre site e admin é obrigatório**. O root `app/layout.tsx` **não pode** importar `globals.css` nem aplicar classes globais (`dark`, fontes, etc.) — qualquer `@tailwind base` ou `body { color }` vaza pro admin e quebra a UI do Payload (inputs pretos em fundo claro, labels invisíveis). Estilos do site moram em `app/(site)/layout.tsx`, embrulhados num `<div>` com classes/fontes.
7. **Access control defensivo**: ao adicionar uma nova Collection tenant-scoped, copiar o padrão de `collections/Posts.ts`/`Categories.ts`/`Authors.ts` — `read/create/update/delete: ({req}) => !!req.user`. O filtro de tenant do plugin multi-tenant **só** é aplicado quando `req.user` existe, então `read: () => true` vaza dados entre tenants via REST anônimo. Site público sempre via Local API com `overrideAccess: true`.
8. **Geração da análise via `after()`**: `POST /api/aplicacao` agenda `gerarAnaliseEmBackground(id)` via `after()` do `next/server` — roda fora do response cycle mas dentro do budget da função serverless. Não trocar por `await` (deixaria o cliente esperando ~30s) nem voltar pra fire-and-forget puro (Vercel pode cortar antes do gateway responder).

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

# 6. Logout/login no admin (JWT pega role nova). Os tenants oficiais são populados
#    via script idempotente (slugs: futurah, augusto-felipe, fi-de-vidraceiro):
npx tsx scripts/seed-tenants.ts
#    Roda upsert por slug via SQL direto (mantém customizações de name/domain já existentes).
#    Requer DATABASE_URL no .env.local (vercel env pull) — apagar o .env.local depois.
#
#    NOTA: NÃO use `node --import tsx/esm scripts/<x>.ts` em scripts custom que
#    importem payload.config — quebra com ERR_REQUIRE_CYCLE_MODULE pelo TLA do
#    Lexical. `npx tsx` lida com isso. O pattern `node --import tsx/esm` continua
#    válido apenas pra CLIs nativas do Payload (`generate:types`, etc.).
```

Em prod, o mesmo fluxo no primeiro deploy Vercel: abrir `<preview-url>/admin`, criar user, rodar o `UPDATE` via Supabase SQL Editor, e rodar `seed-tenants.ts` localmente apontando pro Postgres de produção.
