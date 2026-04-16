import { metadata as studioMetadata, viewport as studioViewport } from 'next-sanity/studio'
import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  ...studioMetadata,
  title: 'Futurah CMS – Admin',
}

export const viewport: Viewport = {
  ...studioViewport,
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
