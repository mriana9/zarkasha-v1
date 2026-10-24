"use client";

import { useState, use } from "react";
import Image from "next/image";
import { Edit3, Trash2 } from "lucide-react";
import { AdminDataTable } from "@/components/admin/AdminDataTable";

interface ProductItem {
  id: string;
  name: { ar: string; en: string };
  category: { ar: string; en: string };
  price: number;
  stock: string | number;
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

  const [products, setProducts] = useState<ProductItem[]>([
    {
      id: "1",
      name: { ar: "فستان مطرز", en: "Embroidered Dress" },
      category: { ar: "فساتين مطرزة", en: "Embroidered Dresses" },
      price: 40,
      stock: "4",
      isVisible: true,
      image: "/categories/hair-accessories1.jpg",
    },
    {
      id: "2",
      name: { ar: "ربطة شعر مطرزة", en: "Embroidered Bow" },
      category: { ar: "أكسسوارات الشعر", en: "Hair Accessories" },
      price: 12,
      stock: "12",
      isVisible: true,
      image: "/categories/hair-accessories.jpg",
    },
    {
      id: "3",
      name: { ar: "طوق شعر مطرز", en: "Embroidered Headband" },
      category: { ar: "أكسسوارات الشعر", en: "Hair Accessories" },
      price: 15,
      stock: "0",
      isVisible: false,
      image: "/categories/hair-accessories1.jpg",
    },
    {
      id: "4",
      name: { ar: "ميدالية مطرزة", en: "Embroidered Keychain" },
      category: { ar: "ميداليات", en: "Keychains" },
      price: 25,
      stock: "25",
      isVisible: true,
      image: "/categories/book.png",
    },
    {
      id: "5",
      name: { ar: "دفتر بغلاف مطرز", en: "Embroidered Notebook" },
      category: { ar: "دفاتر ومفكرات", en: "Notebooks" },
      price: 8,
      stock: "8",
      isVisible: true,
      image: "/categories/book.png",
    },
    {
      id: "6",
      name: { ar: "هدية مخصصة", en: "Custom Gift" },
      category: { ar: "هدايا مخصصة", en: "Custom Gifts" },
      price: 0,
      stock: "-",
      isVisible: false,
      image: "/categories/hair-accessories.jpg",
    },
  ]);

  const toggleVisibility = (id: string) => {
    setProducts((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isVisible: !item.isVisible } : item,
      ),
    );
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
      accessor: (item: ProductItem) => item.category[locale],
      className: "text-[#74655f]",
    },
    {
      header: isRtl ? "السعر" : "Price",
      className: "text-center",
      accessor: (item: ProductItem) => (
        <span className="font-medium text-brown">
          {item.price > 0 ? `${item.price} ${isRtl ? "د.أ" : "JOD"}` : "--"}
        </span>
      ),
    },
    {
      header: isRtl ? "المخزون" : "Stock",
      className: "text-center",
      accessor: "stock" as keyof ProductItem,
    },
    {
      header: isRtl ? "الظهور" : "Visibility",
      className: "text-center",
      accessor: (item: ProductItem) => (
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
