import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "AI Strategy & Implementation Services",
  description: "From AI Readiness Scan to full Pilot Programs. Enterprise discipline, entrepreneurial speed. Every engagement follows the JMCB ASCEND methodology.",
  openGraph: {
    title: "AI Strategy Services | JMCB Technology Group",
    description: "AI Readiness Scan, Strategy Sprint, Pilot Program, and Advisory Retainer. Results in 90 days.",
  },
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
