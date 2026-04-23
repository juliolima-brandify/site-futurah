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

## Migração planejada — Painel admin com Payload 3

Em andamento: substituição de Sanity + Supabase Studio por **painel admin unificado com Payload 3 + multi-tenant** (Futurah é agência, cada cliente = 1 tenant). Dois docs:

- [`PAYLOAD_MIGRATION.md`](./PAYLOAD_MIGRATION.md) — plano com fases, decisões pendentes, fallbacks, critical files (o "porquê/o quê")
- [`PAYLOAD_RUNBOOK.md`](./PAYLOAD_RUNBOOK.md) — runbook passo-a-passo executável das Fases 0-3 (comandos, snippets copy-paste, critérios de sucesso). Fases 4-5 ficam em esqueleto até as decisões destravarem (o "como")

**Não começar implementação antes de resolver as decisões pendentes da seção 4** do `PAYLOAD_MIGRATION.md` — o runbook marca inline quais passos dependem de cada decisão. Após conclusão da migração, ambos docs viram arquivos e são substituídos por `PAYLOAD.md` (steady-state).
