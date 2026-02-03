import { createReader } from '@keystatic/core/reader'
import config from '@/keystatic.config'
// import fs from 'fs'

let _reader: any = null;

export function getReader() {
    if (!_reader) {
        _reader = createReader(process.cwd(), config)
    }
    return _reader
}

export async function getPosts() {
    try {
        const reader = getReader()
        const posts = await reader.collections.posts.all()
        return posts.map((post: any) => {
            const entry = post.entry as any
            // Return only serializable, necessary fields
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
        // fs.appendFileSync('trace.log', 'Error in getPosts: ' + e.message + '\n')
        throw e
    }
}

export async function getCategories() {
    const reader = getReader()
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

export async function getPostBySlug(slug: string) {
    const reader = getReader()
    const post = await reader.collections.posts.read(slug)
    if (!post) return null

    const entry = post as any
    // Return metadata and content separately to avoid serialization issues
    return {
        metadata: {
            slug,
            title: entry.title || slug,
            excerpt: entry.excerpt || '',
            coverImage: entry.coverImage || null,
            category: entry.category || 'Geral',
            publishedAt: entry.publishedAt || null,
        },
        content: entry.content // This is the function
    }
}
