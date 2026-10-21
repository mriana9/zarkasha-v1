interface HeroSignatureProps {
  dict: {
    signatureTitle: string;
    signatureSubtitle: string;
    signatureChart: string;
  };
}

export function HeroSignature({ dict }: HeroSignatureProps) {
  return (
    <div className="flex items-center gap-3 text-burgundy mt-8">
      <span className="w-12 h-12 grid place-items-center border border-burgundy/15 rounded-full font-amiri text-[26px]">
        {dict.signatureChart}
      </span>
      <p className="text-[10px] leading-[1.4] m-0 font-tajawal">
        {dict.signatureTitle}
        <br />
        {dict.signatureSubtitle}
      </p>
    </div>
  );
}
