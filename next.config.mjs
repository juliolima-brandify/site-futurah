import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        domains: ['framerusercontent.com', 'cdn.sanity.io', 'unavatar.io'],
        remotePatterns: [
            { protocol: 'https', hostname: 'framerusercontent.com' },
            { protocol: 'https', hostname: 'cdn.sanity.io' },
            { protocol: 'https', hostname: 'unavatar.io' },
        ],
    },
    trailingSlash: false,
    webpack: (config, { isServer }) => {
        config.resolve = config.resolve || {}
        config.resolve.alias = {
            ...config.resolve.alias,
            slate: path.resolve(__dirname, 'node_modules/slate'),
        }
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
