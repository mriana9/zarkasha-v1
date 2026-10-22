import { Suspense } from "react";
import { getDictionary } from "@/lib/dictionary";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StoryHero } from "@/components/story/StoryHero";
import { StoryManifesto } from "@/components/story/StoryManifesto";
import { StoryOrigin } from "@/components/story/StoryOrigin";
import { StoryChapters } from "@/components/story/StoryChapters";
import { StoryCraft } from "@/components/story/StoryCraft";
import { StoryClosing } from "@/components/story/StoryClosing";

interface StoryPageProps {
  params: Promise<{ locale: "ar" | "en" }>;
}

async function StoryContent({ params }: StoryPageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <div className="story-page bg-[#fffcf9]">
      <Header
        dict={dict.Header}
        searchDict={dict.Search}
        cartDict={dict.Cart}
        locale={locale}
      />
      <StoryHero dict={dict.StoryPage} locale={locale} />
      <StoryManifesto dict={dict.StoryPage} />
      <StoryOrigin dict={dict.StoryPage} />
      <StoryChapters dict={dict.StoryPage} />
      <StoryCraft dict={dict.StoryPage} />
      <StoryClosing dict={dict.StoryPage} locale={locale} />
      <Footer dict={dict.Footer} locale={locale} />
    </div>
  );
}

export default function StoryPageRoute({ params }: StoryPageProps) {
  return (
    <main className="min-h-screen bg-[#fffcf9] text-[#231916] font-tajawal overflow-hidden">
      <Suspense fallback={<div className="min-h-screen bg-[#fffcf9]" />}>
        <StoryContent params={params} />
      </Suspense>
    </main>
  );
}
