import { defineField, defineType } from 'sanity'

export const leadType = defineType({
  name: 'lead',
  title: 'Lead (Contato)',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nome',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'E-mail',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'social',
      title: 'Site ou Instagram',
      type: 'string',
      description: 'Site ou Instagram da empresa',
    }),
    defineField({
      name: 'receivedAt',
      title: 'Recebido em',
      type: 'datetime',
      readOnly: true,
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: { name: 'name', email: 'email', receivedAt: 'receivedAt' },
    prepare({ name, email, receivedAt }) {
      const date = receivedAt ? new Date(receivedAt).toLocaleDateString('pt-BR') : ''
      return {
        title: name || '(sem nome)',
        subtitle: `${email || ''} ${date ? `· ${date}` : ''}`.trim(),
      }
    },
  },
  orderings: [
    { title: 'Mais recentes', name: 'receivedAtDesc', by: [{ field: 'receivedAt', direction: 'desc' }] },
  ],
})
