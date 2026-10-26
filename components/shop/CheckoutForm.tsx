"use client";

import { Send } from "lucide-react";

interface ShippingRates {
  westBank: number;
  jerusalem: number;
  israel48: number;
}

interface CheckoutFormProps {
  locale: "ar" | "en";
  formData: {
    fullName: string;
    phone: string;
    address: string;
    notes: string;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      fullName: string;
      phone: string;
      address: string;
      notes: string;
    }>
  >;
  selectedRegion: keyof ShippingRates;
  setSelectedRegion: (region: keyof ShippingRates) => void;
  shippingRates: ShippingRates;
  totalPrice: number;
  currentShippingCost: number;
  finalTotal: number;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}

export function CheckoutForm({
  locale,
  formData,
  setFormData,
  selectedRegion,
  setSelectedRegion,
  shippingRates,
  totalPrice,
  currentShippingCost,
  finalTotal,
  loading,
  onSubmit,
  onBack,
}: CheckoutFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="flex-1 flex flex-col justify-between py-4 space-y-4 overflow-y-auto"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-[#5d1826] mb-1">
            {locale === "ar" ? "الاسم الكامل" : "Full Name"}
          </label>
          <input
            type="text"
            required
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
            placeholder={
              locale === "ar" ? "أدخلي اسمك الكامل" : "Enter your full name"
            }
            className="w-full h-10 px-3 bg-[#fbf9f6] border border-[#5d1826]/20 rounded-[3px] text-xs text-[#231916] outline-none focus:border-[#5d1826]"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#5d1826] mb-1">
            {locale === "ar" ? "رقم الجوال" : "Phone Number"}
          </label>
          <input
            type="tel"
            required
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            placeholder={locale === "ar" ? "0590000000" : "0590000000"}
            className="w-full h-10 px-3 bg-[#fbf9f6] border border-[#5d1826]/20 rounded-[3px] text-xs text-[#231916] outline-none focus:border-[#5d1826]"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#5d1826] mb-1">
            {locale === "ar" ? "منطقة التوصيل" : "Shipping Region"}
          </label>
          <select
            value={selectedRegion}
            onChange={(e) =>
              setSelectedRegion(e.target.value as keyof ShippingRates)
            }
            className="w-full h-10 px-3 bg-[#fbf9f6] border border-[#5d1826]/20 rounded-[3px] text-xs text-[#231916] outline-none focus:border-[#5d1826]"
          >
            <option value="westBank">
              {locale === "ar"
                ? `الضفة الغربية (${shippingRates.westBank} شيكل)`
                : `West Bank (${shippingRates.westBank} ILS)`}
            </option>
            <option value="jerusalem">
              {locale === "ar"
                ? `القدس (${shippingRates.jerusalem} شيكل)`
                : `Jerusalem (${shippingRates.jerusalem} ILS)`}
            </option>
            <option value="israel48">
              {locale === "ar"
                ? `الداخل (${shippingRates.israel48} شيكل)`
                : `Israel (${shippingRates.israel48} ILS)`}
            </option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#5d1826] mb-1">
            {locale === "ar" ? "العنوان بالتفصيل" : "Detailed Address"}
          </label>
          <textarea
            required
            rows={2}
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            placeholder={
              locale === "ar"
                ? "الشارع، الحارة، معالم تفصيلية..."
                : "Street, Neighborhood..."
            }
            className="w-full p-3 bg-[#fbf9f6] border border-[#5d1826]/20 rounded-[3px] text-xs text-[#231916] outline-none focus:border-[#5d1826] resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#5d1826] mb-1">
            {locale === "ar"
              ? "ملاحظات الطلب (اختياري)"
              : "Order Notes (Optional)"}
          </label>
          <textarea
            rows={2}
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            placeholder={
              locale === "ar"
                ? "أي ملاحظات خاصة بالتطريز أو التوصيل..."
                : "Any special notes..."
            }
            className="w-full p-3 bg-[#fbf9f6] border border-[#5d1826]/20 rounded-[3px] text-xs text-[#231916] outline-none focus:border-[#5d1826] resize-none"
          />
        </div>

        <div className="p-3 bg-[#fbf9f6] border border-[#5d1826]/10 rounded-[4px] space-y-1 text-xs text-[#5d1826]">
          <div className="flex justify-between">
            <span>
              {locale === "ar" ? "مجموع المنتجات:" : "Products Total:"}
            </span>
            <span>
              {totalPrice} {locale === "ar" ? "شيكل" : "ILS"}
            </span>
          </div>
          <div className="flex justify-between">
            <span>{locale === "ar" ? "سعر التوصيل:" : "Shipping:"}</span>
            <span>
              {currentShippingCost} {locale === "ar" ? "شيكل" : "ILS"}
            </span>
          </div>
          <div className="flex justify-between font-bold pt-1 border-t border-[#5d1826]/10">
            <span>{locale === "ar" ? "المجموع الكلي:" : "Total:"}</span>
            <span>
              {finalTotal} {locale === "ar" ? "شيكل" : "ILS"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-2 pt-4 border-t border-[#5d1826]/10">
        <button
          type="button"
          onClick={onBack}
          className="w-1/3 py-3 border border-[#5d1826]/20 text-[#5d1826] rounded-[3px] text-xs font-medium hover:bg-[#5d1826]/5 transition-colors cursor-pointer text-center"
        >
          {locale === "ar" ? "الرجوع" : "Back"}
        </button>
        <button
          type="submit"
          disabled={loading}
          className="w-2/3 py-3 bg-[#5d1826] text-[#fffcf9] rounded-[3px] text-xs font-medium hover:bg-[#5d1826]/90 transition-colors cursor-pointer text-center flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          <span>
            {locale === "ar" ? "تأكيد وإرسال للواتساب" : "Confirm & Send"}
          </span>
        </button>
      </div>
    </form>
  );
}
