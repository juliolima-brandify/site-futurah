'use client'

import { useState, useEffect } from 'react'

// Carregar Studio e config só no cliente evita MODULE_NOT_FOUND do vendor-chunk no servidor
export default function AdminPage() {
  const [Studio, setStudio] = useState<React.ComponentType | null>(null)

  useEffect(() => {
    Promise.all([
      import('next-sanity/studio').then((mod) => mod.NextStudio),
      import('@/sanity/sanity.config').then((mod) => mod.default),
    ]).then(([NextStudio, config]) => {
      setStudio(() => () => <NextStudio config={config} />)
    })
  }, [])

  if (!Studio) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950 text-white">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white mx-auto" />
          <p>Carregando Studio...</p>
        </div>
      </div>
    )
  }

  return <Studio />
}
