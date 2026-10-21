import { ArrowRight } from "lucide-react";
import { HeroSignature } from "./HeroSignature";

interface HeroContentProps {
  dict: {
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    description: string;
    primaryButton: string;
    secondaryButton: string;
    signatureTitle: string;
    signatureSubtitle: string;
    signatureChart: string;
  };
  onExplore: () => void;
  onStory: () => void;
}

export function HeroContent({ dict, onExplore, onStory }: HeroContentProps) {
  return (
    <div className="py-[11vh] px-[8vw] lg:ps-[5vw] lg:pe-[8vw] relative z-20 flex flex-col justify-center">
      <div className="flex items-center gap-[10px] text-olive text-xs font-bold tracking-[0.08em]">
        <span className="w-[32px] h-[1px] bg-olive" />
        {dict.eyebrow}
      </div>

      <h1 className="my-[25px] text-burgundy font-amiri text-[clamp(45px,5.4vw,88px)] font-normal leading-[1.2] tracking-[-0.045em]">
        {dict.titleLine1}
        <br />
        <span className="text-olive font-normal">{dict.titleLine2}</span>
      </h1>

      <p className="max-w-[520px] m-0 text-[#5f514c] text-[18px] leading-[1.95] font-tajawal">
        {dict.description}
      </p>

      <div className="mt-[37px] flex items-center gap-[28px] flex-wrap">
        <button
          onClick={onExplore}
          className="min-h-[52px] px-[28px] inline-flex justify-center items-center gap-[15px] bg-burgundy hover:bg-burgundy-dark text-white rounded-[3px] font-tajawal font-medium transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
        >
          {dict.primaryButton}
          <ArrowRight className="w-[18px] h-[18px] rtl:rotate-180" />
        </button>

        <button
          onClick={onStory}
          className="py-2 inline-flex items-center gap-[10px] bg-transparent border-0 border-b border-currentColor text-burgundy font-tajawal font-medium cursor-pointer group"
        >
          {dict.secondaryButton}
        </button>
      </div>

      <HeroSignature dict={dict} />
    </div>
  );
}
