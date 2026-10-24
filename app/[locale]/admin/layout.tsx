import { getDictionary } from "@/lib/dictionary";
import { AdminLayout } from "@/components/admin/AdminLayout";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: "ar" | "en" }>;
}

export default async function Layout({ children, params }: LayoutProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const layoutDict = dict?.AdminLayout || {
    brandName: "Zarkasha",
    brandSubtitle: "Dashboard - By Mariana",
    adminName: "Mariana",
    adminRole: "Store Manager",
    nav: {
      products: "Products",
      categories: "Categories",
      orders: "Orders",
      messages: "Messages",
      settings: "Settings",
    },
  };

  return (
    <AdminLayout locale={locale} dict={layoutDict}>
      {children}
    </AdminLayout>
  );
}
