"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { ProductCard } from "@/components/shop/ProductCard";

interface CategoryOption {
  id: string;
  name_ar: string;
  name_en: string;
  slug: string;
}

interface Product {
  id: string;
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  price: number;
  stock: number;
  images: string[];
  is_featured: boolean;
  category_id: string;
  categories: CategoryOption | null;
}

interface RandomProductsSectionProps {
  locale: "ar" | "en";
  dict: {
    title: string;
    subtitle: string;
    viewAllBtn: string;
  };
}

export function ProductsSection({ locale, dict }: RandomProductsSectionProps) {
  const supabase = createClient();
  const isRtl = locale === "ar";
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchRandomProducts() {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          categories (
            id,
            name_ar,
            name_en,
            slug
          )
        `)
        .eq("is_visible", true);

      if (!error && data) {
        const shuffled = [...data].sort(() => 0.5 - Math.random());
        setProducts(shuffled.slice(0, 4));
      }
      setLoading(false);
    }

    void fetchRandomProducts();
  }, [supabase]);

  if (loading) {
    return (
      <div className="py-20 flex items-center justify-center bg-ivory">
        <Loader2 className="w-8 h-8 animate-spin text-burgundy" />
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="py-20 px-[6vw] bg-ivory">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-12">
        <div>
          <span className="text-olive text-xs font-bold tracking-wider block mb-2 font-tajawal">
            {dict.subtitle}
          </span>
          <h2 className="font-amiri text-3xl md:text-4xl text-burgundy">
            {dict.title}
          </h2>
        </div>

        <Link
          href={`/${locale}/shop`}
          className="inline-flex items-center gap-2 text-burgundy font-tajawal text-sm hover:opacity-80 transition-opacity border-b border-burgundy pb-0.5"
        >
          <span>{dict.viewAllBtn}</span>
          <ArrowLeft className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            locale={locale}
            isRtl={isRtl}
          />
        ))}
      </div>
    </section>
  );
}