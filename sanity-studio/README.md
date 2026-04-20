# Futurah CMS – Sanity Studio

Studio para editar posts e categorias do blog. Projeto **si7c9dwl**, dataset **production**.

## Rodar local

```bash
cd sanity-studio
npm install
npm run dev
```

Abre em **http://localhost:3333**. Faça login na Sanity quando pedir.

## Deploy na Vercel

1. Crie um **novo projeto** na Vercel.
2. Conecte só a pasta **sanity-studio** (ou o repositório com essa pasta na raiz).
3. **Build command:** `npm run build`
4. **Output directory:** `dist`
5. Depois do deploy, copie a URL (ex.: `https://futurah-studio.vercel.app`).
6. No [sanity.io/manage](https://www.sanity.io/manage) → seu projeto → **Add missing studio by URL** → cole essa URL.

## Site principal

O site (Next.js) usa `NEXT_PUBLIC_SANITY_PROJECT_ID=si7c9dwl` e `NEXT_PUBLIC_SANITY_DATASET=production`. Confirme que a Vercel do **site** tem essas variáveis e `NEXT_PUBLIC_CMS=sanity`.
