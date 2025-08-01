import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_FILE = /\.(.*)$/; 
const i18n = {
  locales: ['en', 'de', 'ukr', 'ru'],
  defaultLocale: 'en',
};

function getLocale(request: NextRequest) {
  
  return i18n.defaultLocale;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  
  if (
    pathname.includes('/api/') ||
    pathname.includes('/_next/') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return;
  }

  
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);

    
    return NextResponse.redirect(
      new URL(`/${locale}${pathname.startsWith('/') ? '' : ''}${pathname}`, request.url)
    );
  }
}
