/** @type {import('next').NextConfig} */
const nextConfig = {
  // Debug line to check environment
  ...(console.log('NODE_ENV:', process.env.NODE_ENV) || {}),
  
  // Only use basePath in production, not during development
  ...(process.env.NODE_ENV === 'production' ? { basePath: '/predicts' } : {}),
  
  // Other common configurations
  reactStrictMode: true,
  
  // Add this configuration to ignore specific hydration errors
  onDemandEntries: {
    // Keep the pages in memory for longer to avoid rebuilding them too often
    maxInactiveAge: 25 * 1000,
    // Number of pages to keep in memory
    pagesBufferLength: 2,
  },
  
  // Configure React to be more tolerant of hydration mismatches
  experimental: {
    // This helps with hydration issues caused by browser extensions
    optimizeCss: true,
    // Increase tolerance for hydration mismatches
    strictNextHead: false,
  },
  
  // If you need to handle images from external domains
  images: {
    domains: ['placeholder.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

module.exports = nextConfig;