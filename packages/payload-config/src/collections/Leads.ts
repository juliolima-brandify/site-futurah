import type { CollectionConfig } from 'payload'

export const Leads: CollectionConfig = {
  slug: 'leads',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['nome', 'email', 'whatsapp', 'source', 'receivedAt'],
    description: 'Capturas de formularios. Tenant-scoped.',
  },
  access: {
    read: ({ req }) => !!req.user,
    // Criação publica SEMPRE via /api/contact ou /api/leads/ingest com
    // overrideAccess:true. REST /api/leads bloqueado para impedir POST
    // cross-tenant por anonimo.
    create: () => false,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => req.user?.role === 'superadmin',
  },
  fields: [
    { name: 'nome', type: 'text', required: true },
    { name: 'email', type: 'email', required: true, index: true },
    { name: 'social', type: 'text' },
    {
      name: 'whatsapp',
      type: 'text',
      admin: {
        description: 'Apenas digitos (10-11 caracteres). Validado na ingestao.',
      },
    },
    {
      name: 'answers',
      type: 'json',
      admin: {
        description: 'Respostas do quiz / wizard. Shape livre por origem.',
      },
    },
    {
      name: 'source',
      type: 'text',
      index: true,
      admin: {
        description:
          'Origem mais granular (ex.: "contact_form", "diagnostico", "newsletter"). Substitui o legado `origem`.',
      },
    },
    {
      // DEPRECATED: substituido por `source`. Mantido como compat para nao
      // quebrar /api/contact existente. Novas integracoes devem usar `source`.
      name: 'origem',
      type: 'text',
      defaultValue: 'contact_form',
      index: true,
      admin: {
        description: 'DEPRECATED — usar `source`. Mantido para compat.',
      },
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
