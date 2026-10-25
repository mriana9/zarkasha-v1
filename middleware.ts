import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["ar", "en"];
const defaultLocale = "ar";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.includes("/admin");

  if (isAdminRoute) {
    const localeMatch = pathname.match(/^\/(ar|en)(\/|$)/);
    const locale = localeMatch ? localeMatch[1] : defaultLocale;
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (pathnameHasLocale) return;

  request.nextUrl.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|hero|.*\\..*).*)",
  ],
};
