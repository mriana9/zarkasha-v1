"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

interface StoryHeroProps {
  dict: {
    breadcrumb: { home: string; current: string };
    heroIndex: string;
    kicker: string;
    titlePart1: string;
    titlePart2: string;
    description: string;
    signature: string;
    signatureChart: string;
  };
  locale: string;
}

export function StoryHero({ dict, locale }: StoryHeroProps) {
  return (
    <section className="min-h-[680px] grid grid-cols-1 lg:grid-cols-[1.08fr_0.92fr] bg-[#fff8f6]">
      <div className="min-h-[500px] lg:min-h-[680px] relative overflow-hidden bg-[#fff8f6]">
        <div className="w-[84%] h-full absolute right-0 top-0 overflow-hidden">
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
              src="/story/story-bg.jpg"
              alt="تفاصيل تطريز فلسطيني يدوي من زركشة"
              fill
              className="object-cover"
              priority
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[rgba(69,16,27,0.13)] pointer-events-none z-10" />
        </div>

        <div className="w-[31%] h-[35%] absolute left-[3%] bottom-[8%] z-20 overflow-hidden border-[9px] border-[#fff8f6] shadow-lg">
          <Image
            src="/story/HairAccessories.png"
            alt="قطعة من زركشة بتطريز الورد الأحمر"
            fill
            className="object-cover"
          />
        </div>

        <span className="absolute top-[8%] left-[5%] z-20 text-[#5d1826] font-['Plus_Jakarta_Sans',sans-serif] text-[9px] tracking-[0.08em] [writing-mode:vertical-rl] select-none">
          {dict.heroIndex}
        </span>
      </div>

      <div className="py-[75px] px-[7vw] lg:px-[6vw] flex flex-col items-start justify-center">
        <div className="mb-[55px] flex items-center gap-[10px] text-[#887a75] text-[11px] font-tajawal">
          <Link href={`/${locale}`} className="text-[#5d1826] hover:underline">
            {dict.breadcrumb.home}
          </Link>
          <span className="text-[#d8a0a5]">/</span>
          <span>{dict.breadcrumb.current}</span>
        </div>

        <span className="flex items-center gap-[10px] text-[#7b843d] text-xs font-bold tracking-[0.08em] mb-2">
          <span className="w-[32px] h-[1px] bg-[#7b843d]" />
          {dict.kicker}
        </span>

        <h1 className="my-[23px] text-[#5d1826] font-amiri text-[clamp(62px,6.2vw,96px)] font-normal leading-[0.94] tracking-[-0.045em]">
          {dict.titlePart1}
          <br />
          <em className="text-[#7b843d] font-normal not-italic">
            {dict.titlePart2}
          </em>
        </h1>

        <p className="max-w-[500px] m-0 text-[#6e5f59] text-[17px] leading-[1.95] font-tajawal">
          {dict.description}
        </p>

        <span className="mt-[35px] flex items-center gap-[13px] text-[#5d1826] text-[10px] leading-[1.5] font-tajawal">
          <b className="w-[46px] h-[46px] grid place-items-center border border-[#5d1826]/16 rounded-full font-amiri text-[25px] font-normal bg-white shadow-sm">
            {dict.signatureChart}
          </b>
          {dict.signature}
        </span>
      </div>
    </section>
  );
}
