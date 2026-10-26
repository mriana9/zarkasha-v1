"use client";

import { useState, useEffect } from "react";
import { X, Search, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface ProductResult {
  id: string;
  title_ar: string;
  title_en: string;
  price: number;
  images?: string[];
  categories?: {
    name_ar: string;
    name_en: string;
    slug: string;
  } | null;
}

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  locale: "ar" | "en";
  dict: {
    eyebrow: string;
    placeholder: string;
    notice: string;
  };
}

export function SearchOverlay({
  isOpen,
  onClose,
  locale,
  dict,
}: SearchOverlayProps) {
  if (!isOpen) return null;

  return (
    <SearchOverlayContent onClose={onClose} locale={locale} dict={dict} />
  );
}

function SearchOverlayContent({
  onClose,
  locale,
  dict,
}: Omit<SearchOverlayProps, "isOpen">) {
  const supabase = createClient();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select(
          "id, title_ar, title_en, price, images, categories(name_ar, name_en, slug)",
        )
        .or(`title_ar.ilike.%${trimmedQuery}%,title_en.ilike.%${trimmedQuery}%`)
        .limit(6);

      if (!error && data) {
        setResults(
          data.map((product) => ({
            ...product,
            categories: product.categories?.[0] ?? null,
          })),
        );
      }
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, supabase]);

  return (
    <div className="fixed inset-0 z-50 bg-[#fffcf9]/98 backdrop-blur-md flex flex-col items-center justify-start pt-20 md:pt-32 p-6 font-tajawal animate-in fade-in duration-200 overflow-y-auto">
      <button
        onClick={onClose}
        className="absolute top-8 start-8 md:top-12 md:start-12 w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#5d1826]/10 transition-colors cursor-pointer"
        aria-label="Close search"
      >
        <X className="w-6 h-6 text-[#5d1826]" />
      </button>

      <div className="w-full max-w-2xl flex flex-col gap-3">
        <span className="text-[#7b843d] text-xs font-bold tracking-wider">
          {dict.eyebrow}
        </span>

        <div className="flex items-center gap-4 border-b-2 border-[#5d1826] pb-3">
          <Search className="w-8 h-8 text-[#5d1826] shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={dict.placeholder}
            className="w-full bg-transparent font-amiri text-3xl md:text-5xl text-[#5d1826] placeholder:text-[#5d1826]/35 focus:outline-none"
            autoFocus
          />
          {loading && query.trim() && (
            <Loader2 className="w-6 h-6 text-[#5d1826] animate-spin shrink-0" />
          )}
        </div>

        <p className="text-xs text-[#8a7c77] mt-2">{dict.notice}</p>

        {query.trim() && results.length > 0 && (
          <div className="mt-6 space-y-3 max-h-[50vh] overflow-y-auto pr-1">
            {results.map((product) => {
              const title =
                locale === "ar" ? product.title_ar : product.title_en;
              const categoryName =
                locale === "ar"
                  ? product.categories?.name_ar
                  : product.categories?.name_en;
              const imageSrc = product.images?.[0] || "/categories/book.png";

              return (
                <Link
                  key={product.id}
                  href={`/${locale}/shop`}
                  onClick={onClose}
                  className="flex items-center gap-4 p-3 bg-[#fbf9f6] border border-[#5d1826]/10 rounded-[4px] hover:border-[#5d1826]/30 transition-all group"
                >
                  <div className="relative w-16 h-16 rounded-[3px] overflow-hidden shrink-0 border border-[#5d1826]/10">
                    <Image
                      src={imageSrc}
                      alt={title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    {categoryName && (
                      <span className="text-[10px] text-[#7b843d] block mb-0.5">
                        {categoryName}
                      </span>
                    )}
                    <h4 className="font-amiri text-lg text-[#5d1826] truncate group-hover:text-[#7b843d] transition-colors">
                      {title}
                    </h4>
                    <p className="text-xs text-[#8a7c77]">
                      {product.price} {locale === "ar" ? "شيكل" : "ILS"}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
