# Usar Sanity como CMS do site

O projeto pode usar **Sanity** para editar posts e categorias do blog. Por padrão continua usando **Keystatic** (arquivos locais).

## 1. Criar projeto no Sanity

1. Acesse [sanity.io](https://www.sanity.io) e crie uma conta (ou faça login).
2. Vá em [sanity.io/manage](https://www.sanity.io/manage) e crie um novo projeto.
3. No projeto, crie um **dataset** (ex.: `production`) se ainda não existir: Project settings → Datasets → Create dataset.
4. Anote o **Project ID** e o nome do **Dataset** (ex.: `production`).

## 2. Variáveis de ambiente

No `.env` (ou `.env.local`), adicione:

```env
# Ativa o Sanity como CMS (sem isso, o site usa Keystatic)
NEXT_PUBLIC_CMS=sanity

# Dados do projeto Sanity (obrigatórios quando CMS=sanity)
NEXT_PUBLIC_SANITY_PROJECT_ID=seu_project_id
NEXT_PUBLIC_SANITY_DATASET=production
```

Na Vercel (ou outro host), configure as mesmas variáveis no painel do projeto.

## 3. Sanity Studio (editor de conteúdo)

O Studio **não fica embutido no site**. Use o Studio hospedado na Sanity:

1. Acesse [sanity.io/manage](https://www.sanity.io/manage).
2. Abra o seu projeto e clique em **Open Studio** (ou acesse o link do studio do projeto).

Lá você cria e edita:

- **Categorias** – nome, slug, descrição  
- **Posts** – título, slug, resumo, imagem de capa, categoria, destaque, data, conteúdo (rich text)

## 4. Estrutura no Sanity

- **Categoria**: nome, slug (gerado a partir do nome), descrição.
- **Post**: título, slug, resumo, imagem de capa, referência à categoria, “Post em destaque”, data de publicação, conteúdo em blocos (texto, imagens, etc.).

Os slugs das categorias são usados na URL (`/blog/category/[slug]`). Crie as categorias antes de associá-las aos posts.

## 5. Build sem Sanity

Se as variáveis do Sanity não estiverem definidas (por exemplo na Vercel), o build usa **Keystatic** e o site continua funcionando. O client Sanity só é criado quando `NEXT_PUBLIC_SANITY_PROJECT_ID` está configurado.

## Resumo

| O que              | Onde / Como |
|--------------------|-------------|
| Ativar Sanity      | `NEXT_PUBLIC_CMS=sanity` + `NEXT_PUBLIC_SANITY_PROJECT_ID` + `NEXT_PUBLIC_SANITY_DATASET` no `.env` |
| Editar conteúdo    | [sanity.io/manage](https://www.sanity.io/manage) → seu projeto → Open Studio |
| Voltar ao Keystatic | Remover `NEXT_PUBLIC_CMS=sanity` ou não definir as variáveis Sanity |
