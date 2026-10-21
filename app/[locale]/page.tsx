import { Suspense } from "react";
import { getDictionary } from "@/lib/dictionary";
import { Header } from "@/components/layout/Header";
import { HeroSection } from "@/components/home/hero/HeroSection";
import { MarqueeSection } from "@/components/home/hero/MarqueeSection";

interface PageProps {
  params: Promise<{ locale: "ar" | "en" }>;
}

async function HomeContent({ params }: PageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <>
      <Header
        dict={dict.Header}
        searchDict={dict.Search}
        cartDict={dict.Cart}
        locale={locale}
      />
      <HeroSection dict={dict.Hero} />
      <MarqueeSection items={dict.Marquee} />
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
