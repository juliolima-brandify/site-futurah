import Header from "@/components/layout/Header"

export async function generateStaticParams() {
    const categories = await getCategories()
    return categories.map((category: any) => ({
        slug: category.slug,
    }))
}

import Footer from "@/components/layout/Footer"
import PostCard from "@/components/blog/PostCard"
import Newsletter from "@/components/sections/Newsletter"
import { getPosts, getCategories } from "@/lib/keystatic"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const categories = await getCategories()
    const category = categories.find((c: any) => c.slug === slug)

    if (!category) {
        notFound()
    }

    const allPosts = await getPosts()
    const categoryPosts = allPosts.filter((post: any) => post.category === slug)

    return (
        <div className="min-h-screen bg-black">
            <Header />

            <main className="pt-32 pb-24">
                <section className="container mx-auto px-6 mb-24">
                    <Link
                        href="/blog"
                        className="mb-8 inline-flex items-center space-x-2 text-sm font-semibold uppercase tracking-widest text-zinc-500 transition-colors hover:text-white"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Voltar para o blog</span>
                    </Link>

                    <div className="mb-12">
                        <span className="text-sm font-bold uppercase tracking-[0.3em] text-[#E1FF00]">
                            Categoria
                        </span>
                        <h1 className="mt-2 text-4xl font-black uppercase tracking-tighter text-white md:text-7xl lg:text-8xl">
                            {category.name}
                        </h1>
                        {category.description && (
                            <p className="mt-4 max-w-2xl text-lg text-zinc-400 md:text-xl">
                                {category.description}
                            </p>
                        )}
                    </div>

                    <div className="border-t border-white/10 pt-16">
                        <div className="grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
                            {categoryPosts.map((post: any) => (
                                <PostCard
                                    key={post.slug}
                                    title={post.title}
                                    slug={post.slug}
                                    excerpt={post.excerpt}
                                    coverImage={post.coverImage}
                                    category={category.name}
                                />
                            ))}
                        </div>
                    </div>
                </section>

                <Newsletter />
            </main>

            <Footer />
        </div>
    )
}
