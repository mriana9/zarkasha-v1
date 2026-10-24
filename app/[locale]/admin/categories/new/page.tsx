"use client";

import { useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowLeft,
  Upload,
  X,
  Sparkles,
  Link2,
} from "lucide-react";

interface AdminNewCategoryPageProps {
  params: Promise<{ locale: "ar" | "en" }>;
}

export default function AdminNewCategoryPage({
  params,
}: AdminNewCategoryPageProps) {
  const resolvedParams = use(params);
  const locale = resolvedParams.locale;
  const isRtl = locale === "ar";

  const [formData, setFormData] = useState({
    nameAr: "",
    nameEn: "",
    slug: "",
    descriptionAr: "",
    descriptionEn: "",
    imageUrl: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, imageUrl }));
    }
  };

  const handleTitleChange = (value: string, lang: "ar" | "en") => {
    setFormData((prev) => {
      const updated = { ...prev, [lang === "ar" ? "nameAr" : "nameEn"]: value };
      // Auto-generate slug from English title if empty or matching old slug
      if (lang === "en") {
        const generatedSlug = value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");
        updated.slug = generatedSlug;
      }
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert(
        isRtl ? "تمت إضافة التصنيف بنجاح!" : "Category added successfully!",
      );
    }, 1200);
  };

  return (
    <div className="space-y-8 font-tajawal max-w-4xl mx-auto pb-12">
      <div className="flex items-center justify-between border-b border-burgundy/10 pb-5">
        <div>
          <h1 className="font-amiri text-3xl font-normal text-burgundy">
            {isRtl ? "إضافة تصنيف جديد" : "Add New Category"}
          </h1>
          <p className="text-xs text-[#887a75] mt-1">
            {isRtl
              ? "أدخلي تفاصيل التصنيف بالعربية والإنجليزية مع الرابط الفريد (Slug) والصورة"
              : "Enter category details in Arabic & English with slug and image"}
          </p>
        </div>
        <Link
          href={`/${locale}/admin/categories`}
          className="inline-flex items-center gap-2 text-xs font-medium text-olive hover:text-burgundy transition-colors"
        >
          {isRtl ? (
            <ArrowRight className="w-4 h-4" />
          ) : (
            <ArrowLeft className="w-4 h-4" />
          )}
          <span>{isRtl ? "العودة للتصنيفات" : "Back to Categories"}</span>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-[#fbf9f6] border border-burgundy/10 rounded-[4px] p-6 space-y-6 shadow-xs">
          <h2 className="font-amiri text-xl text-burgundy border-b border-burgundy/10 pb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-olive" />
            <span>
              {isRtl
                ? "معلومات التصنيف الأساسية"
                : "Basic Category Information"}
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-brown">
                {isRtl ? "اسم التصنيف (بالعربية)" : "Category Name (Arabic)"} *
              </label>
              <input
                type="text"
                required
                value={formData.nameAr}
                onChange={(e) => handleTitleChange(e.target.value, "ar")}
                placeholder={
                  isRtl ? "مثال: فساتين مطرزة" : "e.g. Embroidered Dresses"
                }
                className="w-full h-11 px-4 bg-ivory border border-burgundy/15 rounded-[3px] text-xs text-brown outline-none focus:border-burgundy"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-brown">
                {isRtl
                  ? "اسم التصنيف (بالإنجليزية)"
                  : "Category Name (English)"}{" "}
                *
              </label>
              <input
                type="text"
                required
                value={formData.nameEn}
                onChange={(e) => handleTitleChange(e.target.value, "en")}
                placeholder="e.g. Embroidered Dresses"
                className="w-full h-11 px-4 bg-ivory border border-burgundy/15 rounded-[3px] text-xs text-brown outline-none focus:border-burgundy ltr:text-left"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-brown flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5 text-olive" />
              <span>{isRtl ? "رابط التصنيف (Slug)" : "Category Slug"} *</span>
            </label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
              placeholder="e.g. embroidered-dresses"
              className="w-full h-11 px-4 bg-ivory border border-burgundy/15 rounded-[3px] text-xs text-brown outline-none focus:border-burgundy font-mono ltr:text-left"
            />
            <span className="text-[10px] text-[#887a75] block">
              {isRtl
                ? "يستخدم في مسار الرابط الإلكتروني للمتجر (يُفضل أن يكون أحرف إنجليزية صغيرة مع شرطات)"
                : "Used in the URL path (lowercase letters and hyphens recommended)"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-brown">
                {isRtl ? "وصف التصنيف (بالعربية)" : "Description (Arabic)"}
              </label>
              <textarea
                rows={3}
                value={formData.descriptionAr}
                onChange={(e) =>
                  setFormData({ ...formData, descriptionAr: e.target.value })
                }
                placeholder={
                  isRtl ? "وصف مختصر للتصنيف..." : "Brief description..."
                }
                className="w-full p-4 bg-ivory border border-burgundy/15 rounded-[3px] text-xs text-brown outline-none focus:border-burgundy resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-brown">
                {isRtl ? "وصف التصنيف (بالإنجليزية)" : "Description (English)"}
              </label>
              <textarea
                rows={3}
                value={formData.descriptionEn}
                onChange={(e) =>
                  setFormData({ ...formData, descriptionEn: e.target.value })
                }
                placeholder="Brief category description..."
                className="w-full p-4 bg-ivory border border-burgundy/15 rounded-[3px] text-xs text-brown outline-none focus:border-burgundy resize-none ltr:text-left"
              />
            </div>
          </div>
        </div>

        <div className="bg-[#fbf9f6] border border-burgundy/10 rounded-[4px] p-6 space-y-6 shadow-xs">
          <h2 className="font-amiri text-xl text-burgundy border-b border-burgundy/10 pb-3">
            {isRtl ? "صورة التصنيف" : "Category Image"}
          </h2>

          <div className="border-2 border-dashed border-burgundy/20 bg-ivory rounded-[4px] p-8 text-center space-y-3 cursor-pointer hover:border-burgundy/40 transition-colors relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <div className="w-12 h-12 rounded-full bg-beige/40 grid place-items-center text-burgundy mx-auto">
              <Upload className="w-5 h-5" />
            </div>
            <p className="text-xs text-brown font-medium">
              {isRtl
                ? "اسحبي صورة التصنيف هنا أو اضغطي للرفع"
                : "Drag & drop category image here or click to upload"}
            </p>
          </div>

          {formData.imageUrl && (
            <div className="relative w-32 h-32 rounded-[3px] overflow-hidden border border-burgundy/15 group mx-auto">
              <Image
                src={formData.imageUrl}
                alt="Category preview"
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, imageUrl: "" }))
                }
                className="absolute top-1.5 right-1.5 bg-burgundy/80 text-ivory p-1 rounded-full hover:bg-burgundy transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Link
            href={`/${locale}/admin/categories`}
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
                ? "حفظ التصنيف"
                : "Save Category"}
          </button>
        </div>
      </form>
    </div>
  );
}
