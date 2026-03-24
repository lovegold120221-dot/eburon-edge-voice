const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    unoptimized: false,
    formats: ['image/avif', 'image/webp'],
  },
  turbopack: {
    root: path.join(__dirname, '..'),
  },
};

module.exports = nextConfig;
