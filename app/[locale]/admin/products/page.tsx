"use client";

import { useState, useEffect, use, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit3, Trash2, Loader2 } from "lucide-react";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface ProductItem {
  id: string;
  name: { ar: string; en: string };
  categoryName: { ar: string; en: string };
  price: number;
  stock: number;
  isVisible: boolean;
  image: string;
}

interface ProductsPageProps {
  params: Promise<{ locale: "ar" | "en" }>;
}

export default function AdminProductsPage({ params }: ProductsPageProps) {
  const resolvedParams = use(params);
  const locale = resolvedParams.locale;
  const isRtl = locale === "ar";
  const router = useRouter();
  const supabase = createClient();

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProducts = useCallback(async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*, categories(name_ar, name_en)")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error(isRtl ? "فشل تحميل المنتجات" : "Failed to load products");
      return null;
    }

    return (
      data?.map((item) => {
        const cat = item.categories as {
          name_ar?: string;
          name_en?: string;
        } | null;
        return {
          id: item.id,
          name: { ar: item.title_ar, en: item.title_en },
          categoryName: {
            ar: cat?.name_ar || (isRtl ? "بدون تصنيف" : "Uncategorized"),
            en: cat?.name_en || "Uncategorized",
          },
          price: Number(item.price),
          stock: item.stock,
          isVisible: item.is_visible ?? true,
          image: item.images?.[0] || "/categories/book.png",
        };
      }) ?? []
    );
  }, [supabase, isRtl]);

  useEffect(() => {
    let isActive = true;

    const loadProducts = async () => {
      const formatted = await fetchProducts();
      if (!isActive) return;

      if (formatted) setProducts(formatted);
      setLoading(false);
    };

    void loadProducts();
    return () => {
      isActive = false;
    };
  }, [fetchProducts]);

  const toggleVisibility = async (id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    setProducts((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isVisible: newStatus } : item,
      ),
    );

    const { error } = await supabase
      .from("products")
      .update({ is_visible: newStatus })
      .eq("id", id);

    if (error) {
      toast.error(
        isRtl ? "فشل تحديث حالة الظهور" : "Failed to update visibility",
      );
      const formatted = await fetchProducts();
      if (formatted) setProducts(formatted);
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
    setProducts((prev) => prev.filter((item) => item.id !== id));

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      toast.error(isRtl ? "فشل حذف المنتج" : "Failed to delete product");
      const formatted = await fetchProducts();
      if (formatted) setProducts(formatted);
    } else {
      toast.success(
        isRtl ? "تم حذف المنتج بنجاح" : "Product deleted successfully",
      );
      router.refresh();
    }
  };

  const columns = [
    {
      header: isRtl ? "المنتج" : "Product",
      accessor: (item: ProductItem) => (
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
      header: isRtl ? "التصنيف" : "Category",
      accessor: (item: ProductItem) => item.categoryName[locale],
      className: "text-[#74655f]",
    },
    {
      header: isRtl ? "السعر" : "Price",
      className: "text-center",
      accessor: (item: ProductItem) => (
        <span className="font-medium text-brown">
          {item.price > 0 ? `${item.price} ${isRtl ? "شيكل" : "ILS"}` : "--"}
        </span>
      ),
    },
    {
      header: isRtl ? "المخزون" : "Stock",
      className: "text-center",
      accessor: (item: ProductItem) => item.stock,
    },
    {
      header: isRtl ? "الظهور" : "Visibility",
      className: "text-center",
      accessor: (item: ProductItem) => (
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
      accessor: (item: ProductItem) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/${locale}/admin/products/${item.id}/edit`}
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
      title={isRtl ? "المنتجات" : "Products"}
      subtitle={
        isRtl
          ? "إدارة منتجات المتجر وأسعارها ومخزونها"
          : "Manage store products, prices, and stock"
      }
      addButtonText={isRtl ? "إضافة منتج" : "Add Product"}
      addButtonHref={`/${locale}/admin/products/new`}
      searchPlaceholder={isRtl ? "ابحث عن منتج..." : "Search product..."}
      data={products}
      columns={columns}
    />
  );
}
