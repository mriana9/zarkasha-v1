"use client";

import { useState, useEffect, use, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowLeft,
  Upload,
  X,
  Sparkles,
  Link2,
  Loader2,
} from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

interface EditCategoryPageProps {
  params: Promise<{ locale: "ar" | "en"; id: string }>;
}

export default function AdminEditCategoryPage({
  params,
}: EditCategoryPageProps) {
  const resolvedParams = use(params);
  const locale = resolvedParams.locale;
  const categoryId = resolvedParams.id;
  const isRtl = locale === "ar";
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    nameAr: "",
    nameEn: "",
    slug: "",
    descriptionAr: "",
    descriptionEn: "",
    imageUrl: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);

  const categorySchema = z.object({
    nameAr: z
      .string()
      .min(1, isRtl ? "اسم التصنيف بالعربية مطلوب" : "Arabic name is required"),
    nameEn: z
      .string()
      .min(
        1,
        isRtl ? "اسم التصنيف بالإنجليزية مطلوب" : "English name is required",
      ),
    slug: z.string().min(1, isRtl ? "الرابط (Slug) مطلوب" : "Slug is required"),
  });

  useEffect(() => {
    async function fetchCategory() {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("id", categoryId)
        .single();

      if (error) {
        toast.error(
          isRtl ? "فشل جلب بيانات التصنيف" : "Failed to fetch category data",
        );
        router.push(`/${locale}/admin/categories`);
      } else if (data) {
        setFormData({
          nameAr: data.name_ar || "",
          nameEn: data.name_en || "",
          slug: data.slug || "",
          descriptionAr: data.description_ar || "",
          descriptionEn: data.description_en || "",
          imageUrl: data.image_url || "",
        });
      }
      setLoading(false);
    }

    fetchCategory();
  }, [categoryId, supabase, locale, isRtl, router]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, imageUrl: previewUrl }));
    }
  };

  const handleTitleChange = (value: string, lang: "ar" | "en") => {
    setFormData((prev) => {
      const updated = { ...prev, [lang === "ar" ? "nameAr" : "nameEn"]: value };
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const result = categorySchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as string] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    let uploadedImageUrl = formData.imageUrl;

    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `categories/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("zarkasha-storage")
        .upload(filePath, imageFile);

      if (uploadError) {
        toast.error(isRtl ? "فشل رفع الصورة" : "Failed to upload image", {
          description: uploadError.message,
        });
        setIsSubmitting(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("zarkasha-storage")
        .getPublicUrl(filePath);

      uploadedImageUrl = publicUrlData.publicUrl;
    }

    const { error } = await supabase
      .from("categories")
      .update({
        name_ar: formData.nameAr,
        name_en: formData.nameEn,
        slug: formData.slug,
        description_ar: formData.descriptionAr,
        description_en: formData.descriptionEn,
        image_url: uploadedImageUrl,
      })
      .eq("id", categoryId);

    if (error) {
      toast.error(isRtl ? "فشل تحديث التصنيف" : "Failed to update category", {
        description: error.message,
      });
      setIsSubmitting(false);
      return;
    }

    toast.success(
      isRtl ? "تم تحديث التصنيف بنجاح!" : "Category updated successfully!",
    );
    router.push(`/${locale}/admin/categories`);
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-burgundy" />
      </div>
    );
  }

  return (
    <div className="space-y-8 font-tajawal max-w-4xl mx-auto pb-12">
      <div className="flex items-center justify-between border-b border-burgundy/10 pb-5">
        <div>
          <h1 className="font-amiri text-3xl font-normal text-burgundy">
            {isRtl ? "تعديل التصنيف" : "Edit Category"}
          </h1>
          <p className="text-xs text-[#887a75] mt-1">
            {isRtl
              ? "تحديث بيانات التصنيف والصورة والوصف"
              : "Update category details and image"}
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
                value={formData.nameAr}
                onChange={(e) => handleTitleChange(e.target.value, "ar")}
                className={`w-full h-11 px-4 bg-ivory border ${
                  errors.nameAr ? "border-red-500" : "border-burgundy/15"
                } rounded-[3px] text-xs text-brown outline-none focus:border-burgundy`}
              />
              {errors.nameAr && (
                <p className="text-[11px] text-red-500">{errors.nameAr}</p>
              )}
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
                value={formData.nameEn}
                onChange={(e) => handleTitleChange(e.target.value, "en")}
                className={`w-full h-11 px-4 bg-ivory border ${
                  errors.nameEn ? "border-red-500" : "border-burgundy/15"
                } rounded-[3px] text-xs text-brown outline-none focus:border-burgundy ltr:text-left`}
              />
              {errors.nameEn && (
                <p className="text-[11px] text-red-500">{errors.nameEn}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-brown flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5 text-olive" />
              <span>{isRtl ? "رابط التصنيف (Slug)" : "Category Slug"} *</span>
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
              className={`w-full h-11 px-4 bg-ivory border ${
                errors.slug ? "border-red-500" : "border-burgundy/15"
              } rounded-[3px] text-xs text-brown outline-none focus:border-burgundy font-mono ltr:text-left`}
            />
            {errors.slug && (
              <p className="text-[11px] text-red-500">{errors.slug}</p>
            )}
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
            className="px-8 py-3 bg-burgundy text-ivory rounded-[3px] text-xs font-medium hover:bg-burgundy/90 transition-colors shadow-xs disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>
              {isSubmitting
                ? isRtl
                  ? "جاري التحديث..."
                  : "Updating..."
                : isRtl
                  ? "تحديث التصنيف"
                  : "Update Category"}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
