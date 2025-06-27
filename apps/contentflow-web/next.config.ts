/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@mumicah/ui', '@mumicah/shared'],
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
}

export default nextConfig
