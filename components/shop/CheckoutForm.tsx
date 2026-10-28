"use client";

import { Send } from "lucide-react";

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

interface CheckoutFormProps {
  locale: "ar" | "en";
  formData: CheckoutFormData;
  setFormData: React.Dispatch<React.SetStateAction<CheckoutFormData>>;
  selectedRegion: keyof ShippingRates;
  setSelectedRegion: (region: keyof ShippingRates) => void;
  shippingRates: ShippingRates;
  totalPrice: number;
  currentShippingCost: number;
  finalTotal: number;
  loading: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
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
  const isArabic = locale === "ar";

  return (
    <form
      onSubmit={onSubmit}
      className="flex-1 flex flex-col justify-between py-4 space-y-4 overflow-y-auto"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-[#5d1826] mb-1">
            {isArabic ? "الاسم الكامل" : "Full Name"}
          </label>
          <input
            type="text"
            required
            maxLength={100}
            autoComplete="name"
            value={formData.fullName}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                fullName: e.target.value,
              }))
            }
            placeholder={
              isArabic ? "أدخلي اسمك الكامل" : "Enter your full name"
            }
            className="w-full h-10 px-3 bg-[#fbf9f6] border border-[#5d1826]/20 rounded-[3px] text-xs text-[#231916] outline-none focus:border-[#5d1826]"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#5d1826] mb-1">
            {isArabic ? "رقم الجوال" : "Phone Number"}
          </label>
          <input
            type="tel"
            required
            maxLength={10}
            minLength={10}
            inputMode="numeric"
            autoComplete="tel-national"
            pattern="[0-9]{10}"
            value={formData.phone}
            onChange={(e) => {
              const numericValue = e.target.value.replace(/\D/g, "");

              if (numericValue.length <= 10) {
                setFormData((prev) => ({
                  ...prev,
                  phone: numericValue,
                }));
              }
            }}
            placeholder="0590000000"
            className="w-full h-10 px-3 bg-[#fbf9f6] border border-[#5d1826]/20 rounded-[3px] text-xs text-[#231916] outline-none focus:border-[#5d1826]"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#5d1826] mb-1">
            {isArabic ? "منطقة التوصيل" : "Shipping Region"}
          </label>
          <select
            required
            value={selectedRegion}
            onChange={(e) =>
              setSelectedRegion(e.target.value as keyof ShippingRates)
            }
            className="w-full h-10 px-3 bg-[#fbf9f6] border border-[#5d1826]/20 rounded-[3px] text-xs text-[#231916] outline-none focus:border-[#5d1826]"
          >
            <option value="westBank">
              {isArabic
                ? `الضفة الغربية (${shippingRates.westBank} شيكل)`
                : `West Bank (${shippingRates.westBank} ILS)`}
            </option>
            <option value="jerusalem">
              {isArabic
                ? `القدس (${shippingRates.jerusalem} شيكل)`
                : `Jerusalem (${shippingRates.jerusalem} ILS)`}
            </option>
            <option value="israel48">
              {isArabic
                ? `الداخل (${shippingRates.israel48} شيكل)`
                : `Israel (${shippingRates.israel48} ILS)`}
            </option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#5d1826] mb-1">
            {isArabic ? "العنوان بالتفصيل" : "Detailed Address"}
          </label>
          <textarea
            required
            rows={2}
            maxLength={300}
            autoComplete="street-address"
            value={formData.address}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                address: e.target.value,
              }))
            }
            placeholder={
              isArabic
                ? "الشارع، الحارة، معالم تفصيلية..."
                : "Street, Neighborhood..."
            }
            className="w-full p-3 bg-[#fbf9f6] border border-[#5d1826]/20 rounded-[3px] text-xs text-[#231916] outline-none focus:border-[#5d1826] resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#5d1826] mb-1">
            {isArabic ? "ملاحظات الطلب (اختياري)" : "Order Notes (Optional)"}
          </label>
          <textarea
            rows={2}
            maxLength={500}
            value={formData.notes}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                notes: e.target.value,
              }))
            }
            placeholder={
              isArabic
                ? "أي ملاحظات خاصة بالتطريز أو التوصيل..."
                : "Any special notes..."
            }
            className="w-full p-3 bg-[#fbf9f6] border border-[#5d1826]/20 rounded-[3px] text-xs text-[#231916] outline-none focus:border-[#5d1826] resize-none"
          />
        </div>

        <label className="flex items-start gap-3 p-3 bg-[#fbf9f6] border border-[#5d1826]/15 rounded-[4px] cursor-pointer">
          <input
            type="checkbox"
            required
            checked={formData.whatsappOptIn}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                whatsappOptIn: e.target.checked,
              }))
            }
            className="mt-1 accent-[#5d1826] shrink-0"
          />
          <span className="text-xs leading-6 text-[#5d1826]">
            {isArabic
              ? "أوافق على استلام تأكيد طلبي والفاتورة وتحديثات الطلب عبر واتساب على الرقم الذي أدخلته."
              : "I agree to receive my order confirmation, invoice, and order updates via WhatsApp at the phone number provided."}
          </span>
        </label>

        <div className="p-3 bg-[#fbf9f6] border border-[#5d1826]/10 rounded-[4px] space-y-2 text-xs text-[#5d1826]">
          <div className="flex justify-between">
            <span>{isArabic ? "مجموع المنتجات:" : "Products Total:"}</span>
            <span>
              {totalPrice} {isArabic ? "شيكل" : "ILS"}
            </span>
          </div>

          <div className="flex justify-between">
            <span>{isArabic ? "سعر التوصيل:" : "Shipping:"}</span>
            <span>
              {currentShippingCost} {isArabic ? "شيكل" : "ILS"}
            </span>
          </div>

          <div className="flex justify-between font-bold pt-2 border-t border-[#5d1826]/10">
            <span>{isArabic ? "المجموع الكلي:" : "Total:"}</span>
            <span>
              {finalTotal} {isArabic ? "شيكل" : "ILS"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-2 pt-4 border-t border-[#5d1826]/10">
        <button
          type="button"
          onClick={onBack}
          disabled={loading}
          className="w-1/3 py-3 border border-[#5d1826]/20 text-[#5d1826] rounded-[3px] text-xs font-medium hover:bg-[#5d1826]/5 transition-colors cursor-pointer text-center disabled:opacity-50"
        >
          {isArabic ? "الرجوع" : "Back"}
        </button>

        <button
          type="submit"
          disabled={loading}
          className="w-2/3 py-3 bg-[#5d1826] text-[#fffcf9] rounded-[3px] text-xs font-medium hover:bg-[#5d1826]/90 transition-colors cursor-pointer text-center flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          <span>
            {loading
              ? isArabic
                ? "جارٍ معالجة الطلب..."
                : "Processing order..."
              : isArabic
                ? "تأكيد الطلب وإرسال الفاتورة"
                : "Confirm Order & Send Invoice"}
          </span>
        </button>
      </div>
    </form>
  );
}
