import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'slug'] },
  access: {
    // Site publico le via Local API com overrideAccess. REST exige auth.
    read: ({ req }) => !!req.user,
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      index: true,
      admin: { description: 'Slug unico dentro do tenant.' },
    },
    { name: 'description', type: 'textarea' },
  ],
  hooks: {
    beforeValidate: [
      async ({ data, req, operation, originalDoc }) => {
        if (!data?.slug || !data?.tenant) return data
        if (operation === 'update' && originalDoc?.slug === data.slug) return data
        const existing = await req.payload.find({
          collection: 'categories',
          where: {
            and: [{ slug: { equals: data.slug } }, { tenant: { equals: data.tenant } }],
          },
          limit: 1,
          overrideAccess: true,
        })
        if (existing.docs.length > 0 && existing.docs[0].id !== originalDoc?.id) {
          throw new Error(`Ja existe uma categoria com slug "${data.slug}" neste tenant.`)
        }
        return data
      },
    ],
  },
}
