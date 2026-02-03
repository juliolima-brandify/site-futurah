export async function generateStaticParams() {
    return [{ keystatic: [] }]
}

export const dynamicParams = false

import { makePage } from '@keystatic/next/ui/app'
import config from '../../../keystatic.config'

const KeystaticPage = makePage(config)

export default KeystaticPage
