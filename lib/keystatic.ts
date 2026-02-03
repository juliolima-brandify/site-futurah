import config from '@/keystatic.config'

let _reader: any = null;

export async function getReader() {
    if (typeof window !== 'undefined') return null;
    if (!_reader) {
        const { createReader } = await import('@keystatic/core/reader')
        _reader = createReader(process.cwd(), config)
    }
    return _reader
}

export async function getPosts() {
    try {
        const reader = await getReader()
        if (!reader) return []
        const posts = await reader.collections.posts.all()
        return posts.map((post: any) => {
            const entry = post.entry as any
            return {
                slug: post.slug,
                title: entry.title || post.slug,
                excerpt: entry.excerpt || '',
                coverImage: entry.coverImage || null,
                category: entry.category || 'Geral',
                featured: !!entry.featured,
                publishedAt: entry.publishedAt || null,
            }
        })
    } catch (e: any) {
        throw e
    }
}

export async function getCategories() {
    const reader = await getReader()
    if (!reader) return []
    const categories = await reader.collections.categories.all()
    return categories.map((cat: any) => {
        const entry = cat.entry as any
        return {
            slug: cat.slug,
            name: entry.name || cat.slug,
            description: entry.description || '',
        }
    })
}

/** Content loader: função que retorna o documento do post (lazy do Keystatic) */
export type PostContentLoader = (() => Promise<unknown>) | undefined

export async function getPostBySlug(slug: string): Promise<{
    metadata: { slug: string; title: string; excerpt: string; coverImage: string | null; category: string; publishedAt: string | null }
    content: PostContentLoader
} | null> {
    const reader = await getReader()
    if (!reader) return null
    const post = await reader.collections.posts.read(slug)
    if (!post) return null

    const entry = post as any
    const contentFn = typeof entry.content === 'function' ? entry.content : undefined
    return {
        metadata: {
            slug,
            title: entry.title || slug,
            excerpt: entry.excerpt || '',
            coverImage: entry.coverImage || null,
            category: entry.category || 'Geral',
            publishedAt: entry.publishedAt || null,
        },
        content: contentFn,
    }
}
