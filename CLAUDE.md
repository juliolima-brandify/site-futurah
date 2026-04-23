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
npx drizzle-kit studio     # UI visual do banco
```

Requer `.env.local` com `DATABASE_URL` (string de conexão PostgreSQL) para qualquer comando Drizzle e para a API de contato.

## Arquitetura

### Deploy
O projeto é deployado na **Vercel**. O `npm run build` padrão do Next.js é suficiente — sem configuração especial de build. Variáveis de ambiente (`DATABASE_URL`, etc.) são configuradas no painel da Vercel.

> Os arquivos `wrangler.jsonc`, `open-next.config.ts` e os scripts `cf:build`/`deploy` no `package.json` são resquícios de uma migração anterior para Cloudflare e podem ser ignorados.

### Roteamento — Route Groups
- `app/(site)/` — páginas públicas do site (layout próprio com Header/Footer)
- `app/admin/` — área administrativa interna
- `app/api/` — rotas de API (contact, newsletter)

### Banco de Dados — Drizzle + Supabase/PostgreSQL
Schema em `lib/db/schema.ts`. Quatro tabelas:
- `analises` — análises geradas por leads (pipeline: `pendente_dados → scraping → gerando → pendente_revisao → publicada`)
- `leads` — capturas do formulário de contato da homepage
- `newsletter_subscribers` — inscritos na newsletter
- `analise_eventos` — tracking de leitura (open, scroll, click) de cada análise

Conexão via `lib/db/` e Supabase client em `lib/supabase.ts`.

### Sistema de Propostas
Propostas comerciais são páginas estáticas em `app/(site)/proposta-[cliente]/`. Toda a lógica de apresentação fica em `components/proposta/`, alimentada por um data file em `lib/proposta/[cliente]-data.ts`.

**Para criar uma nova proposta:**
1. Criar `lib/proposta/[cliente]-data.ts` implementando `AnaliseData` (`components/proposta/types.ts`)
2. Criar `app/(site)/proposta-[cliente]/page.tsx` usando `<PageProposta data={...} />`
3. As seções disponíveis estão em `components/proposta/sections/`

O tipo `AnaliseData` define todas as seções: `hero`, `retrato`, `diagnostico`, `tese`, `frentes`, `bancoIdeias`, `fases`, `escopo`, `potencial`, `encerramento`. O campo `variante` (`"criador" | "empresa" | "infoprodutor"`) pode ser usado pelas seções para variações visuais.
Também existe o campo `modelo` para o tipo comercial da proposta: `"coproducao"` (atual) e `"cash_on_delivery"` (novo).

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
