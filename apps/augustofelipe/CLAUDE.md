# CLAUDE.md — apps/augustofelipe

Hub do domínio `augustofelipe.com`. Next.js 15 + Tailwind + Manrope.

## Comandos

```bash
npm run dev        # localhost:3002
npm run build
npm run typecheck
```

## Rotas

| Rota | Tipo | Notas |
|---|---|---|
| `/` | static | Home |
| `/lp/[slug]` | dynamic | Landing pages |
| `/quiz/[slug]` | dynamic | Quizzes genéricos |
| `/analise/[slug]` | dynamic | Análises individuais |
| `/diagnostico` | static | Quiz "Construindo um Viral" (R$ 47) — pitch + captura de lead; pré-preenche o checkout Cakto com os dados |
| `/construindo-um-viral` | static | Página de venda direta (renderiza só o `PitchStep`, sem quiz) — pra tráfego quente |
| `/lista-espera` | static | Mesmo `Quiz` com `mode="waitlist"` |
| `/privacidade` | static | Política de privacidade (LGPD). Usada como Privacy Policy URL da Action do GPT |
| `/creator-elite/sessao` | dynamic, **noindex** | Deck da Sessão Estratégica. `?ig=` ou `?email=` carrega o lead real do Payload; sem param cai no exemplo (Stéfani) |
| `/creator-elite/qualificacao` | static, **noindex** | Form de qualificação pré-sessão da mentoria |
| `/creator-elite/onboarding` | static, **noindex** | Questionário pré-call da mentoria Creator Elite — link **privado**, mandado só pra quem entra na mentoria |

## APIs

| Endpoint | Função |
|---|---|
| `POST /api/diagnostico/lead` | Proxy pro Payload (`source=diagnostico` ou `waitlist`) |
| `POST /api/creator-elite/qualificacao` | Proxy pro Payload (`source=creator-elite-qualificacao`) |
| `POST /api/creator-elite/onboarding` | Proxy pro Payload (`source=creator-elite-onboarding`) + email pro Augusto via Resend |
| `GET /api/analise-perfil` | Action do Custom GPT de Análise. Puxa perfil + últimos posts do Instagram via Apify, normaliza e devolve JSON enxuto. **Não** é proxy de leads (ver abaixo) |

Os endpoints de **leads** encaminham pra `https://www.futurah.co/api/leads/ingest` com `siteId=augustofelipe`, autenticados via `Authorization: Bearer $LEADS_INGEST_TOKEN`. Dedup por `(tenant, email)`.

`GET /api/analise-perfil` é diferente: auth via `Authorization: Bearer $ANALISE_API_KEY`, params `?handle=&email=`. Usa `APIFY_TOKEN` (server-side) pra rodar `apify~instagram-profile-scraper` + `apify~instagram-scraper` em paralelo. Aplica **gate de escassez** (1 análise grátis por email) gravando na tabela `analise_usage` no Postgres (`DATABASE_URL`) — fail-open se o DB cair. Helpers em `lib/db.ts` + `lib/analise-gate.ts`. Cache 24h por @ + rate-limit. `maxDuration=60` (precisa Vercel Pro).

## Envs

| Var | Onde | Obrigatória? | Notas |
|---|---|---|---|
| `LEADS_INGEST_TOKEN` | Vercel + `.env.local` | Sim | Bearer pro `/api/leads/ingest` do `site-futurah`. Sem isso as APIs retornam 500. |
| `LEADS_INGEST_URL` | Vercel | Opcional | Override do endpoint (default `https://www.futurah.co/api/leads/ingest`). |
| `RESEND_API_KEY` | Vercel + `.env.local` | Opcional | **Chave exclusiva do augustofelipe** (NÃO compartilha com `site-futurah`). Sem ela o email do onboarding é pulado silenciosamente. |
| `RESEND_FROM_EMAIL` | — | Opcional | Default `Creator Elite <analise@futurah.co>`. Domínio precisa estar verificado no Resend. |
| `CREATOR_ELITE_NOTIFY_EMAIL` | — | Opcional | Default `augustofelipe@futurah.co`. Destinatário do email de onboarding. |
| `NEXT_PUBLIC_TRACKER_ENDPOINT` | Vercel | Sim | `https://t.augustofelipe.com/e` ou similar — consumido pelo `TrackerBoundary`. |
| `NEXT_PUBLIC_META_PIXEL_ID` | Vercel | Sim | Pixel ID pra CAPI V1 (ver `meta-capi-v1` memory). |
| `APIFY_TOKEN` | Vercel | Sim (pra `/api/analise-perfil`) | Token da conta Apify (`adm.futurah@gmail.com`). Conta precisa de **plano pago** pra rodar os actors de Instagram (free esgota e dá HTTP 402). Secret. |
| `ANALISE_API_KEY` | Vercel | Sim (pra `/api/analise-perfil`) | Protege o endpoint; o **mesmo** valor vai na Action do GPT (Authentication → Bearer). |
| `DATABASE_URL` | Vercel | Opcional | Postgres do Payload (mesmo do `site-futurah`). Gate de escassez da análise. Sem isso o gate libera tudo (fail-open). |

## Gotchas

- **Adicionar env via Vercel CLI não dispara redeploy**. Deploy existente continua com env antiga. Depois de `vercel env add`, rode `vercel redeploy <url>` no último prod ou empurra um commit novo.
- **`next build` no Windows às vezes erra `spawn UNKNOWN`** em "Generating static pages" mesmo depois de `Compiled successfully`. É problema de ambiente Win, não do código — typecheck + compile passando é suficiente; a build de prod roda no Vercel (Linux) sem isso.
- **ESLint não está configurado** (`next lint` pede setup interativo). Pra rodar lint num CI futuro, configurar manualmente.
- **Resend exige domínio verificado pro `from`**. `futurah.co` já está verificado; se quiser usar `augustofelipe.com` como from, verificar antes no painel Resend.

## Onboarding Creator Elite — detalhes

- **Form** em `app/creator-elite/onboarding/OnboardingForm.tsx` (client). 8 etapas: identificação → nicho → posicionamento → monetização → percepção → dores → bloqueios → objetivos.
- **Autosave** em `localStorage` chave `creator-elite-onboarding-v1`. Banner "continuar de onde parei" no retorno. Limpa após sucesso.
- **UX**: botão voltar, progress bar com label da etapa, validação inline, contador de caracteres com cor por estado, Enter avança (Ctrl/Cmd+Enter em textareas), autofocus, auto-resize de textarea, "Prefiro não dizer" no faturamento.
- **API** em `app/api/creator-elite/onboarding/route.ts`. Valida → forward pro Payload → dispara email via `after()` (best-effort, falha não derruba response).
- **Email helper** em `lib/email/onboarding.ts` (Resend). HTML formatado com tabela de respostas + Reply-To no email do aluno.
- **Tela final** estática: "Obrigado por preencher o formulário. Seja bem-vindo à mentoria Creator Elite." Sem agenda, sem CTA — followup manual pelo Augusto.

## Construindo um Viral (R$ 47) + Custom GPTs

- **Quiz** em `app/diagnostico/Quiz.tsx` — um componente, dois modos: `/diagnostico` = `mode="pitch"`, `/lista-espera` = `mode="waitlist"`. O `PitchStep` é exportado e reusado em `/construindo-um-viral`.
- **Pitch:** VSL (YouTube lite, vertical 4:5), prova social (reels do `MENTOR`), botão de preço após o vídeo, FAQ, countdown persistente, print real de diagnóstico (`public/construindo-um-viral/exemplo-diagnostico.png`).
- **Checkout:** Cakto (`CHECKOUT_URL`). No fluxo do quiz, os dados do `LeadCapture` pré-preenchem o checkout via querystring (`name/email/confirmEmail/phone`, DDI 55) — ver `checkoutHref()`. Tracking: `Lead` → `InitiateCheckout` → `Purchase` (Cakto).
- **Custom GPTs** (config em `docs/`): **Análise de Perfil** (bônus grátis, só diagnóstico, usa a Action `/api/analise-perfil` — `docs/gpt-construindo-um-viral.md` + `docs/gpt-action-analise-perfil.yaml`) e **Augusto.IA** (order bump pago, conteúdo/ganchos/roteiros, sem Action — `docs/gpt-assistente-conteudo.md`). Distribuídos por link na área de membros.

## Deck Creator Elite — `/creator-elite/sessao`

- Deck de condução da Sessão Estratégica (noindex). `app/creator-elite/sessao/SessionDeck.tsx` (seções), `lead-data.ts` (dados do lead/exemplo + `MENTOR`), `page.tsx` (lookup do lead real via `/api/leads/lookup`).
- Carrega lead real com `?ig=<handle>` ou `?email=<email>`; sem param usa o `LEAD` exemplo (Stéfani Maia / @eustefanimaia).
- Títulos usam a fonte **Boldonse** (Google Fonts, uppercase). Seção da oferta destaca o plano marcado em `LEAD.oferta.recomendado`.

## Deploy

- Vercel project `augustofelipe` (id `prj_D7r6B7CLStZEJLE6R54wVQcYReEU`), rootDirectory=`apps/augustofelipe`, conectado ao GitHub `juliolima-brandify/site-futurah` branch `main`.
- Domínios `augustofelipe.com` + `www.augustofelipe.com`. DNS em Cloudflare (CNAME pra `cname.vercel-dns.com`, DNS only).
- `git push origin main` dispara build automático.
