import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import OrbitIcon from '../ui/OrbitIcon';
import type { PostListItem } from '@/lib/content';

const Badge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="blog-badge flex items-center gap-2 px-3 py-1 rounded-full">
    <div className="w-1 h-1 rounded-full bg-white shadow-[0_0_4px_white]" />
    <span className="text-[10px] font-bold text-white tracking-[0.05em] uppercase leading-none">
      {children}
    </span>
  </div>
);

const LogoPlaceholder: React.FC = () => (
  <div className="relative h-[54px] w-[290px]">
    <Image
      src="/images/logos/f-blog.svg"
      alt="Futurah Blog"
      fill
      className="object-contain object-left"
    />
  </div>
);

interface BlogSectionProps {
  posts: PostListItem[];
}

export const BlogSection: React.FC<BlogSectionProps> = ({ posts }) => {
  const [firstPost, secondPost] = posts;

  return (
    <section className="w-full px-4 md:px-8 lg:px-12 py-16 lg:py-24 bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-[1.85fr_1fr] gap-6 w-full min-h-screen items-stretch">
        <div className="flex flex-col gap-8 h-full">
          <div className="flex flex-col md:flex-row md:items-end gap-6 h-[86px]">
            <LogoPlaceholder />
            <div className="flex flex-col text-[12px] font-bold tracking-[0.12em] text-black leading-[1.15] mb-1.5 opacity-90">
              <span>APRENDA SOBRE</span>
              <span>O MARKETING DO FUTURO</span>
            </div>
          </div>

          {firstPost ? (
            <Link
              href={`/blog/${firstPost.slug}`}
              className="group relative flex-1 min-h-[520px] rounded-[32px] overflow-hidden bg-black transition-all duration-500 hover:shadow-2xl"
            >
              {firstPost.coverImage ? (
                <Image
                  src={firstPost.coverImage}
                  alt={firstPost.title}
                  fill
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-90"
                  sizes="(max-width: 1024px) 100vw, 65vw"
                />
              ) : (
                <div className="absolute inset-0 bg-zinc-800" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent opacity-60" />

              <div className="absolute top-8 left-8 flex flex-wrap gap-2.5">
                <Badge>{firstPost.category}</Badge>
                {firstPost.tags?.slice(0, 2).map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>

              <div className="absolute bottom-12 left-10 right-10">
                <h3 className="text-white text-[32px] md:text-[40px] font-medium leading-[1.05] tracking-tight max-w-[620px]">
                  {firstPost.title}
                </h3>
              </div>

              <div className="absolute top-8 right-8">
                <OrbitIcon className="w-16 h-16" size={16} />
              </div>
            </Link>
          ) : (
            <Link
              href="/blog"
              className="group relative flex-1 min-h-[520px] rounded-[32px] overflow-hidden bg-[#0E28AD] flex items-center justify-center transition-all duration-500 hover:bg-[#0c2394]"
            >
              <span className="text-white text-xl font-medium">Ver artigos do blog</span>
            </Link>
          )}
        </div>

        <div className="flex flex-col gap-6 h-full">
          {secondPost ? (
            <Link
              href={`/blog/${secondPost.slug}`}
              className="group relative flex-1 min-h-[350px] rounded-[32px] overflow-hidden bg-black transition-all duration-500 hover:shadow-xl"
            >
              {secondPost.coverImage ? (
                <Image
                  src={secondPost.coverImage}
                  alt={secondPost.title}
                  fill
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-85"
                  sizes="(max-width: 1024px) 100vw, 35vw"
                />
              ) : (
                <div className="absolute inset-0 bg-zinc-800" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

              <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                <Badge>{secondPost.category}</Badge>
                {secondPost.tags?.slice(0, 2).map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>

              <div className="absolute bottom-8 left-8 right-8">
                <h6 className="text-white text-[19px] font-medium leading-[1.2] tracking-tight line-clamp-2">
                  {secondPost.title}
                </h6>
              </div>
            </Link>
          ) : null}

          <Link
            href="/blog"
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
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};
