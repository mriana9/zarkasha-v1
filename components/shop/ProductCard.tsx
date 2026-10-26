"use client";

import { useState } from "react";
import Image from "next/image";
import { ShoppingBag, ArrowRight, ArrowLeft } from "lucide-react";
import { ProductQuickViewModal } from "./ProductQuickViewModal";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: {
    id: string;
    title_ar: string;
    title_en: string;
    description_ar: string;
    description_en: string;
    price: number;
    stock: number;
    images?: string[];
    is_featured?: boolean;
    categories?: {
      name_ar: string;
      name_en: string;
      slug: string;
    } | null;
  };
  locale: "ar" | "en";
  isRtl: boolean;
  onToggleFavorite?: () => void;
}

export function ProductCard({
  product,
  locale,
  isRtl,
  onToggleFavorite,
}: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToCart } = useCart();

  const title = locale === "ar" ? product.title_ar : product.title_en;
  const categoryName =
    locale === "ar" ? product.categories?.name_ar : product.categories?.name_en;
  const imageSrc = product.images?.[0] || "/categories/book.png";

  return (
    <>
      <article className="flex flex-col justify-between group">
        <div className="relative aspect-square w-full overflow-hidden bg-[#fbf9f6] border border-[#5d1826]/10 mb-4">
          <Image
            src={imageSrc}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {product.is_featured && (
            <span className="absolute top-3 start-3 bg-[#7b843d] text-[#fffcf9] text-[10px] font-tajawal font-medium px-2.5 py-1 rounded-[2px] z-10">
              {locale === "ar" ? "مميز" : "Featured"}
            </span>
          )}

          <button
            type="button"
            onClick={onToggleFavorite}
            aria-label={
              locale === "ar"
                ? `إضافة ${title} إلى المفضلة`
                : `Add ${title} to favorites`
            }
            className="absolute top-3 end-3 w-9 h-9 rounded-full bg-white/80 backdrop-blur-xs flex items-center justify-center text-[#5d1826] transition-all duration-300 opacity-0 group-hover:opacity-100 hover:bg-white cursor-pointer shadow-xs z-10"
          >
            {/* <Heart className="w-[18px] h-[18px]" /> */}
          </button>

          <button
            type="button"
            onClick={() => addToCart(product)}
            className="absolute inset-x-0 bottom-0 py-3 bg-[#5d1826]/90 backdrop-blur-xs text-[#fffcf9] text-xs font-tajawal font-medium flex items-center justify-center gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 cursor-pointer hover:bg-[#5d1826] z-10"
          >
            <ShoppingBag className="w-[17px] h-[17px]" />
            <span>{locale === "ar" ? "أضيفي إلى السلة" : "Add to Bag"}</span>
          </button>
        </div>

        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            {categoryName && (
              <span className="text-[11px] text-[#7b843d] font-tajawal block mb-1">
                {categoryName}
              </span>
            )}
            <h3 className="font-amiri text-xl text-[#5d1826] font-normal leading-snug">
              {title}
            </h3>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            aria-label={
              locale === "ar"
                ? `عرض تفاصيل ${title}`
                : `View details of ${title}`
            }
            className="w-9 h-9 rounded-full border border-[#5d1826]/25 flex items-center justify-center text-[#5d1826] hover:bg-[#5d1826] hover:text-[#fffcf9] transition-colors shrink-0 mt-1 cursor-pointer"
          >
            {isRtl ? (
              <ArrowLeft className="w-[17px] h-[17px]" />
            ) : (
              <ArrowRight className="w-[17px] h-[17px]" />
            )}
          </button>
        </div>

        <p className="text-xs text-[#887a75] font-tajawal m-0">
          {product.price && product.price > 0
            ? `${product.price} ${locale === "ar" ? "شيكل" : "ILS"}`
            : locale === "ar"
              ? "السعر والتوفر عند إطلاق الكتالوج"
              : "Price and availability upon catalog launch"}
        </p>
      </article>

      <ProductQuickViewModal
        product={product}
        locale={locale}
        isRtl={isRtl}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToCart={() => addToCart(product)}
        onToggleFavorite={onToggleFavorite}
      />
    </>
  );
}
