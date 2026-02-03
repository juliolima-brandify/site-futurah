/** @type {import('next').NextConfig} */
const nextConfig = {
  // Otimizações de performance
  reactStrictMode: false,
  // Otimização de imagens
  images: {
    domains: ['framerusercontent.com'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'framerusercontent.com',
        pathname: '/**',
      },
    ],
  },

  // Compressão
  compress: true,

  // Headers de segurança e performance
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
        ],
      },
    ]
  },
  trailingSlash: false,
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('node:fs', 'node:path', 'node:fs/promises');
    }
    return config;
  },
}

module.exports = nextConfig
