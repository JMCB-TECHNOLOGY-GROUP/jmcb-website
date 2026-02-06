import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center mb-4">
              <span className="text-xl font-bold text-gray-900">
                JMCB<span className="text-accent">.</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500">
              AI strategy and implementation for growing businesses. From clarity to results in 90 days.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Services
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/#offers" className="text-sm text-gray-600 hover:text-accent transition-colors">
                  Strategy Session
                </Link>
              </li>
              <li>
                <Link href="/#offers" className="text-sm text-gray-600 hover:text-accent transition-colors">
                  Readiness Scan
                </Link>
              </li>
              <li>
                <Link href="/#offers" className="text-sm text-gray-600 hover:text-accent transition-colors">
                  Quick Win Sprint
                </Link>
              </li>
              <li>
                <Link href="/#offers" className="text-sm text-gray-600 hover:text-accent transition-colors">
                  Full Deployment
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Resources
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/assessment" className="text-sm text-gray-600 hover:text-accent transition-colors">
                  AI Readiness Assessment
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="text-sm text-gray-600 hover:text-accent transition-colors">
                  ASCEND Framework
                </Link>
              </li>
              <li>
                <Link href="/#results" className="text-sm text-gray-600 hover:text-accent transition-colors">
                  Case Studies
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Connect
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:jermaine@jmcbtech.com"
                  className="text-sm text-gray-600 hover:text-accent transition-colors"
                >
                  jermaine@jmcbtech.com
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com/in/jermainebarker"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-accent transition-colors"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://calendly.com/jermaine-jmcbtech/ai-strategy-ai-agents-consultation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-accent transition-colors"
                >
                  Book a Call
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} JMCB Technology Group. All rights reserved.
          </p>
          <p className="text-sm text-gray-400">
            Designed with purpose. Built with precision.
          </p>
        </div>
      </div>
    </footer>
  );
}
