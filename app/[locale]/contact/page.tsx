import { Suspense } from "react";
import { getDictionary } from "@/lib/dictionary";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ContactSection } from "@/components/contact/ContactSection";

interface ContactPageProps {
  params: Promise<{ locale: "ar" | "en" }>;
}

async function ContactContent({ params }: ContactPageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <div className="contact-page bg-[#fffcf9]">
      <Header
        dict={dict.Header}
        searchDict={dict.Search}
        cartDict={dict.Cart}
        locale={locale}
      />
      <ContactSection dict={dict.ContactPage} locale={locale} />
      <Footer dict={dict.Footer} locale={locale} />
    </div>
  );
}

export default function ContactPageRoute({ params }: ContactPageProps) {
  return (
    <main className="min-h-screen bg-[#fffcf9] text-[#231916] font-tajawal overflow-hidden">
      <Suspense fallback={<div className="min-h-screen bg-[#fffcf9]" />}>
        <ContactContent params={params} />
      </Suspense>
    </main>
  );
}