import { use } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";

interface AdminRootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default function AdminRootLayout({
  children,
  params,
}: AdminRootLayoutProps) {
  const resolvedParams = use(params);
  const locale = (resolvedParams.locale === "en" ? "en" : "ar") as "ar" | "en";
  const isRtl = locale === "ar";

  const dict = {
    brandName: isRtl ? "زركشة" : "Zarkasha",
    brandSubtitle: isRtl
      ? "لوحة التحكم - By Mariana"
      : "Admin Dashboard - By Mariana",
    adminName: isRtl ? "ماريانا" : "Mariana",
    adminRole: isRtl ? "مديرة المتجر" : "Store Manager",
    nav: {
      products: isRtl ? "المنتجات" : "Products",
      categories: isRtl ? "التصنيفات" : "Categories",
      orders: isRtl ? "الطلبات" : "Orders",
      messages: isRtl ? "الرسائل" : "Messages",
      customers: isRtl ? "العملاء" : "Customers",
      settings: isRtl ? "الإعدادات" : "Settings",
    },
  };

  return (
    <AdminLayout locale={locale} dict={dict}>
      {children}
    </AdminLayout>
  );
}
