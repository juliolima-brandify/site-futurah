# Deploy na Cloudflare

Este projeto usa **OpenNext** para deploy em **Cloudflare Workers** (não Pages).

## No dashboard da Cloudflare

1. Crie um projeto **Workers** (não Pages) e conecte este repositório.
2. **Build command:** `npm run pages:build` ou `npm run cf:build`
3. Não defina "Build output directory" – o Workers usa o resultado do OpenNext (`.open-next/`) e faz o deploy via Wrangler.

Se o projeto atual for **Pages**, crie um novo projeto **Workers**, conecte o mesmo repositório e use o comando de build acima.

## Deploy pela sua máquina

```bash
npm run deploy
```

(na primeira vez o Wrangler pode pedir login na Cloudflare)
