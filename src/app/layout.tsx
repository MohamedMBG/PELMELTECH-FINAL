import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-sans",
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
    <html lang="en" className={`scroll-smooth antialiased ${manrope.variable}`}>
      <body className={`min-h-screen flex flex-col bg-background text-on-surface ${manrope.className}`}>
        {children}
      </body>
    </html>
  );
}
