import type { Metadata } from "next";
import {
  Amiri,
  Tajawal,
  Playfair_Display,
  Plus_Jakarta_Sans,
} from "next/font/google";
import "./globals.css";

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-amiri",
});

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
  variable: "--font-tajawal",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-playfair",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-plus-jakarta",
});


export const metadata: Metadata = {
  title: "زركشة | تطريز فلسطيني أصيل",
  description: "علامة فلسطينية تحتفي بجمال التطريز وبالقطع التي تحمل حكاية.",
  icons: {
    icon: "/logo/logo.png", 
    shortcut: "/logo/logo.png",
    apple: "/logo/logo.png", 
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${amiri.variable} ${tajawal.variable} ${playfair.variable} ${plusJakarta.variable}`}
    >
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
