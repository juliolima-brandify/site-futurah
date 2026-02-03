'use client'

import Image from 'next/image'
import Link from 'next/link'
import OrbitIcon from '../ui/OrbitIcon'

interface PostCardProps {
    title: string
    slug: string
    excerpt: string
    coverImage: string | null
    category: string
    publishedAt?: string
}

export default function PostCard({ title, slug, excerpt, coverImage, category, publishedAt }: PostCardProps) {
    // Format date to DD/MM/YYYY
    const formattedDate = publishedAt ? new Date(publishedAt).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }) : '';

    return (
        <Link
            href={`/blog/${slug}`}
            className="group flex flex-col gap-4 cursor-pointer"
        >
            {/* Image Container */}
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[32px] bg-gray-100">
                {coverImage ? (
                    <Image
                        src={coverImage}
                        alt={title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-zinc-400 bg-zinc-100">
                        Futurah
                    </div>
                )}

                {/* Overlay Gradient (Optional, subtle) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Badges - Top Left */}
                <div className="absolute top-5 left-5 flex flex-col gap-2">
                    <span className="self-start rounded-full bg-[#1c2230]/80 backdrop-blur-sm px-3 py-1.5 text-[11px] font-medium text-white uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-white"></span>
                        {category}
                    </span>
                </div>

                {/* Orbit Icon - Top Right */}
                <div className="absolute top-5 right-5">
                    <OrbitIcon size={16} className="w-16 h-16" />
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-2 px-1 mt-1">
                {/* Date */}
                {formattedDate && (
                    <span className="text-[14px] font-normal text-zinc-500 tracking-tight">
                        {formattedDate}
                    </span>
                )}

                {/* Title */}
                <h3 className="text-[22px] font-normal leading-[1.15] text-[#1B1B1B] -tracking-[0.03em] group-hover:text-[#0B2FFF] transition-colors line-clamp-3">
                    {title}
                </h3>
            </div>
        </Link>
    )
}
