import { postgresAdapter } from '@payloadcms/db-postgres'
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { buildConfig, type Config } from 'payload'
import sharp from 'sharp'

import { Authors } from './collections/Authors'
import { Categories } from './collections/Categories'
import { Leads } from './collections/Leads'
import { Media } from './collections/Media'
import { NewsletterSubscribers } from './collections/NewsletterSubscribers'
import { Posts } from './collections/Posts'
import { Tenants } from './collections/Tenants'
import { Users } from './collections/Users'

export { Authors, Categories, Leads, Media, NewsletterSubscribers, Posts, Tenants, Users }

/**
 * buildPayloadConfig — constrói o config do Payload com paths resolvidos
 * relativos ao app que chama (passa `dirname` do próprio payload.config.ts).
 *
 * @param dirname   — `path.dirname(fileURLToPath(import.meta.url))` do app
 * @param overrides — overrides opcionais (ex: admin.meta.titleSuffix por tenant)
 */
export function buildPayloadConfig(dirname: string, overrides?: Partial<Config>) {
  const payloadSecret = process.env.PAYLOAD_SECRET
  if (!payloadSecret) throw new Error('PAYLOAD_SECRET nao definido.')

  return buildConfig({
    admin: {
      user: 'users',
      meta: { titleSuffix: '— Futurah Admin' },
      ...overrides?.admin,
    },
    collections: [
      Tenants,
      Users,
      Media,
      Posts,
      Categories,
      Authors,
      Leads,
      NewsletterSubscribers,
    ],
    editor: lexicalEditor(),
    secret: payloadSecret,
    typescript: {
      outputFile: path.resolve(dirname, 'payload-types.ts'),
    },
    db: postgresAdapter({
      pool: { connectionString: process.env.DATABASE_URL },
      schemaName: 'payload',
      migrationDir: path.resolve(dirname, 'payload-migrations'),
    }),
    sharp,
    plugins: [
      multiTenantPlugin({
        tenantsSlug: 'tenants',
        collections: {
          posts: {},
          categories: {},
          authors: {},
          leads: {},
        },
        tenantsArrayField: {
          includeDefaultField: true,
          arrayFieldName: 'tenants',
          arrayTenantFieldName: 'tenant',
        },
        userHasAccessToAllTenants: (user) => user?.role === 'superadmin',
      }),
      vercelBlobStorage({
        enabled: true,
        collections: { media: true },
        token: process.env.BLOB_READ_WRITE_TOKEN,
        clientUploads: true,
      }),
    ],
    ...overrides,
  })
}
