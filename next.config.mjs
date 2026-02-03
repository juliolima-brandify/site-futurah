/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        domains: ['framerusercontent.com'],
        remotePatterns: [{ protocol: 'https', hostname: 'framerusercontent.com' }],
    },
    trailingSlash: false,
    serverExternalPackages: ['@keystatic/core', '@keystatic/next'],
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
            ];
        }
        return config;
    },
};

export default nextConfig;
