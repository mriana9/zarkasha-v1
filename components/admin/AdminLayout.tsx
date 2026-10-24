"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingBag,
  Grid,
  Package,
  MessageSquare,
  Settings,
  LogOut,
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
  locale: "ar" | "en";
  dict: {
    brandName: string;
    brandSubtitle: string;
    adminName: string;
    adminRole: string;
    nav: {
      products: string;
      categories: string;
      orders: string;
      messages: string;
      settings: string;
    };
  };
}

export function AdminLayout({ children, locale, dict }: AdminLayoutProps) {
  const pathname = usePathname();
  const isRtl = locale === "ar";

  const navItems = [
    {
      label: dict.nav.products,
      href: `/${locale}/admin/products`,
      icon: ShoppingBag,
    },
    {
      label: dict.nav.categories,
      href: `/${locale}/admin/categories`,
      icon: Grid,
    },
    { label: dict.nav.orders, href: `/${locale}/admin/orders`, icon: Package },
    {
      label: dict.nav.messages,
      href: `/${locale}/admin/messages`,
      icon: MessageSquare,
    },
    {
      label: dict.nav.settings,
      href: `/${locale}/admin/settings`,
      icon: Settings,
    },
  ];

  return (
    <div
      className="min-h-screen bg-[#f7f5f2] flex font-tajawal text-brown"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <aside
        className={`w-64 bg-burgundy text-ivory flex flex-col justify-between shrink-0 shadow-lg ${isRtl ? "border-l" : "border-r"} border-ivory/10`}
      >
        <div>
          <div className="p-6 text-center border-b border-ivory/10">
            <h1 className="font-amiri text-3xl font-normal text-ivory tracking-wide">
              {dict.brandName}
            </h1>
            <p className="text-[10px] text-blush/80 mt-1 font-tajawal">
              {dict.brandSubtitle}
            </p>
          </div>

          <nav className="p-4 space-y-1 mt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-[3px] text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-ivory text-burgundy font-semibold shadow-xs"
                      : "text-ivory/80 hover:bg-white/10 hover:text-ivory"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-ivory/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-blush/20 text-ivory grid place-items-center text-xs font-bold font-amiri border border-blush/30">
              {dict.adminName.charAt(0)}
            </div>
            <div className="text-start">
              <span className="block text-xs font-medium text-ivory">
                {dict.adminName}
              </span>
              <span className="block text-[9px] text-blush/70">
                {dict.adminRole}
              </span>
            </div>
          </div>
          <Link
            href={`/${locale}`}
            className="text-ivory/60 hover:text-ivory p-1.5 transition-colors"
          >
            <LogOut className={`w-4 h-4 ${isRtl ? "rotate-180" : ""}`} />
          </Link>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto bg-[#fbf9f6]">
        {children}
      </main>
    </div>
  );
}
