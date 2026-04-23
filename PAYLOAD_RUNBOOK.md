# Runbook — Migração Payload 3 + Multi-tenant (Fases 0-3)

**Stack-alvo confirmado (via `npm view` em 2026-04-23):** `payload@3.84.1`, `@payloadcms/next@3.84.1`, `@payloadcms/db-postgres@3.84.1`, `@payloadcms/richtext-lexical@3.84.1`, `@payloadcms/plugin-multi-tenant@3.84.1`, `@payloadcms/storage-vercel-blob@3.84.1`. Peer deps de `@payloadcms/next@3.84.1` declaram suporte explícito a `next >=15.4.11 <15.5.0` — bate exato com `next@15.4.11` do projeto.

## Pré-requisitos

- [ ] `git status` limpo ou mudanças pendentes commitadas/stashed. Há mudanças não-commitadas em `components/proposta/*`, `lib/proposta/*`, `next.config.mjs`, `.gitignore`, `CLAUDE.md` — commitar ou stash antes de abrir branch de PoC.
- [ ] `node --version` ≥ 20.9 (Payload 3 requer Node 20+).
- [ ] `npm --version` ≥ 10.
- [ ] Acesso ao painel Vercel do projeto `futura-and-co` (precisa adicionar env vars).
- [ ] Acesso ao Supabase do projeto — precisa criar role/schema `payload`.
- [ ] `DATABASE_URL` em `.env.local` apontando pro Postgres do Supabase, com perfil que tem `CREATE SCHEMA` (ou usar credencial de service_role via connection string separada).
- [ ] Confirmar manualmente em `sanity.io/manage` se o dataset `production` tem posts reais ou está vazio — resposta alimenta decisão 4.3.
- [ ] Credenciais Vercel Blob: criar store de Blob no projeto Vercel e anotar o `BLOB_READ_WRITE_TOKEN` (Settings → Storage → Create Blob → Connect Project — Vercel injeta o token automaticamente em prod; copiar pra `.env.local` pra dev).
- [ ] Lista de emails da equipe Futurah que terá acesso (superadmin) — bloqueia seed de Users (decisão 4.6).

## Decisões que bloqueiam passos específicos

| Decisão (§4 do plano) | Passos bloqueados | Sugestão default pra destravar |
|---|---|---|
| **4.1** Fallback se PoC falhar | 0.x (só como fallback). Se PoC passa, não bloqueia. | Opção B (admin custom com shadcn). Decidir **antes** de iniciar Fase 0 pra não ficar travado se quebrar. |
| **4.2** Análises: Collection vs Drizzle | Fase 4 inteira. Não bloqueia Fases 0-3. | Manter em Drizzle + custom admin view (Caminho A). |
| **4.3** Migração Sanity | 2.4 (script de import). Se dataset vazio, pula import. | Verificar em `sanity.io/manage` **antes** de começar Fase 2. Se tem posts, aceitar 1-2 dias extras pra script de conversão. |
| **4.4** Resolução tenant site público | 2.5 (como `lib/content.ts` resolve tenant), 3.3 (rotas de API por tenant). | Opção C: tenant Futurah via domínio raiz; clientes recebem domínio próprio quando vierem. Até lá, todo conteúdo público = Futurah. |
| **4.5** Escopo leads/newsletter | 3.1 (se Newsletter é global ou tenant-scoped). | Newsletter global (Collection sem `tenant` field). Leads tenant-scoped. |
| **4.6** Users iniciais | 1.8 (seed de superadmins). | Listar emails antes de iniciar Fase 1 — sem isso não dá pra logar no admin. |

---

## Fase 0 — PoC de compat (~0.5 dia)

### Passo 0.1 — Limpar e validar build atual
**Contexto:** 5 arquivos `build_err*.log` + `build-error*.log` indicam quebras antigas; precisa baseline verde antes de injetar Payload.
**Comandos:**
```bash
git -C E:/site-futurah status --short
git -C E:/site-futurah stash push -m "pre-payload-poc" --include-untracked
npm --prefix E:/site-futurah run build
```
**Arquivos a criar/editar:** nenhum.
**Critério de sucesso:** `npm run build` retorna exit 0 sem erros bloqueantes. Os `.log` antigos da raiz podem ser ignorados (só removidos na Fase 5).
**Se falhar:** resolver erros do build primeiro. Não prosseguir pra Payload com Next quebrado.

### Passo 0.2 — Criar branch descartável
**Contexto:** PoC vive em branch que pode ser deletada sem dó.
**Comandos:**
```bash
git -C E:/site-futurah checkout -b payload-poc
```
**Critério de sucesso:** `git branch --show-current` = `payload-poc`.

### Passo 0.3 — Instalar Payload 3 e dependências core
**Contexto:** `@payloadcms/next@3.84.1` tem peer range que casa exato com `next@15.4.11`. Usamos `--legacy-peer-deps` porque o projeto tem `react@19.2.3` + `use-effect-event` (polyfill) que pode disparar warning cosmético.
**Comandos:**
```bash
npm --prefix E:/site-futurah install \
  payload@3.84.1 \
  @payloadcms/next@3.84.1 \
  @payloadcms/db-postgres@3.84.1 \
  @payloadcms/richtext-lexical@3.84.1 \
  --legacy-peer-deps
```
**Arquivos a criar/editar:** `package.json`, `package-lock.json` (automático).
**Critério de sucesso:** `npm ls payload @payloadcms/next @payloadcms/db-postgres @payloadcms/richtext-lexical` mostra todas em `3.84.1` sem `invalid` ou `UNMET PEER`.
**Se falhar:** se `ERESOLVE` bloquear, tentar `npm install ... --force`; se ainda quebrar, aplicar decisão 4.1 (Opção B).

### Passo 0.4 — Adicionar `PAYLOAD_SECRET` ao `.env.local`
**Contexto:** Payload exige um segredo pra assinar JWTs de auth. Vale 1 string aleatória de 32+ chars.
**Comandos:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
**Arquivos a criar/editar:** `E:/site-futurah/.env.local` — adicionar (valor gerado acima):
```
PAYLOAD_SECRET=<cole_aqui_o_hex_de_64_chars>
```
**Critério de sucesso:** `grep PAYLOAD_SECRET E:/site-futurah/.env.local` retorna a linha.

### Passo 0.5 — Criar `payload.config.ts` mínimo com Collection dummy
**Contexto:** valida que Payload sobe, abre admin e persiste no Postgres sem precisar de multi-tenant ainda.
**Arquivos a criar/editar:** `E:/site-futurah/payload.config.ts`.
**Snippet:**
```ts
// payload.config.ts — versão MÍNIMA (só pra PoC da Fase 0)
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: 'users',
  },
  collections: [
    {
      slug: 'users',
      auth: true,
      fields: [{ name: 'name', type: 'text' }],
    },
    {
      slug: 'test-collection',
      fields: [{ name: 'title', type: 'text', required: true }],
    },
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL },
    schemaName: 'payload',
  }),
  sharp,
})
```
**Critério de sucesso:** arquivo existe e não tem erros de import (TS).

### Passo 0.6 — Criar schema `payload` no Postgres
**Contexto:** o adapter vai criar as tabelas dele no schema `payload`, isolado do schema `public` onde o Drizzle opera.
**Comandos:**
```bash
psql "$DATABASE_URL" -c "CREATE SCHEMA IF NOT EXISTS payload;"
```
> Se `psql` não estiver no PATH em Windows, rodar o mesmo SQL no Supabase SQL Editor.

**Verificação:**
```bash
psql "$DATABASE_URL" -c "\dn" | grep payload
```
**Critério de sucesso:** schema `payload` listado.

### Passo 0.7 — Adicionar alias `@payload-config` no `tsconfig.json`
**Contexto:** arquivos do admin (`app/(payload)/*`) importam de `@payload-config` pra localizar o config.
**Arquivos a criar/editar:** `E:/site-futurah/tsconfig.json` — adicionar em `compilerOptions.paths`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"],
      "@payload-config": ["./payload.config.ts"]
    }
  }
}
```
**Critério de sucesso:** `tsc --noEmit` (ou o lint do Next) não reclama do import `@payload-config`.

### Passo 0.8 — Criar estrutura `app/(payload)/` (arquivos gerados)
**Contexto:** Payload 3 se hospeda dentro do Next via route group dedicado. Arquivos são **auto-gerados** e não devem ser editados à mão — copiamos do template `blank`.
**Arquivos a criar:**
- `app/(payload)/layout.tsx`
- `app/(payload)/admin/[[...segments]]/page.tsx`
- `app/(payload)/admin/[[...segments]]/not-found.tsx`
- `app/(payload)/admin/importMap.js` (auto-gerado pelo CLI no passo seguinte)
- `app/(payload)/api/[...slug]/route.ts`
- `app/(payload)/api/graphql/route.ts`
- `app/(payload)/api/graphql-playground/route.ts`
- `app/(payload)/custom.scss` (vazio; Payload permite overrides)

**Snippet — `app/(payload)/layout.tsx`:**
```tsx
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config'
import '@payloadcms/next/css'
import type { ServerFunctionClient } from 'payload'
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'
import React from 'react'

import { importMap } from './admin/importMap.js'
import './custom.scss'

type Args = { children: React.ReactNode }

const serverFunction: ServerFunctionClient = async function (args) {
  'use server'
  return handleServerFunctions({ ...args, config, importMap })
}

const Layout = ({ children }: Args) => (
  <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
    {children}
  </RootLayout>
)

export default Layout
```

**Snippet — `app/(payload)/admin/[[...segments]]/page.tsx`:**
```tsx
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import type { Metadata } from 'next'
import config from '@payload-config'
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import { importMap } from '../importMap.js'

type Args = {
  params: Promise<{ segments: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] }>
}

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams })

const Page = ({ params, searchParams }: Args) =>
  RootPage({ config, params, searchParams, importMap })

export default Page
```

**Snippet — `app/(payload)/admin/[[...segments]]/not-found.tsx`:**
```tsx
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import type { Metadata } from 'next'
import config from '@payload-config'
import { NotFoundPage, generatePageMetadata } from '@payloadcms/next/views'
import { importMap } from '../importMap.js'

type Args = {
  params: Promise<{ segments: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] }>
}

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams })

const NotFound = ({ params, searchParams }: Args) =>
  NotFoundPage({ config, params, searchParams, importMap })

export default NotFound
```

**Snippet — `app/(payload)/api/[...slug]/route.ts`:**
```ts
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config'
import '@payloadcms/next/css'
import {
  REST_DELETE, REST_GET, REST_OPTIONS, REST_PATCH, REST_POST, REST_PUT,
} from '@payloadcms/next/routes'

export const GET = REST_GET(config)
export const POST = REST_POST(config)
export const DELETE = REST_DELETE(config)
export const PATCH = REST_PATCH(config)
export const PUT = REST_PUT(config)
export const OPTIONS = REST_OPTIONS(config)
```

**Snippet — `app/(payload)/api/graphql/route.ts`:**
```ts
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config'
import { GRAPHQL_POST, REST_OPTIONS } from '@payloadcms/next/routes'

export const POST = GRAPHQL_POST(config)
export const OPTIONS = REST_OPTIONS(config)
```

**Snippet — `app/(payload)/api/graphql-playground/route.ts`:**
```ts
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config'
import '@payloadcms/next/css'
import { GRAPHQL_PLAYGROUND_GET } from '@payloadcms/next/routes'

export const GET = GRAPHQL_PLAYGROUND_GET(config)
```

**Snippet — `app/(payload)/custom.scss`:**
```scss
/* custom overrides do admin Payload — manter vazio por enquanto */
```

**Critério de sucesso:** todos os arquivos existem. `ls app/(payload)/` mostra `layout.tsx`, `custom.scss`, `admin/`, `api/`.

> ⚠ CONFLITO DE ROTA. O arquivo existente `app/admin/[[...index]]/page.tsx` (Sanity Studio) e o novo `app/(payload)/admin/[[...segments]]/page.tsx` **colidem no path `/admin`**. Na Fase 0 (PoC) vamos resolver temporariamente renomeando o Payload admin:
>
> Na PoC, criar o admin em `app/(payload)/payload-admin/[[...segments]]/page.tsx` (e `not-found.tsx` análogo) — URL fica `/payload-admin`. O Sanity Studio continua em `/admin`. Na Fase 2, quando o Sanity sair, migra pro path `/admin` final.

### Passo 0.9 — Gerar `importMap.js`
**Contexto:** mapa de componentes custom do admin; precisa ser gerado via CLI do Payload a cada mudança de config que adiciona novo componente.
**Comandos:**
```bash
npx --prefix E:/site-futurah payload generate:importmap
```
**Arquivos a criar/editar:** `app/(payload)/admin/importMap.js` (gerado automaticamente).
**Critério de sucesso:** arquivo `app/(payload)/admin/importMap.js` existe e exporta `importMap`. Output do CLI termina com mensagem de sucesso.
**Se falhar:** erro `Cannot find module '@payload-config'` → revisar Passo 0.7. Erro de stack overflow → checar se há import de CSS em código server-only (remover).

### Passo 0.10 — Rodar dev server e criar usuário inicial
**Contexto:** primeiro acesso ao admin cria o root user via wizard.
**Comandos:**
```bash
npm --prefix E:/site-futurah run dev
```
**Verificação:** abrir `http://localhost:3000/payload-admin` no browser. Deve mostrar tela "Create your first user". Criar com email real da equipe e senha forte.
**Critério de sucesso:**
1. Tela de admin carrega em <3s.
2. Após criar user, entra no dashboard.
3. Na sidebar, ver "Users" e "Test Collection".
4. Criar 1 entry em "Test Collection" com `title: "poc"` → salva sem erro.
5. `psql "$DATABASE_URL" -c "SELECT title FROM payload.\"test-collection\" LIMIT 1;"` retorna `poc`.

**Se falhar:**
- `/payload-admin` 404 → conferir nome da pasta em `app/(payload)/`.
- `relation ... does not exist` → o adapter não criou as tabelas; em dev, Payload usa `db push` automático — conferir que user do Postgres tem permissão `CREATE` no schema `payload`.
- Erros React 19 no console → aplicar Opção B da decisão 4.1.

### Passo 0.11 — Rodar build local e deploy preview
**Contexto:** CI da Vercel é o último gate. Bundle do admin é pesado; build tem que terminar em <3min.
**Comandos:**
```bash
npm --prefix E:/site-futurah run build
git -C E:/site-futurah add -A
git -C E:/site-futurah commit -m "poc: payload 3 stub"
git -C E:/site-futurah push -u origin payload-poc
```
**Verificação:** Vercel criou deploy preview. Acessar `<preview-url>/payload-admin`, logar, rodar smoke test igual Passo 0.10. Acessar `<preview-url>/blog` e confirmar que rotas do site continuam renderizando.
**Critério de sucesso:** preview verde + smoke tests ok + `/blog` não regrediu.
**Se falhar:** se build local passou mas Vercel não, diferença é env var — confirmar `DATABASE_URL` e `PAYLOAD_SECRET` no painel Vercel (Production + Preview).

### Passo 0.12 — Decisão de ir pra Fase 1
**Contexto:** PoC válida se 0.10 + 0.11 passaram. Caso contrário, aplicar decisão 4.1.
**Ação:** se tudo verde, `git checkout main` (a branch PoC fica como referência — **não merge**; Fase 1 reescreve a config com multi-tenant).

---

## Fase 1 — Fundação Payload + Multi-tenant (~2-3 dias)

> ⚠ DECISÃO PENDENTE 4.6 — emails dos superadmins. Precisa da lista antes do Passo 1.11 (seed).

### Passo 1.1 — Abrir branch definitiva
**Comandos:**
```bash
git -C E:/site-futurah checkout main
git -C E:/site-futurah checkout -b payload-foundation
```

### Passo 1.2 — Reinstalar Payload com plugin multi-tenant e storage
**Contexto:** instala também `@payloadcms/plugin-multi-tenant` e `@payloadcms/storage-vercel-blob` que serão usados nas Fases 1-2.
**Comandos:**
```bash
npm --prefix E:/site-futurah install \
  payload@3.84.1 \
  @payloadcms/next@3.84.1 \
  @payloadcms/db-postgres@3.84.1 \
  @payloadcms/richtext-lexical@3.84.1 \
  @payloadcms/plugin-multi-tenant@3.84.1 \
  @payloadcms/storage-vercel-blob@3.84.1 \
  --legacy-peer-deps
```
**Critério de sucesso:** `npm ls @payloadcms/plugin-multi-tenant @payloadcms/storage-vercel-blob` mostra ambos em `3.84.1`.

### Passo 1.3 — Replicar estrutura `app/(payload)/` da PoC
**Contexto:** mesmos arquivos da Fase 0 (Passo 0.8), agora no path final `/admin`.
**Ação:** criar a estrutura da Fase 0 Passo 0.8, **mas** com `admin/[[...segments]]/` (não `payload-admin/`). O conflito com Sanity Studio é resolvido no Passo 1.9.

### Passo 1.4 — Criar diretório `collections/` e arquivos de Collection
**Contexto:** cada Collection vira 1 arquivo TS exportando a definição. A raiz `collections/` fica na raiz do repo (junto com `lib/`, `app/`).

### Passo 1.5 — `collections/Tenants.ts`
**Snippet:**
```ts
// collections/Tenants.ts
import type { CollectionConfig } from 'payload'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'domain'],
  },
  access: {
    // Só superadmin cria/edita/deleta tenants
    create: ({ req }) => req.user?.role === 'superadmin',
    update: ({ req }) => req.user?.role === 'superadmin',
    delete: ({ req }) => req.user?.role === 'superadmin',
    read: () => true, // todos os users logados precisam ler pra selector funcionar
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { description: 'Slug único. Ex: "futurah", "haytarzan".' },
    },
    {
      name: 'domain',
      type: 'text',
      admin: { description: 'Domínio raiz do tenant (opcional). Ex: "haytarzan.com.br".' },
    },
    { name: 'logoUrl', type: 'text' },
  ],
}
```

### Passo 1.6 — `collections/Users.ts`
**Contexto:** auth do Payload. Campo `tenants` (array de relations) é injetado automaticamente pelo plugin com `tenantsArrayField.includeDefaultField: true` — **não** declarar aqui.
**Snippet:**
```ts
// collections/Users.ts
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: { useAsTitle: 'email' },
  access: {
    read: ({ req }) => !!req.user,
    create: ({ req }) => req.user?.role === 'superadmin',
    update: ({ req }) => req.user?.role === 'superadmin',
    delete: ({ req }) => req.user?.role === 'superadmin',
  },
  fields: [
    { name: 'name', type: 'text' },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'tenant_admin',
      options: [
        { label: 'Super Admin (Futurah)', value: 'superadmin' },
        { label: 'Tenant Admin', value: 'tenant_admin' },
      ],
    },
    // o campo `tenants` é injetado pelo multiTenantPlugin
  ],
}
```

### Passo 1.7 — Atualizar `payload.config.ts` com plugin multi-tenant e storage Vercel Blob
**Arquivos a criar/editar:** `E:/site-futurah/payload.config.ts` (substituir o da PoC).
**Snippet:**
```ts
// payload.config.ts — versão Fase 1 (multi-tenant + storage pronto)
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'

import { Tenants } from './collections/Tenants'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Posts } from './collections/Posts'
import { Categories } from './collections/Categories'
import { Authors } from './collections/Authors'
import { Leads } from './collections/Leads'
import { NewsletterSubscribers } from './collections/NewsletterSubscribers'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: 'users',
    meta: {
      titleSuffix: '— Futurah Admin',
    },
  },
  collections: [
    Tenants,
    Users,
    Media,
    Posts,
    Categories,
    Authors,
    Leads,
    NewsletterSubscribers,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL },
    schemaName: 'payload',
    migrationDir: path.resolve(dirname, 'payload-migrations'),
  }),
  sharp,
  plugins: [
    multiTenantPlugin({
      tenantsSlug: 'tenants',
      collections: {
        posts: {},
        categories: {},
        authors: {},
        leads: {},
        // newsletter-subscribers NÃO entra aqui — é global (decisão 4.5 default)
      },
      tenantsArrayField: {
        includeDefaultField: true,
        arrayFieldName: 'tenants',
        arrayTenantFieldName: 'tenant',
      },
      userHasAccessToAllTenants: (user) => user?.role === 'superadmin',
    }),
    vercelBlobStorage({
      enabled: true,
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN,
      clientUploads: true, // uploads > 4.5MB direto do browser (limite Vercel)
    }),
  ],
})
```

> ⚠ DECISÃO PENDENTE 4.5 — se Newsletter for tenant-scoped, adicionar `'newsletter-subscribers': {}` ao `collections` do `multiTenantPlugin`.

### Passo 1.8 — Stubs vazios das Collections que o config importa
**Contexto:** `payload.config.ts` importa Posts/Categories/Authors/Media/Leads/NewsletterSubscribers. Fases 2 e 3 preenchem, mas Fase 1 precisa dos arquivos existirem pra config compilar.
**Arquivos a criar:**

`collections/Media.ts`:
```ts
import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: { useAsTitle: 'filename' },
  access: {
    read: () => true, // mídia pública via Vercel Blob
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  upload: {
    mimeTypes: ['image/*', 'video/*', 'application/pdf'],
  },
  fields: [
    { name: 'alt', type: 'text' },
  ],
}
```

`collections/Categories.ts`:
```ts
import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'slug'] },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      index: true,
      admin: { description: 'Slug único dentro do tenant.' },
    },
    { name: 'description', type: 'textarea' },
  ],
}
```

`collections/Authors.ts`:
```ts
import type { CollectionConfig } from 'payload'

export const Authors: CollectionConfig = {
  slug: 'authors',
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'role'] },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, index: true },
    { name: 'role', type: 'text' },
    { name: 'bio', type: 'textarea' },
    { name: 'avatar', type: 'upload', relationTo: 'media' },
  ],
}
```

`collections/Posts.ts` (stub mínimo — Fase 2 expande):
```ts
import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'publishedAt', 'featured'] },
  versions: { drafts: true },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, index: true },
  ],
}
```

`collections/Leads.ts` (stub — Fase 3 expande):
```ts
import type { CollectionConfig } from 'payload'

export const Leads: CollectionConfig = {
  slug: 'leads',
  admin: { useAsTitle: 'email', defaultColumns: ['nome', 'email', 'origem', 'receivedAt'] },
  fields: [
    { name: 'email', type: 'email', required: true },
  ],
}
```

`collections/NewsletterSubscribers.ts` (stub):
```ts
import type { CollectionConfig } from 'payload'

export const NewsletterSubscribers: CollectionConfig = {
  slug: 'newsletter-subscribers',
  admin: { useAsTitle: 'email' },
  fields: [
    { name: 'email', type: 'email', required: true, unique: true },
  ],
}
```

**Critério de sucesso:** `npx payload generate:types` roda sem erro e gera `payload-types.ts`.

### Passo 1.9 — Resolver conflito de rota `/admin` com Sanity Studio
**Contexto:** Sanity Studio fica em `app/admin/[[...index]]/page.tsx`; Payload admin precisa ocupar `/admin` final. Estratégia: **mover Sanity Studio pra path legacy temporário** até Fase 2 removê-lo.
**Comandos (renomear diretório):**
```bash
git -C E:/site-futurah mv app/admin app/sanity-legacy-admin
```
Editar `sanity/sanity.config.ts` — mudar `basePath: '/admin'` para `basePath: '/sanity-legacy-admin'`:
```ts
// sanity/sanity.config.ts — mudança mínima
export default defineConfig({
  // ...
  basePath: '/sanity-legacy-admin', // era '/admin'
  // ...
})
```
**Critério de sucesso:** `/admin` agora é roteado pro Payload (route group `(payload)`); `/sanity-legacy-admin` ainda responde com o Studio pra qualquer revisão de conteúdo legada antes da Fase 2.

### Passo 1.10 — Regenerar importMap e rodar dev
**Comandos:**
```bash
npx --prefix E:/site-futurah payload generate:importmap
npm --prefix E:/site-futurah run dev
```
**Verificação:** abrir `http://localhost:3000/admin`, criar primeiro user (superadmin). Na primeira sessão, ir em **Tenants** → criar:
- `{ name: "Futurah", slug: "futurah" }`
- `{ name: "<1º cliente>", slug: "<slug-cliente>" }` (opcional)

**Critério de sucesso:**
1. Dashboard abre.
2. Sidebar mostra: Tenants, Users, Media, Posts, Categories, Authors, Leads, Newsletter Subscribers.
3. Topo do admin mostra seletor de tenant (injeção do plugin).
4. Consegue criar Tenant, e quando cria Post/Category etc., o campo `tenant` é injetado automaticamente.
5. `psql "$DATABASE_URL" -c "SELECT name, slug FROM payload.tenants;"` retorna 1-2 rows.

**Se falhar:** seletor de tenant não aparece → confirmar que o user criado tem `role=superadmin` no banco. Sem role, o `userHasAccessToAllTenants` retorna false e o plugin esconde o seletor.

### Passo 1.11 — Seed de users superadmin da equipe Futurah
> ⚠ DECISÃO PENDENTE 4.6 — precisa dos emails antes deste passo.

**Contexto:** cada superadmin logam pela primeira vez via "Forgot Password" → email de reset. Criação pode ser feita pelo primeiro user ou via Local API.
**Ação:** no admin, `Users → Create New`, cada email da lista, `role = superadmin`. Depois cada pessoa recebe reset via "Forgot Password".

**Critério de sucesso:** N+1 users existentes (você + equipe), todos com `role=superadmin`.

### Passo 1.12 — Configurar env vars na Vercel
**Contexto:** PAYLOAD_SECRET e BLOB_READ_WRITE_TOKEN precisam existir em Production + Preview.
**Comandos (via `vercel` CLI) — [opcional, pode ser manual]:**
```bash
vercel --cwd E:/site-futurah env add PAYLOAD_SECRET production
vercel --cwd E:/site-futurah env add PAYLOAD_SECRET preview
vercel --cwd E:/site-futurah env add BLOB_READ_WRITE_TOKEN production
vercel --cwd E:/site-futurah env add BLOB_READ_WRITE_TOKEN preview
```
Ou: Settings → Environment Variables no painel Vercel.

**Critério de sucesso:** ambas as vars listadas em `vercel env ls` (ou no painel).

### Passo 1.13 — Deploy preview e smoke test
**Comandos:**
```bash
git -C E:/site-futurah add -A
git -C E:/site-futurah commit -m "feat(payload): fundação multi-tenant"
git -C E:/site-futurah push -u origin payload-foundation
```
**Verificação:** acessar `<preview>/admin`, logar com user seed, criar tenant de teste, trocar no seletor, confirmar que Posts lista (vazia) filtra por tenant.

**Critério de sucesso:** mesmas checagens do 1.10, agora em produção-preview.

### Passo 1.14 — Merge em `main`
**Comandos:**
```bash
git -C E:/site-futurah checkout main
git -C E:/site-futurah merge payload-foundation
git -C E:/site-futurah push origin main
```
**Critério de sucesso:** deploy Production verde. `/admin` exige login. `/blog` ainda renderiza do Sanity (sem regressão).

---

## Fase 2 — Blog (~1-2 dias)

> ⚠ DECISÃO PENDENTE 4.3 — verificar `sanity.io/manage` → projeto → dataset `production` → quantidade de docs. Se 0, pular Passo 2.5. Se >0, Passo 2.5 vira gate.

> ⚠ DECISÃO PENDENTE 4.4 — afeta `lib/content.ts` (Passo 2.6). Default: só domínio Futurah → filtro fixo por tenant `futurah`.

### Passo 2.1 — Abrir branch
**Comandos:**
```bash
git -C E:/site-futurah checkout main
git -C E:/site-futurah checkout -b payload-blog
```

### Passo 2.2 — Expandir `collections/Posts.ts`
**Contexto:** substitui o stub da Fase 1 pelo shape completo do blog.
**Snippet (substituir integral):**
```ts
// collections/Posts.ts
import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { revalidateTag } from 'next/cache'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishedAt', 'featured'],
  },
  versions: {
    drafts: { autosave: { interval: 2000 } },
    maxPerDoc: 20,
  },
  access: {
    read: ({ req }) => {
      // anônimo só lê publicados; logados leem tudo
      if (req.user) return true
      return { _status: { equals: 'published' } }
    },
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      index: true,
      admin: { description: 'Único por tenant.' },
    },
    { name: 'excerpt', type: 'textarea', maxLength: 300 },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
    },
    {
      name: 'authors',
      type: 'relationship',
      relationTo: 'authors',
      hasMany: true,
    },
    { name: 'featured', type: 'checkbox', defaultValue: false },
    { name: 'publishedAt', type: 'date' },
    { name: 'tags', type: 'array', fields: [{ name: 'value', type: 'text' }] },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor(),
    },
  ],
  hooks: {
    afterChange: [
      ({ doc }) => {
        revalidateTag(`posts`)
        revalidateTag(`post:${doc.slug}`)
        return doc
      },
    ],
    afterDelete: [
      ({ doc }) => {
        revalidateTag(`posts`)
        revalidateTag(`post:${doc.slug}`)
        return doc
      },
    ],
  },
}
```

### Passo 2.3 — Regenerar tipos e importMap
**Comandos:**
```bash
npm --prefix E:/site-futurah run dev &
# em outra shell:
npx --prefix E:/site-futurah payload generate:types
npx --prefix E:/site-futurah payload generate:importmap
```
**Critério de sucesso:** `payload-types.ts` contém interface `Post` com os novos campos.

### Passo 2.4 — Criar 1 post de teste no admin
**Verificação:** admin → selecionar tenant "Futurah" → Posts → Create New → preencher título, slug, categoria (criar 1 categoria antes se vazio), conteúdo em Lexical. Salvar.
**Critério de sucesso:** post salva; `psql "$DATABASE_URL" -c "SELECT title, slug, _status FROM payload.posts LIMIT 3;"` retorna a row.

### Passo 2.5 — [condicional] Migrar conteúdo do Sanity pra Lexical
**Contexto:** se dataset Sanity tiver posts reais (decisão 4.3). Não há conversor oficial Portable Text → Lexical; precisa ser script custom.

> ⚠ DECISÃO PENDENTE 4.3 — se dataset vazio, marcar passo como SKIPPED.

**Arquivos a criar:** `scripts/migrate-sanity-posts.ts`.
**Snippet (esqueleto — a função `portableTextToLexical` requer implementação custom):**
```ts
// scripts/migrate-sanity-posts.ts
// Uso: npx tsx scripts/migrate-sanity-posts.ts --dry-run
import { getPayload } from 'payload'
import config from '../payload.config'
import { createClient } from 'next-sanity'
import type { PortableTextBlock } from '@portabletext/types'

const DRY_RUN = process.argv.includes('--dry-run')
const TENANT_SLUG = 'futurah' // todos os posts legados viram do tenant Futurah

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
})

// TODO: implementar adapter Portable Text → Lexical SerializedEditorState.
// Não há converter oficial — escrever ou adaptar comunitário. Placeholder abaixo
// converte parágrafos simples; imagens/listas/links requerem expansão.
function portableTextToLexical(blocks: PortableTextBlock[] | null) {
  if (!blocks || blocks.length === 0) return null
  return {
    root: {
      type: 'root',
      version: 1,
      direction: null as any,
      format: '' as any,
      indent: 0,
      children: blocks.map((b: any) => ({
        type: 'paragraph',
        version: 1,
        direction: null,
        format: '',
        indent: 0,
        children: (b.children ?? []).map((c: any) => ({
          type: 'text',
          version: 1,
          text: c.text ?? '',
          format: 0,
          detail: 0,
          mode: 'normal',
          style: '',
        })),
      })),
    },
  }
}

async function main() {
  const payload = await getPayload({ config })
  const tenant = await payload.find({
    collection: 'tenants',
    where: { slug: { equals: TENANT_SLUG } },
    limit: 1,
  })
  if (tenant.docs.length === 0) throw new Error(`Tenant ${TENANT_SLUG} não existe`)
  const tenantId = tenant.docs[0].id

  const sanityPosts = await sanity.fetch<any[]>(
    `*[_type == "post"] {
      _id, title, "slug": slug.current, excerpt, publishedAt, featured,
      tags, content, "categorySlug": category->slug.current,
      "authorName": author->name
    }`
  )

  console.log(`Encontrados ${sanityPosts.length} posts no Sanity.`)
  if (DRY_RUN) {
    console.log(sanityPosts.map((p) => ({ slug: p.slug, title: p.title })))
    return
  }

  for (const p of sanityPosts) {
    // idempotência: skip se slug já existe no tenant
    const existing = await payload.find({
      collection: 'posts',
      where: {
        and: [
          { slug: { equals: p.slug } },
          { tenant: { equals: tenantId } },
        ],
      },
      limit: 1,
    })
    if (existing.docs.length > 0) {
      console.log(`SKIP ${p.slug} (já existe)`)
      continue
    }

    // TODO: resolver categoryId e authorId por slug
    // TODO: uploadar coverImage via payload.create({ collection: 'media', file: ... })

    await payload.create({
      collection: 'posts',
      data: {
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt,
        publishedAt: p.publishedAt,
        featured: !!p.featured,
        tags: (p.tags ?? []).map((v: string) => ({ value: v })),
        content: portableTextToLexical(p.content),
        _status: 'published',
        tenant: tenantId as any,
      } as any,
    })
    console.log(`OK ${p.slug}`)
  }
}

main().catch((err) => { console.error(err); process.exit(1) })
```
**Comandos:**
```bash
# 1. Dry-run: valida listagem e resolução
npx --prefix E:/site-futurah tsx scripts/migrate-sanity-posts.ts --dry-run

# 2. Backup antes de rodar pra valer
pg_dump "$DATABASE_URL" -n payload -f backup-pre-sanity-import.sql

# 3. Import real
npx --prefix E:/site-futurah tsx scripts/migrate-sanity-posts.ts
```
**Critério de sucesso:** posts listados no admin; `psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM payload.posts;"` bate com Sanity.
**Se falhar:** restaurar backup: `psql "$DATABASE_URL" -f backup-pre-sanity-import.sql`.

### Passo 2.6 — Reescrever `lib/content.ts` pra usar Local API do Payload
**Contexto:** funções `getPosts`, `getPostBySlug`, `getCategories` viram wrappers da Local API. Filtro por tenant padrão = `futurah` (decisão 4.4 default).
**Arquivos a editar:** `E:/site-futurah/lib/content.ts` (substituir integral).
**Snippet:**
```ts
// lib/content.ts — versão Payload
import 'server-only'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Post, Category, Author, Media } from '@/payload-types'

const DEFAULT_TENANT_SLUG = 'futurah'

export interface PostAuthor {
  name: string
  role: string | null
  image: string | null
}

export interface PostListItem {
  slug: string
  title: string
  excerpt: string
  coverImage: string | null
  category: string
  featured: boolean
  publishedAt: string | null
  author: PostAuthor | null
  tags: string[]
}

export interface CategoryItem {
  slug: string
  name: string
  description: string
}

export interface PostBySlug {
  metadata: {
    slug: string
    title: string
    excerpt: string
    coverImage: string | null
    category: string
    publishedAt: string | null
    author: PostAuthor | null
    tags: string[]
  }
  content: unknown // SerializedEditorState do Lexical (tipado dentro do componente)
}

async function getTenantId(slug: string): Promise<string | number | null> {
  const payload = await getPayload({ config })
  const t = await payload.find({
    collection: 'tenants',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  return t.docs[0]?.id ?? null
}

function pickCover(cover: Post['coverImage']): string | null {
  if (!cover || typeof cover === 'string' || typeof cover === 'number') return null
  const m = cover as Media
  return m?.url ?? null
}

function pickAuthor(authors: Post['authors']): PostAuthor | null {
  if (!authors || !Array.isArray(authors) || authors.length === 0) return null
  const a = authors[0]
  if (typeof a === 'string' || typeof a === 'number') return null
  const author = a as Author
  return {
    name: author.name,
    role: author.role ?? null,
    image:
      author.avatar && typeof author.avatar === 'object'
        ? (author.avatar as Media).url ?? null
        : null,
  }
}

export async function getPosts(tenantSlug = DEFAULT_TENANT_SLUG): Promise<PostListItem[]> {
  const payload = await getPayload({ config })
  const tenantId = await getTenantId(tenantSlug)
  if (!tenantId) return []

  const res = await payload.find({
    collection: 'posts',
    depth: 2,
    limit: 100,
    where: {
      and: [
        { tenant: { equals: tenantId } },
        { _status: { equals: 'published' } },
      ],
    },
    sort: '-publishedAt',
  })

  return res.docs.map((p: Post) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt ?? '',
    coverImage: pickCover(p.coverImage),
    category:
      p.category && typeof p.category === 'object'
        ? (p.category as Category).slug
        : 'geral',
    featured: !!p.featured,
    publishedAt: p.publishedAt ?? null,
    author: pickAuthor(p.authors),
    tags: (p.tags ?? []).map((t: any) => t.value).filter(Boolean),
  }))
}

export async function getCategories(tenantSlug = DEFAULT_TENANT_SLUG): Promise<CategoryItem[]> {
  const payload = await getPayload({ config })
  const tenantId = await getTenantId(tenantSlug)
  if (!tenantId) return []

  const res = await payload.find({
    collection: 'categories',
    where: { tenant: { equals: tenantId } },
    limit: 100,
    sort: 'name',
  })

  return res.docs.map((c: Category) => ({
    slug: c.slug,
    name: c.name,
    description: c.description ?? '',
  }))
}

export async function getPostBySlug(
  slug: string,
  tenantSlug = DEFAULT_TENANT_SLUG,
): Promise<PostBySlug | null> {
  const payload = await getPayload({ config })
  const tenantId = await getTenantId(tenantSlug)
  if (!tenantId) return null

  const res = await payload.find({
    collection: 'posts',
    depth: 2,
    limit: 1,
    where: {
      and: [
        { slug: { equals: slug } },
        { tenant: { equals: tenantId } },
        { _status: { equals: 'published' } },
      ],
    },
  })
  const p = res.docs[0]
  if (!p) return null

  return {
    metadata: {
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt ?? '',
      coverImage: pickCover(p.coverImage),
      category:
        p.category && typeof p.category === 'object'
          ? (p.category as Category).name
          : 'Geral',
      publishedAt: p.publishedAt ?? null,
      author: pickAuthor(p.authors),
      tags: (p.tags ?? []).map((t: any) => t.value).filter(Boolean),
    },
    content: (p as any).content ?? null,
  }
}

/** false agora — conteúdo é Lexical, não Portable Text. */
export function isSanityCMS(): boolean {
  return false
}
```

### Passo 2.7 — Substituir `components/blog/PortableText.tsx` por renderer Lexical
**Arquivos a editar:** `E:/site-futurah/components/blog/PortableText.tsx` (substituir integral — mantendo o mesmo path/nome pra não quebrar imports dos consumidores; renomear opcionalmente depois).
**Snippet:**
```tsx
// components/blog/PortableText.tsx — agora renderiza Lexical
'use client'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

interface Props {
  value: SerializedEditorState | null | unknown
}

export default function PortableText({ value }: Props) {
  if (!value || typeof value !== 'object') return null
  return (
    <RichText
      data={value as SerializedEditorState}
      className="payload-rich-text"
    />
  )
}
```
**Observação:** `app/(site)/blog/[slug]/page.tsx` hoje tipa `content` como `PortableTextBlock[]`. Atualizar o tipo pra `unknown` (ou `SerializedEditorState`) e remover os `import type { PortableTextBlock } from '@portabletext/types'` — o import vai falhar depois do uninstall no Passo 2.11.

**Arquivos a editar também:** `app/(site)/blog/[slug]/page.tsx`:
- Trocar `import type { PortableTextBlock } from "@portabletext/types"` por nada (remover).
- Trocar `content as PortableTextBlock[]` por `content`.
- Remover a checagem `Array.isArray(content)` (Lexical é objeto, não array); trocar por `content != null`.

### Passo 2.8 — Reativar ISR nas rotas do blog
**Contexto:** hoje `app/(site)/blog/[slug]/page.tsx` e `.../category/[slug]/page.tsx` usam `export const dynamic = 'force-static'`. Com Payload + `revalidateTag`, precisamos de ISR, não static puro.
**Arquivos a editar:**
- `app/(site)/blog/[slug]/page.tsx` — remover `export const dynamic = 'force-static'`; adicionar `export const revalidate = 60` e usar `unstable_cache` com tag `post:${slug}`.
- `app/(site)/blog/page.tsx` — idem `revalidate = 60` + tag `posts`.
- `app/(site)/blog/category/[slug]/page.tsx` — idem.

**Snippet pra cada uma (adicionar no topo):**
```ts
export const revalidate = 60
```

### Passo 2.9 — Validar blog local
**Comandos:**
```bash
npm --prefix E:/site-futurah run dev
```
**Verificação:**
- `http://localhost:3000/blog` lista posts do tenant Futurah.
- `http://localhost:3000/blog/<slug>` renderiza post com Lexical.
- Editar o post no admin → salvar → verificar que `/blog/<slug>` atualiza após refresh (revalidateTag dispara).

**Critério de sucesso:** 3 rotas renderizam sem erro; revalidação funciona.

### Passo 2.10 — Build local
**Comandos:**
```bash
npm --prefix E:/site-futurah run build
```
**Critério de sucesso:** build verde. Se quebrar em imports de `@portabletext/*`, confirmar que o Passo 2.7 atualizou `app/(site)/blog/[slug]/page.tsx`.

### Passo 2.11 — Cleanup Sanity
**Comandos:**
```bash
npm --prefix E:/site-futurah uninstall \
  sanity \
  next-sanity \
  @portabletext/react \
  @portabletext/types \
  @sanity/image-url

git -C E:/site-futurah rm -r sanity/
git -C E:/site-futurah rm -r sanity-studio/ 2>/dev/null || true
git -C E:/site-futurah rm -r app/sanity-legacy-admin/
git -C E:/site-futurah rm lib/sanity.ts lib/sanity-server.ts
git -C E:/site-futurah rm -r content/posts/ content/categories/ 2>/dev/null || true
git -C E:/site-futurah mv SANITY.md docs/archive/SANITY.md || git rm SANITY.md
```
**Arquivos a editar:**
- `next.config.mjs`: remover `cdn.sanity.io` de `images.domains` e `remotePatterns`.
- `tailwind.config.ts` (se houver path Sanity): remover.

**Verificação:**
```bash
grep -rn "from ['\"].*sanity" E:/site-futurah/app E:/site-futurah/components E:/site-futurah/lib 2>/dev/null
grep -rn "@portabletext" E:/site-futurah/app E:/site-futurah/components E:/site-futurah/lib 2>/dev/null
```
**Critério de sucesso:** zero matches.

### Passo 2.12 — Deploy preview e merge
**Comandos:**
```bash
npm --prefix E:/site-futurah run build  # local verde antes de push
git -C E:/site-futurah add -A
git -C E:/site-futurah commit -m "feat(blog): migração Sanity → Payload 3 + remoção Sanity"
git -C E:/site-futurah push -u origin payload-blog
```
**Verificação (preview URL):**
- `<preview>/admin` ok.
- `<preview>/blog` renderiza do Payload.
- `<preview>/blog/<slug>` renderiza Lexical.
- `<preview>/sanity-legacy-admin` → 404 (esperado).

**Merge:**
```bash
git -C E:/site-futurah checkout main
git -C E:/site-futurah merge payload-blog
git -C E:/site-futurah push origin main
```

---

## Fase 3 — Leads + Newsletter (~1-1.5 dia)

> ⚠ DECISÃO PENDENTE 4.5 — confirmar: Leads **tenant-scoped** (default ok), Newsletter **global** (default ok). Se mudar Newsletter pra tenant-scoped, adicionar `'newsletter-subscribers': {}` em `multiTenantPlugin.collections` (Passo 1.7) e rodar `generate:types` de novo.

### Passo 3.1 — Abrir branch
```bash
git -C E:/site-futurah checkout main
git -C E:/site-futurah checkout -b payload-leads-newsletter
```

### Passo 3.2 — Backup Postgres
**Contexto:** a partir daqui mexemos em dados de produção (`public.leads`, `public.newsletter_subscribers`). Backup obrigatório.
**Comandos:**
```bash
pg_dump "$DATABASE_URL" -n public -t leads -t newsletter_subscribers \
  -f E:/site-futurah/backup-phase3-$(date +%Y%m%d).sql
```
**Critério de sucesso:** arquivo `.sql` existe com conteúdo >1KB.

### Passo 3.3 — Expandir `collections/Leads.ts`
**Snippet (substituir stub):**
```ts
// collections/Leads.ts
import type { CollectionConfig } from 'payload'

export const Leads: CollectionConfig = {
  slug: 'leads',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['nome', 'email', 'origem', 'receivedAt'],
    description: 'Capturas de formulários. Tenant-scoped.',
  },
  access: {
    // Leads são criados via API pública (form) com overrideAccess, mas no admin
    // só logados leem.
    read: ({ req }) => !!req.user,
    create: () => true, // server-side usa overrideAccess; UI admin herda req.user check
    update: ({ req }) => !!req.user,
    delete: ({ req }) => req.user?.role === 'superadmin',
  },
  fields: [
    { name: 'nome', type: 'text', required: true },
    { name: 'email', type: 'email', required: true, index: true },
    { name: 'social', type: 'text' },
    {
      name: 'origem',
      type: 'text',
      defaultValue: 'contact_form',
      index: true,
    },
    {
      name: 'receivedAt',
      type: 'date',
      defaultValue: () => new Date().toISOString(),
      admin: { readOnly: true },
    },
  ],
  timestamps: true,
}
```

### Passo 3.4 — Expandir `collections/NewsletterSubscribers.ts`
**Snippet:**
```ts
// collections/NewsletterSubscribers.ts
import type { CollectionConfig } from 'payload'

export const NewsletterSubscribers: CollectionConfig = {
  slug: 'newsletter-subscribers',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'subscribedAt', 'unsubscribedAt'],
    description: 'Newsletter Futurah (global). Um email = uma inscrição.',
  },
  access: {
    read: ({ req }) => !!req.user,
    create: () => true,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => req.user?.role === 'superadmin',
  },
  fields: [
    { name: 'email', type: 'email', required: true, unique: true, index: true },
    {
      name: 'subscribedAt',
      type: 'date',
      defaultValue: () => new Date().toISOString(),
    },
    { name: 'unsubscribedAt', type: 'date' },
  ],
  timestamps: true,
}
```

### Passo 3.5 — Regenerar tipos
```bash
npx --prefix E:/site-futurah payload generate:types
```
**Critério de sucesso:** `payload-types.ts` atualizado com novos campos.

### Passo 3.6 — Script `scripts/migrate-leads.ts` (idempotente, dry-run)
**Arquivos a criar:** `E:/site-futurah/scripts/migrate-leads.ts`.
**Snippet:**
```ts
// scripts/migrate-leads.ts
// Uso: npx tsx scripts/migrate-leads.ts --dry-run
//      npx tsx scripts/migrate-leads.ts
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'
import postgres from 'postgres'

const DRY_RUN = process.argv.includes('--dry-run')
const TENANT_SLUG = 'futurah' // todos os leads pre-multi-tenant = Futurah

type LegacyLead = {
  id: string
  nome: string
  email: string
  social: string | null
  origem: string | null
  received_at: Date
}

async function main() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL não definida')
  const sql = postgres(process.env.DATABASE_URL, { prepare: false })
  const payload = await getPayload({ config })

  const tenant = await payload.find({
    collection: 'tenants',
    where: { slug: { equals: TENANT_SLUG } },
    limit: 1,
  })
  if (tenant.docs.length === 0) throw new Error(`Tenant ${TENANT_SLUG} não existe`)
  const tenantId = tenant.docs[0].id

  const legacy = await sql<LegacyLead[]>`
    SELECT id, nome, email, social, origem, received_at
    FROM public.leads
    ORDER BY received_at ASC
  `
  console.log(`Encontrados ${legacy.length} leads legados.`)

  let inserted = 0
  let skipped = 0
  for (const l of legacy) {
    // idempotência: (email + origem + data) dentro do tenant
    const existing = await payload.find({
      collection: 'leads',
      where: {
        and: [
          { email: { equals: l.email } },
          { tenant: { equals: tenantId } },
          { receivedAt: { equals: l.received_at.toISOString() } },
        ],
      },
      limit: 1,
    })
    if (existing.docs.length > 0) {
      skipped++
      continue
    }

    if (DRY_RUN) {
      console.log(`[dry-run] +lead ${l.email}`)
      inserted++
      continue
    }

    await payload.create({
      collection: 'leads',
      data: {
        nome: l.nome,
        email: l.email,
        social: l.social ?? undefined,
        origem: l.origem ?? 'contact_form',
        receivedAt: l.received_at.toISOString(),
        tenant: tenantId as any,
      } as any,
      overrideAccess: true,
    })
    inserted++
  }

  console.log(`Inseridos: ${inserted} | Skipped: ${skipped}`)
  await sql.end()
}

main().catch((err) => { console.error(err); process.exit(1) })
```
**Comandos:**
```bash
# Dev deps pra rodar tsx
npm --prefix E:/site-futurah install --save-dev tsx

# Dry-run
npx --prefix E:/site-futurah tsx scripts/migrate-leads.ts --dry-run

# Real
npx --prefix E:/site-futurah tsx scripts/migrate-leads.ts
```
**Verificação:**
```bash
psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM payload.leads;"
psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM public.leads;"
```
**Critério de sucesso:** counts iguais. Rodar o script 2x e confirmar que a 2ª execução reporta `Skipped: N` (todos).

### Passo 3.7 — Script `scripts/migrate-newsletter.ts`
**Snippet:**
```ts
// scripts/migrate-newsletter.ts
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'
import postgres from 'postgres'

const DRY_RUN = process.argv.includes('--dry-run')

type LegacyNews = {
  id: string
  email: string
  subscribed_at: Date
  unsubscribed_at: Date | null
}

async function main() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL não definida')
  const sql = postgres(process.env.DATABASE_URL, { prepare: false })
  const payload = await getPayload({ config })

  const legacy = await sql<LegacyNews[]>`
    SELECT id, email, subscribed_at, unsubscribed_at
    FROM public.newsletter_subscribers
    ORDER BY subscribed_at ASC
  `
  console.log(`Encontrados ${legacy.length} inscritos legados.`)

  let inserted = 0, skipped = 0
  for (const n of legacy) {
    // email é unique na Collection nova; dedupe por email apenas
    const existing = await payload.find({
      collection: 'newsletter-subscribers',
      where: { email: { equals: n.email } },
      limit: 1,
    })
    if (existing.docs.length > 0) {
      skipped++; continue
    }
    if (DRY_RUN) { console.log(`[dry-run] +${n.email}`); inserted++; continue }

    await payload.create({
      collection: 'newsletter-subscribers',
      data: {
        email: n.email,
        subscribedAt: n.subscribed_at.toISOString(),
        unsubscribedAt: n.unsubscribed_at?.toISOString() ?? undefined,
      } as any,
      overrideAccess: true,
    })
    inserted++
  }

  console.log(`Inseridos: ${inserted} | Skipped: ${skipped}`)
  await sql.end()
}

main().catch((err) => { console.error(err); process.exit(1) })
```
**Comandos:**
```bash
npx --prefix E:/site-futurah tsx scripts/migrate-newsletter.ts --dry-run
npx --prefix E:/site-futurah tsx scripts/migrate-newsletter.ts
```
**Verificação:**
```bash
psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM payload.\"newsletter-subscribers\";"
psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM public.newsletter_subscribers;"
```

### Passo 3.8 — Reescrever `app/api/contact/route.ts`
**Snippet:**
```ts
// app/api/contact/route.ts
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

const DEFAULT_TENANT_SLUG = 'futurah' // tenant padrão do form Futurah

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, social } = body as {
      name?: string; email?: string; social?: string
    }
    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json(
        { error: 'Nome e e-mail são obrigatórios.' },
        { status: 400 }
      )
    }

    const payload = await getPayload({ config })

    // resolve tenant por header Host (se config., ver 4.4) OU fallback Futurah
    const host = request.headers.get('host')?.split(':')[0] ?? ''
    const tenantsByHost = await payload.find({
      collection: 'tenants',
      where: { domain: { equals: host } },
      limit: 1,
    })
    let tenantId: string | number | undefined = tenantsByHost.docs[0]?.id
    if (!tenantId) {
      const fallback = await payload.find({
        collection: 'tenants',
        where: { slug: { equals: DEFAULT_TENANT_SLUG } },
        limit: 1,
      })
      tenantId = fallback.docs[0]?.id
    }
    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant não configurado.' }, { status: 500 })
    }

    await payload.create({
      collection: 'leads',
      data: {
        nome: name.trim(),
        email: email.trim().toLowerCase(),
        social: social?.trim() || undefined,
        origem: 'contact_form',
        tenant: tenantId as any,
      } as any,
      overrideAccess: true,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[API] contact:', err)
    return NextResponse.json({ error: 'Erro ao enviar. Tente de novo.' }, { status: 500 })
  }
}
```

### Passo 3.9 — Reescrever `app/api/newsletter/route.ts`
**Snippet:**
```ts
// app/api/newsletter/route.ts
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = body as { email?: string }
    if (!email?.trim()) {
      return NextResponse.json(
        { error: 'E-mail é obrigatório.' },
        { status: 400 }
      )
    }
    const normalized = email.trim().toLowerCase()
    const payload = await getPayload({ config })

    const existing = await payload.find({
      collection: 'newsletter-subscribers',
      where: { email: { equals: normalized } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      // re-subscribe: limpa unsubscribedAt e atualiza subscribedAt
      await payload.update({
        collection: 'newsletter-subscribers',
        id: existing.docs[0].id,
        data: {
          subscribedAt: new Date().toISOString(),
          unsubscribedAt: null as any,
        } as any,
        overrideAccess: true,
      })
    } else {
      await payload.create({
        collection: 'newsletter-subscribers',
        data: {
          email: normalized,
          subscribedAt: new Date().toISOString(),
        } as any,
        overrideAccess: true,
      })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[API] newsletter:', err)
    return NextResponse.json({ error: 'Erro ao inscrever. Tente de novo.' }, { status: 500 })
  }
}
```

### Passo 3.10 — Remover `leads` e `newsletter_subscribers` do Drizzle schema
**Arquivos a editar:** `E:/site-futurah/lib/db/schema.ts` — remover:
- `export const leads = pgTable(...)` e tipos derivados.
- `export const newsletterSubscribers = pgTable(...)` e tipos derivados.
- Manter `analises` e `analiseEventos` (Fase 4).

**Comandos:**
```bash
npx --prefix E:/site-futurah drizzle-kit generate
```
**Critério de sucesso:** nova migration SQL em `lib/db/migrations/` com `DROP TABLE leads;` e `DROP TABLE newsletter_subscribers;`.

### Passo 3.11 — Testar forms no dev local
**Comandos:**
```bash
npm --prefix E:/site-futurah run dev
```
**Verificação:**
```bash
# form de contato
curl -X POST http://localhost:3000/api/contact \
  -H "content-type: application/json" \
  -d '{"name":"Teste","email":"teste@exemplo.com","social":"@teste"}'

# newsletter
curl -X POST http://localhost:3000/api/newsletter \
  -H "content-type: application/json" \
  -d '{"email":"teste@exemplo.com"}'
```
Ambos devem retornar `{"ok":true}`. No admin (`/admin`), ver:
- Leads (tenant Futurah) → 1 novo registro.
- Newsletter Subscribers → 1 novo registro.

### Passo 3.12 — Executar migration Drizzle em produção (drop tables)
**Contexto:** só depois de confirmar que Payload tem todos os dados em `payload.leads` e `payload.newsletter-subscribers`.
**Comandos:**
```bash
# backup adicional antes do DROP
pg_dump "$DATABASE_URL" -n public -t leads -t newsletter_subscribers \
  -f E:/site-futurah/backup-pre-drop-$(date +%Y%m%d).sql

# aplicar migration
npx --prefix E:/site-futurah drizzle-kit migrate
```
**Verificação:**
```bash
psql "$DATABASE_URL" -c "\dt public.*" | grep -E "leads|newsletter"
# esperado: sem resultado (tabelas sumiram)
```

### Passo 3.13 — Deploy preview + merge
```bash
npm --prefix E:/site-futurah run build
git -C E:/site-futurah add -A
git -C E:/site-futurah commit -m "feat(leads+newsletter): migração Drizzle → Payload"
git -C E:/site-futurah push -u origin payload-leads-newsletter
```
Verificar no preview:
- Submeter form de contato → cai em `/admin/collections/leads`.
- Submeter newsletter → cai em `/admin/collections/newsletter-subscribers`.

Merge:
```bash
git -C E:/site-futurah checkout main
git -C E:/site-futurah merge payload-leads-newsletter
git -C E:/site-futurah push origin main
```

---

## Fase 4 — Análises (esqueleto — bloqueado pela decisão 4.2)

> ⚠ DECISÃO PENDENTE 4.2 — Caminho A (manter Drizzle + custom view) ou B (migrar pra Collection). Default recomendado: A.

### Passo 4.1 — [TODO: resolver decisão 4.2] Adicionar `tenant_id` em `public.analises` e `public.analise_eventos` (Caminho A)
**Ação esqueleto:** editar `lib/db/schema.ts` adicionando `tenantId: uuid("tenant_id").references(...)` em `analises` e `analiseEventos`. Gerar migration Drizzle. Backfill: todas análises existentes → tenant Futurah.

### Passo 4.2 — [TODO] Custom admin view em `app/(payload)/admin/custom/analises/page.tsx`
**Ação esqueleto:** usar Payload custom views (`admin.components.views` no config). Tabela de análises com filtro por status + tenant. Botões aprovar/rejeitar.

### Passo 4.3 — [TODO] Endpoints custom no Payload
**Ação esqueleto:** adicionar `endpoints: [...]` ao `payload.config.ts` pra ler/escrever `public.analises` filtrando por `tenant_id` do user logado.

### Passo 4.4 — [TODO] Atualizar pipeline de scraping/geração
**Ação esqueleto:** rota API que cria `analises` passa a setar `tenant_id` (resolvido via host ou param).

### Passo 4.5 — [TODO] Tab "Eventos" por análise
**Ação esqueleto:** read-only view de `analise_eventos` agrupada por análise.

---

## Fase 5 — Cleanup + SEO (esqueleto — executa após Fase 4)

### Passo 5.1 — [TODO] Atualizar `CLAUDE.md`, criar `PAYLOAD.md`, arquivar `PAYLOAD_MIGRATION.md`
### Passo 5.2 — [TODO] `app/sitemap.ts` — incluir posts dinâmicos
### Passo 5.3 — [TODO] `app/feed.xml/route.ts` — RSS
### Passo 5.4 — [TODO] JSON-LD Article schema em `app/(site)/blog/[slug]/page.tsx`
### Passo 5.5 — [TODO] Remover `build_err*.log`, `build-error*.log`, `cf_report.txt`, `debug_posts.json`, `help.txt` da raiz
### Passo 5.6 — [TODO] Confirmar `/admin` exige auth em preview

---

## Variáveis de ambiente (consolidado)

| Variável | Valor | Onde configurar |
|---|---|---|
| `DATABASE_URL` | Postgres Supabase connection string (com permissão de `CREATE SCHEMA`) | `.env.local` + Vercel (Production + Preview) |
| `PAYLOAD_SECRET` | hex 64-char gerado via `crypto.randomBytes(32)` | `.env.local` + Vercel (Production + Preview) |
| `BLOB_READ_WRITE_TOKEN` | Token do Vercel Blob Store | Vercel seta automaticamente em Production quando conecta o Blob ao projeto; copiar manualmente pra `.env.local` pra dev |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | project id Sanity | manter em `.env.local` **apenas enquanto Fase 2 não terminar**; remover após Passo 2.11 |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` | idem acima; remover após Passo 2.11 |
| `NEXT_PUBLIC_SANITY_API_VERSION` | `2024-01-01` | idem; remover após Passo 2.11 |
| `SANITY_API_WRITE_TOKEN` | token de escrita Sanity | remover após Passo 2.11 (**inclusive do Vercel**) |

---

## Rollback de emergência

### Rollback Fase 0 (PoC)
```bash
git -C E:/site-futurah checkout main
git -C E:/site-futurah branch -D payload-poc
psql "$DATABASE_URL" -c "DROP SCHEMA IF EXISTS payload CASCADE;"
# Remover env vars PAYLOAD_SECRET da Vercel se adicionadas.
```

### Rollback Fase 1 (merged em main)
```bash
# revert do merge commit (mantém histórico)
git -C E:/site-futurah checkout main
git -C E:/site-futurah revert -m 1 <sha-do-merge-fase-1>
git -C E:/site-futurah push origin main
# após verificar que /admin voltou pro Sanity:
psql "$DATABASE_URL" -c "DROP SCHEMA IF EXISTS payload CASCADE;"
```

### Rollback Fase 2 (blog)
```bash
git -C E:/site-futurah revert -m 1 <sha-do-merge-fase-2>
git -C E:/site-futurah push origin main
# Reinstalar Sanity deps (se path crítico):
npm --prefix E:/site-futurah install sanity@3.56.0 next-sanity@12.1.0 \
  @portabletext/react@6.0.2 @portabletext/types@4.0.1 @sanity/image-url@2.0.3
# O Sanity dataset em `production` permanece intocado; nada foi escrito lá durante a migração.
```

### Rollback Fase 3 (leads + newsletter)
```bash
# 1. Git revert
git -C E:/site-futurah revert -m 1 <sha-do-merge-fase-3>
git -C E:/site-futurah push origin main

# 2. Restaurar tabelas public.leads e public.newsletter_subscribers do backup
psql "$DATABASE_URL" -f E:/site-futurah/backup-phase3-YYYYMMDD.sql

# 3. Validar
psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM public.leads;"
psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM public.newsletter_subscribers;"

# 4. (opcional) limpar dados migrados em payload
psql "$DATABASE_URL" -c "TRUNCATE payload.leads, payload.\"newsletter-subscribers\" CASCADE;"
```

### Rollback seletivo (só dados Payload sem git revert)
```bash
# Se Payload ficou inconsistente mas código é ok:
pg_restore "$DATABASE_URL" --clean --schema=payload backup-payload.sql
```

---

## Flags de placeholder (verificar docs antes de executar)

1. **Passo 2.5** — `portableTextToLexical` tem placeholder que só converte parágrafos simples. Imagens, listas, links, marks custom do Sanity precisam de implementação adicional. Se o dataset Sanity tiver conteúdo rico, alocar 1 dia extra pra expandir a função com os node types que aparecem (lista via `https://www.sanity.io/docs/presenting-block-text`; Lexical schema via `@payloadcms/richtext-lexical/lexical`).
2. **Passo 1.7** — `userHasAccessToAllTenants` usa `user?.role === 'superadmin'`. Se a estrutura de role do Payload não for visível no callback (tipos gerados antes de adicionar o field), rodar `generate:types` primeiro e ajustar.
3. **Passo 2.2** — `access.read` retorna filtro `{ _status: { equals: 'published' } }` mas a sintaxe exata de filtro em access control callback de Payload 3 pode ser `{ _status: { equals: 'published' } }` ou função async. [verificar docs — placeholder se não casar].
4. **Passo 1.9 / 2.3 / 3.5** — `npx payload generate:importmap` e `generate:types` precisam do binário `payload` disponível. Se o `postinstall` não criou o bin em `node_modules/.bin`, adicionar script no `package.json`:
   ```json
   "scripts": {
     "payload": "payload"
   }
   ```
   e usar `npm run payload generate:importmap`.
5. **Passo 2.7** — o pacote `@payloadcms/richtext-lexical/react` exporta `RichText`; caminho exato pode ser `@payloadcms/richtext-lexical/react` (confirmado) ou subpath `.../react/client` em versões futuras. Testar import no dev logo no Passo 2.3.

Sources:
- [Installation | Payload Docs](https://payloadcms.com/docs/getting-started/installation)
- [Multi-Tenant Plugin | Payload Docs](https://payloadcms.com/docs/plugins/multi-tenant)
- [Postgres Adapter | Payload Docs](https://payloadcms.com/docs/database/postgres)
- [Vercel Blob Storage | Payload Docs](https://payloadcms.com/docs/upload/storage-adapters)
- [blank template (payload) files on GitHub](https://github.com/payloadcms/payload/tree/main/templates/blank/src/app/%28payload%29)
- [multi-tenant plugin source](https://github.com/payloadcms/payload/tree/main/packages/plugin-multi-tenant)