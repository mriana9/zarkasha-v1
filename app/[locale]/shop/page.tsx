import { Suspense } from "react";
import { getDictionary } from "@/lib/dictionary";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ShopHero } from "@/components/shop/ShopHero";
import { ShopCatalog } from "@/components/shop/ShopCatalog";
import { ShopServiceStrip } from "@/components/shop/ShopServiceStrip";

interface ShopPageProps {
  params: Promise<{ locale: "ar" | "en" }>;
}

async function ShopContent({ params }: ShopPageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <div className="shop-page">
      <Header
        dict={dict.Header}
        searchDict={dict.Search}
        cartDict={dict.Cart}
        locale={locale}
      />
      <ShopHero dict={dict.Shop} locale={locale} />
      <ShopCatalog dict={dict.Shop} />
      <ShopServiceStrip dict={dict.Shop.serviceStrip} />
      <Footer dict={dict.Footer} locale={locale} />
    </div>
  );
}

export default function ShopPage({ params }: ShopPageProps) {
  return (
    <main className="min-h-screen bg-ivory text-[#231916] font-tajawal overflow-hidden">
      <Suspense fallback={<div className="min-h-screen bg-ivory" />}>
        <ShopContent params={params} />
      </Suspense>
    </main>
  );
}
