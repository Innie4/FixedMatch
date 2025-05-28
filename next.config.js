/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production-only basePath configuration
  ...(process.env.NODE_ENV === 'production' ? { basePath: '/predicts' } : {}),
  
  // Core configurations
  reactStrictMode: true,
  
  // Image optimization settings
  images: {
    domains: ['placeholder.com'],
    remotePatterns: [{
      protocol: 'https',
      hostname: '**'
    }],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384]
  },
  
  // Performance optimizations
  experimental: {
    optimizeCss: true
  }
};

module.exports = nextConfig;