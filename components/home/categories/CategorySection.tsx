import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CategoryCard } from "./CategoryCard";
import { createClient } from "@/lib/supabase/client";

interface CategorySectionProps {
  dict: {
    eyebrow: string;
    title: string;
    viewAll: string;
  };
  locale: string;
}

export async function CategorySection({ dict, locale }: CategorySectionProps) {
  const supabase = await createClient();
  const { data: categories, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_visible", true)
    .order("created_at", { ascending: true });

  if (error || !categories) {
    return null;
  }

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
        {categories.map((category, index) => {
          const number = String(index + 1).padStart(2, "0");
          const title = locale === "ar" ? category.name_ar : category.name_en;
          const imageSrc = category.image_url || "/categories/book.png";
          const href = `/${locale}/shop?category=${category.slug}`;

          let className = "";
          if (index === 0) {
            className = "lg:row-span-2 lg:col-start-1 lg:row-start-1";
          } else if (index === 3) {
            className = "md:col-span-2 lg:col-span-2 lg:col-start-2";
          }

          return (
            <CategoryCard
              key={category.id}
              number={number}
              title={title}
              imageSrc={imageSrc}
              href={href}
              className={className}
            />
          );
        })}
      </div>
    </section>
  );
}
