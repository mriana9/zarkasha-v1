"use client";

import { useState, useEffect, use, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit3, Trash2, Loader2 } from "lucide-react";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface CategoryItem {
  id: string;
  name: { ar: string; en: string };
  slug: string;
  isVisible: boolean;
  image: string;
}

interface CategoriesPageProps {
  params: Promise<{ locale: "ar" | "en" }>;
}

export default function AdminCategoriesPage({ params }: CategoriesPageProps) {
  const resolvedParams = use(params);
  const locale = resolvedParams.locale;
  const isRtl = locale === "ar";
  const router = useRouter();
  const supabase = createClient();

  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCategories = useCallback(async () => {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error(isRtl ? "فشل تحميل التصنيفات" : "Failed to load categories");
      return null;
    }

    return (
      data?.map((item) => ({
        id: item.id,
        name: { ar: item.name_ar, en: item.name_en },
        slug: item.slug,
        isVisible: item.is_visible ?? true,
        image: item.image_url || "/categories/book.png",
      })) ?? []
    );
  }, [supabase, isRtl]);

  useEffect(() => {
    let isActive = true;

    const loadCategories = async () => {
      const formatted = await fetchCategories();
      if (!isActive) return;

      if (formatted) setCategories(formatted);
      setLoading(false);
    };

    void loadCategories();
    return () => {
      isActive = false;
    };
  }, [fetchCategories]);

  const toggleVisibility = async (id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    setCategories((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isVisible: newStatus } : item,
      ),
    );

    const { error } = await supabase
      .from("categories")
      .update({ is_visible: newStatus })
      .eq("id", id);

    if (error) {
      toast.error(
        isRtl ? "فشل تحديث حالة الظهور" : "Failed to update visibility",
      );
      const formatted = await fetchCategories();
      if (formatted) setCategories(formatted);
    } else {
      toast.success(
        isRtl
          ? "تم تحديث حالة الظهور بنجاح"
          : "Visibility updated successfully",
      );
      router.refresh();
    }
  };

  const handleDelete = async (id: string) => {
    setCategories((prev) => prev.filter((item) => item.id !== id));

    const { error } = await supabase.from("categories").delete().eq("id", id);

    if (error) {
      toast.error(isRtl ? "فشل حذف التصنيف" : "Failed to delete category");
      const formatted = await fetchCategories();
      if (formatted) setCategories(formatted);
    } else {
      toast.success(
        isRtl ? "تم حذف التصنيف بنجاح" : "Category deleted successfully",
      );
      router.refresh();
    }
  };

  const columns = [
    {
      header: isRtl ? "التصنيف" : "Category",
      accessor: (item: CategoryItem) => (
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-[3px] overflow-hidden bg-beige/40 shrink-0 border border-burgundy/10">
            <Image
              src={item.image}
              alt={item.name[locale]}
              fill
              className="object-cover"
            />
          </div>
          <span className="font-medium text-burgundy">{item.name[locale]}</span>
        </div>
      ),
    },
    {
      header: isRtl ? "الرابط (Slug)" : "Slug",
      accessor: (item: CategoryItem) => item.slug,
      className: "text-[#74655f] font-mono text-xs",
    },
    {
      header: isRtl ? "الظهور في الرئيسية" : "Home Visibility",
      className: "text-center",
      accessor: (item: CategoryItem) => (
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => toggleVisibility(item.id, item.isVisible)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
              item.isVisible ? "bg-olive" : "bg-[#c8beba]"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-ivory shadow-xs ring-0 transition duration-200 ease-in-out ${
                item.isVisible
                  ? isRtl
                    ? "-translate-x-5"
                    : "translate-x-5"
                  : "translate-x-0"
              }`}
            />
          </button>
          <span
            className={`text-[11px] font-medium ${item.isVisible ? "text-olive" : "text-[#887a75]"}`}
          >
            {item.isVisible
              ? isRtl
                ? "ظاهر"
                : "Visible"
              : isRtl
                ? "مخفي"
                : "Hidden"}
          </span>
        </div>
      ),
    },
    {
      header: isRtl ? "الإجراءات" : "Actions",
      accessor: (item: CategoryItem) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/${locale}/admin/categories/${item.id}/edit`}
            aria-label="Edit"
            className="p-1 text-[#887a75] hover:text-burgundy transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </Link>
          <button
            type="button"
            onClick={() => handleDelete(item.id)}
            aria-label="Delete"
            className="p-1 text-[#887a75] hover:text-red-600 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-burgundy" />
      </div>
    );
  }

  return (
    <AdminDataTable
      locale={locale}
      title={isRtl ? "التصنيفات" : "Categories"}
      subtitle={
        isRtl
          ? "إدارة تصنيفات المتجر وعرضها في الصفحة الرئيسية"
          : "Manage store categories and home display"
      }
      addButtonText={isRtl ? "إضافة تصنيف" : "Add Category"}
      addButtonHref={`/${locale}/admin/categories/new`}
      searchPlaceholder={isRtl ? "ابحث عن تصنيف..." : "Search category..."}
      data={categories}
      columns={columns}
    />
  );
}
