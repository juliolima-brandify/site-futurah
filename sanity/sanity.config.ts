import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './schema'
import { projectId, dataset } from './env'

export default defineConfig({
  name: 'futurah-cms',
  title: 'Futurah CMS',
  basePath: '/admin',
  projectId,
  dataset,
  plugins: [structureTool()],
  schema: { types: schemaTypes },
})
