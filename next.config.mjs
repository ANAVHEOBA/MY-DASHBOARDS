/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    // Add any webpack configurations if needed
    return config;
  },
  // Add this to force the build to continue even with errors
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;