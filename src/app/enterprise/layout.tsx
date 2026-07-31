import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Enterprise AI Strategy for Mid-Market Companies",
  description: "AI strategy for companies with 50-500 employees. Enterprise discipline at the right scale and price. Working AI in 30 days. Governed production in 90.",
  openGraph: {
    title: "Enterprise AI Strategy | JMCB Technology Group",
    description: "AI strategy for mid-market companies. Working AI in 30 days and governed production in 90, while the industry average from prototype to production is eight months (Gartner).",
  },
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
