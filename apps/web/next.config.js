/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@autoinspect/shared'],
  output: 'standalone',
};
module.exports = nextConfig;
