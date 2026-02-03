'use client'

// Remove Edge runtime as it conflicts with generateStaticParams
// and Keystatic needs to run as a SPA in the browser here.

export async function generateStaticParams() {
    return [{ keystatic: [] }]
}

import { makePage } from '@keystatic/next/ui/app'
import config from '../../../keystatic.config'

const KeystaticPage = makePage(config)

export default KeystaticPage
