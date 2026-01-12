/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Markdown processing configuration
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    });
    
    return config;
  },

  // Support for MDX if needed
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],

  // Environment variables
  env: {
    // Add any public environment variables here
  },

  // Image optimization
  images: {
    domains: [],
    formats: ['image/avif', 'image/webp'],
  },

  // Headers configuration
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },

  // Redirects configuration
  async redirects() {
    return [];
  },

  // Rewrites configuration
  async rewrites() {
    return [];
  },
};

module.exports = nextConfig;
