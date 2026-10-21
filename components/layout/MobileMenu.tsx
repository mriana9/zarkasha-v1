"use client";

import Link from "next/link";
import { X, ArrowRight } from "lucide-react";
import { Logo } from "./Logo";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  locale: string;
  dict: {
    home: string;
    shop: string;
    story: string;
    contact: string;
    footerTagline: string;
  };
}

export function MobileMenu({ isOpen, onClose, locale, dict }: MobileMenuProps) {
  if (!isOpen) return null;

  const navItems = [
    { number: "01", name: dict.home, href: `/${locale}` },
    { number: "02", name: dict.shop, href: `/${locale}/shop` },
    { number: "03", name: dict.story, href: `/${locale}/story` },
    { number: "04", name: dict.contact, href: `/${locale}/contact` },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-ivory flex flex-col p-6 font-tajawal animate-in fade-in duration-200">
      <div className="flex items-center justify-between border-b border-burgundy/15 pb-4">
        <Logo locale={locale} />
        <button
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-beige/40 transition-colors"
        >
          <X className="w-6 h-6 text-burgundy" />
        </button>
      </div>

      <nav className="flex-1 flex flex-col justify-center gap-2 my-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className="group grid grid-cols-[45px_1fr_auto] items-center py-5 border-b border-burgundy/15 text-burgundy font-amiri text-3xl md:text-4xl hover:text-olive transition-colors"
          >
            <span className="font-tajawal text-xs text-olive opacity-80">
              {item.number}
            </span>
            <span>{item.name}</span>
            <ArrowRight className="w-5 h-5 rtl:rotate-180 text-burgundy group-hover:text-olive transition-colors" />
          </Link>
        ))}
      </nav>

      <p className="text-center text-xs text-[#887a75] pt-4">
        {dict.footerTagline}
      </p>
    </div>
  );
}
