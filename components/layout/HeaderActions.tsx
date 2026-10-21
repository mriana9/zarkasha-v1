"use client";

import { Search, ShoppingBag, Globe } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface HeaderActionsProps {
  onOpenSearch: () => void;
  onOpenCart: () => void;
  locale: string;
  dict: {
    ariaSearch: string;
    ariaCart: string;
  };
}

export function HeaderActions({
  onOpenSearch,
  onOpenCart,
  locale,
  dict,
}: HeaderActionsProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageSwitch = () => {
    const newLocale = locale === "ar" ? "en" : "ar";
    const newPathname = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPathname);
  };

  return (
    <div className="flex items-center justify-self-end gap-2 md:gap-4">
      <button
        onClick={onOpenSearch}
        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-beige/40 transition-colors"
        aria-label={dict.ariaSearch}
      >
        <Search className="w-5 h-5 text-[#231916]" />
      </button>

      <button
        onClick={onOpenCart}
        className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-beige/40 transition-colors"
        aria-label={dict.ariaCart}
      >
        <ShoppingBag className="w-5 h-5 text-[#231916]" />
        <span className="absolute top-1 end-1 w-4 h-4 rounded-full flex items-center justify-center bg-burgundy text-ivory text-[9px] font-tajawal">
          0
        </span>
      </button>

      <button
        onClick={handleLanguageSwitch}
        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-beige/40 transition-colors font-tajawal text-xs font-medium text-[#231916]"
        aria-label="Switch Language"
        title={locale === "ar" ? "Switch to English" : "التحويل للغة العربية"}
      >
        <Globe className="w-5 h-5 text-[#231916]" />
      </button>
    </div>
  );
}
