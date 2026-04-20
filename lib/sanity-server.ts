/**
 * Cliente Sanity com permissão de escrita (token).
 * Usar apenas em API routes / server (nunca expor o token no client).
 */
import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '@/sanity/env'

const token = process.env.SANITY_API_WRITE_TOKEN

export function getWriteClient() {
  if (!projectId || !token) return null
  return createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
  })
}
