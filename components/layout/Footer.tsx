import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

interface FooterProps {
  dict: {
    brandDescription: string;
    columns: {
      explore: {
        title: string;
        store: string;
        story: string;
      };
      help: {
        title: string;
        shipping: string;
        faq: string;
      };
      social: {
        title: string;
        instagram: string;
        whatsapp: string;
      };
    };
    rights: string;
    tagline: string;
  };
  locale: string;
}

export async function Footer({ dict, locale }: FooterProps) {
  const currentYear = 2026;
  const supabase = await createClient();

  const { data: settings } = await supabase
    .from("site_settings")
    .select("key, value")
    .in("key", ["whatsapp", "instagram"]);

  const whatsappValue =
    settings?.find((s) => s.key === "whatsapp")?.value || "";
  const instagramValue =
    settings?.find((s) => s.key === "instagram")?.value || "";

  const instagramUrl = instagramValue
    ? `https://instagram.com/${instagramValue.replace(/^@/, "")}`
    : "https://instagram.com";
  const whatsappUrl = whatsappValue
    ? `https://wa.me/+97${whatsappValue.replace(/\D/g, "")}`
    : "https://whatsapp.com";

  return (
    <footer className="pt-[70px] pb-[25px] px-[6vw] text-ivory bg-brown font-tajawal">
      <div className="pb-[55px] grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-[10vw]">
        <div className="flex flex-col items-start">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center justify-start min-w-[140px] mb-4"
          >
            <Image
              src="/logo/logo.png"
              alt="Zarkasha"
              width={148}
              height={66}
              className="object-contain"
            />
          </Link>
          <p className="max-w-[330px] m-0 text-ivory/55 text-[13px] leading-[1.8]">
            {dict.brandDescription}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-[30px]">
          <div>
            <h3 className="m-0 mb-[22px] text-blush text-[13px] font-medium">
              {dict.columns.explore.title}
            </h3>
            <Link
              href={`/${locale}#categories`}
              className="block my-[12px] text-ivory/65 text-[13px] hover:text-white transition-colors"
            >
              {dict.columns.explore.store}
            </Link>
            <Link
              href={`/${locale}#story`}
              className="block my-[12px] text-ivory/65 text-[13px] hover:text-white transition-colors"
            >
              {dict.columns.explore.story}
            </Link>
          </div>

          <div>
            <h3 className="m-0 mb-[22px] text-blush text-[13px] font-medium">
              {dict.columns.help.title}
            </h3>
            <Link
              href={`/${locale}#contact`}
              className="block my-[12px] text-ivory/65 text-[13px] hover:text-white transition-colors"
            >
              {dict.columns.help.shipping}
            </Link>
            <Link
              href={`/${locale}#faq`}
              className="block my-[12px] text-ivory/65 text-[13px] hover:text-white transition-colors"
            >
              {dict.columns.help.faq}
            </Link>
          </div>

          <div>
            <h3 className="m-0 mb-[22px] text-blush text-[13px] font-medium">
              {dict.columns.social.title}
            </h3>
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block my-[12px] text-ivory/65 text-[13px] hover:text-white transition-colors"
            >
              {dict.columns.social.instagram}
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block my-[12px] text-ivory/65 text-[13px] hover:text-white transition-colors"
            >
              {dict.columns.social.whatsapp}
            </a>
          </div>
        </div>
      </div>

      <div className="pt-[22px] flex flex-col sm:flex-row justify-between items-center text-ivory/36 border-t border-ivory/12 text-[11px] gap-2">
        <span>
          © {currentYear} زركشة. {dict.rights}
        </span>
        <span>{dict.tagline}</span>
      </div>
    </footer>
  );
}
