"use client";

import { useState, use } from "react";
import Link from "next/link";
import { Lock, Mail, ArrowRight, Sparkles, ShieldCheck } from "lucide-react";

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
    backToHome: isRtl ? "العودة إلى المتجر الرئيسي" : "Back to Main Store",
    securityNote: isRtl
      ? "منطقة آمنة ومخصصة للإدارة فقط"
      : "Secure area restricted to authorized staff",
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(isRtl ? "تم تسجيل الدخول بنجاح!" : "Signed in successfully!");
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
        <div className="max-w-md w-full space-y-8">
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

          <form onSubmit={handleSubmit} className="space-y-5">
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
                  className="w-full h-12 px-4 bg-ivory border border-burgundy/20 rounded-[3px] text-xs text-brown outline-none focus:border-burgundy focus:ring-1 focus:ring-burgundy/30 transition-all ltr:text-left rtl:text-right shadow-2xs"
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
                  className="w-full h-12 px-4 bg-ivory border border-burgundy/20 rounded-[3px] text-xs text-brown outline-none focus:border-burgundy focus:ring-1 focus:ring-burgundy/30 transition-all shadow-2xs"
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

          <div className="pt-6 border-t border-burgundy/10 text-center">
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
