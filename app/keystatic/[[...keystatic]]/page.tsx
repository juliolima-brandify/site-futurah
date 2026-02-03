export async function generateStaticParams() {
    return [{ keystatic: [] }]
}

export const dynamicParams = false
export const dynamic = 'force-static'

import { makePage } from '@keystatic/next/ui/app'
import config from '../../../keystatic.config'

const KeystaticPage = makePage(config)

export default KeystaticPage
