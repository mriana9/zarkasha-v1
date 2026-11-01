import type { ReactNode } from "react";
import { Toaster } from "sonner";
import { CartProvider } from "@/context/CartContext";
import { ClarityScript } from "@/components/ClarityScript";

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
      <ClarityScript projectId="z6zgfqg4wi" />
      <CartProvider>
        {children}
        <Toaster position="top-center" richColors />
      </CartProvider>
    </div>
  );
}
