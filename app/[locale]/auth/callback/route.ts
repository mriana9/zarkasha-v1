import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

interface CallbackParams {
  params: Promise<{ locale: string }>;
}

export async function GET(request: Request, { params }: CallbackParams) {
  const { locale: requestedLocale } = await params;
  const locale = ["ar", "en"].includes(requestedLocale)
    ? requestedLocale
    : "ar";

  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  const homeUrl = new URL(`/${locale}`, requestUrl.origin);
  const loginUrl = new URL(`/${locale}/login`, requestUrl.origin);

  if (!code) {
    return NextResponse.redirect(loginUrl);
  }

  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    },
  );

  const { error: exchangeError } =
    await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    return NextResponse.redirect(loginUrl);
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.redirect(loginUrl);
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

  if (hasAdminAccess) {
    return NextResponse.redirect(
      new URL(`/${locale}/admin`, requestUrl.origin),
    );
  }

  return NextResponse.redirect(homeUrl);
}
