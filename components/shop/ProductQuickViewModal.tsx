"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, Heart, ShoppingBag, MessageCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface ProductQuickViewModalProps {
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
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: () => void;
  onToggleFavorite?: () => void;
}

export function ProductQuickViewModal({
  product,
  locale,
  isRtl,
  isOpen,
  onClose,
  onAddToCart,
  onToggleFavorite,
}: ProductQuickViewModalProps) {
  const supabase = createClient();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState<string>("970592749393");

  useEffect(() => {
    let isActive = true;

    async function fetchWhatsAppSetting() {
      const { data, error } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "whatsapp")
        .single();

      if (!error && data && data.value && isActive) {
        const cleanedNumber = data.value.replace(/\D/g, "");
        if (cleanedNumber) {
          setPhoneNumber(cleanedNumber);
        }
      }
    }

    if (isOpen) {
      void fetchWhatsAppSetting();
    }

    return () => {
      isActive = false;
    };
  }, [isOpen, supabase]);

  if (!isOpen) return null;

  const title = locale === "ar" ? product.title_ar : product.title_en;
  const description =
    locale === "ar" ? product.description_ar : product.description_en;
  const categoryName =
    locale === "ar" ? product.categories?.name_ar : product.categories?.name_en;

  const images =
    product.images && product.images.length > 0
      ? product.images
      : ["/categories/book.png"];
  const activeImageSrc = images[activeImageIndex] || images[0];

  const handleWhatsAppInquiry = () => {
    const message =
      locale === "ar"
        ? `مرحباً، أود الاستفسار عن هذا المنتج:\n*${title}*\nالسعر: ${product.price} شيكل`
        : `Hello, I would like to inquire about this product:\n*${title}*\nPrice: ${product.price} ILS`;

    const encodedMessage = encodeURIComponent(message);
    window.open(
      `https://wa.me/+97${phoneNumber}?text=${encodedMessage}`,
      "_blank",
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div
        className="relative w-full max-w-2xl bg-[#fffcf9] border border-[#5d1826]/20 rounded-[6px] shadow-xl overflow-hidden p-6 md:p-8 font-tajawal max-h-[90vh] overflow-y-auto"
        dir={isRtl ? "rtl" : "ltr"}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 end-4 w-9 h-9 rounded-full bg-[#5d1826]/10 flex items-center justify-center text-[#5d1826] hover:bg-[#5d1826] hover:text-[#fffcf9] transition-colors cursor-pointer z-20"
          aria-label={locale === "ar" ? "إغلاق" : "Close"}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="space-y-3">
            <div className="relative aspect-square w-full rounded-[4px] overflow-hidden bg-[#fbf9f6] border border-[#5d1826]/10">
              <Image
                src={activeImageSrc}
                alt={title}
                fill
                className="object-cover"
              />
              {product.is_featured && (
                <span className="absolute top-3 start-3 bg-[#7b843d] text-[#fffcf9] text-[10px] font-tajawal font-medium px-2.5 py-1 rounded-[2px] z-10">
                  {locale === "ar" ? "مميز" : "Featured"}
                </span>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-2 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-[#5d1826] [&::-webkit-scrollbar-thumb]:rounded-full">
                {images.map((img, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setActiveImageIndex(index)}
                    className={`relative w-16 h-16 rounded-[3px] overflow-hidden border shrink-0 cursor-pointer transition-all ${
                      activeImageIndex === index
                        ? "border-[#5d1826] ring-2 ring-[#5d1826]/20"
                        : "border-[#5d1826]/20 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${title} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              {categoryName && (
                <span className="text-xs text-[#7b843d] block mb-1">
                  {categoryName}
                </span>
              )}
              <h2 className="font-amiri text-2xl text-[#5d1826] font-normal leading-snug">
                {title}
              </h2>
            </div>

            <p className="text-xs text-[#887a75] leading-relaxed">
              {description ||
                (locale === "ar"
                  ? "لا يوجد وصف متاح حالياً."
                  : "No description available.")}
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-[#5d1826]/10">
              <span className="text-sm font-semibold text-[#5d1826]">
                {product.price} {locale === "ar" ? "شيكل" : "ILS"}
              </span>
              <span className="text-xs text-[#887a75]">
                {locale === "ar"
                  ? `المتوفر: ${product.stock}`
                  : `Stock: ${product.stock}`}
              </span>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onAddToCart}
                  className="flex-1 py-3 bg-[#5d1826] text-[#fffcf9] rounded-[3px] text-xs font-medium flex items-center justify-center gap-2 hover:bg-[#5d1826]/90 transition-colors cursor-pointer shadow-sm"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>
                    {locale === "ar" ? "أضيفي إلى السلة" : "Add to Bag"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={onToggleFavorite}
                  className="w-11 h-11 rounded-[3px] border border-[#5d1826]/20 flex items-center justify-center text-[#5d1826] hover:bg-[#5d1826]/5 transition-colors cursor-pointer"
                  aria-label={
                    locale === "ar" ? "إضافة للمفضلة" : "Add to favorites"
                  }
                >
                  <Heart className="w-5 h-5" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleWhatsAppInquiry}
                className="w-full py-2.5 bg-[#25D366] text-white rounded-[3px] text-xs font-medium flex items-center justify-center gap-2 hover:bg-[#20ba5a] transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>
                  {locale === "ar"
                    ? "استفسري عن المنتج عبر الواتساب"
                    : "Inquire via WhatsApp"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
