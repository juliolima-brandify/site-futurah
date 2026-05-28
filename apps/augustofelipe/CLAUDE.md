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
| `/diagnostico` | static | Quiz "Construindo um Viral" (R$ 47) |
| `/lista-espera` | static | Mesmo `Quiz` com `mode="waitlist"` |
| `/creator-elite/onboarding` | static, **noindex** | Questionário pré-call da mentoria Creator Elite — link **privado**, mandado só pra quem entra na mentoria |

## APIs

| Endpoint | Função |
|---|---|
| `POST /api/diagnostico/lead` | Proxy pro Payload (`source=diagnostico` ou `waitlist`) |
| `POST /api/creator-elite/onboarding` | Proxy pro Payload (`source=creator-elite-onboarding`) + email pro Augusto via Resend |

Ambos encaminham pra `https://www.futurah.co/api/leads/ingest` com `siteId=augustofelipe`, autenticados via `Authorization: Bearer $LEADS_INGEST_TOKEN`. Dedup por `(tenant, email)`.

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

## Deploy

- Vercel project `augustofelipe` (id `prj_D7r6B7CLStZEJLE6R54wVQcYReEU`), rootDirectory=`apps/augustofelipe`, conectado ao GitHub `juliolima-brandify/site-futurah` branch `main`.
- Domínios `augustofelipe.com` + `www.augustofelipe.com`. DNS em Cloudflare (CNAME pra `cname.vercel-dns.com`, DNS only).
- `git push origin main` dispara build automático.
