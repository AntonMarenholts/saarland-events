import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_FILE = /\.(.*)$/; // Пропускаем статические файлы
const i18n = {
  locales: ['en', 'de', 'ukr', 'ru'],
  defaultLocale: 'en',
};

function getLocale(request: NextRequest) {
  // Логика определения языка пользователя
  // Например, из куки, заголовков 'Accept-Language' или других источников.
  // Пока что для простоты вернем язык по умолчанию.
  return i18n.defaultLocale;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Пропускаем статические файлы, API-маршруты и другие служебные пути
  if (
    pathname.includes('/api/') ||
    pathname.includes('/_next/') ||
    pathname.includes('/admin/') || // Пропускаем админку
    PUBLIC_FILE.test(pathname)
  ) {
    return;
  }

  // Проверяем, есть ли в URL уже указанный язык
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Если языка в URL нет, добавляем его
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);

    // Например, /products -> /en/products
    return NextResponse.redirect(
      new URL(`/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url)
    );
  }
}