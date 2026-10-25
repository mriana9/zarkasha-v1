import type { ReactNode } from "react";
import { Toaster } from "sonner";

export const instant = false;

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  return (
    <div dir={locale === "ar" ? "rtl" : "ltr"} className="min-h-screen">
      {children}
      <Toaster position="top-center" richColors />
    </div>
  );
}
