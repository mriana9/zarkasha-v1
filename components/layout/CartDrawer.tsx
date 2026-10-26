"use client";

import { X, ShoppingBag, Trash2, ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { CheckoutForm } from "../shop/CheckoutForm";

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

interface ShippingRates {
  westBank: number;
  jerusalem: number;
  israel48: number;
}

export function CartDrawer({
  isOpen,
  onClose,
  locale,
  isRtl,
  dict,
}: CartDrawerProps) {
  const supabase = createClient();
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();
  const [isVisible, setIsVisible] = useState(true);
  const [isCheckoutStep, setIsCheckoutStep] = useState(false);
  const [loading, setLoading] = useState(false);

  const [shippingRates, setShippingRates] = useState<ShippingRates>({
    westBank: 20,
    jerusalem: 35,
    israel48: 70,
  });

  const [selectedRegion, setSelectedRegion] =
    useState<keyof ShippingRates>("westBank");

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    notes: "",
  });

  useEffect(() => {
    if (isOpen) return;

    const timer = setTimeout(() => {
      setIsVisible(false);
      setIsCheckoutStep(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    async function fetchShippingSettings() {
      const { data, error } = await supabase
        .from("site_settings")
        .select("key, value")
        .in("key", [
          "shipping_west_bank",
          "shipping_jerusalem",
          "shipping_inside",
        ]);

      if (!error && data) {
        const rates: ShippingRates = {
          westBank: 20,
          jerusalem: 35,
          israel48: 70,
        };

        data.forEach((item) => {
          const val = parseFloat(item.value);
          if (!isNaN(val)) {
            if (item.key === "shipping_west_bank") rates.westBank = val;
            if (item.key === "shipping_jerusalem") rates.jerusalem = val;
            if (item.key === "shipping_inside") rates.israel48 = val;
          }
        });

        setShippingRates(rates);
      }
    }

    if (isOpen) {
      void fetchShippingSettings();
    }
  }, [isOpen, supabase]);

  if (!isOpen && !isVisible) return null;

  const currentShippingCost = shippingRates[selectedRegion];
  const finalTotal = totalPrice + (cart.length > 0 ? currentShippingCost : 0);

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.address) {
      toast.error(
        locale === "ar"
          ? "الرجاء ملء جميع الحقول المطلوبة"
          : "Please fill in all required fields",
      );
      return;
    }

    setLoading(true);

    const regionNameAr =
      selectedRegion === "westBank"
        ? "الضفة الغربية"
        : selectedRegion === "jerusalem"
          ? "القدس"
          : "الداخل";
    const regionNameEn =
      selectedRegion === "westBank"
        ? "West Bank"
        : selectedRegion === "jerusalem"
          ? "Jerusalem"
          : "Israel (48)";

    const shippingAddress = {
      full_name: formData.fullName,
      phone: formData.phone,
      address: formData.address,
      notes: formData.notes,
      region: locale === "ar" ? regionNameAr : regionNameEn,
      shipping_cost: currentShippingCost,
      items: cart.map((item) => ({
        id: item.id,
        title: locale === "ar" ? item.title_ar : item.title_en,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
    };

    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert({
        total_amount: finalTotal,
        shipping_address: shippingAddress,
        payment_method: "cash_on_delivery",
        status: "pending",
      })
      .select("order_number")
      .single();

    if (orderError) {
      console.error(orderError);
      toast.error(
        locale === "ar"
          ? "حدث خطأ أثناء إتمام الطلب"
          : "An error occurred while placing the order",
      );
      setLoading(false);
      return;
    }

    const orderNumber = orderData?.order_number || "";

    let whatsAppNumber = "970592749393";
    const { data: waData } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "whatsapp")
      .single();

    if (waData && waData.value) {
      const cleaned = waData.value.replace(/\D/g, "");
      if (cleaned) whatsAppNumber = cleaned;
    }

    const itemsListText = cart
      .map(
        (item) =>
          `- ${locale === "ar" ? item.title_ar : item.title_en} (العدد: ${item.quantity}) - السعر: ${item.price * item.quantity} شيكل`,
      )
      .join("\n");

    const notesText = formData.notes
      ? locale === "ar"
        ? `ملاحظات الطلب: ${formData.notes}\n`
        : `Notes: ${formData.notes}\n`
      : "";

    const message =
      locale === "ar"
        ? `طلب جديد (${orderNumber}):\n\nالاسم: ${formData.fullName}\nرقم الهاتـف: ${formData.phone}\nالمنطقة: ${regionNameAr}\nالعنوان: ${formData.address}\n${notesText}\nالمنتجات:\n${itemsListText}\n\nسعر التوصيل: ${currentShippingCost} شيكل\nالمجموع الكلي: ${finalTotal} شيكل`
        : `New Order (${orderNumber}):\n\nName: ${formData.fullName}\nPhone: ${formData.phone}\nRegion: ${regionNameEn}\nAddress: ${formData.address}\n${notesText}\nItems:\n${itemsListText}\n\nShipping: ${currentShippingCost} ILS\nTotal: ${finalTotal} ILS`;

    const encodedMessage = encodeURIComponent(message);
    window.open(
      `https://wa.me/+97${whatsAppNumber}?text=${encodedMessage}`,
      "_blank",
    );

    toast.success(
      locale === "ar" ? "تم إرسال الطلب بنجاح!" : "Order placed successfully!",
    );
    setLoading(false);
    onClose();
  };

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
              {isCheckoutStep
                ? locale === "ar"
                  ? "معلومات التوصيل"
                  : "Checkout Details"
                : dict?.title}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-beige/40 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-[#231916]" />
          </button>
        </div>

        {!isCheckoutStep ? (
          <>
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
                <div className="space-y-1.5 text-xs text-[#5d1826]">
                  <div className="flex items-center justify-between text-sm font-semibold pt-1">
                    <span>{locale === "ar" ? "المجموع الكلي:" : "Total:"}</span>
                    <span>
                      {totalPrice} {locale === "ar" ? "شيكل" : "ILS"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsCheckoutStep(true)}
                  className="w-full py-3 bg-[#5d1826] text-[#fffcf9] rounded-[3px] text-xs font-medium hover:bg-[#5d1826]/90 transition-colors cursor-pointer text-center flex items-center justify-center gap-2"
                >
                  <span>{locale === "ar" ? "إتمام الطلب" : "Checkout"}</span>
                  {isRtl ? (
                    <ArrowLeft className="w-4 h-4" />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )}
                </button>
              </div>
            )}
          </>
        ) : (
          <CheckoutForm
            locale={locale}
            formData={formData}
            setFormData={setFormData}
            selectedRegion={selectedRegion}
            setSelectedRegion={setSelectedRegion}
            shippingRates={shippingRates}
            totalPrice={totalPrice}
            currentShippingCost={currentShippingCost}
            finalTotal={finalTotal}
            loading={loading}
            onSubmit={handleCheckoutSubmit}
            onBack={() => setIsCheckoutStep(false)}
          />
        )}
      </div>
    </div>
  );
}
