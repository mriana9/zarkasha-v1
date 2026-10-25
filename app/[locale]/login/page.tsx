"use client";

import { useState, use, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Lock,
  Mail,
  Phone,
  ArrowRight,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

interface LoginPageProps {
  params: Promise<{ locale: "ar" | "en" }>;
}

interface CountryCode {
  code: string;
  country: string;
  flag: string;
}

const countryCodes: CountryCode[] = [
  { code: "+970", country: "PS", flag: "🇵🇸" },
  { code: "+972", country: "IL", flag: "🇵🇸" },
];

export default function LoginPage({ params }: LoginPageProps) {
  const resolvedParams = use(params);
  const locale = resolvedParams.locale;
  const isRtl = locale === "ar";
  const router = useRouter();
  const supabase = createClient();

  const [authType, setAuthType] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [countryCode, setCountryCode] = useState<string>("+970");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{
    identifier?: string;
    password?: string;
  }>({});

  const emailSchema = z.object({
    identifier: z
      .string()
      .min(1, isRtl ? "البريد الإلكتروني مطلوب" : "Email is required")
      .email(
        isRtl ? "صيغة البريد الإلكتروني غير صحيحة" : "Invalid email address",
      ),
    password: z
      .string()
      .min(
        6,
        isRtl
          ? "كلمة المرور يجب أن تكون 6 خانات على الأقل"
          : "Password must be at least 6 characters",
      ),
  });

  const phoneSchema = z.object({
    identifier: z
      .string()
      .min(1, isRtl ? "رقم الجوال مطلوب" : "Phone number is required")
      .regex(
        /^\d{10}$/,
        isRtl
          ? "رقم الجوال يجب أن يتكون من 10 أرقام"
          : "Phone number must be exactly 10 digits",
      ),
    password: z
      .string()
      .min(
        6,
        isRtl
          ? "كلمة المرور يجب أن تكون 6 خانات على الأقل"
          : "Password must be at least 6 characters",
      ),
  });

  const t = {
    brandName: isRtl ? "زركشة" : "Zarkasha",
    brandSubtitle: isRtl
      ? "تطريز فلسطيني أصيل"
      : "Authentic Palestinian Embroidery",
    welcomeDesc: isRtl
      ? "لوحة التحكم الخاصة بإدارة المنتجات والطلبات والتواصل مع العميلات"
      : "Manage products, orders, and customer interactions elegantly",
    title: isRtl ? "تسجيل الدخول" : "Sign In",
    subtitle: isRtl
      ? "أدخلي بيانات الحساب للوصول للوحة التحكم"
      : "Enter your credentials to access the admin panel",
    emailTab: isRtl ? "البريد الإلكتروني" : "Email",
    phoneTab: isRtl ? "رقم الجوال" : "Phone Number",
    emailLabel: isRtl ? "البريد الإلكتروني" : "Email Address",
    phoneLabel: isRtl ? "رقم الجوال (10 أرقام)" : "Phone Number (10 digits)",
    passwordLabel: isRtl ? "كلمة المرور" : "Password",
    submitBtn: isRtl ? "تسجيل الدخول للوحة التحكم" : "Sign In to Dashboard",
    orDivider: isRtl ? "أو" : "OR",
    googleBtn: isRtl ? "المتابعة باستخدام Google" : "Continue with Google",
    backToHome: isRtl ? "العودة إلى المتجر الرئيسي" : "Back to Main Store",
    securityNote: isRtl
      ? "منطقة آمنة ومخصصة للإدارة فقط"
      : "Secure area restricted to authorized staff",
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const activeSchema = authType === "email" ? emailSchema : phoneSchema;
    const currentIdentifier = authType === "email" ? email : phone;

    const result = activeSchema.safeParse({
      identifier: currentIdentifier,
      password,
    });

    if (!result.success) {
      const fieldErrors: { identifier?: string; password?: string } = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0] === "identifier")
          fieldErrors.identifier = issue.message;
        if (issue.path[0] === "password") fieldErrors.password = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);

    if (authType === "email") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(isRtl ? "خطأ في تسجيل الدخول" : "Authentication Error", {
          description: error.message,
        });
        setLoading(false);
      } else {
        setEmail("");
        setPassword("");
        toast.success(
          isRtl ? "تم تسجيل الدخول بنجاح" : "Signed in successfully",
        );
        router.push(`/${locale}/admin`);
        router.refresh();
      }
    } else {
      const formattedPhone = `${countryCode}${phone}`;
      const { error } = await supabase.auth.signInWithPassword({
        phone: formattedPhone,
        password,
      });

      if (error) {
        toast.error(isRtl ? "خطأ في تسجيل الدخول" : "Authentication Error", {
          description: error.message,
        });
        setLoading(false);
      } else {
        setPhone("");
        setPassword("");
        toast.success(
          isRtl ? "تم تسجيل الدخول بنجاح" : "Signed in successfully",
        );
        router.push(`/${locale}/admin`);
        router.refresh();
      }
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/${locale}/auth/callback`,
      },
    });

    if (error) {
      toast.error(
        isRtl ? "فشل الاتصال بحساب Google" : "Google Sign-In failed",
        {
          description: error.message,
        },
      );
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#f7f5f2] flex font-tajawal"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="hidden lg:flex lg:w-1/2 bg-burgundy text-ivory relative flex-col justify-between p-12 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <h1 className="font-amiri text-5xl font-normal text-ivory tracking-wide pt-4">
            {t.brandName}
          </h1>
          <p className="text-sm text-blush/80 font-light tracking-wider">
            {t.brandSubtitle}
          </p>
        </div>

        <div className="relative z-10 space-y-4 max-w-lg">
          <blockquote className="font-amiri text-2xl text-ivory/90 leading-relaxed font-normal border-r-2 ltr:border-l-2 ltr:border-r-0 border-blush/40 pr-4 ltr:pl-4">
            &ldquo;{t.welcomeDesc}&rdquo;
          </blockquote>
          <div className="flex items-center gap-2 text-xs text-blush/70">
            <ShieldCheck className="w-4 h-4 text-blush" />
            <span>{t.securityNote}</span>
          </div>
        </div>

        <div className="relative z-10 text-[11px] text-blush/50">
          © {new Date().getFullYear()} Zarkasha. All rights reserved.
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-[#fbf9f6]">
        <div className="max-w-md w-full space-y-6">
          <div className="lg:hidden text-center space-y-1">
            <h1 className="font-amiri text-3xl font-normal text-burgundy">
              {t.brandName}
            </h1>
            <p className="text-xs text-[#887a75]">{t.brandSubtitle}</p>
          </div>

          <div className="space-y-2">
            <h2 className="font-amiri text-3xl font-normal text-burgundy">
              {t.title}
            </h2>
            <p className="text-xs text-[#887a75] leading-relaxed">
              {t.subtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full h-12 bg-ivory border border-burgundy/20 rounded-[3px] text-xs font-medium text-brown hover:bg-burgundy/5 transition-all shadow-2xs flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{t.googleBtn}</span>
          </button>

          <div className="flex items-center gap-4 my-2">
            <div className="flex-1 h-px bg-burgundy/15" />
            <span className="text-[11px] text-[#887a75] font-medium">
              {t.orDivider}
            </span>
            <div className="flex-1 h-px bg-burgundy/15" />
          </div>

          <div className="grid grid-cols-2 gap-2 bg-burgundy/5 p-1 rounded-[4px] border border-burgundy/10">
            <button
              type="button"
              onClick={() => {
                setAuthType("email");
                setErrors({});
              }}
              className={`h-9 rounded-[3px] text-xs font-medium transition-all cursor-pointer ${
                authType === "email"
                  ? "bg-burgundy text-ivory shadow-2xs"
                  : "text-brown hover:text-burgundy"
              }`}
            >
              {t.emailTab}
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthType("phone");
                setErrors({});
              }}
              className={`h-9 rounded-[3px] text-xs font-medium transition-all cursor-pointer ${
                authType === "phone"
                  ? "bg-burgundy text-ivory shadow-2xs"
                  : "text-brown hover:text-burgundy"
              }`}
            >
              {t.phoneTab}
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {authType === "email" ? (
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-brown">
                  {t.emailLabel}
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@zarkasha.com"
                    className={`w-full h-12 px-4 bg-ivory border ${
                      errors.identifier
                        ? "border-red-500"
                        : "border-burgundy/20"
                    } rounded-[3px] text-xs text-brown outline-none focus:border-burgundy focus:ring-1 focus:ring-burgundy/35 transition-all ltr:text-left rtl:text-right shadow-2xs`}
                  />
                  <Mail
                    className={`w-4 h-4 text-[#a0928d] absolute ${isRtl ? "left-3.5" : "right-3.5"} top-1/2 -translate-y-1/2`}
                  />
                </div>
                {errors.identifier && (
                  <p className="text-[11px] text-red-500">
                    {errors.identifier}
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-brown">
                  {t.phoneLabel}
                </label>
                <div className="flex gap-2" dir="ltr">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="h-12 px-2 bg-ivory border border-burgundy/20 rounded-[3px] text-xs text-brown outline-none focus:border-burgundy cursor-pointer shadow-2xs"
                  >
                    {countryCodes.map((item) => (
                      <option key={item.code} value={item.code}>
                        {item.flag} {item.code}
                      </option>
                    ))}
                  </select>

                  <div className="relative flex-1">
                    <input
                      type="tel"
                      maxLength={10}
                      value={phone}
                      onChange={(e) =>
                        setPhone(e.target.value.replace(/\D/g, ""))
                      }
                      placeholder="0590000000"
                      className={`w-full h-12 px-4 bg-ivory border ${
                        errors.identifier
                          ? "border-red-500"
                          : "border-burgundy/20"
                      } rounded-[3px] text-xs text-brown outline-none focus:border-burgundy focus:ring-1 focus:ring-burgundy/35 transition-all ltr:text-left shadow-2xs`}
                    />
                    <Phone className="w-4 h-4 text-[#a0928d] absolute right-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
                {errors.identifier && (
                  <p className="text-[11px] text-red-500">
                    {errors.identifier}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-brown">
                {t.passwordLabel}
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full h-12 px-4 bg-ivory border ${
                    errors.password ? "border-red-500" : "border-burgundy/20"
                  } rounded-[3px] text-xs text-brown outline-none focus:border-burgundy focus:ring-1 focus:ring-burgundy/35 transition-all shadow-2xs`}
                />
                <Lock
                  className={`w-4 h-4 text-[#a0928d] absolute ${isRtl ? "left-3.5" : "right-3.5"} top-1/2 -translate-y-1/2`}
                />
              </div>
              {errors.password && (
                <p className="text-[11px] text-red-500">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-burgundy text-ivory rounded-[3px] text-xs font-medium hover:bg-burgundy/90 transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2 mt-2 group disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>{t.submitBtn}</span>
                  <ArrowRight
                    className={`w-4 h-4 transition-transform ${isRtl ? "group-hover:-translate-x-1 rotate-180" : "group-hover:translate-x-1"}`}
                  />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-burgundy/10 text-center">
            <Link
              href={`/${locale}`}
              className="text-xs text-olive hover:text-burgundy transition-colors inline-flex items-center gap-2 font-medium"
            >
              <ArrowRight
                className={`w-3.5 h-3.5 ${isRtl ? "rotate-0" : "rotate-180"}`}
              />
              <span>{t.backToHome}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
