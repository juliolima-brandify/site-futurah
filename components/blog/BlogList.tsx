'use client';

import { useState } from 'react';
import PostCard from './PostCard';

interface Post {
    slug: string;
    title: string;
    excerpt: string;
    coverImage: string | null;
    category: string;
    featured: boolean;
    publishedAt: string | null;
}

interface BlogListProps {
    initialPosts: Post[];
    categories: { slug: string; name: string }[];
}

const CATEGORY_TABS = [
    { id: 'todos', label: 'TODOS' },
    { id: 'ferramentas', label: 'FERRAMENTAS' },
    { id: 'processo-criativo', label: 'PROCESSO CRIATIVO' },
    { id: 'mercado', label: 'MERCADO' },
    { id: 'tendencias', label: 'TENDÊNCIAS' },
    { id: 'cases', label: 'CASES' },
];

export default function BlogList({ initialPosts, categories }: BlogListProps) {
    const [activeTab, setActiveTab] = useState('todos');

    // Filter logic
    const filteredPosts = initialPosts.filter((post) => {
        if (activeTab === 'todos') return true;
        // Basic slug matching, assuming category slugs match the tabs or close enough
        // In reality, we might need a more robust mapping if Keystatic slugs differ.
        // For now, let's normalize:
        const postCatSlug = post.category.toLowerCase().replace(/\s+/g, '-');
        return postCatSlug === activeTab;
    });

    return (
        <section id="recent-posts" className="w-full px-4 md:px-8 lg:px-12 pb-24 bg-white">
            <div className="max-w-[1400px] mx-auto space-y-12">

                {/* Header & Filters */}
                <div className="flex flex-col items-center gap-8">
                    <h2 className="text-[52px] font-medium text-black tracking-[-0.02em] leading-tight text-center">
                        Todas as Categorias
                    </h2>

                    <div className="flex flex-wrap justify-center gap-2">
                        {CATEGORY_TABS.map((tab) => {
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                                        px-6 py-2.5 rounded-full text-[13px] font-bold tracking-[0.05em] uppercase transition-all duration-300
                                        ${isActive
                                            ? 'bg-[#0B2FFF] text-white border border-[#0B2FFF]'
                                            : 'bg-[#F5F5F7] text-black/60 border border-transparent hover:bg-black/5'
                                        }
                                    `}
                                >
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
                    {filteredPosts.map((post) => (
                        <PostCard
                            key={post.slug}
                            slug={post.slug}
                            title={post.title}
                            excerpt={post.excerpt}
                            coverImage={post.coverImage}
                            category={post.category}
                            publishedAt={post.publishedAt || ''}
                        />
                    ))}
                </div>

                {filteredPosts.length === 0 && (
                    <div className="py-24 text-center">
                        <p className="text-xl text-zinc-500">Nenhum artigo encontrado nesta categoria.</p>
                    </div>
                )}

            </div>
        </section>
    );
}
