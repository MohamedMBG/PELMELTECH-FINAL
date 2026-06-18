import type { Metadata } from "next";
import { Manrope, Cairo } from "next/font/google";
import { LanguageProvider } from "@/i18n";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-sans",
});

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-arabic",
});

export const metadata: Metadata = {
  title: "PelmelTech | High-Impact Industrial Precision Printing",
  description: "Premium large format printing, event graphics, banners, panels, and custom production. Industrial precision meets luxury craftsmanship.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" className={`scroll-smooth antialiased ${manrope.variable} ${cairo.variable}`}>
      <body className={`min-h-screen flex flex-col bg-background text-on-surface ${manrope.className}`}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
