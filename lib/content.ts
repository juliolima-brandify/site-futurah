/**
 * Camada de conteúdo: Sanity CMS.
 */

import {
  getPostsSanity,
  getCategoriesSanity,
  getPostBySlugSanity,
  type PostListItem,
  type CategoryItem,
  type PostBySlug,
} from './sanity'

export async function getPosts(): Promise<PostListItem[]> {
  return getPostsSanity()
}

export async function getCategories(): Promise<CategoryItem[]> {
  return getCategoriesSanity()
}

export async function getPostBySlug(slug: string): Promise<PostBySlug | null> {
  return getPostBySlugSanity(slug)
}

/** true: o CMS é Sanity (conteúdo em Portable Text). */
export function isSanityCMS(): boolean {
  return true
}
