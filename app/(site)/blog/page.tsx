import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import BlogHero from "@/components/blog/BlogHero"
import PostCard from "@/components/blog/PostCard"
import BlogList from "@/components/blog/BlogList"
import Newsletter from "@/components/sections/Newsletter"
import { getPosts, getCategories } from "@/lib/keystatic"
import { Suspense } from "react"

export default async function BlogPage() {
    const allPosts = await getPosts()
    const categories = await getCategories()

    const featuredPosts = allPosts
        .filter((post: any) => post.featured)
        .sort((a: any, b: any) => new Date(b.publishedAt || '').getTime() - new Date(a.publishedAt || '').getTime())
        .slice(0, 3)

    const regularPosts = allPosts.filter((post: any) => !post.featured || !featuredPosts.find((fp: any) => fp.slug === post.slug))

    return (
        <div className="min-h-screen bg-white">
            <Header />

            <main>
                <Suspense fallback={<div className="h-[600px] w-full animate-pulse rounded-3xl bg-zinc-900" />}>
                    <BlogHero featuredPosts={featuredPosts} />
                </Suspense>

                {/* Featured Categories & Grid */}
                <BlogList initialPosts={regularPosts} categories={categories} />

                <section>
                    <Newsletter />
                </section>
            </main>

            <Footer />
        </div>
    )
}
