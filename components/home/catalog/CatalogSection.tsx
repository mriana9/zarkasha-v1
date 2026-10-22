"use client";

import Link from "next/link";
import { PenTool } from "lucide-react";

interface CatalogSectionProps {
  dict: {
    eyebrow: string;
    title: string;
    description: string;
    statusTitle: string;
    statusSubtitle: string;
    contactButton: string;
  };
  locale: string;
}

export function CatalogSection({ dict, locale }: CatalogSectionProps) {
  return (
    <section className="py-[105px] px-[7vw] bg-burgundy text-ivory" id="catalog">
      <div className="grid grid-cols-1 md:grid-cols-2 items-end gap-[30px]">
        <div className="md:col-span-2 flex items-center gap-[10px] text-blush text-xs font-bold tracking-[0.08em]">
          <span className="w-[32px] h-[1px] bg-blush" />
          {dict.eyebrow}
        </div>
        <h2 className="m-0 font-amiri text-[clamp(43px,5vw,66px)] font-normal leading-tight">
          {dict.title}
        </h2>
        <p className="m-0 text-ivory/65 leading-[1.8] max-w-[540px] font-tajawal text-sm sm:text-base">
          {dict.description}
        </p>
      </div>

      <div className="mt-[55px] min-h-[150px] py-8 px-[38px] grid grid-cols-1 md:grid-cols-[auto_1fr_auto] items-center gap-[25px] border border-white/18 bg-white/[0.045] backdrop-blur-sm rounded-[3px]">
        <div className="w-[60px] h-[60px] grid place-items-center border border-white/25 rounded-full text-blush">
          <PenTool className="w-7 h-7" />
        </div>

        <div>
          <h3 className="m-0 mb-1.5 font-amiri text-[25px] font-normal">
            {dict.statusTitle}
          </h3>
          <p className="m-0 text-ivory/62 text-sm font-tajawal">
            {dict.statusSubtitle}
          </p>
        </div>

        <Link
          href={`/${locale}/contact`}
          className="min-h-[52px] px-7 inline-flex justify-center items-center bg-ivory text-burgundy hover:bg-white rounded-[3px] font-tajawal font-medium transition-all duration-200 hover:-translate-y-0.5 text-center"
        >
          {dict.contactButton}
        </Link>
      </div>
    </section>
  );
}