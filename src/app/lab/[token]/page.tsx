import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LabPortal from "./LabPortal";

// Private student portal. The token in the URL is the login, so the page is
// never indexed and never linked from anywhere public.
export const metadata: Metadata = {
  title: "Your Lab",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default function LabPage({ params }: { params: { token: string } }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-16">
        <LabPortal token={params.token} />
      </main>
      <Footer />
    </div>
  );
}
