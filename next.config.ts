import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: {}, // tells Next.js you're intentionally using Turbopack

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.rentorahouselink.com',
      },
    ],
  },

  async headers() {
    return [
      {
        source: '/.well-known/apple-app-site-association',
        headers: [{ key: 'Content-Type', value: 'application/json' }],
      },
      {
        source: '/.well-known/assetlinks.json',
        headers: [{ key: 'Content-Type', value: 'application/json' }],
      },
    ];
  },
};

export default nextConfig;