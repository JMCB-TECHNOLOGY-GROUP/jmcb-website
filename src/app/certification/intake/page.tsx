import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import IntakeForm from "./IntakeForm";
import { SPRINT, TRACK_NAME } from "@/lib/certification";

// Unlisted onboarding page: linked from the track emails
// (docs/certification-track/templates.md), not from the nav, and kept out of
// search. ?path=associate preselects the associate path.
export const metadata: Metadata = {
  title: `${TRACK_NAME} — intake`,
  description: `Intake for the ${TRACK_NAME}: your details, your exam, and your path.`,
  robots: { index: false, follow: false },
};

export default function CertificationIntakePage({
  searchParams,
}: {
  searchParams: { path?: string };
}) {
  const initialPath = searchParams.path === "associate" ? "associate" : "sprint";

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <section className="bg-gray-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-32 pb-14">
          <p className="text-accent font-body font-semibold text-sm tracking-widest uppercase mb-4">
            {TRACK_NAME}
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">
            Your intake
          </h1>
          <p className="text-lg text-gray-300 leading-relaxed">
            Five minutes. It gives me what I need to set you up, build your {SPRINT.weeks}-week plan
            around your own work, and get you to exam day.
          </p>
        </div>
      </section>
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <IntakeForm initialPath={initialPath} />
      </section>
      <Footer />
    </div>
  );
}
