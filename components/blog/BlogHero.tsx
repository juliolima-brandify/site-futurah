'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

interface Post {
    title: string
    slug: string
    coverImage: string | null
    category: string
    excerpt: string
}

interface BlogHeroProps {
    featuredPosts: Post[]
}

const Badge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-black/20 backdrop-blur-md">
        <div className="w-1 h-1 rounded-full bg-white shadow-[0_0_4px_white]" />
        <span className="text-[10px] font-bold text-white tracking-[0.05em] uppercase leading-none">
            {children}
        </span>
    </div>
);

const BlogTitle: React.FC = () => (
    <div className="relative h-[54px] w-[290px]">
        <Image
            src="/images/logos/f-blog.svg"
            alt="Futurah Blog"
            fill
            className="object-contain object-left"
            priority
        />
    </div>
);

export default function BlogHero({ featuredPosts }: BlogHeroProps) {
    if (!featuredPosts || featuredPosts.length === 0) return null

    const mainPost = featuredPosts[0]
    const secondaryPost = featuredPosts[1]

    return (
        <section className="w-full px-4 md:px-8 lg:px-12 pt-32 pb-16 lg:pb-24 bg-white relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-[1.85fr_1fr] gap-6 w-full max-w-[1400px] mx-auto items-stretch">
                <div className="flex flex-col gap-8 h-full">
                    <div className="flex flex-col md:flex-row md:items-end gap-6 h-auto md:h-[86px]">
                        <BlogTitle />
                        <div className="flex flex-col text-[12px] font-bold tracking-[0.12em] text-black leading-[1.15] mb-1.5 opacity-90">
                            <span>APRENDA SOBRE</span>
                            <span>O MARKETING DO FUTURO</span>
                        </div>
                    </div>

                    <Link
                        href={`/blog/${mainPost.slug}`}
                        className="group relative flex-1 min-h-[520px] rounded-[32px] overflow-hidden bg-black transition-all duration-500 hover:shadow-2xl"
                    >
                        {mainPost.coverImage && (
                            <Image
                                src={mainPost.coverImage}
                                alt={mainPost.title}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 60vw"
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-90"
                            />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent opacity-60" />

                        <div className="absolute top-8 left-8 flex gap-2.5">
                            <Badge>{mainPost.category}</Badge>
                        </div>

                        <div className="absolute bottom-12 left-10 right-10">
                            <h3 className="text-white text-[32px] md:text-[40px] font-medium leading-[1.05] tracking-tight max-w-[620px]">
                                {mainPost.title}
                            </h3>
                            <p className="mt-4 text-zinc-300 line-clamp-2 text-lg max-w-[580px]">
                                {mainPost.excerpt}
                            </p>
                        </div>

                        <div className="absolute top-8 right-8">
                            <div className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <ArrowUpRight className="w-5 h-5 text-white/60" />
                            </div>
                        </div>
                    </Link>
                </div>

                <div className="flex flex-col gap-6 h-full lg:pt-[118px]">
                    {secondaryPost ? (
                        <Link
                            href={`/blog/${secondaryPost.slug}`}
                            className="group relative flex-1 min-h-[350px] rounded-[32px] overflow-hidden bg-black transition-all duration-500 hover:shadow-xl"
                        >
                            {secondaryPost.coverImage && (
                                <Image
                                    src={secondaryPost.coverImage}
                                    alt={secondaryPost.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-85"
                                />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                            <div className="absolute top-6 left-6 flex gap-2">
                                <Badge>{secondaryPost.category}</Badge>
                            </div>

                            <div className="absolute bottom-8 left-8 right-8">
                                <h6 className="text-white text-[19px] font-medium leading-[1.2] tracking-tight line-clamp-3">
                                    {secondaryPost.title}
                                </h6>
                            </div>
                        </Link>
                    ) : (
                        <div className="group relative flex-1 min-h-[350px] rounded-[32px] overflow-hidden bg-black/5 border-2 border-dashed border-black/10 flex items-center justify-center">
                            <div className="text-center">
                                <p className="text-black/40 font-medium font-sans">Em breve</p>
                            </div>
                        </div>
                    )}

                    <a
                        href="#recent-posts"
                        className="group flex flex-col justify-between p-10 h-[292px] bg-[#0E28AD] rounded-[24px] transition-all duration-500 hover:bg-[#0c2394] hover:shadow-xl"
                    >
                        <div className="w-14 h-14 rounded-full border border-white/30 flex items-center justify-center transition-all duration-500 group-hover:bg-white group-hover:scale-110">
                            <svg
                                width="28"
                                height="28"
                                viewBox="0 0 24 24"
                                fill="none"
                                className="stroke-white transition-colors duration-500 group-hover:stroke-[#0E28AD]"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="7" y1="17" x2="17" y2="7"></line>
                                <polyline points="7 7 17 7 17 17"></polyline>
                            </svg>
                        </div>
                        <div>
                            <h6 className="text-white text-[28px] font-medium leading-[0.9] tracking-tighter">
                                Ver Todos<br />os Artigos
                            </h6>
                            <p className="mt-2 text-white/60 text-sm font-medium tracking-wide">
                                Explore nosso arquivo
                            </p>
                        </div>
                    </a>
                </div>
            </div>
        </section>
    )
}
