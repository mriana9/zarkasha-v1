import { Sparkles, Heart, ShieldCheck } from "lucide-react";

interface ShopServiceStripProps {
  dict: {
    item1Title: string;
    item1Desc: string;
    item2Title: string;
    item2Desc: string;
    item3Title: string;
    item3Desc: string;
  };
}

export function ShopServiceStrip({ dict }: ShopServiceStripProps) {
  return (
    <div className="py-[55px] px-[6vw] grid grid-cols-1 md:grid-cols-3 gap-[35px] items-center bg-burgundy text-ivory">
      <div className="flex items-center justify-center gap-[15px]">
        <Sparkles className="w-6 h-6 text-blush shrink-0" />
        <div>
          <b className="block text-ivory font-amiri text-[17px] font-normal">
            {dict.item1Title}
          </b>
          <span className="text-ivory/58 text-[10px] leading-[1.7] font-tajawal">
            {dict.item1Desc}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-[15px]">
        <Heart className="w-6 h-6 text-blush shrink-0" />
        <div>
          <b className="block text-ivory font-amiri text-[17px] font-normal">
            {dict.item2Title}
          </b>
          <span className="text-ivory/58 text-[10px] leading-[1.7] font-tajawal">
            {dict.item2Desc}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-[15px]">
        <ShieldCheck className="w-6 h-6 text-blush shrink-0" />
        <div>
          <b className="block text-ivory font-amiri text-[17px] font-normal">
            {dict.item3Title}
          </b>
          <span className="text-ivory/58 text-[10px] leading-[1.7] font-tajawal">
            {dict.item3Desc}
          </span>
        </div>
      </div>
    </div>
  );
}
