import type { CollectionConfig } from 'payload'

export const Leads: CollectionConfig = {
  slug: 'leads',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['nome', 'email', 'origem', 'receivedAt'],
    description: 'Capturas de formularios. Tenant-scoped.',
  },
  access: {
    read: ({ req }) => !!req.user,
    // Criação pública SEMPRE via /api/contact com overrideAccess:true.
    // REST /api/leads bloqueado para impedir POST cross-tenant por anonimo.
    create: () => false,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => req.user?.role === 'superadmin',
  },
  fields: [
    { name: 'nome', type: 'text', required: true },
    { name: 'email', type: 'email', required: true, index: true },
    { name: 'social', type: 'text' },
    {
      name: 'origem',
      type: 'text',
      defaultValue: 'contact_form',
      index: true,
    },
    {
      name: 'receivedAt',
      type: 'date',
      defaultValue: () => new Date().toISOString(),
      admin: { readOnly: true },
    },
  ],
  timestamps: true,
}
