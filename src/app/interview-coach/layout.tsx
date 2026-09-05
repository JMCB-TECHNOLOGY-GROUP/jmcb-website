import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Interview Coach — Practise With a Hiring Manager Who Has Read Your CV",
  description:
    "A mock interview built from your own CV and target role. Six questions, scored on a fixed rubric, with your answers rewritten the way a strong candidate would say them. For job seekers, careers coaches and HR teams.",
  openGraph: {
    title: "Interview Coach | JMCB Technology Group",
    description:
      "Practise with an interviewer who has read your CV, presses for figures, and scores every answer. Licences for coaches and HR teams.",
  },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
