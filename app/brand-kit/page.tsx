import React from "react";

const brandColors = [
  {
    name: "برغندي زركشة",
    latinName: "Zarqasha Burgundy",
    hex: "#5D1826",
    role: "اللون الرئيسي",
    bgClass: "bg-brand-burgundy",
    textClass: "text-white",
  },
  {
    name: "وردي الخيط",
    latinName: "Thread Blush",
    hex: "#D8A0A5",
    role: "لون داعم",
    bgClass: "bg-brand-blush",
    textClass: "text-white",
  },
  {
    name: "عاجي القماش",
    latinName: "Canvas Ivory",
    hex: "#FFFCF9",
    role: "الخلفية الأساسية",
    bgClass: "bg-brand-ivory border border-gray-200",
    textClass: "text-brand-burgundy",
  },
  {
    name: "زيتوني التراث",
    latinName: "Heritage Olive",
    hex: "#7B843D",
    role: "لون إبراز",
    bgClass: "bg-brand-olive",
    textClass: "text-white",
  },
  {
    name: "بيج طبيعي",
    latinName: "Natural Beige",
    hex: "#EDE0D9",
    role: "خلفية ثانوية",
    bgClass: "bg-brand-beige",
    textClass: "text-brand-burgundy",
  },
];

const typefaces = [
  {
    family: "أميري",
    latinName: "Amiri",
    usage: "العناوين العربية",
    sample: "حكاية تُروى بالخيط",
    fontClass: "font-amiri",
    dir: "rtl" as const,
  },
  {
    family: "تجوال",
    latinName: "Tajawal",
    usage: "النصوص والواجهات العربية",
    sample: "تفاصيل فلسطينية صُنعت بمحبة",
    fontClass: "font-tajawal",
    dir: "rtl" as const,
  },
  {
    family: "Playfair Display",
    latinName: "Playfair Display",
    usage: "العناوين اللاتينية",
    sample: "Threads of Heritage",
    fontClass: "font-playfair",
    dir: "ltr" as const,
  },
  {
    family: "Plus Jakarta Sans",
    latinName: "Plus Jakarta Sans",
    usage: "النصوص والواجهات اللاتينية",
    sample: "Crafted with meaning",
    fontClass: "font-jakarta",
    dir: "ltr" as const,
  },
];

export default function BrandKitPage() {
  return (
    <main className="min-h-screen bg-brand-ivory text-brand-burgundy font-tajawal py-20 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto space-y-20">
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-8 border-b border-brand-burgundy/15 pb-10">
          <div>
            <span className="font-jakarta text-sm tracking-widest text-gray-500 uppercase block mb-4">
              Zarqasha visual language
            </span>
            <h1 className="font-amiri text-4xl md:text-5xl lg:text-6xl leading-[1.2]">
              نظام بصري يحمل
              <br />
              <span className="text-brand-olive">روح الحكاية</span>
            </h1>
          </div>
          <p className="max-w-sm text-sm md:text-base leading-relaxed text-gray-600 font-tajawal">
            لوحة مستوحاة من خيوط التطريز الفلسطيني، وخطوط تجمع بين دفء التراث
            ووضوح التجربة المعاصرة.
          </p>
        </div>

        <section>
          <div className="flex justify-between items-end mb-8 border-b border-brand-burgundy/15 pb-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-jakarta text-brand-olive">01</span>
              <h2 className="font-amiri text-2xl md:text-3xl">لوحة الألوان</h2>
            </div>
            <p className="text-xs md:text-sm text-gray-500 font-tajawal">
              ألوان العلامة الأساسية وأدوارها المقترحة
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {brandColors.map((color, index) => (
              <div key={index} className="flex flex-col group">
                <div
                  className={`w-full aspect-[4/5] ${color.bgClass} relative flex items-end justify-start p-4`}
                >
                  <span
                    className={`text-[10px] px-3 py-1.5 bg-black/40 backdrop-blur-sm rounded-sm font-tajawal ${color.textClass}`}
                  >
                    {color.role}
                  </span>
                </div>
                <div className="mt-4 flex justify-between items-start gap-2">
                  <div>
                    <h3 className="font-amiri text-lg font-bold">
                      {color.name}
                    </h3>
                    <span className="text-[10px] text-gray-500 font-jakarta block mt-1">
                      {color.latinName}
                    </span>
                  </div>
                  <code className="text-[9px] bg-gray-100 text-gray-600 px-2 py-1 rounded font-jakarta tracking-wider">
                    {color.hex}
                  </code>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex justify-between items-end mb-8 border-b border-brand-burgundy/15 pb-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-jakarta text-brand-olive">02</span>
              <h2 className="font-amiri text-2xl md:text-3xl">
                النظام الطباعي
              </h2>
            </div>
            <p className="text-xs md:text-sm text-gray-500 font-tajawal">
              أصوات متكاملة للعربية واللاتينية
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 border-t border-r border-brand-burgundy/15">
            {typefaces.map((font, index) => (
              <div
                key={index}
                className="p-6 md:p-8 border-b border-l border-brand-burgundy/15 bg-brand-ivory flex flex-col justify-between"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-start gap-4">
                    <span className="text-[10px] font-jakarta text-brand-olive mt-1">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3
                        className={`text-lg md:text-xl font-medium ${font.fontClass}`}
                      >
                        {font.family}
                      </h3>
                      <p className="text-[11px] text-gray-500 mt-1 font-tajawal">
                        {font.usage}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-3xl ${font.fontClass} text-brand-blush`}
                  >
                    Aa
                  </span>
                </div>

                <div
                  dir={font.dir}
                  className={`text-4xl md:text-5xl py-12 flex items-center ${font.fontClass}`}
                >
                  {font.sample}
                </div>

                <div
                  dir="ltr"
                  className="flex justify-between text-[9px] text-gray-400 mt-4 pt-4 border-t border-brand-burgundy/10 font-jakarta tracking-widest"
                >
                  <span>Regular 400</span>
                  <span>Medium 500</span>
                  <span>Bold 700</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
