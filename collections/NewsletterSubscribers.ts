import type { CollectionConfig } from 'payload'

export const NewsletterSubscribers: CollectionConfig = {
  slug: 'newsletter-subscribers',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'subscribedAt', 'unsubscribedAt'],
    description: 'Newsletter Futurah (global). Um email = uma inscricao.',
  },
  access: {
    read: ({ req }) => !!req.user,
    // Criação pública SEMPRE via /api/newsletter com overrideAccess:true.
    create: () => false,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => req.user?.role === 'superadmin',
  },
  fields: [
    { name: 'email', type: 'email', required: true, unique: true, index: true },
    {
      name: 'subscribedAt',
      type: 'date',
      defaultValue: () => new Date().toISOString(),
    },
    { name: 'unsubscribedAt', type: 'date' },
  ],
  timestamps: true,
}
