'use client'

import { PortableText as BasePortableText, type PortableTextComponents } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity'

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null
      const src = urlFor(value)
      return (
        <span className="my-6 block">
          <img
            src={src}
            alt={value.alt ?? ''}
            className="rounded-lg w-full h-auto"
          />
          {value.caption && (
            <span className="mt-2 block text-sm text-zinc-500 text-center">
              {value.caption}
            </span>
          )}
        </span>
      )
    },
  },
  block: {
    normal: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
    h2: ({ children }) => (
      <h2 className="text-2xl font-medium mt-8 mb-4 text-[#1B1B1B]">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-medium mt-6 mb-3 text-[#1B1B1B]">
        {children}
      </h3>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>
    ),
  },
  marks: {
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#0B2FFF] underline hover:no-underline"
      >
        {children}
      </a>
    ),
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  },
}

interface Props {
  value: PortableTextBlock[] | null
}

export default function PortableText({ value }: Props) {
  if (!value || value.length === 0) return null
  return <BasePortableText value={value} components={components} />
}
