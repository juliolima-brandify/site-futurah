import { buildPayloadConfig } from '@futurah/payload-config'
import path from 'path'
import { fileURLToPath } from 'url'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export default buildPayloadConfig(dirname, {
  admin: {
    user: 'users',
    meta: { titleSuffix: '— Futurah Admin' },
  },
})
