/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ["prod-metadata.s3.amazonaws.com", "ethereum.org"],
  },
  env: {
    DISCO_API_KEY: process.env.DISCO_API_KEY,
    GITCOIN_API_KEY: process.env.GITCOIN_API_KEY,
  }
};
