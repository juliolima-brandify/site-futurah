# Fluxo de Análise — Auditoria + Gap Plan

> **Status (2026-04-23):** diagnóstico inicial entregue por arquiteto sênior após migração Payload 3 concluída. Pontas do funil (wizard + render) estão implementadas; miolo (ingestão, pipeline, admin, pagamento, tracking) **estava ausente**. Este doc foi a fonte do plano de implementação executado em 2026-04-24.
>
> **Atualização (2026-04-24):** ingestão + geração via OpenAI + espera + entrega **implementadas end-to-end**. O miolo agora existe (API de ingestão, gerador `lib/ai/`, página de recebido, wizard refeito em typeform). Ainda pendente: scraping real, admin de revisão, Stripe, tenant_id em `analises`, hardening (rate-limit, tracking `analise_eventos`, zod runtime). Ver seção 3 pra blockers resolvidos/pendentes e seção **7 — Pós-implementação** no final.

Ver também:
- [`CLAUDE.md`](./CLAUDE.md) — seção "Fluxo de Análise (pipeline interno)" e "Pipeline de IA (`lib/ai/`)"
- [`PAYLOAD_RUNBOOK.md`](./PAYLOAD_RUNBOOK.md) — Fase 4 (esqueleto): decisão 4.2 = manter análises em Drizzle + custom admin view

## 1. Mapa do fluxo (atualizado 2026-04-24)

```
[ Landing / Hero / Home Contact ]
   | Caminho 1: form "Solicitar Diagnóstico Gratuito" → POST /api/contact → router.push(/aplicacao?name=&email=&social=)   [IMPLEMENTADO]
   | Caminho 2: link direto /aplicacao (sem query)                                                                          [IMPLEMENTADO]
   v
[ /aplicacao — app/(site)/aplicacao/page.tsx ]
   | ApplicationWizard — typeform, 1 pergunta por tela, 9-12 steps dinâmicos    [IMPLEMENTADO]
   | 0: analise | 1: momento | 2: gargalo | 3: velocidade
   | 4: headcount | 5: cargos | 6: custo-funcionario
   | 7: plataformas | 8: custo-plataformas
   | [9: nome] [10: email]  (só caminho 2) | 11: whatsapp + submit
   v
[ POST /api/aplicacao — app/api/aplicacao/route.ts ]                            [IMPLEMENTADO]
   | Valida email + handle, normaliza, gera slug nanoid(22)
   | INSERT analises status='pendente_dados', tipo='express'
   | Dispara gerarAnaliseEmBackground(id) fire-and-forget
   v
[ Pipeline externo: scraping IG → dadosScraped jsonb ]                          [AUSENTE / EXTERNO]
   | Ainda não existe. conteudo é gerado só com dados do wizard.
   v
[ lib/ai/gerar.ts — geração via OpenAI ]                                        [IMPLEMENTADO]
   | status: pendente_dados → gerando
   | buildPrompt() com shape AnaliseData → chat.completions.create (json_object)
   | Parse + validateConteudo (seções obrigatórias)
   | calcularEconomia() — determinístico, cruza catalogo com respostas do wizard
   | Merge → conteudo.economiaPrevista
   v
[ Revisão humana → aprovar/rejeitar ]                                           [AUSENTE — TODO fase 4]
   | Por ora publica direto (status='publicada').
   | Troca publicada → pendente_revisao quando admin existir
   | (marcado TODO(fase 4) em lib/ai/gerar.ts:88).
   v
[ Pagamento Stripe (só tipo="completa") ]                                       [AUSENTE]
   | Só tipo 'express' é gerado. stripeSessionId no schema, zero código usa.
   v
[ /aplicacao/recebido/[slug] — espera com polling ]                             [IMPLEMENTADO]
   | AguardandoAnalise.tsx faz GET /api/aplicacao/[slug]/status a cada 3s
   | Quando 'publicada' → router.replace(/analise/[slug])
   | Quando 'falhou' → CTA pra contato@futurah.co
   v
[ /analise/[slug] — app/(site)/analise/[slug]/page.tsx ]                        [IMPLEMENTADO]
   | SELECT where slug=$1 AND status='publicada'
   | Render via <PageProposta data={conteudo as AnaliseData}/>
   | EconomiaSection renderiza antes de Encerramento (hook pro CTA)
   | noindex via robots meta
   v
[ Tracking: analise_eventos ]                                                   [AUSENTE — H4]
   | Tabela existe + índice. Nenhum endpoint populado.
```

**Resumo**: o **miolo agora existe** — ingestão + geração + espera + entrega. Pendente: scraping real, admin humano, Stripe, tenant_id, hardening.

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

Legenda: ✅ resolvido · 🟡 parcial · 🔴 pendente.

| ID | Status | Item | Arquivo(s) | Notas |
|---|---|---|---|---|
| **B1** | ✅ | `POST /api/aplicacao` — cria row `pendente_dados`, gera slug `nanoid(22)`, valida email + handle, dispara geração em background | `app/api/aplicacao/route.ts` | **Sem** resolução de `tenant_id` ainda (depende de B6). Sem PATCH incremental — wizard envia tudo no submit final. |
| **B2** | ✅ | Reconciliar campos wizard × schema — schema ganhou `momento`, `gargalo`, `velocidade`, `equipe` (jsonb), `plataformas` (jsonb). Email é coletado no wizard (step dedicado quando caminho 2). | `components/sections/ApplicationWizard.tsx`, `lib/db/schema.ts`, migrations 0002/0003 | Colunas antigas (`objetivo`, `monetiza_hoje`, `tempo_disponivel`) ficaram no schema como deprecadas — não removidas. |
| **B3** | 🔴 | Webhook de pipeline — `POST /api/pipeline/webhook` autenticado via `PIPELINE_WEBHOOK_SECRET`, aceita transições `scraping/gerando/pendente_revisao` com `dadosScraped`/`conteudo` | `app/api/pipeline/webhook/route.ts` | **Pendente**. Hoje a IA gera só com dados do wizard. Scraping real fica como próxima iteração. |
| **B4** | 🟡 | Validação do `conteudo` — hoje `validateConteudo` em `lib/ai/gerar.ts` checa só existência das seções obrigatórias. Zod runtime profundo ainda não existe. | `lib/ai/gerar.ts` | Cobertura suficiente pra MVP. Zod completo fica pro sprint de hardening. |
| **B5** | 🔴 | Custom admin view de análises | `app/(payload)/admin/custom/analises/page.tsx` | **Pendente** (Fase 4 Payload). Hoje geração publica direto (status='publicada'), sem revisão humana. `TODO(fase 4)` marcado em `lib/ai/gerar.ts:88`. |
| **B6** | 🔴 | `tenant_id` em `analises` + `analise_eventos` | `lib/db/schema.ts` | **Pendente**. Sem isolamento multi-tenant nas análises ainda. `tenant_id` ausente não bloqueia o MVP (só existe um tenant — `futurah`). |
| **B7** | 🔴 | Stripe (só `completa`) | vários | **Pendente**. Hoje só `express` é gerado (grátis). |

### Hardening (produção decente)

| ID | Status | Item |
|---|---|---|
| **H1** | 🔴 | Rate-limit em `/api/aplicacao` (Upstash ou in-memory por IP+email). **Crítico** — cada submissão consome token OpenAI. |
| **H2** | ✅ | Slug seguro — `nanoid(22)` em `app/api/aplicacao/route.ts`. |
| **H3** | 🔴 | Access control no webhook — depende de B3 existir primeiro. |
| **H4** | 🔴 | `analise_eventos` endpoint + pixel no `/analise/[slug]`. Tabela e índice existem, nada popula. |
| **H5** | 🔴 | Idempotência — unique parcial `(email, instagram_handle)` onde `status <> 'falhou'`. |
| **H6** | 🟡 | Error state no wizard — `submitError` implementado; página `/aplicacao/recebido/[slug]` tem copy para `falhou`. Retry ainda não. |
| **H7** | 🔴 | RLS no `public`. |
| **H8** | 🔴 | **Serverless fire-and-forget** — `gerarAnaliseEmBackground` pode ser cortado antes da OpenAI responder em Vercel. Fix: trocar por `after()` do Next 15. **Crítico pra prod**. |

### Nice-to-have

| ID | Status | Item |
|---|---|---|
| **N1** | ✅ | Página "aguarde" — `/aplicacao/recebido/[slug]` com polling a cada 3s. |
| **N2** | 🔴 | Email transacional via Resend. |
| **N3** | 🔴 | Dashboard de métricas no admin. |
| **N4** | 🔴 | Logs estruturados (pino). Hoje `console.error` com prefixos `[API]` e `[ai/gerar]`. |
| **N5** | 🔴 | Preview da análise em `pendente_revisao` (depende de B5). |

## 4. Recomendação de ordem — sprints (revisada 2026-04-24)

### Sprint 1 — destravar ingestão ✅ CONCLUÍDO
Original `B2 → B6 → B1`. Executado como **`B2 → B1`** (sem B6 — `tenant_id` ficou pra depois, não bloqueia MVP single-tenant).

### Sprint 2 — pipeline end-to-end 🟡 PARCIAL
Original `B3 + B4 + H3`. **Divergência**: em vez de pipeline externo com webhook (B3), o gerador foi integrado diretamente ao repo (`lib/ai/` + `gerarAnaliseEmBackground`) consumindo OpenAI direto. Scraping real ainda ausente. B3 + H3 ficam como próxima iteração se quisermos trazer scraping do Instagram pra dentro do pipeline. B4 resolvido só parcialmente (validação leve em `validateConteudo`).

### Sprint 3 — revisão humana no admin 🔴 PENDENTE
`B5 + N5`. Não iniciado. Sem isso, toda análise gerada publica direto (risco de marca). Bloqueador pra abrir tráfego pago.

### Sprint 4 — hardening 🔴 PENDENTE (urgente)
`H1 (rate-limit)`, `H8 (after() do Next)`, `H4 (tracking)`, `H5 (idempotência)`, `N4 (logs)`. **`H8` é o mais urgente** — sem isso, análises podem ficar travadas em `gerando` em prod quando a função serverless é encerrada antes da OpenAI responder. `H1` também crítico se for abrir tráfego (custo OpenAI).

### Sprint 5 — monetização `completa` 🔴 PENDENTE
`B7 + N2`. Opcional — só se quiser lançar `completa` pago. `express` grátis como isca já está no ar.

### Sprint 6 — scraping real (novo)
`B3 + H3` + integração real com Instagram scraping (n8n, Apify, etc). Promove o `dadosScraped` de `null` pra conteúdo real, aumentando a qualidade da análise gerada. Fica como sprint dedicado porque envolve decisão de stack externo.

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

## 7. Pós-implementação (2026-04-24)

### O que foi entregue
- **Ingestão**: `POST /api/aplicacao` (`app/api/aplicacao/route.ts`), wizard com validação + submit, página de espera com polling (`/aplicacao/recebido/[slug]`).
- **Geração via IA**: todo o código em `lib/ai/` — cliente OpenAI, prompt estruturado, catálogo de substituição (10 cargos + 19 plataformas), cálculo programático de economia, orquestrador com idempotência e error handling.
- **Seção nova na análise**: `EconomiaPrevista` — raio-X de custos com bloco de "economia mensal/anual" e CTA pra Sessão Estratégica. Plugada em `PageProposta` antes do encerramento.
- **Wizard typeform**: 9-12 steps dinâmicos, 1 pergunta por tela, centralizado, progress bar, Enter avança. Steps de contato (nome/email/whatsapp) condicionais ao caminho 1 vs 2.
- **Schema**: colunas novas (`momento`, `gargalo`, `velocidade`, `equipe`, `plataformas`) via migrations 0002 e 0003.

### Commits
- `a658b31` — feat(analise): fluxo end-to-end wizard → OpenAI → /analise/[slug]
- `291a2dd` — feat(wizard): redesign typeform — uma pergunta por tela

### Próxima ação crítica
**H8** (trocar fire-and-forget por `after()` do Next 15). Enquanto isso não for feito, existe risco real em prod de análises travarem em `gerando` por corte serverless.

### Catálogo extensível
Adicionar um cargo/plataforma ao catálogo leva 3 passos (editar `lib/ai/catalogo.ts` + `ApplicationWizard.tsx`). Detalhe documentado no `CLAUDE.md` → seção "Pipeline de IA".
