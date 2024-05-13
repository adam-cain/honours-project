/** @type {import('next').NextConfig} */
import NextBundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = NextBundleAnalyzer({
  enabled: process.env.BUNDLE_ANALYZER === "true",
});

const nextConfig = {
  experimental: {
    urlImports: ["https://cdn.skypack.dev", "https://umgn7lure7vaypuk.public.blob.vercel-storage.com"],
    serverActions: {
      serverActions: true,
      allowedOrigins: ["localhost:3000", process.env.NEXTAUTH_URL],
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: "umgn7lure7vaypuk.public.blob.vercel-storage.com"
      },
      { hostname: "public.blob.vercel-storage.com" },
      { hostname: "res.cloudinary.com" },
      { hostname: "abs.twimg.com" },
      { hostname: "pbs.twimg.com" },
      { hostname: "avatar.vercel.sh" },
      { hostname: "www.google.com" },
      { hostname: "flag.vercel.app" },
      { hostname: "illustrations.popsy.co" },
    ]
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...config.externals, 'isolated-vm', 'esbuild'];
    }
    return config;
  },
};

export default withBundleAnalyzer(nextConfig);
