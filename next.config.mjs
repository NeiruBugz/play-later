/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["howlongtobeat.com", "placehold.jp"],
  },
  experimental: {
    appDir: true,
  },
}

export default nextConfig
