# Plano de Migração — Painel Admin Unificado com Payload 3

Plano de substituir o setup atual de **Sanity + Supabase Studio** por um **painel admin unificado com Payload 3 + multi-tenant** que cobre blog, leads, newsletter e pipeline de análises — para todos os clientes da Futurah num painel só. Este documento tem prazo de validade: após a Fase 5 concluída, será substituído por um `PAYLOAD.md` de steady-state (e este vira arquivo arquivado).

**Contexto do negócio.** Futurah é uma **agência de infoprodução AI-first** — não é SaaS. O admin é **interno da Futurah** (equipe não se autoatende via self-service), e serve pra operar **o blog da própria Futurah + os ativos digitais de cada cliente contratante** (leads de funis, análises geradas por IA, possivelmente blogs dos clientes). Primeiro cliente já fechado; plano precisa nascer multi-tenant pra escalar pros próximos sem refactor.

**Status:** rascunho — aguardando resolução das [decisões pendentes](#decisões-pendentes-resolver-antes-de-começar) antes de abrir branch.

---

## 1. Objetivo

Consolidar em um único painel admin, no domínio da Futurah, **com design/auth próprios e isolamento por tenant**:

- **Blog** — posts, categorias, autores (hoje no Sanity, parcialmente ligado em `app/(site)/blog/`). Tenant próprio "futurah"; clientes podem ter seus próprios blogs se contratarem.
- **Leads** — capturas de formulários (hoje genéricos em `leads` via Drizzle). **Tenant-scoped** — cada cliente vê só os próprios leads.
- **Newsletter** — inscritos (hoje global em `newsletter_subscribers`). Tenant-scoped se cada cliente tiver sua própria; global se é só a da Futurah.
- **Análises** — pipeline completo (`pendente_dados → scraping → gerando → pendente_revisao → publicada → falhou`), hoje em `analises` via Drizzle, sem UI de revisão. **Tenant-scoped** por cliente.

Resultado esperado: equipe da Futurah entra em `/admin`, escolhe o tenant (Futurah ou cliente X), vê os 4 domínios scopeados, com workflows customizados (botão "aprovar análise", export CSV de leads do tenant, etc).

## 2. Estado atual (baseline)

- **Sanity parcialmente instalado.** Studio embutido em `app/admin/[[...index]]/page.tsx`, schemas em `sanity/schema/*`, libs em `lib/sanity.ts` + `lib/sanity-server.ts`. Blog renderiza em `app/(site)/blog/`. Pasta `sanity-studio/` standalone é **duplicada** (tem schemas próprios que podem ter divergido).
- **Drizzle + Supabase em produção.** Schema em `lib/db/schema.ts` com 4 tabelas (`analises`, `leads`, `newsletter_subscribers`, `analise_eventos`).
- **`SANITY.md` está desatualizado.** Descreve modelo híbrido Sanity/Keystatic que foi removido no commit `ab5d3c9`. `lib/content.ts` hardcoda `isSanityCMS() { return true }`.
- **`content/posts/*.md` + `content/categories/*.json`** são órfãos do Keystatic removido. Sem código referenciando.
- **Auth do admin atual.** `/admin` é rota pública — só o Studio do Sanity tem auth interna. Qualquer pessoa com o URL acessa a rota (Studio bloqueia o uso, mas a rota em si não está protegida).
- **5 arquivos `build_err*.log` + `build-error*.log` na raiz** — indicam builds quebrados recentes. Precisa investigar antes de adicionar Payload por cima.
- **Blog sem SEO técnico.** Não existe sitemap dinâmico de posts, nem feed RSS, nem JSON-LD Article. `app/sitemap.ts` só cobre páginas estáticas.

## 3. Decisão de arquitetura

**Payload 3 + `@payloadcms/plugin-multi-tenant`** (self-hosted dentro do próprio Next app), com **Drizzle adapter** apontando pro **mesmo Supabase**. Dois schemas lado a lado no Postgres:

- `public` → tabelas Drizzle existentes (preservadas ou migradas, ver Fase 3 e 4)
- `payload` → tabelas que o Payload gerencia (Collections novas, todas com coluna `tenant_id`)

### Modelo multi-tenant

- **Collection `Tenants`** — cada registro representa um cliente da Futurah (primeiro registro = tenant "Futurah", depois cada cliente contratante vira 1 tenant). Campos: `name`, `slug`, `domain` (opcional), `logoUrl`, `createdAt`.
- **Collections tenant-scoped:** `Leads`, `NewsletterSubscribers` (se escopo por cliente), `Analises`, `Posts` (quando cliente tiver blog próprio), `Categories`, `Authors`.
- **Collections globais:** `Users` (equipe interna Futurah), `Media` (upload de imagens reutilizáveis). Users têm um campo `tenants` (array de relations) que define a quais tenants aquele user tem acesso — superadmin da Futurah vê todos; um futuro user por cliente (se precisar) vê só o próprio.
- **Resolução de tenant no admin:** seletor no topo do painel (padrão do plugin).
- **Resolução de tenant no site público:** por domínio (`host` header) OU por path prefix (`/c/[slug]`). **Decisão pendente** — ver [item 4.4](#44-resolução-de-tenant-no-site-público).

Rationale:

- **Zero custo recorrente** (vs Sanity Growth $99/mês ou Contentful $300/mês) — mesmo com multi-tenant.
- **Mesmo banco** — não cria silo. Pode cruzar posts/leads/análises em queries futuras.
- **TypeScript end-to-end** — Collections são definidas em TS, tipos gerados automaticamente.
- **Admin panel embutido** — `/admin` vira Payload admin, substituindo o Studio do Sanity.
- **Hooks programáveis** — permite workflows custom (ex: aprovar análise, disparar scraping).
- **Lock-in baixo** — Collections são declarativas; migrar pra fora = script de export.
- **Nasce multi-tenant** — adicionar cliente novo = criar registro em `Tenants`, não refactor.

## 4. Decisões pendentes (resolver antes de começar)

Essas três perguntas bloqueiam o início. Sem respostas, o plano não pode virar código.

### 4.1 Fallback se Fase 0 falhar
Se Payload 3 + Next 15.4 + React 19 + Drizzle coexistência quebrar, qual o plano B?
- **Opção A:** Next 15 + Payload 2.x (sacrifica features novas, mantém plano)
- **Opção B:** Admin custom com shadcn/ui + TanStack Table (mais trabalho, zero dependência externa)
- **Opção C:** Abandonar "admin unificado", usar Supabase Studio pra leads/newsletter + manter Sanity pro blog
- **Recomendação inicial:** decidir por B antes de começar — se Payload não funcionar, não dá pra improvisar.

### 4.2 Análises — migrar pra Collection Payload ou manter em Drizzle?
- **Migrar:** admin UI de graça (CRUD, filtros, workflow), mas exige reescrever o pipeline de scraping/geração e converter jsonb de `conteudo` no rich text do Payload.
- **Manter:** pipeline existente preservado, mas admin de análises vira **custom page** no Payload (mais trabalho, ~2-3 dias extras, UI menos polida).
- **Recomendação inicial:** manter em Drizzle + custom admin page. O pipeline de análises é complexo demais pra ser reescrito num projeto de "troca de admin".

### 4.3 Migração de conteúdo do Sanity
- Tem posts reais publicados no Sanity hoje, ou o dataset está vazio?
- Se tem: rodar `sanity dataset export`, converter Portable Text → Lexical (formato do Payload 3) via script. Todos os posts existentes viram do tenant "Futurah".
- Se vazio: apagar Sanity direto, começar do zero no Payload.
- **Ação:** verificar no painel sanity.io/manage antes de iniciar Fase 2.

### 4.4 Resolução de tenant no site público
Como o front `(site)` sabe de qual tenant puxar os dados?

- **Opção A — Por domínio.** `futurah.com.br` → tenant Futurah, `haytarzan.com.br` → tenant Haytarzan. Requer: comprar/configurar domínios dos clientes, apontar pra Vercel, middleware que lê `host` e seta contexto. **Mais profissional, exige operação de DNS por cliente.**
- **Opção B — Por path prefix.** `futurah.com.br/c/haytarzan/blog`, `futurah.com.br/c/carlos/funil`. Requer: route group `(client)/c/[tenant]/*` duplicando estrutura do site. **Mais simples de operar, URL menos clean.**
- **Opção C — Híbrido.** Blog da Futurah em `futurah.com.br/blog`. Blogs/funis de clientes em subdomínio ou domínio próprio. **Recomendação:** começa A só pra Futurah, adiciona domain-per-client quando 2º cliente vier.
- **Ação:** responder antes da Fase 2 (blog migra já no modelo definido).

### 4.5 Escopo de leads e newsletter
- **Leads** do form de contato da homepage Futurah → tenant Futurah (captura de clientes pra agência).
- **Leads** de funis que a Futurah opera pra clientes → tenant do cliente (ex: leads do funil do Haytarzan caem no tenant "haytarzan").
- **Newsletter** — é só uma (newsletter da Futurah) ou cada cliente tem a sua? **Recomendação inicial:** só Futurah; deixar Collection global ou fixar no tenant Futurah.
- **Ação:** confirmar antes da Fase 3.

### 4.6 Users e permissões
- Quem acessa o admin? Só fundador? Equipe interna (2-5 pessoas)? Algum cliente eventualmente?
- **Recomendação inicial:** só equipe Futurah, todos superadmin (acesso a todos os tenants). Adicionar permissões por tenant só quando um cliente explicitamente pedir acesso.
- **Ação:** listar emails dos users iniciais antes da Fase 1.

---

## 5. Fases

### Fase 0 — Validação de compat **(0.5 dia, obrigatória)**

**Branch:** `payload-poc` (throwaway).

**Objetivo:** provar que Payload 3 + Next 15.4 + React 19 + Drizzle coexistem no mesmo repo antes de investir nas outras fases.

**Tarefas:**
1. Rodar `npm run build` no estado atual. Corrigir os `build_err*.log` pendentes ou confirmar que são lixo antigo.
2. Criar branch `payload-poc`.
3. Instalar `payload`, `@payloadcms/next`, `@payloadcms/db-postgres`, `@payloadcms/richtext-lexical`.
4. Criar `payload.config.ts` mínimo com 1 Collection dummy (`TestCollection` com 1 campo `title`).
5. Montar admin em `app/(payload)/admin/` (route group separado).
6. Rodar `npm run dev`, criar 1 entry via admin, confirmar que persiste no Postgres.
7. Rodar `npm run build` e deploy preview na Vercel — confirmar que nenhuma rota do site quebra.

**Critério de sucesso:** build passa, admin abre em `/admin`, CRUD funciona, rotas públicas do `(site)` continuam renderizando.

**Se falhar:** aplicar Opção B do [item 4.1](#41-fallback-se-fase-0-falhar). Branch descartável.

**Risco:** `use-effect-event` em `package.json` é pacote polyfill do React 19 — pode conflitar com peer deps do Payload.

### Fase 1 — Fundação Payload + Multi-tenant **(2-3 dias)**

**Branch:** `payload-foundation` (a partir de `main`, depois de Fase 0 validada).

**Objetivo:** Payload rodando em produção com admin vazio **já multi-tenant**, sem quebrar nada do site atual.

**Tarefas:**
1. Copiar config da Fase 0 (validada) pra branch definitiva.
2. Configurar schema separado no Postgres: Payload no schema `payload`, Drizzle continua no `public`. Docs: [Payload Postgres adapter schema config](https://payloadcms.com/docs/database/postgres).
3. Instalar `@payloadcms/plugin-multi-tenant` e configurar no `payload.config.ts`. Docs: [Multi-Tenant Plugin](https://payloadcms.com/docs/plugins/multi-tenant).
4. Criar Collection `Tenants` (global, não tenant-scoped): `name`, `slug` (auto), `domain` (opcional, pra resolução por host), `logoUrl`. Seed inicial: 1 tenant "Futurah" + 1 tenant do primeiro cliente.
5. Configurar `Users` Collection (auth do Payload) com campo `tenants` (relationship many) + campo `role` (`superadmin | tenant_admin`). Superadmin vê todos os tenants; tenant_admin vê só os tenants na lista dele. Seed inicial: emails da equipe Futurah como superadmin (ver [item 4.6](#46-users-e-permissões)).
6. Decidir e implementar **coexistência de rotas `/admin`**:
   - O Sanity Studio está em `app/admin/[[...index]]/page.tsx`.
   - Payload admin vai em `app/(payload)/admin/...` via route group próprio OU substitui `/admin` diretamente.
   - **Recomendação:** usar route group `(payload)` e manter path `/admin` — quando Sanity sair (Fase 2), deleta o arquivo antigo.
7. Implementar seletor de tenant no admin (já vem no plugin, só confirmar exibição).
8. Deploy na Vercel. Confirmar cold start aceitável (Payload admin é bundle grande — se passar de 3s, investigar lazy loading).
9. Commit + merge em `main`. A partir daqui, admin coexiste com Sanity.

**Risco:** admin em mesmo deploy aumenta tamanho de bundle da Vercel. Se bater limite de função serverless, mover admin pra deploy separado (subdomain `admin.futurah.com.br`).

### Fase 2 — Blog no Payload **(1-2 dias)**

**Branch:** `payload-blog`.

**Objetivo:** Blog migrado integralmente do Sanity pro Payload. Sanity desinstalado.

**Tarefas:**
1. Criar Collections no Payload (todas tenant-scoped exceto `Media`):
   - `Categories` (tenant-scoped) — name, slug (auto), description
   - `Authors` (tenant-scoped) — name, slug, bio, avatar (relationship com Media)
   - `Media` (global) — upload de imagens (adapter Vercel Blob OU Supabase Storage — **decidir**)
   - `Posts` (tenant-scoped) — title, slug, excerpt, cover (upload), category (ref), authors (ref many), featured (bool), publishedAt, content (Lexical rich text)
2. **Se [item 4.3](#43-migração-de-conteúdo-do-sanity) indicar conteúdo real no Sanity:** rodar `npx sanity dataset export production` + script de conversão Portable Text → Lexical JSON (biblioteca candidata: `@portabletext/toolkit` + adapter custom). Importar via Payload Local API. **Caso contrário:** pular.
3. Reescrever `lib/content.ts` pra apontar pras queries do Payload (Local API no server, REST API em client se necessário). Função precisa receber (ou resolver via middleware) o `tenantSlug` atual — se é `futurah.com.br`, filtra por tenant Futurah.
4. Substituir `components/blog/PortableText.tsx` por renderer do Lexical. Biblioteca: `@payloadcms/richtext-lexical/react` (renderer oficial do Payload 3).
5. Atualizar `components/sections/BlogSection.tsx` se necessário (tipos mudam).
6. **Cleanup do Sanity:**
   - `npm uninstall sanity next-sanity @portabletext/react @portabletext/types @sanity/image-url`
   - `rm -rf sanity/ sanity-studio/`
   - `rm app/admin/[[...index]]/page.tsx` (era o Studio Sanity)
   - `rm lib/sanity.ts lib/sanity-server.ts`
   - `rm SANITY.md` (ou mover pra `docs/archive/`)
   - `rm -rf content/posts/ content/categories/` (órfãos Keystatic)
7. Testar todas as rotas do blog (`/blog`, `/blog/[slug]`, `/blog/category/[slug]`) com conteúdo real.

**Risco:** `force-static` nas rotas do blog vai travar atualização de posts. Trocar por `revalidateTag` + webhook do Payload (hooks `afterChange` na Collection Posts).

**Decisão de upload:** Vercel Blob é mais fácil (SDK nativo, $0.15/GB); Supabase Storage é mais barato se volume alto (já contratado). Recomendação: **Vercel Blob** no curto prazo, migrar se crescer.

### Fase 3 — Leads + Newsletter **(1-1.5 dia)**

**Branch:** `payload-leads-newsletter`.

**Objetivo:** tabelas `leads` e `newsletter_subscribers` viram Collections do Payload, tenant-scoped conforme [item 4.5](#45-escopo-de-leads-e-newsletter). Admin UI de graça.

**Tarefas:**
1. Criar Collections:
   - `Leads` (tenant-scoped) — nome, email, social, origem, receivedAt (auto). Expor no admin como read-only + delete + export. Admin filtra por tenant automaticamente.
   - `NewsletterSubscribers` — email (unique **por tenant** se scopeado, ou global se for só Futurah), subscribedAt, unsubscribedAt. Admin com botão "marcar como unsubscribed".
2. **Migração de dados:**
   - Payload gerenciará essas tabelas no schema `payload.leads` e `payload.newsletter_subscribers`, com coluna `tenant_id`.
   - Script `scripts/migrate-leads.ts`: copia de `public.leads` → `payload.leads` via Payload Local API (1x). Todos os leads existentes viram do tenant Futurah (captura pre-multi-tenant).
   - Script equivalente pra newsletter.
   - Deletar tabelas `public.leads` e `public.newsletter_subscribers` do Drizzle (remover do `lib/db/schema.ts`, gerar migration).
3. **Rewrite de API routes:**
   - `app/api/contact/route.ts` — trocar insert Drizzle por `payload.create({ collection: 'leads', data: { ..., tenant: tenantId } })`. Resolver `tenantId` via middleware (host → tenant) ou por query param na request.
   - `app/api/newsletter/route.ts` — idem.
   - **Novas rotas por cliente** (se funis de cliente entrarem): `app/api/[tenant]/contact/route.ts` ou resolução por domínio.
4. Confirmar no admin do Payload que leads novos caem no tenant certo (teste: submeter do domínio Futurah → vira no tenant Futurah; submeter de cliente → vira no tenant cliente).

**Risco:** se as tabelas atuais têm dados reais de produção, backup antes da migração. Dump completo via `pg_dump` como safety net.

### Fase 4 — Análises **(2-3 dias)**

**Branch:** `payload-analises`.

**Objetivo:** admin de análises funcional, com workflow de aprovação. Baseado na [decisão 4.2](#42-análises--migrar-pra-collection-payload-ou-manter-em-drizzle):

#### Caminho A — Manter em Drizzle + Custom Admin View (**recomendação inicial**)

1. **Adicionar coluna `tenant_id`** em `public.analises` e `public.analise_eventos` via migration Drizzle. Backfill: todas as análises existentes → tenant Futurah (ou tenant do primeiro cliente, se já tiverem sido geradas pra ele).
2. Criar página custom no Payload admin: `app/(payload)/admin/custom/analises/page.tsx` (Payload 3 suporta views custom via `admin.components.views`).
3. Usar shadcn/ui ou componentes do Payload pra construir:
   - Tabela de análises com filtro por status **+ filtro por tenant** (respeita seletor global de tenant do Payload)
   - Preview do conteúdo (jsonb `conteudo`)
   - Botão "aprovar" (transição `pendente_revisao → publicada`)
   - Botão "rejeitar" (transição → `falhou`)
   - Botão "reenviar pra scraping"
4. Endpoints auxiliares: criar REST endpoints customizados no Payload (`endpoints: [...]` no config) que leem/escrevem na tabela Drizzle `public.analises`, **sempre filtrando por `tenant_id`** conforme o tenant ativo do user logado.
5. `analise_eventos` continua intacta em Drizzle (com `tenant_id` herdado da análise pai) — admin tem aba "Eventos" por análise (read-only).
6. Pipeline de scraping/geração segue igual, **só precisa escrever `tenant_id`** ao criar análise nova (definido pela rota de API que recebe o form).

**Estimativa:** 2-3 dias.

#### Caminho B — Migrar pra Collection Payload

1. Criar Collection `Analises` replicando todos os campos do schema Drizzle.
2. Converter `conteudo` (jsonb free-form hoje) num tipo estruturado — exige analisar o formato real gerado pelo pipeline de IA e decidir se vira Lexical rich text ou permanece jsonb.
3. Migrar dados via script (análogo à Fase 3).
4. Reescrever rotas de API (`app/api/aplicacao/*`) pra usar Payload Local API.
5. Reescrever pipeline de scraping/geração IA pra disparar via `afterCreate` hook do Payload.
6. `analise_eventos` também vira Collection (ou permanece Drizzle com relação custom).

**Estimativa:** 4-5 dias (o dobro). Só vale se for pra fazer refactoring grande do pipeline de qualquer jeito.

**Decisão padrão:** Caminho A, a menos que a decisão 4.2 mude.

### Fase 5 — Cleanup + SEO técnico **(0.5-1 dia)**

**Branch:** `payload-polish`.

**Tarefas:**
1. Reescrever `CLAUDE.md`:
   - Remover seção sobre Sanity
   - Adicionar seção "Admin Payload" com estrutura de Collections, como rodar local, como adicionar Collection nova
   - Apontar pro `PAYLOAD.md` (steady-state, substitui este `PAYLOAD_MIGRATION.md`)
2. Criar `PAYLOAD.md` (steady-state) — como operar o admin, onde mexer, convenções.
3. Deletar `SANITY.md` (ou mover pra `docs/archive/`).
4. Arquivar este plano: mover `PAYLOAD_MIGRATION.md` → `docs/archive/payload-migration-2026-04.md`.
5. **SEO técnico do blog** (hoje inexistente):
   - `app/sitemap.ts` — incluir posts dinâmicos
   - `app/feed.xml/route.ts` — RSS feed
   - `app/(site)/blog/[slug]/page.tsx` — adicionar JSON-LD Article schema
6. Remover `build_err*.log`, `build-error*.log` da raiz (depois de confirmar que são lixo).
7. Confirmar que `/admin` tem auth obrigatória (Payload resolve isso nativamente, mas validar em preview deploy).

---

## 6. Fallbacks

| Gatilho | Fallback |
|---|---|
| Fase 0 quebra (Payload 3 incompat) | Admin custom com shadcn + TanStack Table ([item 4.1](#41-fallback-se-fase-0-falhar)) |
| Payload admin cold-start > 3s em Vercel | Mover admin pra deploy separado (subdomain `admin.futurah.com.br`) |
| Conversão Portable Text → Lexical trava | Começar blog zerado no Payload; exportar Sanity pra JSON e arquivar |
| Migração de leads corrompe dados | Rollback via `pg_dump` feito antes da Fase 3 |
| Fase 4 Caminho A inviável por features que faltam no Payload | Construir admin de análises como rota separada do Next (não dentro do Payload) |

## 7. Arquivos críticos

Ordem de prioridade (editar/criar durante as fases):

- `payload.config.ts` — raiz, nova. Config principal do Payload.
- `app/(payload)/admin/[[...segments]]/page.tsx` — nova. Ponto de entrada do admin.
- `collections/*.ts` — novas. Definições de Posts, Categories, Authors, Media, Leads, NewsletterSubscribers, Users.
- `lib/content.ts` — **substituir** implementação Sanity por Payload Local API.
- `components/blog/PortableText.tsx` — **substituir** renderer Portable Text por renderer Lexical.
- `app/api/contact/route.ts` — Fase 3.
- `app/api/newsletter/route.ts` — Fase 3.
- `lib/db/schema.ts` — Fase 3 remove `leads` e `newsletter_subscribers`; Fase 4 (Caminho A) mantém `analises`.
- `app/sitemap.ts`, `app/feed.xml/route.ts` — Fase 5.
- `CLAUDE.md`, `PAYLOAD.md` (novo), `SANITY.md` (deletar) — Fase 5.

## 8. Pesquisa aberta

Itens que precisam ser verificados durante a Fase 0 ou antes:

- [Payload 3 docs — Next.js integration](https://payloadcms.com/docs/getting-started/installation) — confirmar passo a passo com App Router.
- Compatibilidade com **React 19**. Payload 3 foi lançado pensando em React 18; verificar se há issues abertas no GitHub do Payload (`@payloadcms/next`).
- Compatibilidade com **Next 15.4**. Idem.
- **Postgres adapter**: `@payloadcms/db-postgres` usa Drizzle internamente — confirmar se dá pra apontar pra schema específico (`payload`) sem conflitar com o Drizzle nativo do projeto.
- **Lexical rich text**: estrutura JSON serializada. Se for preciso converter Portable Text → Lexical, avaliar bibliotecas existentes ou escrever adapter custom.
- **Upload adapter**: `@payloadcms/storage-vercel-blob` vs `@payloadcms/storage-s3` (Supabase Storage é S3-compatible). Verificar SDKs oficiais.
- **Auth**: cookie-based ou JWT? Consequências pra Vercel deploy.
- **Preview** de posts do blog antes de publicar: feature nativa do Payload (Draft Preview) — confirmar setup.

## 9. Checklist de pronto (Definition of Done)

Este plano só é considerado executado quando:

- [ ] `/admin` exige login, bloqueia acesso anônimo
- [ ] Admin mostra seletor de tenant no topo, com "Futurah" + 1º cliente listados
- [ ] Criar post no tenant Futurah publica em `futurah.com.br/blog`; criar no tenant cliente publica no domínio/path do cliente
- [ ] `/blog` renderiza posts do Payload (Sanity totalmente removido)
- [ ] Lead submetido no site Futurah cai só no tenant Futurah; lead submetido em funil de cliente cai só no tenant do cliente
- [ ] Admin de análises mostra só análises do tenant ativo; trocar tenant troca a lista
- [ ] User tenant_admin de um cliente não consegue ver dados de outro tenant
- [ ] Admin de análises lista registros, permite aprovar/rejeitar, e a transição de status persiste
- [ ] Pipeline de scraping/geração IA continua funcionando como antes, respeitando `tenant_id`
- [ ] `npm run build` passa em CI (Vercel)
- [ ] Sitemap inclui posts, `/feed.xml` gera RSS válido, posts têm JSON-LD Article
- [ ] `CLAUDE.md` atualizado, `PAYLOAD.md` criado, `SANITY.md` removido, `build_err*.log` limpos

## 10. Cronograma total

Somando otimista e pessimista (já incluindo multi-tenant):

| Fase | Otimista | Pessimista |
|---|---|---|
| 0 | 0.5 dia | 1 dia |
| 1 (+ multi-tenant) | 2 dias | 3 dias |
| 2 | 1 dia | 2 dias |
| 3 | 1 dia | 1.5 dia |
| 4 (Caminho A) | 2 dias | 3 dias |
| 5 | 0.5 dia | 1 dia |
| **Total** | **~7 dias** | **~11.5 dias** |

Fase 4 Caminho B adiciona 2-3 dias. Fallbacks podem adicionar 2-5 dias extras. Resolução de domínio por cliente (opção A do [item 4.4](#44-resolução-de-tenant-no-site-público)) adiciona 0.5-1 dia por cliente novo (DNS + Vercel config), não por feature.

## 11. Perguntas de operação (futuro, não bloqueiam Fase 0-5)

Pra planejar a partir do 2º cliente:

- Cada cliente novo tem domínio próprio? Quem compra e configura DNS?
- Funil de leads de cliente: Futurah opera 100% ou cliente também edita copy?
- Blog de cliente: se oferecido, conteúdo é gerado por IA e revisado pela Futurah?
- Há algum ativo que foge do modelo tenant (ex: biblioteca compartilhada de modelos de análise, prompts de IA, criativos de ads)? Fica como Collection global ou vive fora do Payload.
- Billing: Futurah cobra por ativos? Precisa tracking por tenant do que foi consumido (análises geradas, DMs respondidas)? Entra como Collection `TenantUsage` futura.
