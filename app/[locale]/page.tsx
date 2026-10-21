import { getDictionary } from "@/lib/dictionary";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";

export const instant = false;

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: "ar" | "en" }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <main>
      <AnnouncementBar dict={dict.AnnouncementBar} />
      <Header
        dict={dict.Header}
        searchDict={dict.Search}
        cartDict={dict.Cart}
        locale={locale}
      />
    </main>
  );
}
