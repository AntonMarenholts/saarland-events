import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // Список всех поддерживаемых языков
  locales: ['en', 'de', 'ru'],

  // Язык по умолчанию, который будет использоваться, если язык не указан
  defaultLocale: 'de'
});

export const config = {
  // ИСПРАВЛЕНИЕ: Используем более явный и строгий matcher.
  // Он говорит middleware запускаться только на корневом пути ('/')
  // и на всех путях, которые начинаются с одного из наших языков.
  // Это самый надежный способ настройки.
  matcher: ['/', '/(de|en|ru)/:path*']
};
