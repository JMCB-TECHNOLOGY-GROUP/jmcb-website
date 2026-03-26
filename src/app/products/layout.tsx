import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Products",
  description: "Digital products built by JMCB Technology Group. ASCEND Content Manager, Tendivo Health, and LeapIQ.",
};
export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
