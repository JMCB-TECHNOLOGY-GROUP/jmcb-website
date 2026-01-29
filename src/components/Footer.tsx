import Link from "next/link";
import { Linkedin, Mail, Calendar } from "lucide-react";

const consultingLinks = [
  { href: "/platform", label: "Platform" },
  { href: "/solutions", label: "Solutions" },
  { href: "/services", label: "Services & Pricing" },
];

const resourceLinks = [
  { href: "/assessment", label: "AI Readiness Assessment" },
  { href: "#results", label: "Credentials" },
  { href: "#about", label: "About Us" },
];

export default function Footer() {
  return (
    <footer className="bg-navy-dark py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <img
                src="/logo.png"
                alt="JMCB Technology Group"
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-gray-400 mb-4">Enterprise AI Consulting</p>
            <p className="text-sm text-gray-500">
              © 2026 JMCB Technology Group
            </p>
          </div>

          {/* Enterprise AI Column */}
          <div>
            <h4 className="text-white font-semibold mb-4">Enterprise AI</h4>
            <ul className="space-y-3">
              {consultingLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect Column */}
          <div>
            <h4 className="text-white font-semibold mb-4">Connect</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="mailto:jermaine@jmcbtech.com"
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  jermaine@jmcbtech.com
                </Link>
              </li>
              <li>
                <Link
                  href="https://linkedin.com/in/jermainebarker"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </Link>
              </li>
              <li>
                <Link
                  href="https://calendly.com/jermaine-jmcbtech/ai-strategy-ai-agents-consultation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  Book Strategy Call
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom border */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          <p className="text-center text-sm text-gray-500">
            Designed with purpose. Built with precision.
          </p>
        </div>
      </div>
    </footer>
  );
}
