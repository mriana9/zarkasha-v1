"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface CustomSectionProps {
  dict: {
    kicker: string;
    titlePart1: string;
    titlePart2: string;
    description: string;
    buttonText: string;
  };
  locale: string;
}

export function CustomSection({ dict, locale }: CustomSectionProps) {
  return (
    <section className="min-h-[680px] grid grid-cols-1 lg:grid-cols-2 bg-burgundy text-ivory overflow-hidden">
      <div className="relative h-[430px] lg:h-auto overflow-hidden group">
        <Image
          src="/custom/custom-bg.jpg"
          alt="ميداليات مطرزة حسب الطلب"
          fill
          className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.025]"
          loading="lazy"
        />
      </div>

      <div className="py-[90px] px-[7vw] lg:px-[9vW] flex flex-col items-start justify-center relative bg-[radial-gradient(rgba(216,160,165,0.2)_0.7px,transparent_0.7px)] [background-size:13px_13px]">
        <span
          className="absolute top-[40px] start-[4vw] text-blush text-[44px] opacity-55 select-none"
          aria-hidden="true"
        >
          ✣
        </span>

        <div className="flex items-center gap-[10px] text-blush text-xs font-bold tracking-[0.08em] mb-4">
          <span className="w-[32px] h-[1px] bg-blush" />
          {dict.kicker}
        </div>

        <h2 className="my-[18px] text-ivory font-amiri text-[clamp(42px,4.6vw,67px)] font-normal leading-[1.15]">
          {dict.titlePart1}
          <br />
          <em className="text-blush font-normal not-italic">
            {dict.titlePart2}
          </em>
        </h2>

        <p className="max-w-[500px] text-ivory/70 font-tajawal leading-[1.9] text-sm sm:text-base mb-8">
          {dict.description}
        </p>

        <Link
          href={`/${locale}/contact`}
          className="min-h-[52px] px-7 inline-flex justify-center items-center gap-[15px] bg-ivory text-burgundy hover:bg-white rounded-[3px] font-tajawal font-medium text-sm transition-all duration-200 hover:-translate-y-0.5 text-center group"
        >
          <span>{dict.buttonText}</span>
          <ArrowLeft className="w-4 h-4 rtl:rotate-0 ltr:rotate-180 transition-transform group-hover:-translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
