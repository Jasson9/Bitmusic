/** @type {import('next').NextConfig} */
//disable StrictMode
/**
module.exports = {
  webpack: (config) => {
    config.experiments = { topLevelAwait: true };
    return config;
  },
};
 */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  experimental:{
    
  },
  images: {
    domains: ['i.ytimg.com'],
  },
  env: {
    ROOT: __dirname,
  },
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
}

module.exports = nextConfig
