import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "AI for Associations & Nonprofits",
  description: "AI strategy for trade associations, nonprofits, and mission-driven organizations. Do more with less. Member engagement, content, operations at scale.",
  openGraph: {
    title: "Association & Nonprofit AI | JMCB Technology Group",
    description: "AI that multiplies your mission impact. Member engagement, content, and operations at scale.",
  },
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
