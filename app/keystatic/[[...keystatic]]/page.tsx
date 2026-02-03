'use client'

export const runtime = 'edge'


import { makePage } from '@keystatic/next/ui/app'
import config from '../../../keystatic.config'

const KeystaticPage = makePage(config)

export default KeystaticPage
