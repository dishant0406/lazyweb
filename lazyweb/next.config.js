/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  //image source
  images: {
    domains: ['api.lazyweb.rocks'],
  },
}

module.exports = nextConfig
