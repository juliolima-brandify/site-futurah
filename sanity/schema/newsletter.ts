import { defineField, defineType } from 'sanity'

export const newsletterType = defineType({
  name: 'newsletter',
  title: 'Newsletter',
  type: 'document',
  fields: [
    defineField({
      name: 'email',
      title: 'E-mail',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'subscribedAt',
      title: 'Inscrito em',
      type: 'datetime',
      readOnly: true,
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: { email: 'email', subscribedAt: 'subscribedAt' },
    prepare({ email, subscribedAt }) {
      const date = subscribedAt ? new Date(subscribedAt).toLocaleDateString('pt-BR') : ''
      return {
        title: email || '(sem e-mail)',
        subtitle: date,
      }
    },
  },
  orderings: [
    { title: 'Mais recentes', name: 'subscribedAtDesc', by: [{ field: 'subscribedAt', direction: 'desc' }] },
  ],
})
