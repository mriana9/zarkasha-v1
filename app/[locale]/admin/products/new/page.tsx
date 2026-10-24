"use client";

import { useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowLeft, Upload, X, Sparkles } from "lucide-react";

interface AdminNewProductPageProps {
  params: Promise<{ locale: "ar" | "en" }>;
}

export default function AdminNewProductPage({
  params,
}: AdminNewProductPageProps) {
  const resolvedParams = use(params);
  const locale = resolvedParams.locale;
  const isRtl = locale === "ar";

  const [formData, setFormData] = useState({
    categoryId: "",
    titleAr: "",
    titleEn: "",
    descriptionAr: "",
    descriptionEn: "",
    price: "",
    stock: "1",
    isFeatured: false,
    images: [] as string[],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { id: "1", nameAr: "فساتين مطرزة", nameEn: "Embroidered Dresses" },
    { id: "2", nameAr: "أكسسوارات الشعر", nameEn: "Hair Accessories" },
    { id: "3", nameAr: "ميداليات", nameEn: "Keychains" },
    { id: "4", nameAr: "دفاتر ومفكرات", nameEn: "Notebooks" },
    { id: "5", nameAr: "هدايا مخصصة", nameEn: "Custom Gifts" },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newImages = filesArray.map((file) => URL.createObjectURL(file));
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages],
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert(isRtl ? "تمت إضافة المنتج بنجاح!" : "Product added successfully!");
    }, 1200);
  };

  return (
    <div className="space-y-8 font-tajawal max-w-4xl mx-auto pb-12">
      <div className="flex items-center justify-between border-b border-burgundy/10 pb-5">
        <div>
          <h1 className="font-amiri text-3xl font-normal text-burgundy">
            {isRtl ? "إضافة منتج جديد" : "Add New Product"}
          </h1>
          <p className="text-xs text-[#887a75] mt-1">
            {isRtl
              ? "أدخلي تفاصيل القطعة المطرزة بالعربية والإنجليزية مع الصور والأسعار"
              : "Enter the embroidered product details in Arabic & English with images and pricing"}
          </p>
        </div>
        <Link
          href={`/${locale}/admin/products`}
          className="inline-flex items-center gap-2 text-xs font-medium text-olive hover:text-burgundy transition-colors"
        >
          {isRtl ? (
            <ArrowRight className="w-4 h-4" />
          ) : (
            <ArrowLeft className="w-4 h-4" />
          )}
          <span>{isRtl ? "العودة للمنتجات" : "Back to Products"}</span>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-[#fbf9f6] border border-burgundy/10 rounded-[4px] p-6 space-y-6 shadow-xs">
          <h2 className="font-amiri text-xl text-burgundy border-b border-burgundy/10 pb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-olive" />
            <span>{isRtl ? "المعلومات الأساسية" : "Basic Information"}</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-brown">
                {isRtl ? "عنوان المنتج (بالعربية)" : "Product Title (Arabic)"} *
              </label>
              <input
                type="text"
                required
                value={formData.titleAr}
                onChange={(e) =>
                  setFormData({ ...formData, titleAr: e.target.value })
                }
                placeholder={
                  isRtl
                    ? "مثال: طوق شعر مطرز برسمة الزيتون"
                    : "e.g. Embroidered Olive Headband"
                }
                className="w-full h-11 px-4 bg-ivory border border-burgundy/15 rounded-[3px] text-xs text-brown outline-none focus:border-burgundy"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-brown">
                {isRtl
                  ? "عنوان المنتج (بالإنجليزية)"
                  : "Product Title (English)"}{" "}
                *
              </label>
              <input
                type="text"
                required
                value={formData.titleEn}
                onChange={(e) =>
                  setFormData({ ...formData, titleEn: e.target.value })
                }
                placeholder="e.g. Embroidered Olive Branch Headband"
                className="w-full h-11 px-4 bg-ivory border border-burgundy/15 rounded-[3px] text-xs text-brown outline-none focus:border-burgundy ltr:text-left"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-brown">
                {isRtl ? "وصف المنتج (بالعربية)" : "Description (Arabic)"} *
              </label>
              <textarea
                required
                rows={4}
                value={formData.descriptionAr}
                onChange={(e) =>
                  setFormData({ ...formData, descriptionAr: e.target.value })
                }
                placeholder={
                  isRtl
                    ? "اكتبي وصفاً دقيقاً للقطعة ونوع الخيط والقماش..."
                    : "Write a detailed description..."
                }
                className="w-full p-4 bg-ivory border border-burgundy/15 rounded-[3px] text-xs text-brown outline-none focus:border-burgundy resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-brown">
                {isRtl ? "وصف المنتج (بالإنجليزية)" : "Description (English)"} *
              </label>
              <textarea
                required
                rows={4}
                value={formData.descriptionEn}
                onChange={(e) =>
                  setFormData({ ...formData, descriptionEn: e.target.value })
                }
                placeholder="Detailed description of craftsmanship, threads, and fabric..."
                className="w-full p-4 bg-ivory border border-burgundy/15 rounded-[3px] text-xs text-brown outline-none focus:border-burgundy resize-none ltr:text-left"
              />
            </div>
          </div>
        </div>

        <div className="bg-[#fbf9f6] border border-burgundy/10 rounded-[4px] p-6 space-y-6 shadow-xs">
          <h2 className="font-amiri text-xl text-burgundy border-b border-burgundy/10 pb-3">
            {isRtl ? "السعر والمخزون والتصنيف" : "Pricing, Stock & Category"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-brown">
                {isRtl ? "التصنيف" : "Category"}
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) =>
                  setFormData({ ...formData, categoryId: e.target.value })
                }
                className="w-full h-11 px-4 bg-ivory border border-burgundy/15 rounded-[3px] text-xs text-brown outline-none focus:border-burgundy cursor-pointer"
              >
                <option value="">
                  {isRtl ? "اختر التصنيف..." : "Select Category..."}
                </option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {isRtl ? cat.nameAr : cat.nameEn}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-brown">
                {isRtl ? "السعر (د.أ)" : "Price (JOD)"} *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                placeholder="0.00"
                className="w-full h-11 px-4 bg-ivory border border-burgundy/15 rounded-[3px] text-xs text-brown outline-none focus:border-burgundy"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-brown">
                {isRtl ? "الكمية المتاحة في المخزون" : "Available Stock"} *
              </label>
              <input
                type="number"
                required
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value })
                }
                placeholder="0"
                className="w-full h-11 px-4 bg-ivory border border-burgundy/15 rounded-[3px] text-xs text-brown outline-none focus:border-burgundy"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3 border-t border-burgundy/10">
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  isFeatured: !prev.isFeatured,
                }))
              }
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                formData.isFeatured ? "bg-olive" : "bg-[#c8beba]"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-ivory shadow-xs ring-0 transition duration-200 ease-in-out ${
                  formData.isFeatured
                    ? isRtl
                      ? "-translate-x-5"
                      : "translate-x-5"
                    : "translate-x-0"
                }`}
              />
            </button>
            <span className="text-xs font-medium text-brown">
              {isRtl
                ? "تثبيت كمنتج مميز (يظهر في القسم الرئيس للموقع)"
                : "Set as Featured Product (Shown on Home Page)"}
            </span>
          </div>
        </div>

        <div className="bg-[#fbf9f6] border border-burgundy/10 rounded-[4px] p-6 space-y-6 shadow-xs">
          <h2 className="font-amiri text-xl text-burgundy border-b border-burgundy/10 pb-3">
            {isRtl ? "صور المنتج" : "Product Images"}
          </h2>

          <div className="border-2 border-dashed border-burgundy/20 bg-ivory rounded-[4px] p-8 text-center space-y-3 cursor-pointer hover:border-burgundy/40 transition-colors relative">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <div className="w-12 h-12 rounded-full bg-beige/40 grid place-items-center text-burgundy mx-auto">
              <Upload className="w-5 h-5" />
            </div>
            <p className="text-xs text-brown font-medium">
              {isRtl
                ? "اسحبي الصور هنا أو اضغطي للرفع (يمكنك اختيار عدة صور)"
                : "Drag & drop images here or click to upload"}
            </p>
          </div>

          {formData.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
              {formData.images.map((img, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-[3px] overflow-hidden border border-burgundy/15 group"
                >
                  <Image
                    src={img}
                    alt={`Product ${index}`}
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1.5 right-1.5 bg-burgundy/80 text-ivory p-1 rounded-full hover:bg-burgundy transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Link
            href={`/${locale}/admin/products`}
            className="px-6 py-3 border border-burgundy/20 text-brown rounded-[3px] text-xs font-medium hover:bg-burgundy/5 transition-colors"
          >
            {isRtl ? "إلغاء" : "Cancel"}
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-burgundy text-ivory rounded-[3px] text-xs font-medium hover:bg-burgundy/90 transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting
              ? isRtl
                ? "جاري الحفظ..."
                : "Saving..."
              : isRtl
                ? "حفظ المنتج"
                : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
