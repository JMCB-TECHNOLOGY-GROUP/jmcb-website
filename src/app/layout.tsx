import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "JMCB Technology Group | AI Strategy & Implementation",
    template: "%s | JMCB Technology Group",
  },
  description: "Deploy AI with confidence. Take our free AI Readiness Assessment or book a strategy call. Enterprise discipline, entrepreneurial speed. Results in 90 days.",
  keywords: ["AI strategy", "AI consulting", "AI readiness assessment", "ASCEND framework", "AI implementation", "agentic AI", "AI governance"],
  authors: [{ name: "Jermaine Barker", url: "https://jmcbtech.com" }],
  creator: "JMCB Technology Group",
  metadataBase: new URL("https://jmcbtech.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://jmcbtech.com",
    siteName: "JMCB Technology Group",
    title: "JMCB Technology Group | AI Strategy & Implementation",
    description: "Deploy AI with confidence. Free AI Readiness Assessment. Enterprise discipline, entrepreneurial speed. Results in 90 days.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "JMCB Technology Group - AI Strategy & Implementation" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "JMCB Technology Group | AI Strategy & Implementation",
    description: "Deploy AI with confidence. Free AI Readiness Assessment. Results in 90 days.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "JMCB Technology Group",
  url: "https://jmcbtech.com",
  logo: "https://jmcbtech.com/logo.png",
  description: "AI Strategy & Implementation for growing businesses. Enterprise discipline, entrepreneurial speed.",
  founder: {
    "@type": "Person",
    name: "Jermaine Barker",
    jobTitle: "Founder & CEO",
    sameAs: "https://linkedin.com/in/jermaine-barker-9a74536",
  },
  sameAs: ["https://linkedin.com/in/jermaine-barker-9a74536"],
  contactPoint: {
    "@type": "ContactPoint",
    email: "jermaine@jmcbtech.com",
    contactType: "sales",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} font-sans`}>{children}</body>
    </html>
  );
}
