/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: "https",
        hostname: "pwxpxouatzzxvvvszdnx.supabase.co",
      },
      {
        protocol: 'https',
        hostname: 'armoto.vtexassets.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn-xiaomi.waugi.com.ar',
      },
      {
        protocol: 'https',
        hostname: 'www.google.com',
      },
    ],
  },
};

export default nextConfig;
