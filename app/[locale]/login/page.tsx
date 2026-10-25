"use client";

import { useState, use } from "react";
import Link from "next/link";
import { Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";

interface LoginPageProps {
  params: Promise<{ locale: "ar" | "en" }>;
}

export default function LoginPage({ params }: LoginPageProps) {
  const resolvedParams = use(params);
  const locale = resolvedParams.locale;
  const isRtl = locale === "ar";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const t = {
    brandName: isRtl ? "زركشة" : "Zarkasha",
    brandSubtitle: isRtl
      ? "تطريز فلسطيني أصيل"
      : "Authentic Palestinian Embroidery",
    welcomeTitle: isRtl ? "أهلاً بكِ مجدداً" : "Welcome Back",
    welcomeDesc: isRtl
      ? "لوحة التحكم الخاصة بإدارة المنتجات والطلبات والتواصل مع العميلات"
      : "Manage products, orders, and customer interactions elegantly",
    title: isRtl ? "تسجيل الدخول" : "Sign In",
    subtitle: isRtl
      ? "أدخلي بيانات الحساب للوصول للوحة التحكم"
      : "Enter your credentials to access the admin panel",
    emailLabel: isRtl ? "البريد الإلكتروني" : "Email Address",
    passwordLabel: isRtl ? "كلمة المرور" : "Password",
    submitBtn: isRtl ? "تسجيل الدخول للوحة التحكم" : "Sign In to Dashboard",
    orDivider: isRtl ? "أو" : "OR",
    googleBtn: isRtl ? "المتابعة باستخدام Google" : "Continue with Google",
    backToHome: isRtl ? "العودة إلى المتجر الرئيسي" : "Back to Main Store",
    securityNote: isRtl
      ? "منطقة آمنة ومخصصة للإدارة فقط"
      : "Secure area restricted to authorized staff",
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(isRtl ? "تم تسجيل الدخول بنجاح!" : "Signed in successfully!");
  };

  const handleGoogleLogin = () => {
    alert(isRtl ? "جاري الاتصال بحساب جوجل..." : "Connecting with Google...");
  };

  return (
    <div
      className="min-h-screen bg-[#f7f5f2] flex font-tajawal"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Visual Brand Side (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-burgundy text-ivory relative flex-col justify-between p-12 overflow-hidden">
        {/* Subtle Decorative Pattern Background */}
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

      {/* Login Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-[#fbf9f6]">
        <div className="max-w-md w-full space-y-6">
          {/* Mobile Header Brand */}
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

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full h-12 bg-ivory border border-burgundy/20 rounded-[3px] text-xs font-medium text-brown hover:bg-burgundy/5 transition-all shadow-2xs flex items-center justify-center gap-3 cursor-pointer"
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-brown">
                {t.emailLabel}
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@zarkasha.com"
                  className="w-full h-12 px-4 bg-ivory border border-burgundy/20 rounded-[3px] text-xs text-brown outline-none focus:border-burgundy focus:ring-1 focus:ring-burgundy/35 transition-all ltr:text-left rtl:text-right shadow-2xs"
                />
                <Mail
                  className={`w-4 h-4 text-[#a0928d] absolute ${isRtl ? "left-3.5" : "right-3.5"} top-1/2 -translate-y-1/2`}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-brown">
                {t.passwordLabel}
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full h-12 px-4 bg-ivory border border-burgundy/20 rounded-[3px] text-xs text-brown outline-none focus:border-burgundy focus:ring-1 focus:ring-burgundy/35 transition-all shadow-2xs"
                />
                <Lock
                  className={`w-4 h-4 text-[#a0928d] absolute ${isRtl ? "left-3.5" : "right-3.5"} top-1/2 -translate-y-1/2`}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-12 bg-burgundy text-ivory rounded-[3px] text-xs font-medium hover:bg-burgundy/90 transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2 mt-2 group"
            >
              <span>{t.submitBtn}</span>
              <ArrowRight
                className={`w-4 h-4 transition-transform ${isRtl ? "group-hover:-translate-x-1 rotate-180" : "group-hover:translate-x-1"}`}
              />
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
