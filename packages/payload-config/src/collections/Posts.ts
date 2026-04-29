import { lexicalEditor } from '@payloadcms/richtext-lexical'
import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishedAt', 'featured'],
  },
  versions: {
    drafts: { autosave: { interval: 2000 } },
    maxPerDoc: 20,
  },
  access: {
    // Site publico le via Local API com overrideAccess. REST exige auth.
    read: ({ req }) => !!req.user,
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      index: true,
      admin: { description: 'Unico por tenant.' },
    },
    { name: 'excerpt', type: 'textarea', maxLength: 300 },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
    },
    {
      name: 'authors',
      type: 'relationship',
      relationTo: 'authors',
      hasMany: true,
    },
    { name: 'featured', type: 'checkbox', defaultValue: false },
    { name: 'publishedAt', type: 'date' },
    { name: 'tags', type: 'array', fields: [{ name: 'value', type: 'text' }] },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor(),
    },
  ],
  hooks: {
    beforeValidate: [
      async ({ data, req, operation, originalDoc }) => {
        if (!data?.slug || !data?.tenant) return data
        if (operation === 'update' && originalDoc?.slug === data.slug) return data
        const existing = await req.payload.find({
          collection: 'posts',
          where: {
            and: [{ slug: { equals: data.slug } }, { tenant: { equals: data.tenant } }],
          },
          limit: 1,
          overrideAccess: true,
        })
        if (existing.docs.length > 0 && existing.docs[0].id !== originalDoc?.id) {
          throw new Error(`Ja existe um post com slug "${data.slug}" neste tenant.`)
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc }) => {
        const { revalidateTag } = await import('next/cache')
        revalidateTag('posts')
        revalidateTag(`post:${doc.slug}`)
        return doc
      },
    ],
    afterDelete: [
      async ({ doc }) => {
        const { revalidateTag } = await import('next/cache')
        revalidateTag('posts')
        revalidateTag(`post:${doc.slug}`)
        return doc
      },
    ],
  },
}
