interface MarqueeSectionProps {
  items: string[];
}

export function MarqueeSection({ items }: MarqueeSectionProps) {
  return (
    <section className="bg-burgundy text-ivory py-4 border-y border-burgundy-dark select-none overflow-hidden">
      <div className="flex items-center justify-center gap-6 md:gap-12 flex-wrap px-4">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-6 md:gap-12">
            <span className="font-amiri text-lg md:text-xl font-normal tracking-wide">
              {item}
            </span>
            <span className="text-olive text-xs opacity-80" aria-hidden="true">
              ✦
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
