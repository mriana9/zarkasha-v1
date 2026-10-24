"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingBag,
  Grid,
  Package,
  MessageSquare,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
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
      customers?: string;
      settings: string;
    };
  };
}

export function AdminLayout({ children, locale, dict }: AdminLayoutProps) {
  const pathname = usePathname();
  const isRtl = locale === "ar";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    {
      label: dict.nav.orders,
      href: `/${locale}/admin/orders`,
      icon: Package,
    },
    {
      label: dict.nav.messages,
      href: `/${locale}/admin/messages`,
      icon: MessageSquare,
    },
    {
      label: dict.nav.customers || (isRtl ? "العملاء" : "Customers"),
      href: `/${locale}/admin/customers`,
      icon: Users,
    },
    {
      label: dict.nav.settings,
      href: `/${locale}/admin/settings`,
      icon: Settings,
    },
  ];

  return (
    <div
      className="min-h-screen bg-[#f7f5f2] flex flex-col lg:flex-row font-tajawal text-brown"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Mobile Top Bar */}
      <div className="lg:hidden flex items-center justify-between bg-burgundy text-ivory p-4 shadow-md">
        <div>
          <h1 className="font-amiri text-xl font-normal text-ivory">
            {dict.brandName}
          </h1>
          <p className="text-[9px] text-blush/80">{dict.brandSubtitle}</p>
        </div>
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-ivory hover:bg-white/10 rounded-[3px]"
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Sidebar for Desktop & Mobile Drawer */}
      <aside
        className={`fixed inset-y-0 z-50 w-64 bg-burgundy text-ivory flex flex-col justify-between shrink-0 shadow-lg transition-transform duration-300 lg:static lg:translate-x-0 ${
          isRtl
            ? `${isMobileMenuOpen ? "right-0" : "-right-64"} border-l`
            : `${isMobileMenuOpen ? "left-0" : "-left-64"} border-r`
        } border-ivory/10`}
      >
        <div>
          <div className="p-6 text-center border-b border-ivory/10 hidden lg:block">
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
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-[3px] text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-white/15 text-ivory font-semibold shadow-xs border-r-2 border-ivory"
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

      {/* Backdrop for mobile */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto bg-[#fbf9f6]">
        {children}
      </main>
    </div>
  );
}
