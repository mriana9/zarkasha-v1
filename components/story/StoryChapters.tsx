interface Chapter {
  number: string;
  title: string;
  text: string;
}

interface StoryChaptersProps {
  dict: {
    chaptersKicker: string;
    chaptersTitle: string;
    chapters: Chapter[];
  };
}

export function StoryChapters({ dict }: StoryChaptersProps) {
  return (
    <section className="py-[105px] px-[7vw] text-[#fffcf9] bg-[#5d1826]">
      <div className="mb-[60px] grid grid-cols-1 lg:grid-cols-2 items-end gap-[40px]">
        <span className="flex items-center gap-[10px] text-[#d8a0a5] text-xs font-bold tracking-[0.08em]">
          <span className="w-[32px] h-[1px] bg-[#d8a0a5]" />
          {dict.chaptersKicker}
        </span>
        <h2 className="m-0 font-amiri text-[clamp(42px,4.5vw,64px)] font-normal leading-[1.15]">
          {dict.chaptersTitle}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 border-t border-b border-white/18">
        {dict.chapters.map((chapter) => (
          <article
            key={chapter.number}
            className="min-h-[280px] p-[38px_36px] border-b md:border-b-0 md:border-s border-white/18 first:border-s-0"
          >
            <span className="text-[#d8a0a5] font-['Plus_Jakarta_Sans',sans-serif] text-[10px]">
              {chapter.number}
            </span>
            <h3 className="mt-[50px] mb-[13px] text-[#fffcf9] font-amiri text-[28px] font-normal">
              {chapter.title}
            </h3>
            <p className="max-w-[310px] m-0 text-white/60 text-[13px] leading-[1.9] font-tajawal">
              {chapter.text}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
