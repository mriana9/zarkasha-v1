import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const locales = ["ar", "en"];
const defaultLocale = "ar";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdminRoute = pathname.includes("/admin");

  if (isAdminRoute) {
    const localeMatch = pathname.match(/^\/(ar|en)(\/|$)/);
    const locale = localeMatch ? localeMatch[1] : defaultLocale;

    if (!user) {
      return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }

    const { data: settingData } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "admin_email")
      .single();

    const allowedAdminEmail = settingData?.value || process.env.ADMIN_EMAIL;

    const isAuthorized =
      allowedAdminEmail &&
      user.email?.toLowerCase() === allowedAdminEmail.toLowerCase();

    if (!isAuthorized) {
      return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }
  }

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (pathnameHasLocale) return response;

  request.nextUrl.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|hero|.*\\..*).*)",
  ],
};
