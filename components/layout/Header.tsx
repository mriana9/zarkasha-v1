"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Logo } from "./Logo";
import { DesktopNavigation } from "./DesktopNavigation";
import { MobileMenu } from "./MobileMenu";
import { SearchOverlay } from "./SearchOverlay";
import { CartDrawer } from "./CartDrawer";
import { HeaderActions } from "./HeaderActions";

interface HeaderProps {
  dict: {
    ariaMenu: string;
    ariaSearch: string;
    ariaCart: string;
    home: string;
    shop: string;
    story: string;
    contact: string;
    footerTagline: string;
  };
  searchDict: {
    eyebrow: string;
    placeholder: string;
    notice: string;
  };
  cartDict: {
    title: string;
    empty: string;
  };
  locale: string;
}

export function Header({ dict, searchDict, cartDict, locale }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      <header className="h-[78px] lg:h-[94px] grid grid-cols-[1fr_auto_1fr] items-center px-[4vw] relative z-20 bg-ivory/95 border-b border-burgundy/15 backdrop-blur-md">
        <button
          onClick={() => setIsMenuOpen(true)}
          className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-beige/40 transition-colors"
          aria-label={dict.ariaMenu}
        >
          <Menu className="w-5 h-5 text-[#231916]" />
        </button>

        <DesktopNavigation locale={locale} dict={dict} />

        <Logo locale={locale} />

        <HeaderActions
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenCart={() => setIsCartOpen(true)}
          locale={locale}
          dict={dict}
        />
      </header>

      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        locale={locale}
        dict={dict}
      />

      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        dict={searchDict}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        dict={cartDict}
      />
    </>
  );
}
