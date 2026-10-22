import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CategoryCard } from "./CategoryCard";

interface CategorySectionProps {
  dict: {
    eyebrow: string;
    title: string;
    viewAll: string;
    items: {
      hairAccessories: string;
      embroideredThobes: string;
      bookmarks: string;
      keychains: string;
      gifts: string;
      customOrders: string;
    };
  };
  locale: string;
}

export function CategorySection({ dict, locale }: CategorySectionProps) {
  return (
    <section className="py-20 px-[4vw] bg-ivory" id="categories">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-12">
        <div className="text-start md:text-start">
          <span className="text-olive text-xs font-bold tracking-wider block mb-2">
            {dict.eyebrow}
          </span>
          <h2 className="font-amiri text-4xl md:text-5xl text-burgundy">
            {dict.title}
          </h2>
        </div>

        <Link
          href={`/${locale}/shop`}
          className="inline-flex items-center gap-2 text-burgundy font-tajawal text-sm hover:opacity-80 transition-opacity border-b border-burgundy pb-0.5"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
          <span>{dict.viewAll}</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 auto-rows-[240px]">
        <CategoryCard
          number="01"
          title={dict.items.embroideredThobes}
          imageSrc="/categories/dresses.jpg"
          href={`/${locale}/shop?category=thobes`}
          className="lg:row-span-2 lg:col-start-1 lg:row-start-1"
        />

        <CategoryCard
          number="02"
          title={dict.items.hairAccessories}
          imageSrc="/categories/hair-accessories.jpg"
          href={`/${locale}/shop?category=hair-accessories`}
        />

        <CategoryCard
          number="03"
          title={dict.items.bookmarks}
          imageSrc="/categories/book.png"
          href={`/${locale}/shop?category=bookmarks`}
        />

        <CategoryCard
          number="04"
          title={dict.items.keychains}
          imageSrc="/categories/keychains1.png"
          href={`/${locale}/shop?category=keychains`}
          className="md:col-span-2 lg:col-span-2 lg:col-start-2"
        />
      </div>
    </section>
  );
}
