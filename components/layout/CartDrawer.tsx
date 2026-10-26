"use client";

import { X, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { useEffect, useState } from "react";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  locale: "ar" | "en";
  isRtl: boolean;
  dict: {
    title: string;
    empty: string;
  };
}

export function CartDrawer({
  isOpen,
  onClose,
  locale,
  isRtl,
  dict,
}: CartDrawerProps) {
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (isOpen) return;

    const timer = setTimeout(() => setIsVisible(false), 300);
    return () => clearTimeout(timer);
  }, [isOpen]);

  if (!isOpen && !isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-end font-tajawal transition-opacity duration-300 ${
        isOpen
          ? "bg-black/40 backdrop-blur-sm opacity-100"
          : "bg-black/0 backdrop-blur-none opacity-0 pointer-events-none"
      }`}
      dir={isRtl ? "rtl" : "ltr"}
      onClick={onClose}
    >
      <div
        className={`w-full max-w-md h-full bg-[#fffcf9] p-6 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen
            ? "translate-x-0"
            : isRtl
              ? "-translate-x-full"
              : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-6 border-b border-[#5d1826]/15">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#5d1826]" />
            <span className="font-bold text-lg text-[#231916]">
              {dict?.title}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-beige/40 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-[#231916]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-3">
              <ShoppingBag className="w-12 h-12 text-[#5d1826]/30 animate-pulse" />
              <p className="text-[#231916]/60 text-sm">{dict?.empty}</p>
            </div>
          ) : (
            cart.map((item) => {
              const title = locale === "ar" ? item.title_ar : item.title_en;
              return (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 bg-[#fbf9f6] border border-[#5d1826]/10 rounded-[4px] items-center transition-all duration-200 hover:border-[#5d1826]/30"
                >
                  <div className="relative w-16 h-16 rounded-[3px] overflow-hidden shrink-0 border border-[#5d1826]/10">
                    <Image
                      src={item.image}
                      alt={title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-medium text-[#5d1826] truncate font-amiri text-base">
                      {title}
                    </h4>
                    <p className="text-xs text-[#887a75] mt-0.5">
                      {item.price} {locale === "ar" ? "شيكل" : "ILS"}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center border border-[#5d1826]/20 rounded-[2px] bg-white">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="px-2 py-0.5 text-xs text-[#5d1826] hover:bg-[#5d1826]/5 cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs text-[#5d1826]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="px-2 py-0.5 text-xs text-[#5d1826] hover:bg-[#5d1826]/5 cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      removeFromCart(item.id);
                      toast.success(
                        locale === "ar"
                          ? "تم إزالة المنتج من السلة"
                          : "Item removed from cart",
                      );
                    }}
                    className="text-[#887a75] hover:text-red-600 transition-colors p-1 cursor-pointer"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {cart.length > 0 && (
          <div className="pt-4 border-t border-[#5d1826]/10 bg-[#fffcf9] space-y-3">
            <div className="flex items-center justify-between text-sm font-semibold text-[#5d1826]">
              <span>{locale === "ar" ? "المجموع الكلي:" : "Total:"}</span>
              <span>
                {totalPrice} {locale === "ar" ? "شيكل" : "ILS"}
              </span>
            </div>
            <button
              onClick={() => {
                toast.success(
                  locale === "ar"
                    ? "تم إتمام الطلب بنجاح!"
                    : "Order placed successfully!",
                );
              }}
              className="w-full py-3 bg-[#5d1826] text-[#fffcf9] rounded-[3px] text-xs font-medium hover:bg-[#5d1826]/90 transition-colors cursor-pointer text-center"
            >
              {locale === "ar" ? "إتمام الطلب" : "Checkout"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
