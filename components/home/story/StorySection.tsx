import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface StorySectionProps {
  dict: {
    kicker: string;
    titlePart1: string;
    titlePart2: string;
    lead: string;
    description: string;
    buttonText: string;
  };
  locale: string;
}

export function StorySection({ dict, locale }: StorySectionProps) {
  return (
    <section className="py-[110px] px-[6vw] grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-[10vw] items-center bg-ivory" id="story">
      <div className="relative h-[520px] sm:h-[690px]">
        <div className="absolute w-[76%] h-[86%] overflow-hidden">
          <Image
            src="/story/story-main.jpg"
            alt="تفاصيل دقيقة من تطريز زركشة اليدوي"
            fill
            className="object-cover"
            loading="lazy"
          />
        </div>

        <div className="absolute left-0 bottom-0 w-[42%] h-[42%] overflow-hidden">
          <Image
            src="/logo/logo-xl.jpg"
            alt="نقشة تطريز فلسطينية باللون العنابي"
            fill
            className="object-cover"
            loading="lazy"
          />
        </div>

        <span className="absolute top-[5%] left-[5%] text-burgundy font-playfair text-[13px] [writing-mode:vertical-rl] tracking-wider select-none">
          02
        </span>
      </div>

      <div className="flex flex-col items-start">
        <div className="flex items-center gap-[10px] text-olive text-xs font-bold tracking-[0.08em]">
          <span className="w-[32px] h-[1px] bg-olive" />
          {dict.kicker}
        </div>

        <h2 className="my-[18px] text-burgundy font-amiri text-[clamp(42px,4.6vw,67px)] font-normal leading-[1.15]">
          {dict.titlePart1}
          <br />
          <em className="text-olive font-normal not-italic">{dict.titlePart2}</em>
        </h2>

        <p className="font-amiri text-[20px] text-brown leading-[1.9] mb-4">
          {dict.lead}
        </p>

        <p className="text-[#6e5f59] font-tajawal leading-[1.9] text-sm sm:text-base mb-6">
          {dict.description}
        </p>

        <Link
          href={`/${locale}/story`}
          className="inline-flex items-center gap-[10px] pb-1 border-b border-currentColor bg-none cursor-pointer text-burgundy font-tajawal font-medium text-sm transition-colors hover:opacity-80 group mt-2"
        >
          <span>{dict.buttonText}</span>
          <ArrowLeft className="w-4 h-4 rtl:rotate-0 ltr:rotate-180 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}