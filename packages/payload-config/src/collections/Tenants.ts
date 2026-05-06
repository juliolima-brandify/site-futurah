import type { CollectionConfig } from 'payload'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'siteId', 'domain'],
  },
  access: {
    create: ({ req }) => req.user?.role === 'superadmin',
    update: ({ req }) => req.user?.role === 'superadmin',
    delete: ({ req }) => req.user?.role === 'superadmin',
    read: () => true,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { description: 'Slug unico. Ex: "futurah", "haytarzan".' },
    },
    {
      name: 'siteId',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        description:
          'Identificador usado pelo tracker (Worker `site_id`) e pelo /api/leads/ingest. Ex.: "futurah", "augustofelipe", "fidevidraceiro".',
      },
    },
    {
      name: 'domain',
      type: 'text',
      admin: {
        description: 'Dominio raiz do tenant (opcional). Ex: "haytarzan.com.br".',
      },
    },
    { name: 'logoUrl', type: 'text' },
  ],
}
