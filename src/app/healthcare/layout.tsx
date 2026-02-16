import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Healthcare AI Strategy & Implementation",
  description: "Responsible AI for health systems, payers, and healthcare organizations. HIPAA-conscious workflows, clinical validation, and governance-first methodology.",
  openGraph: {
    title: "Healthcare AI | JMCB Technology Group",
    description: "AI that improves patient outcomes. HIPAA-conscious, clinically validated, governance-first.",
  },
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
