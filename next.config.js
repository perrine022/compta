/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: false,
  },
  // Ne pas utiliser 'standalone' sur Vercel, Vercel gère ça automatiquement
}

module.exports = nextConfig
