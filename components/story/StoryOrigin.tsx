import Image from "next/image";

interface StoryOriginProps {
  dict: {
    originKicker: string;
    originTitlePart1: string;
    originTitlePart2: string;
    originLead: string;
    originText: string;
  };
}

export function StoryOrigin({ dict }: StoryOriginProps) {
  return (
    <section className="py-[110px] px-[6vw] min-h-[750px] grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] items-center gap-[9vw] bg-[#fffcf9]">
      <div className="flex flex-col items-start">
        <span className="flex items-center gap-[10px] text-[#7b843d] text-xs font-bold tracking-[0.08em] mb-2">
          <span className="w-[32px] h-[1px] bg-[#7b843d]" />
          {dict.originKicker}
        </span>

        <h2 className="my-[20px] text-[#5d1826] font-amiri text-[clamp(46px,4.8vw,68px)] font-normal leading-[1.12]">
          {dict.originTitlePart1}
          <br />
          <em className="text-[#7b843d] font-normal not-italic">
            {dict.originTitlePart2}
          </em>
        </h2>

        <p className="text-[#231916] font-amiri text-[20px] leading-[1.8] mb-5">
          {dict.originLead}
        </p>

        <p className="text-[#74655f] text-[14px] leading-[2] font-tajawal m-0">
          {dict.originText}
        </p>
      </div>

      <div className="h-[640px] relative">
        <div className="w-[76%] h-[84%] absolute top-0 left-0 overflow-hidden bg-[#ede0d9] shadow-sm">
          <Image
            src="/story/story-bg1.jpg"
            alt="نقشة تطريز فلسطينية من هوية زركشة"
            fill
            className="object-cover"
            loading="lazy"
          />
        </div>

        <div className="w-[43%] h-[45%] absolute right-0 bottom-0 overflow-hidden border-[10px] border-[#fffcf9] shadow-lg">
          <Image
            src="/story/HairAccessories1.png"
            alt="طوق شعر مطرز من زركشة"
            fill
            className="object-cover"
            loading="lazy"
          />
        </div>

        <span
          className="w-[58px] h-[58px] absolute right-[7%] top-[9%] grid place-items-center rounded-full text-[#fffcf9] bg-[#5d1826] text-[22px] shadow-md select-none"
          aria-hidden="true"
        >
          ✣
        </span>
      </div>
    </section>
  );
}
