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
    
  }
}

module.exports = nextConfig
