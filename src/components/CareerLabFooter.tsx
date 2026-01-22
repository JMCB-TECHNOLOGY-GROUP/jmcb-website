import Link from "next/link";
import Image from "next/image";
import { Linkedin, Mail, Calendar } from "lucide-react";

const careerLinks = [
  { href: "/career-assessment", label: "Career Assessment" },
  { href: "/workforce", label: "For Organizations" },
  { href: "/products", label: "Resources" },
  { href: "/chapter", label: "Free Chapter" },
];

const resourceLinks = [
  { href: "/dashboard", label: "My Dashboard" },
  { href: "/sign-up", label: "Create Account" },
];

export default function CareerLabFooter() {
  return (
    <footer className="bg-navy-dark py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div>
            <Link href="/career-assessment" className="inline-flex items-center gap-3 mb-4">
              <Image
                src="/logo.png"
                alt="Career Lab"
                width={120}
                height={43}
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-secondary font-semibold mb-2">Career Lab</p>
            <p className="text-gray-400 text-sm mb-4">
              Career development tools and coaching for professionals ready to grow.
            </p>
            <p className="text-sm text-gray-500">
              © 2026 JMCB Technology Group
            </p>
          </div>

          {/* Career Lab Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Career Lab</h4>
            <ul className="space-y-3">
              {careerLinks.map((link) => (
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

          {/* Account Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Your Account</h4>
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
                  href="https://calendly.com/jermaine-jmcbtech/free-review-career-lab-review"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  Book Career Session
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Cross-link to Enterprise */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          <p className="text-center text-sm text-gray-500">
            Looking for enterprise AI solutions?{" "}
            <Link href="/" className="text-accent hover:text-amber-400 transition-colors">
              Visit JMCB Technology Group →
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
