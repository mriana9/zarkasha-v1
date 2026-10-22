import { Suspense } from "react";
import { getDictionary } from "@/lib/dictionary";
import { Header } from "@/components/layout/Header";
import { HeroSection } from "@/components/home/hero/HeroSection";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { MarqueeSection } from "@/components/home/hero/MarqueeSection";
import { CategorySection } from "@/components/home/categories/CategorySection";
import { CatalogSection } from "@/components/home/catalog/CatalogSection";
import { StorySection } from "@/components/home/story/StorySection";
import { CustomSection } from "@/components/home/custom/CustomSection";
import { ValuesSection } from "@/components/home/values/ValuesSection";
import { InstagramSection } from "@/components/home/instagram/InstagramSection";
import { ContactSection } from "@/components/home/contact/ContactSection";
import { FaqSection } from "@/components/home/faq/FaqSection";

interface PageProps {
  params: Promise<{ locale: "ar" | "en" }>;
}

async function HomeContent({ params }: PageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <>
      <AnnouncementBar dict={dict.AnnouncementBar} />
      <Header
        dict={dict.Header}
        searchDict={dict.Search}
        cartDict={dict.Cart}
        locale={locale}
      />
      <HeroSection dict={dict.Hero} />
      <MarqueeSection items={dict.Marquee} />
      <CategorySection dict={dict.Categories} locale={locale} />
      <CatalogSection dict={dict.Catalog} locale={locale} />
      <StorySection dict={dict.Story} locale={locale} />
      <CustomSection dict={dict.Custom} locale={locale} />
      <ValuesSection dict={dict.Values} />
      <InstagramSection dict={dict.Instagram} />
      <FaqSection dict={dict.Faq} />
      <ContactSection dict={dict.Contact} />
    </>
  );
}

export default function HomePage({ params }: PageProps) {
  return (
    <main className="min-h-screen bg-ivory text-[#231916] font-tajawal overflow-hidden">
      <Suspense fallback={<div className="min-h-screen bg-ivory" />}>
        <HomeContent params={params} />
      </Suspense>
    </main>
  );
}
