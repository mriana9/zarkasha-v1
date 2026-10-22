interface StoryManifestoProps {
  dict: {
    manifestoKicker: string;
    manifestoTextPart1: string;
    manifestoTextPart2: string;
    manifestoTextHighlight: string;
  };
}

export function StoryManifesto({ dict }: StoryManifestoProps) {
  return (
    <section className="py-[120px] px-[10vw] text-center text-[#fffcf9] bg-[#5d1826]">
      <span className="text-[#d8a0a5] text-[10px] font-bold tracking-[0.1em] uppercase font-['Plus_Jakarta_Sans',sans-serif]">
        {dict.manifestoKicker}
      </span>
      <p className="max-w-4xl mx-auto mt-[27px] font-amiri text-[clamp(38px,4.3vw,64px)] font-normal leading-[1.35]">
        {dict.manifestoTextPart1}
        <br />
        {dict.manifestoTextPart2}
        <em className="text-[#d8a0a5] font-normal not-italic">
          {dict.manifestoTextHighlight}
        </em>
      </p>
    </section>
  );
}
