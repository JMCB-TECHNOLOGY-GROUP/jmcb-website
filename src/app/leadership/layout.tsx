import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Leadership",
  description: "Meet the JMCB Technology Group leadership team. Enterprise AI strategy paired with 27+ years of maritime operations leadership.",
};
export default function LeadershipLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
