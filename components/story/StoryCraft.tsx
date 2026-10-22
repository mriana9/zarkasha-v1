import { Sparkles, PenTool, Scissors, Gift } from "lucide-react";

interface ProcessStep {
  title: string;
  text: string;
}

interface StoryCraftProps {
  dict: {
    craftKicker: string;
    craftTitlePart1: string;
    craftTitlePart2: string;
    process: ProcessStep[];
  };
}

export function StoryCraft({ dict }: StoryCraftProps) {
  const icons = [Sparkles, PenTool, Scissors, Gift];

  return (
    <section className="py-[110px] px-[6vw] bg-[#fffcf9]">
      <div className="max-w-[800px] mb-[65px]">
        <span className="flex items-center gap-[10px] text-[#7b843d] text-xs font-bold tracking-[0.08em] mb-2">
          <span className="w-[32px] h-[1px] bg-[#7b843d]" />
          {dict.craftKicker}
        </span>
        <h2 className="m-0 text-[#5d1826] font-amiri text-[clamp(46px,4.8vw,68px)] font-normal leading-[1.12]">
          {dict.craftTitlePart1}
          <br />
          <em className="text-[#7b843d] font-normal not-italic">
            {dict.craftTitlePart2}
          </em>
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-b border-[#5d1826]/16">
        {dict.process.map((step, index) => {
          const IconComponent = icons[index % icons.length];
          return (
            <article
              key={step.title}
              className="min-h-[290px] p-[30px_28px] relative text-center border-b sm:border-b-0 lg:border-s border-[#5d1826]/16 first:border-s-0"
            >
              <span className="absolute top-[24px] right-[24px] text-[#d8a0a5] font-['Plus_Jakarta_Sans',sans-serif] text-[9px]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="w-[62px] h-[62px] mx-auto my-[25px] grid place-items-center border border-[#5d1826]/16 rounded-full text-[#7b843d] bg-[#fff8f6]">
                <IconComponent className="w-6 h-6" />
              </div>
              <h3 className="m-0 mb-[10px] text-[#5d1826] font-amiri text-[23px] font-normal">
                {step.title}
              </h3>
              <p className="m-0 text-[#83746e] text-[11px] leading-[1.8] font-tajawal">
                {step.text}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
