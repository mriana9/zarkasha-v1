export async function generateStaticParams() {
  return [{ locale: "ar" }, { locale: "en" }];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div dir={locale === "ar" ? "rtl" : "ltr"} className="min-h-screen">
      {children}
    </div>
  );
}
