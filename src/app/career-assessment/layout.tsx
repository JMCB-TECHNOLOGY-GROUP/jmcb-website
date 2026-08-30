import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Career Compass — Free Job Search Assessment",
  description:
    "Free 6-minute assessment for job seekers. Tell us what you want from your next job, get scored across the seven things employers screen on, and leave with an honest 90-day plan.",
  openGraph: {
    title: "Career Compass — Free Job Search Assessment | JMCB Technology Group",
    description:
      "Why isn't your job search working? Get scored across seven dimensions and leave with a 90-day plan. Free, 6 minutes.",
  },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
