import { defineField, defineType } from 'sanity'

export const authorType = defineType({
  name: 'author',
  title: 'Autor',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nome',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Foto',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'role',
      title: 'Cargo / Badge',
      type: 'string',
      description: 'Ex: Staff, Human Picks, Editor',
    }),
  ],
  preview: {
    select: { name: 'name', role: 'role', media: 'image' },
    prepare({ name, role, media }) {
      return {
        title: name || '(sem nome)',
        subtitle: role || undefined,
        media,
      }
    },
  },
})
