/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ['en', 'de', 'ukr', 'ru'],
    defaultLocale: 'en',
    localeDetection: false,
  },
};

module.exports = nextConfig;