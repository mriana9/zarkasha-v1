import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const locales = ["ar", "en"];
const defaultLocale = "ar";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  let response = NextResponse.next({
    request,
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
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          response = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const isAdminRoute = /^\/(?:ar|en)\/admin(?:\/|$)/.test(pathname);

  if (isAdminRoute) {
    const localeMatch = pathname.match(/^\/(ar|en)(?:\/|$)/);
    const locale = localeMatch?.[1] ?? defaultLocale;

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
    }

    const { data: admin, error: adminError } = await supabase
      .from("admins")
      .select("role, is_active")
      .eq("user_id", user.id)
      .maybeSingle();

    const hasAdminAccess =
      !adminError &&
      admin !== null &&
      admin.is_active === true &&
      ["owner", "admin"].includes(admin.role);

    if (!hasAdminAccess) {
      return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }
  }

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (pathnameHasLocale) {
    return response;
  }

  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = `/${defaultLocale}${pathname}`;

  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|hero|.*\\..*).*)",
  ],
};
