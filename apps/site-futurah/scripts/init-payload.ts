import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'

async function main() {
  const payload = await getPayload({ config })
  console.log('Payload initialized. Schema push complete.')
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
