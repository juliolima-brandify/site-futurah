import type { MetadataRoute } from 'next';

export const runtime = 'edge';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Futura and Co.',
    short_name: 'Futura',
    description: 'Marketing do Futuro com Impacto no presente - A maior escola de IA para profissionais criativos',
    start_url: '/',
    display: 'standalone',
    background_color: '#E7E7E7',
    theme_color: '#1B1B1B',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
