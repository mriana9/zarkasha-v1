"use client";

import { useState, use } from "react";
import Image from "next/image";
import { Edit3, Trash2 } from "lucide-react";
import { AdminDataTable } from "@/components/admin/AdminDataTable";

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

  const [categories, setCategories] = useState<CategoryItem[]>([
    {
      id: "1",
      name: { ar: "فساتين مطرزة", en: "Embroidered Dresses" },
      slug: "embroidered-dresses",
      isVisible: true,
      image: "/categories/hair-accessories1.jpg",
    },
    {
      id: "2",
      name: { ar: "أكسسوارات الشعر", en: "Hair Accessories" },
      slug: "hair-accessories",
      isVisible: true,
      image: "/categories/hair-accessories.jpg",
    },
    {
      id: "3",
      name: { ar: "ميداليات", en: "Keychains" },
      slug: "keychains",
      isVisible: true,
      image: "/categories/book.png",
    },
  ]);

  const toggleVisibility = (id: string) => {
    setCategories((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isVisible: !item.isVisible } : item,
      ),
    );
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
      accessor: "slug" as keyof CategoryItem,
      className: "text-[#74655f]",
    },
    {
      header: isRtl ? "الظهور في الرئيسية" : "Home Visibility",
      className: "text-center",
      accessor: (item: CategoryItem) => (
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => toggleVisibility(item.id)}
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
      accessor: () => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Edit"
            className="p-1 text-[#887a75] hover:text-burgundy transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            aria-label="Delete"
            className="p-1 text-[#887a75] hover:text-burgundy transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

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
