import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {

    config.plugins.push(new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    }));
    // Important: return the modified config
    return config;
  },
  /* config options here */
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  images: {
    // unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lamhystore.b-cdn.net',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'cdn-images.kiotviet.vn',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'cdn2-retail-images.kiotviet.vn',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'down-bs-vn.img.susercontent.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'theme.hstatic.net',
        port: '',
      }
    ],
  },
};

export default nextConfig;
