import Link from "next/link";

interface DesktopNavigationProps {
  locale: string;
  dict: {
    home: string;
    shop: string;
    story: string;
    contact: string;
  };
}

export function DesktopNavigation({ locale, dict }: DesktopNavigationProps) {
  const links = [
    { name: dict.home, href: `/${locale}` },
    { name: dict.shop, href: `/${locale}/shop` },
    { name: dict.story, href: `/${locale}/story` },
    { name: dict.contact, href: `/${locale}/contact` },
  ];

  return (
    <nav className="hidden lg:flex items-center gap-7 font-tajawal text-[14px] text-[#231916]">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="relative hover:text-burgundy transition-colors group py-1"
        >
          {link.name}
          <span className="absolute bottom-0 start-0 w-0 h-[1px] bg-burgundy transition-all duration-300 group-hover:w-full" />
        </Link>
      ))}
    </nav>
  );
}
