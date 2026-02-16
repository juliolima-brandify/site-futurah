/**
 * Camada unificada de conteúdo: Sanity ou Keystatic.
 * Use NEXT_PUBLIC_CMS=sanity e variáveis SANITY_* no .env para ativar o Sanity.
 */

import { isConfigured } from '@/sanity/env'
import {
  getPostsSanity,
  getCategoriesSanity,
  getPostBySlugSanity,
  type PostListItem,
  type CategoryItem,
  type PostBySlug,
} from './sanity'
import {
  getPosts as getPostsKeystatic,
  getCategories as getCategoriesKeystatic,
  getPostBySlug as getPostBySlugKeystatic,
} from './keystatic'

const useSanity = typeof window === 'undefined'
  ? process.env.NEXT_PUBLIC_CMS === 'sanity' && isConfigured
  : process.env.NEXT_PUBLIC_CMS === 'sanity' && isConfigured

export async function getPosts(): Promise<PostListItem[]> {
  if (useSanity) return getPostsSanity()
  const list = await getPostsKeystatic()
  return list as PostListItem[]
}

export async function getCategories(): Promise<CategoryItem[]> {
  if (useSanity) return getCategoriesSanity()
  const list = await getCategoriesKeystatic()
  return list as CategoryItem[]
}

/** Retorno unificado: Sanity retorna content como array (Portable Text); Keystatic retorna content como função. */
export async function getPostBySlug(slug: string): Promise<{
  metadata: PostBySlug['metadata']
  content: import('@portabletext/types').PortableTextBlock[] | (() => Promise<unknown>) | null
} | null> {
  if (useSanity) {
    const data = await getPostBySlugSanity(slug)
    return data
  }
  return getPostBySlugKeystatic(slug) as Promise<{
    metadata: PostBySlug['metadata']
    content: (() => Promise<unknown>) | null
  } | null>
}

/** true se o CMS em uso for Sanity (para o front decidir como renderizar o body) */
export function isSanityCMS(): boolean {
  return Boolean(useSanity)
}
