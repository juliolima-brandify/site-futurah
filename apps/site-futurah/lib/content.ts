import 'server-only'

import config from '@payload-config'
import { getPayload } from 'payload'

const DEFAULT_TENANT_SLUG = 'futurah'

export interface PostAuthor {
  name: string
  role: string | null
  image: string | null
}

export interface PostListItem {
  slug: string
  title: string
  excerpt: string
  coverImage: string | null
  category: string
  featured: boolean
  publishedAt: string | null
  author: PostAuthor | null
  tags: string[]
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
    author: PostAuthor | null
    tags: string[]
  }
  content: unknown
}

type MediaDoc = { url?: string | null } | null
type AuthorDoc = {
  name: string
  role?: string | null
  avatar?: MediaDoc | string | number | null
}
type CategoryDoc = {
  slug: string
  name: string
  description?: string | null
}
type PostDoc = {
  slug: string
  title: string
  excerpt?: string | null
  coverImage?: MediaDoc | string | number | null
  category?: CategoryDoc | string | number | null
  featured?: boolean | null
  publishedAt?: string | null
  authors?: (AuthorDoc | string | number)[] | null
  tags?: { value?: string | null }[] | null
  content?: unknown
}

async function getTenantId(slug: string): Promise<string | number | null> {
  const payload = await getPayload({ config })
  const tenant = await payload.find({
    collection: 'tenants',
    where: { slug: { equals: slug } },
    limit: 1,
    overrideAccess: true,
  })
  return tenant.docs[0]?.id ?? null
}

function pickCover(cover: PostDoc['coverImage']): string | null {
  if (!cover || typeof cover === 'string' || typeof cover === 'number') return null
  const media = cover as MediaDoc
  return media?.url ?? null
}

function pickAuthor(authors: PostDoc['authors']): PostAuthor | null {
  if (!authors || !Array.isArray(authors) || authors.length === 0) return null
  const firstAuthor = authors[0]
  if (typeof firstAuthor === 'string' || typeof firstAuthor === 'number') return null
  const author = firstAuthor as AuthorDoc
  const avatar =
    author.avatar && typeof author.avatar === 'object' ? (author.avatar as MediaDoc) : null
  return {
    name: author.name,
    role: author.role ?? null,
    image: avatar?.url ?? null,
  }
}

export async function getPosts(tenantSlug = DEFAULT_TENANT_SLUG): Promise<PostListItem[]> {
  const payload = await getPayload({ config })
  const tenantId = await getTenantId(tenantSlug)
  if (!tenantId) return []

  const result = await payload.find({
    collection: 'posts',
    depth: 2,
    limit: 100,
    where: {
      and: [{ tenant: { equals: tenantId } }, { _status: { equals: 'published' } }],
    },
    sort: '-publishedAt',
    overrideAccess: true,
  })
  const docs = result.docs as unknown as PostDoc[]

  return docs.map((post) => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt ?? '',
    coverImage: pickCover(post.coverImage),
    category:
      post.category && typeof post.category === 'object'
        ? (post.category as CategoryDoc).slug
        : 'geral',
    featured: !!post.featured,
    publishedAt: post.publishedAt ?? null,
    author: pickAuthor(post.authors),
    tags: (post.tags ?? []).map((tag: { value?: string | null }) => tag?.value || '').filter(Boolean),
  }))
}

export async function getCategories(tenantSlug = DEFAULT_TENANT_SLUG): Promise<CategoryItem[]> {
  const payload = await getPayload({ config })
  const tenantId = await getTenantId(tenantSlug)
  if (!tenantId) return []

  const result = await payload.find({
    collection: 'categories',
    where: { tenant: { equals: tenantId } },
    limit: 100,
    sort: 'name',
    overrideAccess: true,
  })
  const docs = result.docs as unknown as CategoryDoc[]

  return docs.map((category) => ({
    slug: category.slug,
    name: category.name,
    description: category.description ?? '',
  }))
}

export async function getPostBySlug(
  slug: string,
  tenantSlug = DEFAULT_TENANT_SLUG,
): Promise<PostBySlug | null> {
  const payload = await getPayload({ config })
  const tenantId = await getTenantId(tenantSlug)
  if (!tenantId) return null

  const result = await payload.find({
    collection: 'posts',
    depth: 2,
    limit: 1,
    where: {
      and: [
        { slug: { equals: slug } },
        { tenant: { equals: tenantId } },
        { _status: { equals: 'published' } },
      ],
    },
    overrideAccess: true,
  })
  const post = (result.docs as unknown as PostDoc[])[0]
  if (!post) return null

  return {
    metadata: {
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt ?? '',
      coverImage: pickCover(post.coverImage),
      category:
        post.category && typeof post.category === 'object'
          ? (post.category as CategoryDoc).name
          : 'Geral',
      publishedAt: post.publishedAt ?? null,
      author: pickAuthor(post.authors),
      tags: (post.tags ?? []).map((tag: { value?: string | null }) => tag?.value || '').filter(Boolean),
    },
    content: post.content ?? null,
  }
}

export function isSanityCMS(): boolean {
  return false
}
