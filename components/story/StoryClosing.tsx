import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

interface StoryClosingProps {
  dict: {
    closingKicker: string;
    closingTitlePart1: string;
    closingTitlePart2: string;
    closingText: string;
    exploreButton: string;
    customLink: string;
  };
  locale: string;
}

export function StoryClosing({ dict, locale }: StoryClosingProps) {
  return (
    <section className="min-h-[650px] grid grid-cols-1 lg:grid-cols-2 text-[#fffcf9] bg-[#5d1826] overflow-hidden">
      <div className="min-h-[450px] lg:min-h-[650px] relative overflow-hidden bg-[#45101b]">
        <Image
          src="/hero/hero.webp"
          alt="ثوب فلسطيني مطرز من زركشة"
          fill
          className="object-cover object-[center_28%] transition-transform duration-1000 hover:scale-102"
          loading="lazy"
        />
      </div>

      <div className="py-[85px] px-[8vw] flex flex-col items-start justify-center bg-[radial-gradient(rgba(216,160,165,0.2)_0.7px,transparent_0.7px)] bg-[size:13px_13px]">
        <span className="flex items-center gap-[10px] text-[#d8a0a5] text-xs font-bold tracking-[0.08em] mb-2">
          <span className="w-[32px] h-[1px] bg-[#d8a0a5]" />
          {dict.closingKicker}
        </span>

        <h2 className="my-[22px] font-amiri text-[clamp(48px,5vw,70px)] font-normal leading-[1.08]">
          {dict.closingTitlePart1}
          <br />
          <em className="text-[#d8a0a5] font-normal not-italic">
            {dict.closingTitlePart2}
          </em>
        </h2>

        <p className="max-w-[480px] m-0 text-white/68 text-base leading-[1.9] font-tajawal">
          {dict.closingText}
        </p>

        <div className="mt-[32px] flex items-center gap-[26px] flex-wrap">
          <Link
            href={`/${locale}/shop`}
            className="min-h-[52px] px-7 inline-flex justify-center items-center gap-[15px] bg-[#fffcf9] text-[#5d1826] hover:bg-white rounded-[3px] font-tajawal font-medium text-sm transition-all duration-200 hover:-translate-y-0.5 group shadow-sm"
          >
            <span>{dict.exploreButton}</span>
            <ArrowLeft className="w-4 h-4 rtl:rotate-0 ltr:rotate-180 transition-transform group-hover:-translate-x-1" />
          </Link>

          <Link
            href={`/${locale}#contact`}
            className="py-2 text-[#fffcf9] border-b border-white/55 text-[13px] font-tajawal hover:border-white transition-colors"
          >
            {dict.customLink}
          </Link>
        </div>
      </div>
    </section>
  );
}
