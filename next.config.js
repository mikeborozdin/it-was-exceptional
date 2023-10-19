/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ['lh5.googleusercontent.com'],
  }
};

module.exports = nextConfig
