import { Leaf, PenTool, Gift, Sparkles } from "lucide-react";

interface ValueItem {
  title: string;
  text: string;
}

interface ValuesSectionProps {
  dict: {
    kicker: string;
    title: string;
    items: ValueItem[];
  };
}

export function ValuesSection({ dict }: ValuesSectionProps) {
  const icons = [Leaf, PenTool, Gift, Sparkles];

  return (
    <section className="py-[110px] px-[6vw] bg-soft-blush" id="values">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center gap-[10px] text-olive text-xs font-bold tracking-[0.08em] mb-2">
          <span className="w-[32px] h-[1px] bg-olive" />
          {dict.kicker}
          <span className="w-[32px] h-[1px] bg-olive" />
        </div>
        <h2 className="m-0 text-burgundy font-amiri text-[clamp(40px,4vw,58px)] font-normal">
          {dict.title}
        </h2>
      </div>

      <div className="mt-[55px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-b border-[#5d1826]/16">
        {dict.items.map((item, index) => {
          const IconComponent = icons[index % icons.length];
          return (
            <article
              key={index}
              className="py-[46px] px-[32px] text-center border-b md:border-b-0 lg:border-s border-[#5d1826]/16 first:border-s-0"
            >
              <div className="w-[58px] h-[58px] mx-auto mb-[24px] grid place-items-center border border-[#5d1826]/16 rounded-full text-olive bg-ivory">
                <IconComponent className="w-6 h-6" />
              </div>
              <h3 className="m-0 mb-[12px] text-burgundy font-amiri text-[24px] font-normal">
                {item.title}
              </h3>
              <p className="m-0 text-[#766863] text-[13px] leading-[1.8] font-tajawal">
                {item.text}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
