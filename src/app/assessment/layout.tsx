import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Free AI Readiness Assessment",
  description: "Take the free JMCB AI Readiness Assessment. 10 questions, 5 minutes. Get your score across 10 ASCEND dimensions with personalized recommendations.",
  openGraph: {
    title: "Free AI Readiness Assessment | JMCB Technology Group",
    description: "Find out where AI fits in your business. 10 questions, 5 minutes, free personalized report.",
  },
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
