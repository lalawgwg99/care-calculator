/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  swcMinify: true,
  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
  },
  // Compression and caching
  compress: true,
  poweredByHeader: false,
};

module.exports = nextConfig;
