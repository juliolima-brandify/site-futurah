import { getPostBySlug, getPosts } from "@/lib/keystatic"

export async function generateStaticParams() {
    const posts = await getPosts()
    return posts.map((post: any) => ({
        slug: post.slug,
    }))
}

import { notFound } from "next/navigation"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import Image from "next/image"
import Newsletter from "@/components/sections/Newsletter"
import PostCard from "@/components/blog/PostCard"
import { ArrowLeft, Clock, Tag } from "lucide-react"
import Link from "next/link"
import { DocumentRenderer } from '@keystatic/core/renderer'

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    console.log(`DEBUG: PostPage hit for slug: ${slug}`)

    const data = await getPostBySlug(slug)
    console.log(`DEBUG: getPostBySlug returned:`, data ? 'FOUND' : 'NULL')

    if (!data) {
        console.log('DEBUG: Post not found')
        notFound()
    }

    const { metadata: post, content } = data
    console.log('DEBUG: Post metadata:', JSON.stringify(post, null, 2))

    const allPosts = await getPosts()
    console.log(`DEBUG: allPosts count: ${allPosts.length}`)

    // Get other posts for "Veja também" - prioritize same category but fallback to others if needed
    // For now, let's just show the latest 2 posts that aren't this one
    const relatedPosts = allPosts
        .filter((p: any) => p.slug !== slug)
        .slice(0, 2)
    // fs.appendFileSync('trace.log', `relatedPosts count: ${relatedPosts.length}\n`)

    let postContent = null
    try {
        postContent = content ? await content() : null
        console.log('DEBUG: postContent loaded successfully')
    } catch (e) {
        console.error('DEBUG: Failed to load post content', e)
    }

    return (
        <div className="min-h-screen bg-white text-[#1B1B1B]">
            <Header />

            <main className="pt-32">
                <article className="container mx-auto px-6">
                    {/* Header Layout: Centered Title + Meta + Image */}
                    <div className="mx-auto max-w-[1000px] mb-12">
                        {/* Title */}
                        <h1 className="text-4xl md:text-5xl lg:text-[56px] font-medium leading-[1.1] text-center text-[#1B1B1B] uppercase tracking-[-0.02em] mb-10">
                            {post.title}
                        </h1>

                        {/* Meta Row: Date & Author */}
                        <div className="flex flex-col md:flex-row items-center justify-between border-t border-black/5 pt-6 mb-10 gap-4">
                            {/* Date */}
                            <div className="text-[13px] font-medium text-zinc-400 uppercase tracking-widest">
                                {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).replace('.', '').toUpperCase() : ''}
                            </div>

                            {/* Author / Staff Badge */}
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-zinc-200" />
                                <div className="flex flex-col leading-none">
                                    <span className="text-[10px] font-bold text-[#1B1B1B] uppercase tracking-wider mb-0.5">HUMAN PICKS</span>
                                    <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">STAFF</span>
                                </div>
                            </div>
                        </div>

                        {/* Featured Image */}
                        {post.coverImage && (
                            <div className="relative w-full aspect-[21/10] overflow-hidden rounded-[32px] bg-zinc-100 mb-16">
                                <Image
                                    src={post.coverImage}
                                    alt={post.title}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 1200px) 100vw, 1200px"
                                    priority
                                />
                            </div>
                        )}

                        {/* Article Content */}
                        <div className="prose prose-lg prose-zinc mx-auto max-w-[680px] prose-headings:font-medium prose-headings:text-[#1B1B1B] prose-p:text-zinc-600 prose-p:leading-relaxed prose-a:text-[#0B2FFF] prose-strong:font-semibold">
                            <p className="lead">{post.excerpt}</p>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                            </p>
                            <p>
                                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                            </p>
                            <hr className="my-8 border-black/10" />
                        </div>

                        {/* Tags */}
                        <div className="mx-auto max-w-[680px] mt-12 mb-16 flex flex-wrap gap-2 justify-center">
                            <span className="px-4 py-1.5 rounded-full bg-[#E1FF00] text-black text-xs font-bold uppercase tracking-wider hover:brightness-95 cursor-pointer transition-all">
                                {post.category}
                            </span>
                            <span className="px-4 py-1.5 rounded-full bg-[#E0E7FF] text-[#3730A3] text-xs font-bold uppercase tracking-wider hover:brightness-95 cursor-pointer transition-all">
                                AI Trends
                            </span>
                            <span className="px-4 py-1.5 rounded-full bg-[#DCFCE7] text-[#166534] text-xs font-bold uppercase tracking-wider hover:brightness-95 cursor-pointer transition-all">
                                Futuro
                            </span>
                            <span className="px-4 py-1.5 rounded-full bg-[#F3E8FF] text-[#6B21A8] text-xs font-bold uppercase tracking-wider hover:brightness-95 cursor-pointer transition-all">
                                Tecnologia
                            </span>
                        </div>

                        {/* Footer: Voltar / Share */}
                        <div className="mx-auto max-w-[680px] border-t border-black/5 py-8 flex justify-between items-center">
                            <Link
                                href="/blog"
                                className="text-sm font-bold uppercase tracking-widest text-zinc-400 hover:text-[#1B1B1B] transition-colors"
                            >
                                ← Voltar
                            </Link>

                            <div className="flex items-center space-x-2 text-zinc-500">
                                <Tag className="h-4 w-4" />
                                <span className="text-sm font-bold uppercase tracking-widest">Compartilhar</span>
                            </div>
                        </div>
                    </div>
                </article>

                {relatedPosts.length > 0 && (
                    <section className="container mx-auto px-6 py-12 max-w-[1400px]">
                        <h2 className="mb-10 text-[42px] font-medium text-[#1B1B1B] leading-none tracking-tight">
                            Veja também
                        </h2>
                        <div className="grid grid-cols-1 lg:grid-cols-[7fr_3fr] gap-6">
                            {relatedPosts.map((p: any) => (
                                <Link
                                    key={p.slug}
                                    href={`/blog/${p.slug}`}
                                    className="group relative h-[450px] w-full overflow-hidden rounded-[32px] block"
                                >
                                    {/* Background Image */}
                                    {p.coverImage ? (
                                        <Image
                                            src={p.coverImage}
                                            alt={p.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-zinc-900" />
                                    )}

                                    {/* Gradients */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

                                    {/* Badges */}
                                    <div className="absolute top-8 left-8 flex flex-col gap-2">
                                        <span className="self-start rounded-full bg-[#1c2230]/60 backdrop-blur-md px-3 py-1.5 text-[11px] font-medium text-white uppercase tracking-wider flex items-center gap-1.5 border border-white/10">
                                            <span className="w-1 h-1 rounded-full bg-white"></span>
                                            {p.category}
                                        </span>
                                    </div>

                                    {/* Content */}
                                    <div className="absolute bottom-10 left-10 right-10">
                                        <h3 className="text-[28px] font-medium leading-[1.1] text-white tracking-tight group-hover:text-white/90 transition-colors">
                                            {p.title}
                                        </h3>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                <Newsletter />
            </main>

            <Footer />
        </div>
    )
}
