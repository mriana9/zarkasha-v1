"use client";

import { useState } from "react";
import { Search, Sparkles } from "lucide-react";

interface ShopCatalogProps {
  dict: {
    catalogTitle: string;
    catalogSubtitle: string;
    categories: {
      all: string;
      thobes: string;
      hair: string;
      books: string;
      keychains: string;
    };
    searchPlaceholder: string;
    sortDefault: string;
    emptyTitle: string;
    emptyDesc: string;
  };
}

export function ShopCatalog({ dict }: ShopCatalogProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categoriesList = [
    { id: "all", label: dict.categories.all },
    { id: "thobes", label: dict.categories.thobes },
    { id: "hair", label: dict.categories.hair },
    { id: "books", label: dict.categories.books },
    { id: "keychains", label: dict.categories.keychains },
  ];

  return (
    <section
      className="py-[100px] px-[6vw] pb-[120px] bg-[#fffcf9]"
      id="shop-products"
    >
      <div className="mb-[45px] flex items-end justify-between flex-wrap gap-4">
        <div>
          <span className="flex items-center gap-[10px] text-[#7b843d] text-xs font-bold tracking-[0.08em] mb-2">
            <span className="w-[32px] h-[1px] bg-[#7b843d]" />
            {dict.catalogTitle}
          </span>
          <h2 className="m-0 text-[#5d1826] font-amiri text-[clamp(42px,4.5vw,64px)] font-normal">
            {dict.catalogSubtitle}
          </h2>
        </div>
        <p className="m-0 text-[#887a75] text-xs font-tajawal">
          {dict.emptyTitle}
        </p>
      </div>

      <div className="mb-[42px] py-4 flex items-center justify-between gap-[30px] border-t border-b border-[#5d1826]/16 flex-wrap">
        <div
          className="flex items-center gap-[7px] overflow-x-auto w-full lg:w-auto"
          role="tablist"
        >
          {categoriesList.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                role="tab"
                aria-selected={isActive}
                className={`px-4 py-2 border-0 cursor-pointer text-xs transition-all font-tajawal shrink-0 rounded-[2px] ${
                  isActive
                    ? "bg-[#5d1826] text-[#fffcf9] font-medium shadow-sm"
                    : "bg-transparent text-[#796b66] hover:text-[#5d1826] hover:bg-[#fff8f6]"
                }`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
          <div className="min-w-[220px] px-3 py-1.5 flex items-center gap-2 border-s border-[#5d1826]/16 bg-transparent">
            <Search className="w-4 h-4 text-[#5d1826] shrink-0" />
            <input
              type="text"
              placeholder={dict.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label={dict.searchPlaceholder}
              className="w-full border-0 outline-0 bg-transparent text-[#231916] text-xs font-tajawal placeholder:text-[#a0928d]"
            />
          </div>
          <button
            className="min-w-[118px] px-4 py-2 text-[#5d1826] border border-[#5d1826]/16 bg-transparent text-xs cursor-pointer font-tajawal rounded-[2px]"
            type="button"
          >
            {dict.sortDefault}
          </button>
        </div>
      </div>

      <div className="min-h-[360px] p-10 flex flex-col items-center justify-center text-center bg-[#fff8f6] border border-[#5d1826]/10 rounded-[4px]">
        <div className="w-[58px] h-[58px] grid place-items-center rounded-full bg-[#fffcf9] border border-[#5d1826]/16 mb-5">
          <Sparkles className="w-6 h-6 text-[#d8a0a5]" />
        </div>
        <div>
          <h3 className="m-0 mb-2 text-[#5d1826] font-amiri text-[25px] font-normal">
            {dict.emptyTitle}
          </h3>
          <p className="m-0 text-[#887a75] text-xs font-tajawal max-w-md">
            {dict.emptyDesc}
          </p>
        </div>
      </div>
    </section>
  );
}
