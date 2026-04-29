import type { CollectionConfig } from 'payload'

export const Authors: CollectionConfig = {
  slug: 'authors',
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'role'] },
  access: {
    read: ({ req }) => !!req.user,
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, index: true },
    { name: 'role', type: 'text' },
    { name: 'bio', type: 'textarea' },
    { name: 'avatar', type: 'upload', relationTo: 'media' },
  ],
  hooks: {
    beforeValidate: [
      async ({ data, req, operation, originalDoc }) => {
        if (!data?.slug || !data?.tenant) return data
        if (operation === 'update' && originalDoc?.slug === data.slug) return data
        const existing = await req.payload.find({
          collection: 'authors',
          where: {
            and: [{ slug: { equals: data.slug } }, { tenant: { equals: data.tenant } }],
          },
          limit: 1,
          overrideAccess: true,
        })
        if (existing.docs.length > 0 && existing.docs[0].id !== originalDoc?.id) {
          throw new Error(`Ja existe um author com slug "${data.slug}" neste tenant.`)
        }
        return data
      },
    ],
  },
}
