import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  title: "JMCB Technology Group | AI Strategy & Implementation",
  description:
    "Turn AI anxiety into AI advantage. Founder-led AI strategy and implementation for organizations ready to ship AI that actually works.",
  keywords: [
    "AI strategy",
    "AI consulting",
    "AI implementation",
    "fractional AI leadership",
    "AI governance",
    "enterprise AI",
  ],
  authors: [{ name: "Jermaine Barker" }],
  openGraph: {
    title: "JMCB Technology Group | AI Strategy & Implementation",
    description:
      "Turn AI anxiety into AI advantage. Founder-led AI strategy for organizations ready to ship AI that actually works.",
    url: "https://jmcbtech.com",
    siteName: "JMCB Technology Group",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "JMCB Technology Group | AI Strategy & Implementation",
    description:
      "Turn AI anxiety into AI advantage. Founder-led AI strategy for organizations ready to ship AI that actually works.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="bg-white">{children}</body>
    </html>
  );
}
