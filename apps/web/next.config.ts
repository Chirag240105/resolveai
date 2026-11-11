import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: process.env.BUILD_STANDALONE === '1' ? 'standalone' : undefined,
  outputFileTracingRoot: path.join(import.meta.dirname),
  async redirects() {
    return [
      { source: '/disputes', destination: '/dashboard/disputes', permanent: false },
      { source: '/disputes/:id', destination: '/dashboard/disputes/:id', permanent: false },
      { source: '/evidence', destination: '/dashboard/evidence', permanent: false },
      { source: '/investigations', destination: '/dashboard/investigations', permanent: false },
      { source: '/transactions', destination: '/dashboard/transactions', permanent: false },
      { source: '/audit', destination: '/dashboard/audit', permanent: false },
      { source: '/webhooks', destination: '/dashboard/webhooks', permanent: false },
      { source: '/settings', destination: '/dashboard/settings', permanent: false },
    ];
  },
};

export default nextConfig;
