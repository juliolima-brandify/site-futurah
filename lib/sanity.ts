import { createClient, type SanityClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import { apiVersion, dataset, projectId, useCdn } from '@/sanity/env'

let _client: SanityClient | null = null

function getClient(): SanityClient | null {
  if (!projectId) return null
  if (!_client) {
    _client = createClient({ projectId, dataset, apiVersion, useCdn })
  }
  return _client
}

export const client = getClient()

export function urlFor(source: { _type: string; asset?: { _ref: string } } | undefined) {
  if (!source) return ''
  const c = getClient()
  if (!c) return ''
  return imageUrlBuilder(c).image(source).url()
}

// Tipos compatíveis com o que o blog já usa
export interface PostListItem {
  slug: string
  title: string
  excerpt: string
  coverImage: string | null
  category: string
  featured: boolean
  publishedAt: string | null
}

export interface CategoryItem {
  slug: string
  name: string
  description: string
}

export interface PostBySlug {
  metadata: {
    slug: string
    title: string
    excerpt: string
    coverImage: string | null
    category: string
    publishedAt: string | null
  }
  content: import('@portabletext/types').PortableTextBlock[] | null
}

const postsFields = `
  _id,
  "slug": slug.current,
  title,
  excerpt,
  coverImage,
  "category": category->slug.current,
  "categoryName": category->name,
  featured,
  publishedAt
`

const postBySlugFields = `
  _id,
  "slug": slug.current,
  title,
  excerpt,
  coverImage,
  "category": category->name,
  publishedAt,
  content
`

export async function getPostsSanity(): Promise<PostListItem[]> {
  const c = getClient()
  if (!c) return []
  const posts = await c.fetch<Array<{
    slug: string
    title: string
    excerpt: string | null
    coverImage: unknown
    category: string
    featured: boolean
    publishedAt: string | null
  }>>(
    `*[_type == "post"] | order(publishedAt desc) { ${postsFields} }`
  )
  return posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt || '',
    coverImage: p.coverImage ? urlFor(p.coverImage as { _type: string; asset?: { _ref: string } }) : null,
    category: p.category || 'Geral',
    featured: !!p.featured,
    publishedAt: p.publishedAt || null,
  }))
}

export async function getCategoriesSanity(): Promise<CategoryItem[]> {
  const c = getClient()
  if (!c) return []
  const categories = await c.fetch<Array<{
    slug: string
    name: string
    description: string | null
  }>>(
    `*[_type == "category"] | order(name asc) { "slug": slug.current, name, description }`
  )
  return categories.map((c) => ({
    slug: c.slug,
    name: c.name,
    description: c.description || '',
  }))
}

export async function getPostBySlugSanity(slug: string): Promise<PostBySlug | null> {
  const c = getClient()
  if (!c) return null
  const post = await c.fetch<{
    slug: string
    title: string
    excerpt: string | null
    coverImage: unknown
    category: string
    publishedAt: string | null
    content: import('@portabletext/types').PortableTextBlock[] | null
  } | null>(
    `*[_type == "post" && slug.current == $slug][0] { ${postBySlugFields} }`,
    { slug }
  )
  if (!post) return null
  return {
    metadata: {
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt || '',
      coverImage: post.coverImage ? urlFor(post.coverImage as { _type: string; asset?: { _ref: string } }) : null,
      category: post.category || 'Geral',
      publishedAt: post.publishedAt || null,
    },
    content: post.content || null,
  }
}
