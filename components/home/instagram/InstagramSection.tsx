import Image from "next/image";
import { Camera } from "lucide-react";

interface InstagramSectionProps {
  dict: {
    kicker: string;
    titlePart1: string;
    titlePart2: string;
    description: string;
    handle: string;
  };
}

export function InstagramSection({ dict }: InstagramSectionProps) {

  return (
    <section className="min-h-[650px] grid grid-cols-1 lg:grid-cols-[0.7fr_1.3fr] overflow-hidden">
      <div className="py-[75px] px-[7vw] flex flex-col justify-center items-start bg-beige">
        <Camera className="w-[23px] h-[23px] text-burgundy mb-3" />
        <span className="mt-[12px] text-olive text-[12px] font-bold tracking-[0.08em]">
          {dict.kicker}
        </span>
        <h2 className="my-[25px] text-burgundy font-amiri text-[46px] font-normal leading-[1.2]">
          {dict.titlePart1}
          <br />
          {dict.titlePart2}
        </h2>
        <p className="max-w-[420px] text-[#6d5c56] font-tajawal leading-[1.8] text-sm sm:text-base mb-5">
          {dict.description}
        </p>
        <span className="text-burgundy font-tajawal text-sm font-medium direction-ltr select-none">
          {dict.handle}
        </span>
      </div>

      <div className="grid grid-cols-3 grid-rows-2 gap-[5px] h-[500px] lg:h-auto">
        <div className="overflow-hidden row-span-2 relative">
          <Image
            src="/instagram/HairAccessories1.jpg"
            alt=""
            fill
            className="object-cover transition-transform duration-600 hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="overflow-hidden col-span-2 relative">
          <Image
            src="/instagram/HairAccessories2.png"
            alt=""
            fill
            className="object-cover transition-transform duration-600 hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="overflow-hidden relative">
          <Image
            src="/instagram/HairAccessories3.jpg"
            alt=""
            fill
            className="object-cover transition-transform duration-600 hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="overflow-hidden relative">
          <Image
            src="/instagram/HairAccessories4.jpg"
            alt=""
            fill
            className="object-cover transition-transform duration-600 hover:scale-105"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
