import Link from "next/link";
import Image from "next/image";
import { Building2, User, ArrowRight } from "lucide-react";

const businessLinks = [
  { href: "/services", label: "Services & Pricing" },
  { href: "/assessment", label: "AI Readiness Assessment" },
  { href: "https://calendly.com/jermaine-jmcbtech/ai-strategy-ai-agents-consultation", label: "Book Consultation", external: true },
];

const careerLinks = [
  { href: "/#career", label: "Career Coaching" },
  { href: "/career-assessment", label: "Career Assessment" },
  { href: "/products", label: "Book & Resources" },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center bg-navy overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy to-primary/20" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 w-full">
        {/* Top Section - Headline */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold text-white leading-tight mb-6">
            AI Strategy That{" "}
            <span className="text-accent">Delivers Results</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Whether you're scaling enterprise AI or building a career that compounds, we bring the same systematic approach to help you succeed.
          </p>
        </div>

        {/* Persona Selection Cards */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto mb-16">
          {/* Business Persona */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all group">
            <div className="w-14 h-14 bg-accent/20 rounded-xl flex items-center justify-center mb-6">
              <Building2 className="w-7 h-7 text-accent" />
            </div>
            <h2 className="text-2xl font-heading font-bold text-white mb-3">
              For Business
            </h2>
            <p className="text-gray-300 mb-6">
              Enterprise AI consulting, strategy, and implementation for organizations ready to move from pilot to production.
            </p>
            <div className="space-y-3">
              {businessLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className="flex items-center justify-between text-gray-200 hover:text-accent transition-colors py-2 border-b border-white/10 last:border-0"
                >
                  <span>{link.label}</span>
                  <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          </div>

          {/* Career Persona */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all group">
            <div className="w-14 h-14 bg-secondary/20 rounded-xl flex items-center justify-center mb-6">
              <User className="w-7 h-7 text-secondary" />
            </div>
            <h2 className="text-2xl font-heading font-bold text-white mb-3">
              For Professionals
            </h2>
            <p className="text-gray-300 mb-6">
              Career coaching, strategy sessions, and resources to help you build a career that compounds over time.
            </p>
            <div className="space-y-3">
              {careerLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="flex items-center justify-between text-gray-200 hover:text-secondary transition-colors py-2 border-b border-white/10 last:border-0"
                >
                  <span>{link.label}</span>
                  <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Trusted By Section */}
        <div className="text-center">
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-6">
            Organizations We've Worked With
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
            <div className="text-gray-400 font-heading font-semibold text-lg tracking-wide hover:text-gray-300 transition-colors">
              Johns Hopkins Ward Infinity
            </div>
            <div className="text-gray-400 font-heading font-semibold text-lg tracking-wide hover:text-gray-300 transition-colors">
              ThorBoys Auto Body
            </div>
            <div className="text-gray-400 font-heading font-semibold text-lg tracking-wide hover:text-gray-300 transition-colors">
              Damascus House
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-100 to-transparent" />
    </section>
  );
}
