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

interface CheckoutFormData {
  fullName: string;
  phone: string;
  address: string;
  notes: string;
  whatsappOptIn: boolean;
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

  const [isVisible, setIsVisible] = useState(isOpen);
  const [isCheckoutStep, setIsCheckoutStep] = useState(false);
  const [loading, setLoading] = useState(false);

  const [shippingRates, setShippingRates] = useState<ShippingRates>({
    westBank: 20,
    jerusalem: 35,
    israel48: 70,
  });

  const [selectedRegion, setSelectedRegion] =
    useState<keyof ShippingRates>("westBank");

  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: "",
    phone: "",
    address: "",
    notes: "",
    whatsappOptIn: false,
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
    if (!isOpen) return;

    let cancelled = false;

    async function fetchShippingSettings() {
      const { data, error } = await supabase
        .from("site_settings")
        .select("key, value")
        .in("key", [
          "shipping_west_bank",
          "shipping_jerusalem",
          "shipping_inside",
        ]);

      if (error || !data || cancelled) return;

      const rates: ShippingRates = {
        westBank: 20,
        jerusalem: 35,
        israel48: 70,
      };

      data.forEach((item) => {
        const value = Number.parseFloat(item.value);

        if (!Number.isFinite(value)) return;

        if (item.key === "shipping_west_bank") rates.westBank = value;
        if (item.key === "shipping_jerusalem") rates.jerusalem = value;
        if (item.key === "shipping_inside") rates.israel48 = value;
      });

      setShippingRates(rates);
    }

    void fetchShippingSettings();

    return () => {
      cancelled = true;
    };
  }, [isOpen, supabase]);

  const currentShippingCost = shippingRates[selectedRegion];
  const finalTotal = totalPrice + (cart.length > 0 ? currentShippingCost : 0);

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.fullName.trim() ||
      !formData.phone.trim() ||
      !formData.address.trim()
    ) {
      toast.error(
        locale === "ar"
          ? "الرجاء ملء جميع الحقول المطلوبة"
          : "Please fill in all required fields",
      );
      return;
    }

    if (!/^\d{10}$/.test(formData.phone.trim())) {
      toast.error(
        locale === "ar"
          ? "رقم الهاتف يجب أن يتكون من 10 أرقام فقط"
          : "Phone number must be exactly 10 digits",
      );
      return;
    }

    if (!formData.whatsappOptIn) {
      toast.error(
        locale === "ar"
          ? "يرجى الموافقة على استلام تفاصيل الطلب عبر واتساب"
          : "Please consent to receiving order details through WhatsApp",
      );
      return;
    }

    if (cart.length === 0) {
      toast.error(locale === "ar" ? "سلة التسوق فارغة" : "Your cart is empty");
      return;
    }

    setLoading(true);

    const whatsappWindow = window.open("about:blank", "_blank");

    try {
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

      const regionName = locale === "ar" ? regionNameAr : regionNameEn;

      const shippingAddress = {
        full_name: formData.fullName.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        notes: formData.notes.trim(),
        region: regionName,
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
        console.error("Order insertion error:", orderError);

        if (whatsappWindow && !whatsappWindow.closed) {
          whatsappWindow.close();
        }

        toast.error(
          locale === "ar"
            ? "حدث خطأ أثناء حفظ الطلب. يرجى المحاولة مرة أخرى."
            : "Could not save the order. Please try again.",
        );
        return;
      }

      const orderNumber = orderData?.order_number ?? "";

      let whatsappNumber = "970592749393";

      const { data: whatsappSetting } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "whatsapp")
        .maybeSingle();

      if (whatsappSetting?.value) {
        const cleanedNumber = String(whatsappSetting.value).replace(/\D/g, "");

        if (cleanedNumber) {
          whatsappNumber = cleanedNumber;
        }
      }

      const productMessages = cart.map((item, index) => {
        const title = locale === "ar" ? item.title_ar : item.title_en;

        let imageUrl = item.image;

        try {
          imageUrl = new URL(item.image, window.location.origin).href;
        } catch {
          imageUrl = item.image;
        }

        return [
          `📌 *${index + 1}. ${title}*`,
          `🔹 ${locale === "ar" ? "الكمية" : "Quantity"}: ${item.quantity}`,
          `🔹 ${locale === "ar" ? "سعر القطعة" : "Unit price"}: ${item.price} ${locale === "ar" ? "شيكل" : "ILS"}`,
          `🔹 ${locale === "ar" ? "المجموع" : "Subtotal"}: ${item.price * item.quantity} ${locale === "ar" ? "شيكل" : "ILS"}`,
          `🖼️ ${locale === "ar" ? "صورة المنتج" : "Product image"}: ${imageUrl}`,
        ].join("\n");
      });

      const notesText = formData.notes.trim()
        ? locale === "ar"
          ? `\n📝 *ملاحظات الطلب:* ${formData.notes.trim()}`
          : `\n📝 *Order notes:* ${formData.notes.trim()}`
        : "";

      const message =
        locale === "ar"
          ? [
              "🛍️ *طلب جديد من زركشة*",
              "━━━━━━━━━━━━━━━",
              `🧾 *رقم الطلب:* ${orderNumber || "غير متوفر"}`,
              "",
              "👤 *معلومات العميل*",
              `الاسم: ${formData.fullName.trim()}`,
              `رقم الهاتف: ${formData.phone.trim()}`,
              `المنطقة: ${regionNameAr}`,
              `العنوان: ${formData.address.trim()}${notesText}`,
              "",
              "📦 *تفاصيل المنتجات*",
              ...productMessages,
              "",
              "━━━━━━━━━━━━━━━",
              `🛒 *مجموع المنتجات:* ${totalPrice} شيكل`,
              `🚚 *رسوم التوصيل:* ${currentShippingCost} شيكل`,
              `💰 *المجموع النهائي:* ${finalTotal} شيكل`,
              "",
              "💳 *طريقة الدفع:* الدفع عند الاستلام",
            ].join("\n")
          : [
              "🛍️ *New Order from Zarkasha*",
              "━━━━━━━━━━━━━━━",
              `🧾 *Order number:* ${orderNumber || "Unavailable"}`,
              "",
              "👤 *Customer details*",
              `Name: ${formData.fullName.trim()}`,
              `Phone: ${formData.phone.trim()}`,
              `Region: ${regionNameEn}`,
              `Address: ${formData.address.trim()}${notesText}`,
              "",
              "📦 *Products*",
              ...productMessages,
              "",
              "━━━━━━━━━━━━━━━",
              `🛒 *Products total:* ${totalPrice} ILS`,
              `🚚 *Shipping:* ${currentShippingCost} ILS`,
              `💰 *Grand total:* ${finalTotal} ILS`,
              "",
              "💳 *Payment method:* Cash on delivery",
            ].join("\n");

      const whatsappUrl = `https://wa.me/+97${whatsappNumber}?text=${encodeURIComponent(message)}`;

      if (whatsappWindow && !whatsappWindow.closed) {
        whatsappWindow.location.href = whatsappUrl;
      } else {
        window.location.href = whatsappUrl;
      }

      toast.success(
        locale === "ar"
          ? `تم حفظ الطلب ${orderNumber ? `رقم ${orderNumber}` : ""}. أكملي إرساله عبر واتساب.`
          : `Order ${orderNumber ? `#${orderNumber}` : ""} saved. Complete sending through WhatsApp.`,
        { duration: 6000 },
      );

      setFormData({
        fullName: "",
        phone: "",
        address: "",
        notes: "",
        whatsappOptIn: false,
      });

      setSelectedRegion("westBank");
      setIsCheckoutStep(false);
      onClose();
    } catch (error) {
      console.error("Checkout error:", error);

      if (whatsappWindow && !whatsappWindow.closed) {
        whatsappWindow.close();
      }

      toast.error(
        locale === "ar"
          ? "تعذّر إتمام الطلب. يرجى المحاولة مرة أخرى."
          : "Could not complete the order. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

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
              {isCheckoutStep
                ? locale === "ar"
                  ? "معلومات التوصيل"
                  : "Checkout Details"
                : dict?.title}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={locale === "ar" ? "إغلاق السلة" : "Close cart"}
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
                          sizes="64px"
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
                              type="button"
                              onClick={() => updateQuantity(item.id, -1)}
                              aria-label={
                                locale === "ar"
                                  ? "تقليل الكمية"
                                  : "Decrease quantity"
                              }
                              className="px-2 py-0.5 text-xs text-[#5d1826] hover:bg-[#5d1826]/5 cursor-pointer"
                            >
                              -
                            </button>

                            <span className="px-2 text-xs text-[#5d1826]">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, 1)}
                              aria-label={
                                locale === "ar"
                                  ? "زيادة الكمية"
                                  : "Increase quantity"
                              }
                              className="px-2 py-0.5 text-xs text-[#5d1826] hover:bg-[#5d1826]/5 cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          removeFromCart(item.id);
                          toast.success(
                            locale === "ar"
                              ? "تم إزالة المنتج من السلة"
                              : "Item removed from cart",
                          );
                        }}
                        className="text-[#887a75] hover:text-red-600 transition-colors p-1 cursor-pointer"
                        aria-label={
                          locale === "ar" ? "إزالة المنتج" : "Remove item"
                        }
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
                    <span>
                      {locale === "ar" ? "مجموع المنتجات:" : "Products total:"}
                    </span>
                    <span>
                      {totalPrice} {locale === "ar" ? "شيكل" : "ILS"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span>{locale === "ar" ? "التوصيل:" : "Shipping:"}</span>
                    <span>
                      {currentShippingCost} {locale === "ar" ? "شيكل" : "ILS"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-base font-bold pt-2 border-t border-[#5d1826]/10">
                    <span>
                      {locale === "ar" ? "المجموع النهائي:" : "Grand total:"}
                    </span>
                    <span>
                      {finalTotal} {locale === "ar" ? "شيكل" : "ILS"}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
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
