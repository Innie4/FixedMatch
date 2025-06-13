/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production-only basePath configuration
  ...(process.env.NODE_ENV === 'production' ? { basePath: '/predicts' } : {}),

  // Core configurations
  reactStrictMode: true,

  // Image optimization settings
  images: {
    domains: ['placeholder.com', 'res.cloudinary.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Performance optimizations
  experimental: {
    optimizeCss: true,
  },

  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't resolve 'fs' module on the client to prevent this error on build --> Error: Can't resolve 'fs'
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        path: false,
        os: false,
      }
    }
    return config
  },
}

module.exports = nextConfig
