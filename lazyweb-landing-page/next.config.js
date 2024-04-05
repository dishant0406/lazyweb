/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true
  },
  //image source
  images: {
    domains: ['api.lazyweb.rocks', 'via.placeholder.com', 'pub-e97d1a56502c4db6aa9b54e745ce2298.r2.dev'],
  },
  async rewrites() {
    return [
      {
        source: "/blog",
        destination: "https://lazyweb-blogs-gygcdy0fk-lazywebs-projects.vercel.app/blog",
      },
      {
        source: "/blog/:path*",
        destination: "https://lazyweb-blogs-gygcdy0fk-lazywebs-projects.vercel.app/blog/:path*",
      },
    ];
  },
}

module.exports = nextConfig
