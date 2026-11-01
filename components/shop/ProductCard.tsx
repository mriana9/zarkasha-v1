"use client";

import { useState } from "react";
import Image from "next/image";
import { ShoppingBag, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { ProductQuickViewModal } from "./ProductQuickViewModal";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

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
  const [isLoadingImage, setIsLoadingImage] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addToCart } = useCart();

  const title = locale === "ar" ? product.title_ar : product.title_en;
  const categoryName =
    locale === "ar" ? product.categories?.name_ar : product.categories?.name_en;
  const imageSrc = product.images?.[0] || "/categories/book.png";

  const handleAddToCart = async () => {
    try {
      setIsAddingToCart(true);
      await Promise.resolve(addToCart(product));
      toast.success(
        locale === "ar"
          ? "تمت إضافة المنتج إلى السلة بنجاح"
          : "Product added to bag successfully",
      );
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <>
      <article className="flex flex-col justify-between group">
        <div className="relative aspect-square w-full overflow-hidden bg-[#fbf9f6] border border-[#5d1826]/10 mb-4">
          {isLoadingImage && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#fbf9f6] z-10">
              <Loader2 className="w-6 h-6 text-[#5d1826] animate-spin" />
            </div>
          )}

          <Image
            src={imageSrc}
            alt={title}
            fill
            loading="lazy"
            onLoad={() => setIsLoadingImage(false)}
            className={`object-cover transition-all duration-700 ease-in-out group-hover:scale-105 ${
              isLoadingImage ? "opacity-0 scale-95" : "opacity-100 scale-100"
            }`}
          />

          {product.is_featured && (
            <span className="absolute top-3 start-3 bg-[#7b843d] text-[#fffcf9] text-[10px] font-tajawal font-medium px-2.5 py-1 rounded-[2px] z-10">
              {locale === "ar" ? "مميز" : "Featured"}
            </span>
          )}

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className="absolute inset-x-0 bottom-0 py-3 bg-[#5d1826]/90 backdrop-blur-xs text-[#fffcf9] text-xs font-tajawal font-medium flex items-center justify-center gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 cursor-pointer hover:bg-[#5d1826] z-10 disabled:cursor-not-allowed"
          >
            {isAddingToCart ? (
              <Loader2 className="w-[17px] h-[17px] animate-spin" />
            ) : (
              <ShoppingBag className="w-[17px] h-[17px]" />
            )}
            <span>
              {isAddingToCart
                ? locale === "ar"
                  ? "جاري الإضافة..."
                  : "Adding..."
                : locale === "ar"
                  ? "أضيفي إلى السلة"
                  : "Add to Bag"}
            </span>
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
        onAddToCart={handleAddToCart}
        onToggleFavorite={onToggleFavorite}
      />
    </>
  );
}
