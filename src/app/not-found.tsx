import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-28 pb-24 px-4">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-7xl font-bold text-accent mb-4">404</p>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Page not found</h1>
          <p className="text-gray-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-amber-600 transition"
            >
              Back to Home
            </Link>
            <Link
              href="/assessment"
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-gray-900 text-gray-900 font-semibold rounded-lg hover:bg-gray-900 hover:text-white transition"
            >
              Take Free Assessment
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
