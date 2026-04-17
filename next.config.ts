import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow fetching images from RSS feed CDNs
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.bloomberg.com" },
      { protocol: "https", hostname: "**.cnn.com" },
      { protocol: "https", hostname: "**.cnbc.com" },
      { protocol: "https", hostname: "**.ytimg.com" },
    ],
  },

  // Permit YouTube iframes via Content-Security-Policy
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https:",
              "frame-src https://www.youtube.com https://www.youtube-nocookie.com",
              "connect-src 'self'",
              "media-src 'self' https:",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
