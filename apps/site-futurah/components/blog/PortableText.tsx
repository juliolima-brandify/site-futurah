'use client'

import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { RichText } from '@payloadcms/richtext-lexical/react'

interface Props {
  value: SerializedEditorState | null | unknown
}

export default function PortableText({ value }: Props) {
  if (!value || typeof value !== 'object') return null
  return <RichText data={value as SerializedEditorState} className="payload-rich-text" />
}
