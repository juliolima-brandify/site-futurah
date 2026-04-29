/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'framerusercontent.com' },
            { protocol: 'https', hostname: 'unavatar.io' },
            { protocol: 'https', hostname: '**.public.blob.vercel-storage.com' },
        ],
    },
    trailingSlash: false,
    webpack: (config, { isServer }) => {
        if (isServer) {
            config.externals = [
                ...(Array.isArray(config.externals) ? config.externals : [config.externals].filter(Boolean)),
                'fs',
                'path',
                'fs/promises',
                'node:fs',
                'node:path',
                'node:fs/promises',
            ]
        }
        return config
    },
}

export default nextConfig;
