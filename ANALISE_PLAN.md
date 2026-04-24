# Fluxo de Análise — Auditoria + Gap Plan

> **Status (2026-04-23):** diagnóstico entregue por arquiteto sênior após migração Payload 3 concluída. Pontas do funil (wizard + render) estão implementadas; miolo (ingestão, pipeline, admin, pagamento, tracking) **está ausente**. Este doc é fonte para o plano de implementação da Fase 4 + hardening de produção.

Ver também:
- [`CLAUDE.md`](./CLAUDE.md) — seção "Fluxo de Análise (pipeline interno)"
- [`PAYLOAD_RUNBOOK.md`](./PAYLOAD_RUNBOOK.md) — Fase 4 (esqueleto): decisão 4.2 = manter análises em Drizzle + custom admin view

## 1. Mapa do fluxo (estado atual)

```
[ Landing / Hero ]
   | Botão "Aplicação" → /aplicacao?name=&social=    [IMPLEMENTADO]
   v
[ /aplicacao — app/(site)/aplicacao/page.tsx ]
   | ApplicationWizard (5 steps client-side)         [PARCIAL — só UI]
   | step 0: social | step 1: momento | step 2: gargalo
   | step 3: velocidade | step 4: whatsapp + CTA "agenda"
   | NENHUM fetch pra backend. Nenhum /api/aplicacao.   [AUSENTE]
   v
[ INSERT em public.analises com status='pendente_dados' ]   [AUSENTE]
   | Schema existe (migration 0000 aplicada). Nenhum código grava.
   v
[ Pipeline externo: scraping IG → dadosScraped jsonb ]      [AUSENTE / EXTERNO]
   | status: pendente_dados → scraping → gerando
   | Nada no repo escreve em dados_scraped. Sem webhook.
   v
[ Geração IA → conteudo jsonb (shape AnaliseData) ]         [AUSENTE / EXTERNO]
   | status: gerando → pendente_revisao
   | Nenhum provider de LLM em package.json (openai/anthropic/gemini ausentes).
   v
[ Revisão humana → aprovar/rejeitar ]                       [AUSENTE]
   | status: pendente_revisao → publicada | falhou
   | Não há custom admin view em app/(payload)/admin/custom/analises/
   | (Fase 4 do Payload Runbook está TODO).
   v
[ Pagamento Stripe (só tipo="completa") ]                   [AUSENTE]
   | stripeSessionId existe no schema, zero código usa.
   | Nenhuma dependência Stripe no package.json, nenhum webhook.
   v
[ /analise/[slug] — app/(site)/analise/[slug]/page.tsx ]    [IMPLEMENTADO]
   | SELECT where slug=$1 AND status='publicada'
   | Render via <PageProposta data={conteudo as AnaliseData}/>
   | noindex via robots meta.                                [OK]
   v
[ Tracking: analise_eventos ]                               [AUSENTE]
   | Tabela existe + índice. Nenhum endpoint populado.
   | firstViewedAt/lastViewedAt nunca são atualizados.
```

**Resumo**: apenas as **pontas** (wizard visual + render da análise publicada) existem. O miolo (API de ingestão, pipeline, Stripe, admin de revisão, tracking) é inexistente.

## 2. Auditoria — Checklist de integridade

### Schema DB
1. **Migrations aplicadas vs prod** — `psql "$DATABASE_URL" -c "\d public.analises"` deve bater com `lib/db/schema.ts`. Esperado: colunas de 0000 presentes. **Blocker** se divergir.
2. **Enum `status` como `text` sem CHECK** — `\d+ public.analises` mostra `text`, não CHECK constraint. Drizzle valida só em TS; um UPDATE manual pode gravar status inválido. **Importante**.
3. **`slug` unique** — já garantido por `analises_slug_unique`. OK.
4. **`tenant_id` ausente** — grep confirma zero referência. **Blocker** pra multi-tenant (decisão 4.2 A).
5. **Índice composto `(tenant_id, status)` ausente** — relevante quando admin filtrar. **Importante**.

### Formulário `/aplicacao`
6. **Campos do wizard vs schema** — wizard coleta `siteName` (mapeia `instagramHandle`?), `momento`, `gargalo`, `velocidade`, `whatsapp`. Schema tem `objetivo`, `monetizaHoje`, `tempoDisponivel` — **nomes não batem**. **Blocker** de modelagem.
7. **`email` nunca é coletado** — schema obriga `email NOT NULL`; wizard não pede. **Blocker**.
8. **`nome`** — só vem via `?name=` na query string (do Hero). Frágil. **Importante**.
9. **Validação client-side** — nenhuma (sem zod, sem required). **Importante**.
10. **Botão final "SOLICITAR HORÁRIO NA AGENDA"** — `<button>` sem `onClick`. Não submete nada. **Blocker**.

### API write path
11. **Rota `/api/aplicacao` existe?** Glob `app/api/**` retorna só `contact` e `newsletter`. **Ausente**. **Blocker**.
12. **Injeção de `tenant_id`** — padrão de `/api/contact` (resolve via host + fallback `futurah`) seria reusado. Precisa existir. **Blocker** depois de #4.
13. **Rate-limit / antispam** — `/api/contact` e `/api/newsletter` não têm. **Importante** (análises custam LLM/scraping — bot spam vira prejuízo financeiro).
14. **Idempotência por email+handle** — evitar duplicar análises. **Nice-to-have**.

### Pipeline externo
15. **Endpoint webhook de status** — nenhum. Pipeline externo não consegue marcar `scraping/gerando/pendente_revisao`. **Blocker**.
16. **Autenticação do webhook** — precisa shared secret (header `X-Pipeline-Token`). **Blocker** de segurança.
17. **Retry / timeout** — nada. Se pipeline cair a análise trava em `pendente_dados` indefinidamente. **Importante**.
18. **Contrato de `conteudo` jsonb** — `AnaliseData` (`components/proposta/types.ts`) é o shape esperado. Pipeline externo precisa gerar JSON válido contra esse tipo. Sem runtime validator (zod). **Blocker** qualitativo.

### Pagamento (só `completa`)
19. **Stripe SDK** — não está em `package.json`. **Blocker**.
20. **Rota `/api/stripe/checkout`** — ausente. **Blocker** pra `completa`.
21. **Webhook `/api/stripe/webhook`** — ausente. Sem isso `pago=true` nunca é setado. **Blocker**.
22. **Gate de render** — `/analise/[slug]` hoje renderiza qualquer `publicada`; não checa `tipo==='completa' && pago===true`. **Blocker** de monetização.

### Admin / revisão
23. **Custom view em `/admin/custom/analises`** — ausente (PAYLOAD_RUNBOOK Fase 4 TODO). **Blocker**.
24. **Endpoints Payload `endpoints:[...]`** — ausentes. **Blocker**.
25. **Botões aprovar/rejeitar/republish** — ausentes. **Blocker**.

### Render `/analise/[slug]`
26. **Consome `conteudo` como `AnaliseData`** — cast direto `conteudo as AnaliseData`. Sem zod runtime. **Importante**.
27. **`notFound()` se não `publicada`** — OK (where inclui status). OK.
28. **`noindex`** — OK.

### Tracking
29. **POST `/api/analise-eventos`** — ausente. `analise_eventos` nunca é populada. **Importante**.
30. **`firstViewedAt` / `lastViewedAt`** — server component não dispara UPDATE. **Importante**.

### Segurança
31. **Leitura de `/analise/[slug]`** — slug é o token. Slug precisa ser UUID ou ≥22 chars random. Hoje é `text` livre. **Importante**.
32. **RLS no Supabase public schema** — não documentada. **Importante**.

## 3. Gap plan — o que falta pra rodar em prod

### Blockers (fluxo não existe sem isto)

| ID | Item | Arquivo(s) | Esforço | Depende de |
|---|---|---|---|---|
| **B1** | `POST /api/aplicacao` — cria row `pendente_dados`, gera slug random, resolve `tenant_id` via host (copiar padrão de `/api/contact`) | `app/api/aplicacao/route.ts` (novo) | 4h | B2, B6 |
| **B2** | Reconciliar campos wizard × schema — expandir schema (`momento`, `gargalo`, `velocidade`) OU converter wizard pros campos atuais (`objetivo`, `monetizaHoje`, `tempoDisponivel`); adicionar input de **email** | `components/sections/ApplicationWizard.tsx`, `lib/db/schema.ts`, nova migration | 3h | — |
| **B3** | Webhook de pipeline — `POST /api/pipeline/webhook` autenticado via `PIPELINE_WEBHOOK_SECRET`, aceita `{ analiseId, status, dadosScraped?, conteudo?, error? }`, aplica transição | `app/api/pipeline/webhook/route.ts` (novo), `.env.example` | 4h | B1 |
| **B4** | Validação zod do `conteudo` — schema zod espelhando `AnaliseData`; rejeita payload inválido | `lib/proposta/validation.ts` (novo) | 3h | — |
| **B5** | Custom admin view de análises — tabela + filtros (status, tenant) + preview JSON + botões aprovar/rejeitar/reprocessar | `app/(payload)/admin/custom/analises/page.tsx`, `payload.config.ts` (`admin.components.views`), `endpoints:[...]` custom que tocam Drizzle | 12h | B6 |
| **B6** | `tenant_id` em `analises` + `analise_eventos` — migration Drizzle, backfill pra `futurah`, atualizar schema TS | `lib/db/schema.ts`, `lib/db/migrations/0002_*.sql` | 2h | — |
| **B7** | Stripe (se `completa` entra no MVP) — `npm i stripe`, rota `/api/stripe/checkout`, webhook `/api/stripe/webhook` (grava `pago=true` + `stripeSessionId`), gate em `/analise/[slug]` | vários | 8h | B5 |

### Hardening (produção decente)

| ID | Item | Esforço |
|---|---|---|
| **H1** | Rate-limit em `/api/aplicacao` (Upstash ou in-memory por IP+email) | 2h |
| **H2** | Slug seguro — 22 chars nanoid ou uuidv4 | 0.5h (dentro de B1) |
| **H3** | Access control no webhook — constant-time compare do secret + allowlist IP se pipeline for fixo | 1h |
| **H4** | `analise_eventos` endpoint + pixel no `/analise/[slug]` — `POST /api/analise-eventos` + hook client que dispara open/scroll/click, atualiza `firstViewedAt/lastViewedAt` | 4h |
| **H5** | Idempotência — unique parcial `(email, instagram_handle)` onde `status <> 'falhou'` pra evitar submissão duplicada | 1h |
| **H6** | Error state no wizard — feedback quando POST falha + retry | 2h |
| **H7** | RLS no `public` — mesmo com API-only, adicionar policy defensiva | 2h |

### Nice-to-have

| ID | Item | Esforço |
|---|---|---|
| **N1** | Página "aguarde" após submit (`/aplicacao/recebido?id=...`) com poll até `publicada` | 3h |
| **N2** | Email transacional ("sua análise está pronta") via Resend | 3h |
| **N3** | Dashboard de métricas no admin (conversão, tempo médio no pipeline, % falhou) | 4h |
| **N4** | Logs estruturados (pino) nas rotas de API + IDs de correlação | 2h |
| **N5** | Preview da análise ainda em `pendente_revisao` pro revisor (`?preview=<token>`) | 2h |

## 4. Recomendação de ordem — 5 sprints curtos

### Sprint 1 — destravar ingestão (1.5 dia)
`B2 → B6 → B1`. Ao fim do sprint, um lead real preenche o wizard e uma row aparece em `analises` com tenant. Nada é gerado ainda, mas a ponta-esquerda do funil está viva e mensurável.

### Sprint 2 — contrato com pipeline externo (1 dia)
`B3 + B4 + H3`. Pipeline externo (fora do repo — n8n, worker Python, etc.) ganha um endpoint estável pra reportar status e entregar `conteudo`. Com zod validando, `AnaliseData` malformado é rejeitado antes de virar `publicada`. A ponta-direita do funil (`/analise/[slug]`) já funciona — portanto **fim do Sprint 2 = fluxo end-to-end `express` rodando**, sem humano no meio.

### Sprint 3 — revisão humana no admin (1.5 dia)
`B5 + N5`. Destrava a transição `pendente_revisao → publicada` manual, que é o ponto onde a Futurah protege a marca antes de publicar. É aqui que a decisão 4.2 (Caminho A do Runbook) é de fato exercitada: custom view em Payload lendo Drizzle via endpoints.

### Sprint 4 — hardening (1 dia)
`H1, H2, H4, H5, H6, N4`. Rate-limit, tracking, logs. Tudo que separa "liguei pra 3 amigos" de "posso rodar tráfego pago nisto".

### Sprint 5 — monetização `completa` (1–2 dias)
`B7 + N1 + N2`. Stripe + espera + email. **Opcional no primeiro lançamento** se a Futurah só entregar `express` grátis como isca.

### Racional da ordem
- **B6 antes de B1**: adicionar `tenant_id` depois da rota obriga retrabalho; melhor já entrar com a coluna.
- **B4 no Sprint 2**: zod de `AnaliseData` é barato e protege o Sprint 3 (admin não vai precisar lidar com JSON inválido).
- **Admin depois do pipeline**: sem dados reais chegando, não dá pra validar a UI do admin.
- **Stripe por último**: maior incerteza está no pipeline — atrasar o pagamento permite iterar no produto `express` grátis primeiro.

## 5. Critical files for implementation

- `app/api/aplicacao/route.ts` (novo — ingestão)
- `components/sections/ApplicationWizard.tsx` (reconciliar campos + POST)
- `lib/db/schema.ts` (adicionar `tenant_id` + reconciliar colunas do form)
- `app/api/pipeline/webhook/route.ts` (novo — transições de status + `conteudo`)
- `app/(payload)/admin/custom/analises/page.tsx` (novo — revisão humana, Fase 4 do Runbook)

## 6. Totais

| Escopo | Esforço | Sprints |
|---|---|---|
| Blockers (sem Stripe) | ~28h | 1+2+3 |
| Blockers completos | ~36h | 1+2+3+5 |
| Com hardening | ~40h | 1+2+3+4 |
| Tudo (blockers + hardening + nice-to-have) | ~55h | 1+2+3+4+5 |

**MVP mínimo rodando em prod** (wizard → pipeline → análise publicada, sem pagamento): **~28h ≈ 3.5 dias de foco**.
