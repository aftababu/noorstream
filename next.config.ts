
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // https://img.youtube.com/vi/AklUBQzfxCw/maxresdefault.jpg
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**', // This allows any path under picsum.photos
        },
        {
          protocol: 'https',
          hostname: 'img.youtube.com',
          port: '',
          pathname: '/vi/**', // This allows any path under img.youtube.com/vi/
        }
    ],
  },
};

module.exports = nextConfig;