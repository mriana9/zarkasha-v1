"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

interface ShopHeroProps {
  dict: {
    breadcrumb: { home: string; current: string };
    promoLabel: string;
    titlePart1: string;
    titlePart2: string;
    description: string;
    exploreButton: string;
    customLink: string;
    noteTitle: string;
    noteText: string;
  };
  locale: string;
}

export function ShopHero({ dict, locale }: ShopHeroProps) {
  return (
    <section className="min-h-[620px] grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] overflow-hidden bg-[#5d1826] text-[#fffcf9]">
      <div className="py-[70px] px-[7vw] lg:px-[6vw] flex flex-col items-start justify-center relative z-10">
        <div className="mb-[50px] flex items-center gap-[10px] text-[#fffcf9]/55 text-[11px] font-tajawal">
          <Link
            href={`/${locale}`}
            className="hover:text-[#fffcf9] transition-colors"
          >
            {dict.breadcrumb.home}
          </Link>
          <span className="text-[#d8a0a5]">/</span>
          <span>{dict.breadcrumb.current}</span>
        </div>

        <span className="flex items-center gap-[10px] text-[#d8a0a5] text-[11px] font-bold tracking-[0.08em] mb-4">
          <span className="w-[28px] h-[1px] bg-[#d8a0a5]" />
          {dict.promoLabel}
        </span>

        <h1 className="my-[24px] text-[#fffcf9] font-amiri text-[clamp(56px,5.8vw,88px)] font-normal leading-[0.98] tracking-[-0.04em]">
          {dict.titlePart1}
          <br />
          <em className="text-[#d8a0a5] font-normal not-italic">
            {dict.titlePart2}
          </em>
        </h1>

        <p className="max-w-[530px] m-0 text-[#fffcf9]/68 text-base leading-[1.95] font-tajawal mb-8">
          {dict.description}
        </p>

        <div className="flex items-center gap-[26px] flex-wrap">
          <button
            className="min-h-[52px] px-7 inline-flex justify-center items-center gap-[15px] bg-[#fffcf9] text-[#5d1826] hover:bg-white rounded-[3px] font-tajawal font-medium text-sm transition-all duration-200 hover:-translate-y-0.5 cursor-pointer group shadow-sm"
            onClick={() =>
              document
                .getElementById("shop-products")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <span>{dict.exploreButton}</span>
            <ArrowLeft className="w-4 h-4 rtl:rotate-0 ltr:rotate-180 transition-transform group-hover:-translate-x-1" />
          </button>

          <Link
            className="py-2 text-[#fffcf9] border-b border-[#fffcf9]/55 text-[13px] font-tajawal hover:border-[#fffcf9] transition-colors"
            href={`/${locale}#contact`}
          >
            {dict.customLink}
          </Link>
        </div>
      </div>

      <div className="relative min-h-[450px] lg:min-h-[620px] bg-[#45101b]">
        <div className="absolute top-0 left-0 w-[72%] h-full overflow-hidden">
          <motion.div
            initial={{ scale: 1.25, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{
              scale: { duration: 1.8, ease: [0.25, 1, 0.5, 1] },
              opacity: { duration: 1.2 },
            }}
            className="relative w-full h-full"
          >
            <Image
              src="/categories/hair-accessories1.jpg"
              alt="ربطة شعر مطرزة من مجموعة زركشة"
              fill
              className="object-cover"
              priority
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[rgba(69,16,27,0.22)] pointer-events-none z-10" />
        </div>

        <div className="absolute right-[3%] bottom-[9%] w-[34%] h-[42%] z-20 border-[9px] border-[#5d1826] overflow-hidden shadow-lg rounded-[4px]">
          <Image
            src="/categories/hair-accessories.jpg"
            alt="تفاصيل تطريز فلسطيني يدوي من زركشة"
            fill
            className="object-cover"
          />
        </div>

        <span className="absolute top-[9%] right-[15%] z-30 p-[16px_20px] bg-[#45101b]/86 backdrop-blur-[10px] text-[#fffcf9]/66 text-[9px] leading-[1.7] rounded-[4px]">
          <b className="block text-[#fffcf9] font-amiri text-[18px] font-normal mb-1">
            {dict.noteTitle}
          </b>
          {dict.noteText}
        </span>

        <span
          className="absolute left-[7%] bottom-[6%] z-30 w-[52px] h-[52px] grid place-items-center rounded-full bg-[#fffcf9] text-[#5d1826] text-[20px] shadow-md select-none"
          aria-hidden="true"
        >
          ✣
        </span>
      </div>
    </section>
  );
}