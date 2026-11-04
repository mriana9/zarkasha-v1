"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Sparkles, Loader2, ArrowUpDown, SlidersHorizontal } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { ProductCard } from "./ProductCard";

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
  embroidery_type?: string | null;
  fabric_type?: string | null;
  color?: string | null;
  size?: string | null;
  categories: CategoryOption | null;
}

interface ShopCatalogProps {
  dict: {
    catalogTitle: string;
    catalogSubtitle: string;
    categories: {
      all: string;
    };
    searchPlaceholder: string;
    sortDefault: string;
    emptyTitle: string;
    emptyDesc: string;
    filters?: {
      title: string;
      embroidery: string;
      fabric: string;
      color: string;
      all: string;
      clear: string;
    };
  };
  locale: "ar" | "en";
}

type SortOption = "default" | "price-asc" | "price-desc";

export function ShopCatalog({ dict, locale }: ShopCatalogProps) {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const isRtl = locale === "ar";

  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [categorySelection, setCategorySelection] = useState({
    param: categoryParam,
    value: categoryParam || "all",
  });

  if (categorySelection.param !== categoryParam) {
    setCategorySelection({
      param: categoryParam,
      value: categoryParam || "all",
    });
  }

  const activeCategory = categorySelection.value;
  const setActiveCategory = (value: string) => {
    setCategorySelection({ param: categoryParam, value });
  };

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<SortOption>("default");
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterEmbroidery, setFilterEmbroidery] = useState("all");
  const [filterFabric, setFilterFabric] = useState("all");
  const [filterColor, setFilterColor] = useState("all");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      const { data: catData } = await supabase
        .from("categories")
        .select("id, name_ar, name_en, slug")
        .eq("is_visible", true);

      if (catData) {
        setCategories(catData);
      }

      let query = supabase
        .from("products")
        .select(
          `
          *,
          categories (
            id,
            name_ar,
            name_en,
            slug
          )
        `
        )
        .eq("is_visible", true);

      if (activeCategory !== "all") {
        const selectedCat = catData?.find((c) => c.slug === activeCategory);
        if (selectedCat) {
          query = query.eq("category_id", selectedCat.id);
        }
      }

      if (sortOrder === "price-asc") {
        query = query.order("price", { ascending: true });
      } else if (sortOrder === "price-desc") {
        query = query.order("price", { ascending: false });
      } else {
        query = query.order("created_at", { ascending: false });
      }

      const { data: prodData, error } = await query;

      if (!error && prodData) {
        setProducts(prodData as Product[]);
      }

      setLoading(false);
    }

    void fetchData();
  }, [activeCategory, sortOrder, supabase]);

  const filteredProducts = products.filter((p) => {
    const title = isRtl ? p.title_ar : p.title_en;
    
    if (!title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterEmbroidery !== "all" && p.embroidery_type !== filterEmbroidery) return false;
    if (filterFabric !== "all" && p.fabric_type !== filterFabric) return false;
    if (filterColor !== "all" && p.color !== filterColor) return false;

    return true;
  });

  const uniqueEmbroidery = Array.from(new Set(products.map(p => p.embroidery_type).filter(Boolean))) as string[];
  const uniqueFabric = Array.from(new Set(products.map(p => p.fabric_type).filter(Boolean))) as string[];
  const uniqueColor = Array.from(new Set(products.map(p => p.color).filter(Boolean))) as string[];

  const toggleSort = () => {
    if (sortOrder === "default") {
      setSortOrder("price-asc");
    } else if (sortOrder === "price-asc") {
      setSortOrder("price-desc");
    } else {
      setSortOrder("default");
    }
  };

  const getSortLabel = () => {
    if (sortOrder === "price-asc") {
      return isRtl ? "السعر: من الأقل للأعلى" : "Price: Low to High";
    }
    if (sortOrder === "price-desc") {
      return isRtl ? "السعر: من الأعلى للأقل" : "Price: High to Low";
    }
    return dict.sortDefault;
  };

  const resetFilters = () => {
    setFilterEmbroidery("all");
    setFilterFabric("all");
    setFilterColor("all");
  };

  return (
    <section
      className="py-[100px] px-[6vw] pb-[120px] bg-[#fffcf9]"
      id="shop-products"
    >
      <div className="mb-[45px] flex items-end justify-between flex-wrap gap-4">
        <div>
          <span className="flex items-center gap-[10px] text-[#7b843d] text-xs font-bold tracking-[0.08em] mb-2 font-tajawal">
            <span className="w-[32px] h-[1px] bg-[#7b843d]" />
            {dict.catalogTitle}
          </span>
          <h2 className="m-0 text-[#5d1826] font-amiri text-[clamp(42px,4.5vw,64px)] font-normal">
            {dict.catalogSubtitle}
          </h2>
        </div>
        <p className="m-0 text-[#887a75] text-xs font-tajawal">
          {filteredProducts.length}{" "}
          {isRtl ? "منتج متوفر" : "products available"}
        </p>
      </div>

      <div className="mb-[42px] py-4 flex items-center justify-between gap-[30px] border-t border-b border-[#5d1826]/16 flex-wrap">
        <div
          className="flex items-center gap-[7px] overflow-x-auto w-full lg:w-auto"
          role="tablist"
        >
          <button
            role="tab"
            aria-selected={activeCategory === "all"}
            className={`px-4 py-2 border-0 cursor-pointer text-xs transition-all font-tajawal shrink-0 rounded-[2px] ${
              activeCategory === "all"
                ? "bg-[#5d1826] text-[#fffcf9] font-medium shadow-sm"
                : "bg-transparent text-[#796b66] hover:text-[#5d1826] hover:bg-[#fff8f6]"
            }`}
            onClick={() => setActiveCategory("all")}
          >
            {dict.categories.all}
          </button>

          {categories.map((cat) => {
            const isActive = activeCategory === cat.slug;
            const catLabel = isRtl ? cat.name_ar : cat.name_en;
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
                onClick={() => setActiveCategory(cat.slug)}
              >
                {catLabel}
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
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="px-4 py-2 text-[#5d1826] border border-[#5d1826]/16 bg-transparent text-xs cursor-pointer font-tajawal rounded-[2px] flex items-center justify-center gap-2 hover:bg-[#5d1826]/5 transition-colors"
            type="button"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{dict.filters?.title || (isRtl ? "تصفية" : "Filter")}</span>
          </button>

          <button
            onClick={toggleSort}
            className="min-w-[150px] px-4 py-2 text-[#5d1826] border border-[#5d1826]/16 bg-transparent text-xs cursor-pointer font-tajawal rounded-[2px] flex items-center justify-center gap-2 hover:bg-[#5d1826]/5 transition-colors"
            type="button"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>{getSortLabel()}</span>
          </button>
        </div>
      </div>

      {isFilterOpen && (
        <div className="mb-[42px] p-6 bg-[#fbf9f6] border border-[#5d1826]/10 rounded-[4px] grid grid-cols-1 md:grid-cols-3 gap-6">
          {uniqueEmbroidery.length > 0 && (
            <div>
              <label className="block text-xs font-medium text-[#5d1826] mb-2">{dict.filters?.embroidery || (isRtl ? "نوع التطريز" : "Embroidery")}</label>
              <select value={filterEmbroidery} onChange={(e) => setFilterEmbroidery(e.target.value)} className="w-full h-10 px-3 bg-white border border-[#5d1826]/20 rounded-[3px] text-xs text-[#231916] outline-none">
                <option value="all">{dict.filters?.all || (isRtl ? "الكل" : "All")}</option>
                {uniqueEmbroidery.map(val => <option key={val} value={val}>{val}</option>)}
              </select>
            </div>
          )}
          {uniqueFabric.length > 0 && (
            <div>
              <label className="block text-xs font-medium text-[#5d1826] mb-2">{dict.filters?.fabric || (isRtl ? "نوع القماش" : "Fabric")}</label>
              <select value={filterFabric} onChange={(e) => setFilterFabric(e.target.value)} className="w-full h-10 px-3 bg-white border border-[#5d1826]/20 rounded-[3px] text-xs text-[#231916] outline-none">
                <option value="all">{dict.filters?.all || (isRtl ? "الكل" : "All")}</option>
                {uniqueFabric.map(val => <option key={val} value={val}>{val}</option>)}
              </select>
            </div>
          )}
          {uniqueColor.length > 0 && (
            <div>
              <label className="block text-xs font-medium text-[#5d1826] mb-2">{dict.filters?.color || (isRtl ? "اللون" : "Color")}</label>
              <select value={filterColor} onChange={(e) => setFilterColor(e.target.value)} className="w-full h-10 px-3 bg-white border border-[#5d1826]/20 rounded-[3px] text-xs text-[#231916] outline-none">
                <option value="all">{dict.filters?.all || (isRtl ? "الكل" : "All")}</option>
                {uniqueColor.map(val => <option key={val} value={val}>{val}</option>)}
              </select>
            </div>
          )}
          <div className="col-span-full flex justify-end mt-2">
            <button onClick={resetFilters} className="text-xs text-[#887a75] hover:text-[#5d1826] underline">
              {dict.filters?.clear || (isRtl ? "مسح التصفية" : "Clear filters")}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="min-h-[360px] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#5d1826]" />
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              locale={locale}
              isRtl={isRtl}
            />
          ))}
        </div>
      ) : (
        <div className="min-h-[360px] p-10 flex flex-col items-center justify-center text-center bg-[#fff8f6] border border-[#5d1826]/10 rounded-[4px]">
          <div className="w-[58px] h-[58px] grid place-items-center rounded-full bg-[#fffcf9] border border-[#5d1826]/16 mb-5">
            <Sparkles className="w-6 h-6 text-[#d8a0a5]" />
          </div>
          <div>
            <h3 className="m-0 mb-2 text-[#5d1826] font-amiri text-[25px] font-normal">
              {dict.emptyTitle}
            </h3>
            <p className="m-0 text-[#887a75] text-xs font-tajawal max-w-md mb-4">
              {dict.emptyDesc}
            </p>
            <button
              className="px-4 py-2 bg-[#5d1826] text-[#fffcf9] text-xs rounded-[3px] font-tajawal cursor-pointer"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
                setSortOrder("default");
                resetFilters();
              }}
            >
              {isRtl ? "عرض كل القطع" : "Show all pieces"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}