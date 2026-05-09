import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Footer } from "@/components/Footer";
import { TopNav } from "@/components/TopNav";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "KidsCarLab",
    template: "%s | KidsCarLab",
  },
  description: "RTINGS style kids mobility review prototype for products, reviews, rankings, and transparency.",
  applicationName: "KidsCarLab",
  keywords: [
    "kids car",
    "stroller",
    "kids mobility",
    "reviews",
    "rankings",
    "methodology",
    "transparency",
  ],
  alternates: {
    canonical: "/",
    languages: {
      "zh-CN": "/?lang=zh",
      en: "/?lang=en",
    },
  },
  openGraph: {
    type: "website",
    title: "KidsCarLab",
    description: "Kids mobility review and ranking prototype with transparent methodology.",
    url: "/",
    siteName: "KidsCarLab",
    locale: "zh_CN",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-zinc-50 text-zinc-900">
        <TopNav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
