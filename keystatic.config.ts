import { config, collection, fields } from '@keystatic/core'

export default config({
  storage: { kind: 'local' },
  ui: {
    brand: {
      name: 'Futurah CMS',
    },
  },
  collections: {
    posts: collection({
      label: 'Posts',
      slugField: 'title',
      path: 'content/posts/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.text({
          label: 'Title',
          validation: { isRequired: true },
        }),
        excerpt: fields.text({
          label: 'Excerpt',
          multiline: true,
        }),
        coverImage: fields.image({
          label: 'Cover Image',
          directory: 'public/uploads',
          publicPath: '/uploads',
        }),
        category: fields.relationship({
          label: 'Category',
          collection: 'categories',
          validation: { isRequired: true },
        }),
        featured: fields.checkbox({
          label: 'Featured Post',
          description: 'Show this post in the hero section',
        }),
        content: fields.markdoc({
          label: 'Content',
          extension: 'md',
        }),
        publishedAt: fields.date({
          label: 'Published At',
        }),
      },
    }),
    categories: collection({
      label: 'Categories',
      slugField: 'name',
      path: 'content/categories/*',
      schema: {
        name: fields.text({
          label: 'Name',
          validation: { isRequired: true },
        }),
        description: fields.text({
          label: 'Description',
          multiline: true,
        }),
      },
    }),
    faq: collection({
      label: 'FAQ',
      slugField: 'question',
      path: 'content/faq/*',
      format: { contentField: 'answer' },
      schema: {
        question: fields.text({
          label: 'Question',
          validation: { isRequired: true },
        }),
        answer: fields.markdoc({
          label: 'Answer',
          extension: 'md',
        }),
      },
    }),
    analises: collection({
      label: 'Analises',
      slugField: 'title',
      path: 'content/analises/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.text({
          label: 'Title',
          validation: { isRequired: true },
        }),
        summary: fields.text({
          label: 'Summary',
          multiline: true,
        }),
        coverImage: fields.image({
          label: 'Cover Image',
          directory: 'public/uploads',
          publicPath: '/uploads',
        }),
        content: fields.markdoc({
          label: 'Content',
          extension: 'md',
        }),
        publishedAt: fields.date({
          label: 'Published At',
        }),
      },
    }),
    media: collection({
      label: 'Media',
      slugField: 'title',
      path: 'content/media/*',
      schema: {
        title: fields.text({
          label: 'Title',
          validation: { isRequired: true },
        }),
        image: fields.image({
          label: 'Image',
          directory: 'public/uploads',
          publicPath: '/uploads',
        }),
        alt: fields.text({
          label: 'Alt Text',
        }),
      },
    }),
  },
})
