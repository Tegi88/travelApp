/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@travel-app/shared"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "*.amadeus.com" },
    ],
  },
  webpack: (config) => {
    config.resolve.alias["@travel-app/shared"] = path.resolve(__dirname, "../shared/src");
    return config;
  },
};

module.exports = nextConfig;
