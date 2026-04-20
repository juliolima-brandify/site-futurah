import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './schemas'

export default defineConfig({
  name: 'futurah-cms',
  title: 'Futurah CMS',
  projectId: 'si7c9dwl',
  dataset: 'production',
  plugins: [structureTool()],
  schema: { types: schemaTypes },
})
