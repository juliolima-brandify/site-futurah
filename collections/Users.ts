import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: { useAsTitle: 'email' },
  access: {
    read: ({ req }) => !!req.user,
    create: ({ req }) => req.user?.role === 'superadmin',
    update: ({ req }) => req.user?.role === 'superadmin',
    delete: ({ req }) => req.user?.role === 'superadmin',
  },
  fields: [
    { name: 'name', type: 'text' },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'tenant_admin',
      options: [
        { label: 'Super Admin (Futurah)', value: 'superadmin' },
        { label: 'Tenant Admin', value: 'tenant_admin' },
      ],
    },
  ],
}
