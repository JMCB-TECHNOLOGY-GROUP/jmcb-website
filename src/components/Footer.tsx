import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center mb-4">
              <span className="text-xl font-bold text-white font-display">
                JMCB<span className="text-accent">.</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed">
              AI strategy and implementation for growing businesses. Enterprise discipline, operational depth.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Services</h4>
            <ul className="space-y-2.5">
              {["AI Readiness Scan", "AI Strategy Sprint", "AI Pilot Program", "Advisory Retainer"].map((s) => (
                <li key={s}>
                  <Link href="/services" className="text-sm text-gray-400 hover:text-white transition-colors">{s}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Leadership", href: "/leadership" },
                { label: "Healthcare AI", href: "/healthcare" },
                { label: "Enterprise AI", href: "/enterprise" },
                { label: "Associations", href: "/associations" },
                { label: "AI Assessment", href: "/assessment" },
              ].map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-gray-400 hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Connect</h4>
            <ul className="space-y-2.5">
              <li>
                <a href="mailto:jermaine@jmcbtech.com" className="text-sm text-gray-400 hover:text-white transition-colors">jermaine@jmcbtech.com</a>
              </li>
              <li>
                <a href="https://linkedin.com/in/jermaine-barker-9a74536" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-white transition-colors">LinkedIn</a>
              </li>
              <li>
                <a href="https://calendly.com/jermaine-jmcbtech/ai-strategy-ai-agents-consultation" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-white transition-colors">Book a Call</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} JMCB Technology Group. All rights reserved.
          </p>
          <p className="text-xs text-gray-600">
            Washington, D.C. &middot; Georgetown, Guyana
          </p>
        </div>
      </div>
    </footer>
  );
}
