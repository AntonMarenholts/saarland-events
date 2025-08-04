import createNextIntlPlugin from "next-intl/plugin";

// ИСПРАВЛЕНИЕ: Указываем правильный путь к нашему файлу i18n.ts,
// который теперь находится внутри папки `src`.
const withNextIntl = createNextIntlPlugin("./src/i18n.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ucarecdn.com",
        pathname: "/**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
