"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Code2, ShieldCheck, GraduationCap } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const CALENDLY_URL = "https://calendly.com/jermaine-jmcbtech/ai-strategy-ai-agents-consultation";

export default function LeadershipPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80&auto=format" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/85 to-gray-900/95" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <p className="text-xs font-body font-semibold tracking-widest uppercase text-accent mb-4">Leadership</p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            The team behind <span className="italic text-accent">the technology.</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Enterprise AI strategy paired with 27+ years of maritime operations leadership. We bring the discipline of billion-dollar programs and the operational depth of real-world fleet management.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Jermaine Full Bio */}
      <section className="py-20 md:py-28 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-5 gap-12 items-start">
            <div className="md:col-span-2">
              <div className="rounded-2xl overflow-hidden border border-gray-200 bg-gray-50">
                <Image src="/jermaine-barker.jpg" alt="Jermaine Barker" width={600} height={700} className="w-full h-auto object-cover" />
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {["Johns Hopkins Fellow", "Howard M.S.", "$2B+ Programs", "AI Safety", "Anthropic Certified", "Vital Guardian AI"].map((t) => (
                  <span key={t} className="px-3 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-full border border-gray-200">{t}</span>
                ))}
              </div>
              <a href="https://linkedin.com/in/jermaine-barker-9a74536" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-accent hover:text-amber-700 transition-colors">
                View LinkedIn Profile
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
            <div className="md:col-span-3">
              <p className="text-xs font-body font-semibold tracking-widest uppercase text-accent mb-3">Founder & Chief Executive Officer</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-6">Jermaine Barker</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Jermaine leads JMCB Technology Group with 15+ years in federal health technology, including oversight of large-scale programs exceeding $2B in scope. A Johns Hopkins Ward Infinity Fellow focused on Healthcare and AI Safety, he brings scientific rigor and governance-first thinking to every engagement.
                </p>
                <p>
                  He holds multiple Anthropic certifications and leads the firm as a member of the Claude Partner Network.
                </p>
                <p>
                  He holds an M.S. in Molecular Genetics from Howard University and co-founded Vital Guardian AI, a chronic disease management platform that won both the Johns Hopkins Ward Infinity Pitch Competition and Community Impact Award. That work drove the development of Tendivo Health, a health record platform that puts patients' complete medical records in their hands.
                </p>
                <p>
                  At JMCB Technology Group, Jermaine applies the governance and discipline of enterprise programs to help growing businesses deploy AI with a structured plan, responsible oversight, and results you can measure within 90 days. His methodology, the ASCEND Framework, has been refined across engagements spanning healthcare, mid-market enterprise, and associations.
                </p>
                <p>
                  His approach is built on a simple principle: if the technology doesn't create measurable results within 90 days, it's not ready for production.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-5xl mx-auto px-4"><div className="border-t border-gray-200" /></div>

      {/* David Profile */}
      <section className="py-20 md:py-28 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-body font-semibold tracking-widest uppercase text-accent mb-3">Director, Caribbean Operations</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-6">David Cheddie</h2>
          <div className="max-w-3xl space-y-4 text-gray-600 leading-relaxed">
            <p>
              David leads JMCB Technology Group's Caribbean operations and government delivery, with deep operational expertise in the region's maritime sector. His background spans 27+ years in maritime engineering and fleet operations across the Caribbean.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {["Unlimited Chief Engineer", "DP Class 2", "Caribbean Ops"].map((t) => (
              <span key={t} className="px-3 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-full border border-gray-200">{t}</span>
            ))}
          </div>
          <a href="https://www.linkedin.com/in/david-cheddie/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-accent hover:text-amber-700 transition-colors">
            View LinkedIn Profile
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>

      {/* The Practice */}
      <section className="py-20 md:py-28 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <p className="text-xs font-body font-semibold tracking-widest uppercase text-accent mb-4">The Practice</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
              The team behind <span className="italic text-accent">the products.</span>
            </h2>
            <p className="text-gray-600 leading-relaxed">
              JMCB Technology Group is an Anthropic-certified engineering team building AI products
              across healthcare, maritime, civic, and education. We're based in Washington, D.C.
              and serve clients across the US and the Caribbean.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Code2,
                title: "AI Engineering",
                body: "Anthropic-certified engineers who take AI products from first prototype to production, with human review built in where the domain demands it.",
              },
              {
                icon: ShieldCheck,
                title: "Regulated Domain Delivery",
                body: "Product work in fields where mistakes carry real cost: health records, maritime safety, civic services, and education.",
              },
              {
                icon: GraduationCap,
                title: "Talent Development",
                body: "A structured summer internship program with D.C. workforce partners trains early-career technologists toward professional AI certifications.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl border border-gray-200 p-7">
                <item.icon className="w-6 h-6 text-accent mb-4" />
                <h3 className="font-display text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            AI strategy backed by <span className="italic text-accent">operational depth.</span>
          </h2>
          <p className="text-gray-600 mb-8">See how our team can accelerate your AI deployment with a free strategy briefing.</p>
          <Link href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="btn-primary text-base">
            Book Strategy Briefing
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
