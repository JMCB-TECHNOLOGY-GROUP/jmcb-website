import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Enterprise AI Strategy for Mid-Market Companies",
  description: "AI strategy for companies with 50-500 employees. Big 4 discipline without the Big 4 price tag. From assessment to production in 90 days.",
  openGraph: {
    title: "Enterprise AI Strategy | JMCB Technology Group",
    description: "AI strategy for mid-market companies. Results in 90 days, not 24 months.",
  },
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
