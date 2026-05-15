# Fluxo de Análise — Auditoria + Gap Plan

> **Status (2026-04-23):** diagnóstico inicial entregue por arquiteto sênior após migração Payload 3 concluída. Pontas do funil (wizard + render) estão implementadas; miolo (ingestão, pipeline, admin, pagamento, tracking) **estava ausente**. Este doc foi a fonte do plano de implementação executado em 2026-04-24.
>
> **Atualização (2026-04-24):** ingestão + geração via OpenAI + espera + entrega **implementadas end-to-end**. O miolo agora existe (API de ingestão, gerador `lib/ai/`, página de recebido, wizard refeito em typeform). Ainda pendente: scraping real, admin de revisão, Stripe, tenant_id em `analises`, hardening (rate-limit, tracking `analise_eventos`, zod runtime). Ver seção 3 pra blockers resolvidos/pendentes e seção **7 — Pós-implementação** no final.
>
> **Atualização (2026-05-06):** migrado pra **Vercel AI Gateway** (`@ai-sdk/gateway` + `generateObject`). Schema zod (`lib/ai/schema.ts`) virou source-of-truth do output da IA — resolve **B4** (validação runtime). `H8` resolvido com `after()` do `next/server`. Provider/modelo agora trocável via `AI_GATEWAY_MODEL` sem mexer em código. Em prod, OIDC do Vercel autentica o gateway sozinho — `OPENAI_API_KEY` foi descontinuada.
>
> **Atualização (2026-05-11):** mudança de produto — **revisão humana desligada do fluxo de lead** + **página da análise simplificada radicalmente**. IA gera → publica direto → resultado aparece na própria página de espera (sem email). A `/analise/[slug]` agora é uma **única tela enxuta** (sem Header, sem Footer, sem Hero/Retrato/Diagnóstico/Tese/Economia/Encerramento/FAQ): só callout de valor na mesa → maturidade → radar de 8 pilares → cards de pilares → CTA pra Sessão Estratégica → fundadores. Schema da IA ganhou seção `pilares` (6 pilares com score 0-10); +2 pilares "comportamentais" (Maturidade, Velocidade) são derivados em código sem alucinação. `/admin/analises` segue existindo como histórico mas não tem mais fila de aprovação. Ver seção **9 — Pós-implementação (2026-05-11)**.

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
[ lib/ai/gerar.ts — geração via AI Gateway ]                                    [IMPLEMENTADO]
   | status: pendente_dados → gerando
   | buildPrompt() + generateObject(analiseGeradaSchema)
   | Schema inclui `pilares.pilares` (array de 6 com score 0-10)
   | calcularEconomia() — determinístico, cruza catalogo com respostas do wizard
   | derivarPilaresComportamentais() — 2 pilares âncora (Maturidade, Velocidade)
   |   calculados em código a partir de momento/velocidade do wizard
   | Merge → conteudo.economiaPrevista + conteudo.pilares (8 pilares totais)
   v
[ Publicação direta — sem revisão humana ]                                      [IMPLEMENTADO 2026-05-11]
   | status='publicada' + publishedAt=now() direto após gerar.
   | (Revisão humana foi removida do caminho crítico — admin /admin/analises
   |  segue existindo mas não tem mais fila pendente. Email Resend não dispara.)
   v
[ Pagamento Stripe (só tipo="completa") ]                                       [AUSENTE]
   | Só tipo 'express' é gerado. stripeSessionId no schema, zero código usa.
   v
[ /aplicacao/recebido/[slug] — espera com polling ]                             [IMPLEMENTADO]
   | AguardandoAnalise.tsx faz GET /api/aplicacao/[slug]/status a cada 3s
   | Quando 'publicada' → router.replace(/analise/[slug])  (em ~10-30s)
   | Quando 'falhou' → CTA pra contato@futurah.co
   v
[ /analise/[slug] — layout minimalista ]                                        [IMPLEMENTADO]
   | SELECT where slug=$1 AND status='publicada'
   | <main> próprio, SEM Header, SEM Footer, SEM PageProposta
   | Ordem: AnaliseTracker → ValorNaMesa → MaturidadeSlider →
   |   RadarPilares → PilaresCards → CtaTeaser → TeamTestimonial
   | Não usa: Hero, Retrato, Diagnóstico, Tese, Economia detalhada,
   |   Encerramento, FAQ, Frentes, Banco, Fases, Escopo, Potencial.
   |   (Esses só existem em propostas estáticas via PageProposta.)
   | noindex via robots meta
   v
[ Tracking H4 — via tracker-worker ]                                            [IMPLEMENTADO]
   | analise_view, analise_scroll_50/90, analise_cta_click (location: economia|encerramento|teaser)
```

**Resumo**: fluxo end-to-end **publica direto** com diagnóstico visual (radar de 8 pilares + callout de valor na mesa). Plano de ação completo gated atrás de Sessão Estratégica. Pendente: scraping real, Stripe, tenant_id.

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
| **B4** | ✅ | Validação do `conteudo` — `generateObject` do Vercel AI SDK valida o output contra `analiseGeradaSchema` (`lib/ai/schema.ts`) em runtime. Type-safe end-to-end. | `lib/ai/schema.ts`, `lib/ai/gerar.ts` | Schema zod completo (sem `economiaPrevista`, que é calculado em código). |
| **B5** | ✅ (órfão desde 2026-05-11) | Custom admin view de análises | `app/admin/analises/`, `app/api/admin/analises/[id]/{aprovar,rejeitar}/route.ts` | Existe mas saiu do caminho crítico: análises publicam direto. Admin segue como histórico/leitura. Endpoints aprovar/rejeitar ficaram órfãos — operam só sobre rows legadas em `pendente_revisao`. |
| **B6** | 🔴 | `tenant_id` em `analises` + `analise_eventos` | `lib/db/schema.ts` | **Pendente**. Sem isolamento multi-tenant nas análises ainda. `tenant_id` ausente não bloqueia o MVP (só existe um tenant — `futurah`). |
| **B7** | 🔴 | Stripe (só `completa`) | vários | **Pendente**. Hoje só `express` é gerado (grátis). |

### Hardening (produção decente)

| ID | Status | Item |
|---|---|---|
| **H1** | ✅ | Rate-limit in-memory em `/api/aplicacao` — 5/h por IP, 2/24h por email. Resposta 429 com `Retry-After`. `lib/rate-limit.ts`. Migrar pra Upstash se escalar horizontal. |
| **H2** | ✅ | Slug seguro — `nanoid(22)` em `app/api/aplicacao/route.ts`. |
| **H3** | 🔴 | Access control no webhook — depende de B3 existir primeiro. |
| **H4** | ✅ | Tracking de leitura via tracker-worker existente (`t.futurah.co`). `AnaliseTracker` (client) dispara `analise_view` + `analise_scroll_50/90` (IntersectionObserver). `AnaliseCTA` instrumenta os dois CTAs com `analise_cta_click` (pointerdown + auxclick). Reusa `siteId='futurah'`. Tabela `analise_eventos` em Postgres NÃO foi populada — eventos vão pro Analytics Engine via Worker. |
| **H5** | 🔴 | Idempotência — unique parcial `(email, instagram_handle)` onde `status <> 'falhou'`. |
| **H6** | 🟡 | Error state no wizard — `submitError` implementado; página `/aplicacao/recebido/[slug]` tem copy para `falhou`. Retry ainda não. |
| **H7** | 🔴 | RLS no `public`. |
| **H8** | ✅ | `after()` do `next/server` aplicado em `app/api/aplicacao/route.ts` — geração roda fora do response cycle mas dentro do budget da função serverless. |

### Nice-to-have

| ID | Status | Item |
|---|---|---|
| **N1** | ✅ | Página "aguarde" — `/aplicacao/recebido/[slug]` com polling a cada 3s. **Atualizado 2026-05-11**: polling segue até `publicada` (não para mais em `pendente_revisao`, que deixou de existir no caminho normal). |
| **N2** | ✅ (órfão desde 2026-05-11) | Email transacional via Resend. Antes disparava quando admin aprovava em `/admin/analises`. Agora não dispara no fluxo normal (publicação é direta). Helper `lib/email/resend.ts` segue existindo e funcional pra usos futuros. |
| **N3** | 🔴 | Dashboard de métricas no admin. |
| **N4** | 🔴 | Logs estruturados (pino). Hoje `console.error` com prefixos `[API]` e `[ai/gerar]`. |
| **N5** | ✅ | Preview da análise em `pendente_revisao` via `/analise/[slug]?preview=1` — só funciona quando request vem de superadmin autenticado (gate por `payload.auth({ headers })`). |

## 4. Recomendação de ordem — sprints (revisada 2026-04-24)

### Sprint 1 — destravar ingestão ✅ CONCLUÍDO
Original `B2 → B6 → B1`. Executado como **`B2 → B1`** (sem B6 — `tenant_id` ficou pra depois, não bloqueia MVP single-tenant).

### Sprint 2 — pipeline end-to-end 🟡 PARCIAL
Original `B3 + B4 + H3`. **Divergência**: em vez de pipeline externo com webhook (B3), o gerador foi integrado diretamente ao repo (`lib/ai/` + `gerarAnaliseEmBackground`) consumindo OpenAI direto. Scraping real ainda ausente. B3 + H3 ficam como próxima iteração se quisermos trazer scraping do Instagram pra dentro do pipeline. B4 resolvido só parcialmente (validação leve em `validateConteudo`).

### Sprint 3 — revisão humana no admin ✅ CONCLUÍDO
`B5 + N5`. Admin em `/admin/analises` (server-rendered, `requireSuperadmin`), endpoints `aprovar`/`rejeitar`. Análises geradas saem como `pendente_revisao` em vez de `publicada`. Lead vê copy "em revisão" e espera email.

### Sprint 4 — hardening 🟡 QUASE
`H8` ✅, `H1` ✅, `H4` ✅. Pendentes: `H5 (idempotência)`, `N4 (logs)`, `H7 (RLS)`.

### Sprint 5 — monetização `completa` 🔴 PENDENTE
`B7`. Opcional — só se quiser lançar `completa` pago. `express` grátis como isca já está no ar. (`N2` saiu daqui — virou parte do Sprint 3.)

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

## 8. Pós-implementação (2026-05-08)

### O que foi entregue nesta rodada
- **Calendly no CTA** (não estava no plan formal): `AnaliseData.agendaUrl` é setado server-side em `gerar.ts` lendo `NEXT_PUBLIC_AGENDA_URL` na hora de salvar (snapshot imutável por análise). `EconomiaSection` e `EncerramentoSection` resolvem a URL via `components/proposta/agendaUrl.ts`. `AnaliseCTA` (client component) wrapeia `<a>` com tracking. Sem env: CTA cai em `mailto:contato@futurah.co`.
- **H1**: rate-limit in-memory (5/h por IP, 2/24h por email) em `/api/aplicacao` via `lib/rate-limit.ts`. 429 com `Retry-After`.
- **B5 + N5**: admin de revisão `/admin/analises` (RSC, `requireSuperadmin`) com listagem de pendentes, preview e botões aprovar/rejeitar. Endpoints `POST /api/admin/analises/[id]/{aprovar,rejeitar}`. Análises agora saem como `pendente_revisao` (não publicada direto).
- **N2**: email transacional via Resend disparado quando admin aprova. Helper `lib/email/resend.ts` usa SDK oficial. Sem `RESEND_API_KEY`: `console.warn` + segue (não quebra admin).
- **H4**: tracking via `@futurah/tracker-sdk` em `/analise/[slug]`. Eventos: `analise_view`, `analise_scroll_50`, `analise_scroll_90`, `analise_cta_click`. Reusa `siteId='futurah'` da config global.

### Commits
- `8ca4138f` — chore(site-futurah): consolidar migração AI Gateway (WIP pré-existente)
- `9db2775e` — feat(analise): CTAs apontam pra agenda comercial via NEXT_PUBLIC_AGENDA_URL
- `b76f1f97` — feat(analise): rate-limit em /api/aplicacao
- `2b225e32` — feat(analise): admin de revisão humana + email transacional Resend
- `92ddb17f` — feat(analise): tracking via tracker-worker em /analise/[slug] + Resend SDK

### TODOs deixados
- `NEXT_PUBLIC_AGENDA_URL` — URL real da agenda (Calendly/Cal.com) precisa ser setada na Vercel pra prod e em `.env.local` pra dev.
- `RESEND_API_KEY` + `RESEND_FROM_EMAIL` — pegar key no Resend e configurar domínio verificado.
- Sidebar nativa do Payload com link pra `/admin/analises` — depende de regen do `importMap.js` via `npm run dev`. Fica como TODO. Por ora o link aparece no nav do `/admin/tracking`.

## 9. Pós-implementação (2026-05-11) — fluxo direto + teaser visual

### Mudança de produto
Decisão: **retirar a revisão humana do caminho crítico** e fazer a análise aparecer direto na própria página de espera, sem email. Ao mesmo tempo, **transformar a análise gerada num teaser visual** que mostra diagnóstico forte mas guarda o plano de ação completo pra Sessão Estratégica. Inspirado em UX de diagnósticos tipo "Diagnóstico ECOM" (agenciawedo).

### O que foi entregue

**Backend — publicação direta**
- `lib/ai/gerar.ts`: status final mudou de `pendente_revisao` pra `publicada` + setar `publishedAt = now()`. Análise vai pro ar assim que IA termina.
- `app/(site)/aplicacao/recebido/[slug]/AguardandoAnalise.tsx`: removido early-return em `pendente_revisao`. Polling continua até `publicada` (10-30s típico). Copy atualizada — sem promessa de email.

**Schema da IA — pilares**
- `lib/ai/schema.ts`: adicionado `pilaresSchema` com 6 pilares (enum estrito de chaves: `aquisicao`, `posicionamento`, `processo-comercial`, `capacidade-operacional`, `stack-plataformas`, `automacao-ia`). Cada pilar tem `chave`, `nome`, `score` (0-10 inteiro), `descricao` (~140 chars).
- `lib/ai/prompt-analise.ts`: bloco `PILARES_BRIEF` no system com critérios de calibração por gargalo/momento/equipe/plataformas. Princípio: ao menos 1 pilar de "dor" tem score ≤ 4 e automação-IA sempre ≤ 5 (cria a abertura comercial).
- `lib/ai/gerar.ts`: função `derivarPilaresComportamentais(momento, velocidade)` calcula 2 pilares "âncora" sem IA — Maturidade do Negócio (validação=3, tração=6, escala=8) e Velocidade de Execução (pesquisando=2, validar=6, prioridade=9). São mergidos com os 6 da IA → total de 8 pilares no radar.

**Frontend — `/analise/[slug]` enxuto, sem `PageProposta`**
- A página `/analise/[slug]` foi reescrita pra **NÃO usar `PageProposta`**. Layout próprio, minimalista, sem Header e sem Footer.
- Ordem final: `AnaliseTracker` → `ValorNaMesaSection` → `MaturidadeSlider` → `RadarPilares` → `PilaresCards` → `CtaTeaserSection` → `TeamTestimonialSection`. Só isso.
- Removidas da página (mas ainda existem como componentes pra propostas estáticas): Hero, Retrato, Diagnóstico, Tese, Economia detalhada (tabela de cargos/plataformas), Encerramento, FAQ, Frentes, BancoIdeias, Fases, Escopo, Potencial.
- `PageProposta` voltou ao formato original (sem prop `modoTeaser`) — segue usado SÓ por `/proposta-haytarzan`, `/proposta-augusto-felipe`, `/proposta-carlos-damiao`.

**Componentes visuais novos** (`components/proposta/sections/`)
- `ValorNaMesaSection.tsx` — callout vermelho ("Sua operação está deixando aproximadamente R$ X,XX na mesa todos os meses"). Lê `economiaPrevista.totais.economiaMensal`.
- `MaturidadeSlider.tsx` — slider horizontal com gradiente vermelho→amarelo→verde, posicionado pelo score do pilar `maturidade`.
- `RadarPilares.tsx` — radar SVG octogonal (8 vértices), grid concêntrico (25/50/75/100%), polígono de score, labels coloridas por faixa. Sem libs externas — SVG puro, server-rendered.
- `PilaresCards.tsx` — lista de 8 cards (bolinha colorida + nome + descrição + pill `N/10`).
- `CtaTeaserSection.tsx` — bloco escuro com CTA "Agendar Sessão Estratégica" instrumentado via `AnaliseCTA` com novo `location="teaser"`.

**Tracking**
- `AnaliseCTA` ganhou location `"teaser"` (além de `"economia"` e `"encerramento"`) pra segmentar cliques no dashboard.

### Iteração final do mesmo dia — página enxuta (sem chrome)
Decisão posterior no mesmo dia: a análise gerada ficou muito longa. Reduzido pra **uma tela só**, sem Header/Footer:

1. `ValorNaMesaSection` — callout vermelho
2. `MaturidadeSlider`
3. `RadarPilares` (radar SVG)
4. `PilaresCards` (8 cards)
5. `CtaTeaserSection`
6. `TeamTestimonialSection`

A `/analise/[slug]` **parou de usar `PageProposta`** — passou a montar seu próprio `<main>` direto. A prop `modoTeaser` foi removida do `PageProposta`, que voltou ao formato original (só pra propostas estáticas).

Bug do `RadarPilares` (labels laterais sobrepondo o desenho) corrigido junto: viewBox aumentado pra 800×720, `transformForAnchor` removido, posicionamento de rect+text agora baseado em `Math.cos(angle)` com 3 modos (start/middle/end).

### Commits
- `33380a39` — feat(analise): publicação direta + radar de pilares + modo teaser
- (este commit) refactor(analise): /analise/[slug] enxuto + fix radar labels

### O que ficou órfão (sem remover ainda)
- `/admin/analises` + endpoints `aprovar`/`rejeitar` — funcionam, mas a fila de `pendente_revisao` não tem mais entradas novas.
- Email Resend — código intacto, mas não dispara no fluxo normal.
- Preview por superadmin via `?preview=1` — continua funcionando (gate por `payload.auth`), só não tem mais utilidade no caminho normal.
- Componentes de proposta tradicionais (`Hero`, `Retrato`, `Diagnostico`, `Tese`, `Frentes`, `BancoIdeias`, `Fases`, `Escopo`, `Potencial`, `Economia` detalhada, `Encerramento`, `MiniFaq`) — não aparecem mais em análises geradas. Continuam usados pelas propostas estáticas.
- Seções da `analiseGeradaSchema` que a IA gera mas não aparecem na página (`hero`, `retrato`, `diagnostico`, `tese`, `frentes`, `bancoIdeias`, `fases`, `escopo`, `potencial`, `encerramento`, `miniFaq`) — ficam gravadas em `conteudo` mas não renderizadas. Custo de tokens "desperdiçado" — vale enxugar o prompt+schema numa próxima rodada se quiser economizar.

### Iteração 3 do mesmo dia — schema/prompt enxutos
Tokens da IA estavam sendo gastos em seções que não aparecem mais (hero, retrato, diagnostico, tese, frentes, banco, fases, escopo, potencial, encerramento, faq). Removidos do schema e do prompt.

**Schema** (`lib/ai/schema.ts`): `analiseGeradaSchema` agora é só `{ meta: { title, description }, pilares: { pilares[6] } }`. Sem `variante`, `modelo`, nem qualquer das seções tradicionais.

**Prompt** (`lib/ai/prompt-analise.ts`): removidas instruções pra `{{highlight}}`/`{{italic}}` (que eram só pra tese/encerramento), persona enxuta. Adicionado `META_BRIEF` curto. `PILARES_BRIEF` mantido inalterado.

**Tipo** (`components/proposta/types.ts`): novo tipo `AnaliseGeradaConteudo` minimal — `{ meta, pilares?, economiaPrevista?, agendaUrl?, variante?, modelo? }`. `AnaliseData` continua existindo intacto pra propostas estáticas.

**Gerar** (`lib/ai/gerar.ts`): salva `conteudo` como `AnaliseGeradaConteudo`. Removido `stripNulls` (sem mais `.nullable()` no schema).

**Render** (`app/(site)/analise/[slug]/page.tsx`): lê `conteudo as AnaliseGeradaConteudo`. `AnaliseTracker` recebe defaults pra `variante` e `modelo` (já não vêm da IA).

**Admin órfão** (`/api/admin/analises/[id]/aprovar`): cast de `conteudo` virou `{ agendaUrl?: string }` defensivo — funciona pra ambos os shapes (legado e novo).

### Commits
- `33380a39` — feat(analise): publicação direta + radar de pilares + modo teaser
- `85a8d6e7` — refactor(analise): /analise/[slug] enxuto + fix radar labels
- (este commit) refactor(ai): enxuga schema e prompt da análise pra só meta + pilares

### Próxima ação crítica
Remover o código órfão de admin/Resend e os componentes de proposta que ficaram exclusivos das estáticas (se valer a manutenção de duplicação). Por ora todos estão estáveis em stand-by.

## 10. Iteração planejada (2026-05-15) — prévia de soluções da Futurah

### Decisão de produto
A análise gerada hoje é puramente diagnóstica (radar + pilares + valor na mesa). Vamos adicionar uma **prévia de soluções da Futurah** entre `PilaresCards` e `CtaTeaserSection` — vitrine curta do que a Futurah faz, **personalizada pelo gargalo do lead**, mas sem entregar o plano de ação completo (esse continua gated atrás da Sessão Estratégica).

**Decisões travadas:**
- **Personalização**: IA escolhe 3-5 soluções de um catálogo fixo, com 1 linha contextualizada pro gargalo/cargos/plataformas do lead.
- **Profundidade**: nome + 1 linha (~80 chars) — sem descrição longa, sem benefício elaborado. Mantém o gate da Sessão.
- **Posição**: entre `PilaresCards` e `CtaTeaserSection`. Lê como progressão: problema → diagnóstico → o que dá pra fazer → vamos conversar.

### Catálogo fixo (`lib/ai/catalogo-solucoes.ts` — novo)
Source-of-truth com **10 soluções** (enum estrito pra schema). Cada entry tem `{ chave, nome, descricaoBase, relevantePara }`:

- `agente-atendimento` — Agente de Atendimento 24h (DM + WhatsApp)
- `agente-sdr` — Agente SDR / Pré-qualificação
- `agente-agendamento` — Agente de Agendamento
- `agente-followup` — Agente de Follow-up
- `landing-conversao` — Landing Page de Conversão
- `identidade-visual` — Identidade Visual
- `trafego-pago` — Tráfego Pago Gerenciado (Meta + Google)
- `conteudo` — Conteúdo Recorrente
- `dashboard` — Dashboard Operacional
- `crm-integracoes` — CRM + Integrações

### Schema da IA (`lib/ai/schema.ts`)
Adiciona campo `solucoes` ao `analiseGeradaSchema`:

```ts
solucoes: z.object({
  solucoes: z.array(z.object({
    chave: solucaoChaveSchema,       // enum estrito do catálogo
    linha: z.string()                  // ~80 chars contextualizada
  })).min(3).max(5)
})
```

### Prompt (`lib/ai/prompt-analise.ts`)
Novo bloco `SOLUCOES_BRIEF`:
- Lista do catálogo com `chave + nome` (IA escolhe por chave, sem inventar).
- Regras de calibração por gargalo:
  - `trafego` → obrigatórios: `trafego-pago` + `landing-conversao`
  - `processo` → obrigatórios: `agente-atendimento` + `agente-sdr`
  - `gestao` → obrigatórios: agentes diversos + `dashboard`
  - `posicionamento` → obrigatórios: `identidade-visual` + `landing-conversao` + `conteudo`
- Linha tem que citar contexto do lead (cargos/plataformas) — proibido genérico.

### Tipo (`components/proposta/types.ts`)
Adiciona `solucoes?: SolucoesData` em `AnaliseGeradaConteudo` (opcional pra não quebrar análises antigas).

### Componente (`components/proposta/sections/PreviaSolucoesSection.tsx` — novo)
Lista vertical de cards minimalistas. Cada card: bolinha colorida + `nome` (negrito) + `linha` (cinza). Tom alinhado ao resto da página enxuta — sem CTAs internos, sem ícones decorativos pesados.

### Render (`app/(site)/analise/[slug]/page.tsx`)
Inserir `<PreviaSolucoesSection solucoes={conteudo.solucoes} />` entre `<PilaresCards />` e `<CtaTeaserSection />`. Fallback silencioso se `solucoes` ausente (análises pré-mudança não renderizam a seção).

### Custo
- Input: ~200 tokens (`SOLUCOES_BRIEF` + catálogo).
- Output: ~150 tokens (3-5 itens × ~80 chars + chaves).
- Marginal — mesma ordem do `PILARES_BRIEF` atual.

### Migration
Nenhuma. `conteudo` é jsonb; novos campos coexistem com shape antigo sem alterar schema do Postgres. Análises antigas (sem `solucoes`) seguem renderizando — só não mostram a nova seção.

### Status
🔴 Planejado, não implementado. Doc deste plano commitado em 2026-05-15. Ordem de execução prevista: catálogo → schema → prompt → tipo → componente → render → doc final.

## 11. Pós-implementação (2026-05-15) — Resend reativado no fluxo direto

### Contexto
Desde a mudança pra publicação direta (2026-05-11), o Resend ficou órfão — código intacto e env vars (`RESEND_API_KEY`, `RESEND_FROM_EMAIL`) configuradas na Vercel, mas o helper `enviarEmailAnalisePronta` só era chamado em `POST /api/admin/analises/[id]/aprovar`, que deixou de ser acionado no caminho normal. Resultado: leads recebiam a análise apenas via polling em `/aplicacao/recebido/[slug]`, sem cópia por email pra resgatar depois.

### O que foi entregue
- **`lib/ai/gerar.ts`**: importa `enviarEmailAnalisePronta` e chama logo após o `UPDATE` que seta `status='publicada'`. Chamada isolada em `try/catch` interno — falha de email loga `[ai/gerar] resend falhou` mas **não** marca a análise como `falhou` (ela já publicou com sucesso).
- **Comportamento**: best-effort. Sem `RESEND_API_KEY` (dev local sem chave): helper retorna `{ skipped: true }` silenciosamente, sem warning chato. Em prod: dispara automaticamente em **toda análise gerada**.
- **Payload do email**: `to = row.email`, `nome = row.nome`, `slug = row.slug`, `agendaUrl` (snapshot da env capturado mais cedo no mesmo fluxo). Mantém consistência com o `agendaUrl` gravado em `conteudo` — não há divergência entre o que aparece no CTA da página e o do email.

### Decisão de design: best-effort, não retry
Email NÃO entra no caminho crítico. Se Resend cair ou rate-limit estourar:
- Análise segue publicada e acessível via link direto.
- Lead vê o resultado pela página de espera (polling).
- Log fica no Vercel pra investigação manual se quisermos reenviar.

Não há retry automático nem fila persistente. Volume baixo (~10-30 análises/dia) não justifica. Se virar problema, próxima iteração seria mover o disparo pra worker dedicado com retry exponencial.

### Commits
- (este commit) feat(analise): dispara email Resend automaticamente ao publicar análise

### Doc atualizada
- `CLAUDE.md`: env vars (`RESEND_API_KEY`/`RESEND_FROM_EMAIL`), estado do fluxo (linha "Estado (2026-05-15)"), passo 8 do gerador, seção do painel admin (fluxo atual reativado).
