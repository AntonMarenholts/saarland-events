/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ['en', 'de', 'ukr', 'ru'],
    defaultLocale: 'de',
    localeDetection: false,
  },
};

module.exports = nextConfig;
