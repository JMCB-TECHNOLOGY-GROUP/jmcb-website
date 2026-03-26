"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, ExternalLink, Layers, Heart, GraduationCap, CheckCircle2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const CALENDLY_URL = "https://calendly.com/jermaine-jmcbtech/ai-strategy-ai-agents-consultation";

const products = [
  {
    icon: Layers,
    name: "ASCEND Content Manager",
    tagline: "AI-powered content strategy and social management.",
    status: "Live",
    statusColor: "bg-green-500",
    url: "https://ascend.jmcbtech.com",
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80&auto=format",
    description: "ASCEND Content Manager is a SaaS platform that gives businesses consistent, on-brand content output without the overhead of a full marketing team. It combines AI-powered content generation with multi-platform social media management, scheduling, and analytics.",
    features: [
      "Multi-model Response Council polling Claude and Perplexity for quality output",
      "OAuth integrations for LinkedIn, X, and Instagram",
      "Content calendar with automated scheduling and publishing",
      "Brand voice training and tone consistency",
      "Analytics dashboard with engagement tracking",
    ],
    stack: "React, FastAPI, Supabase, Stripe, Vercel + Railway",
    audience: "Small businesses, solo founders, med spas, professional services firms",
  },
  {
    icon: Heart,
    name: "Tendivo Health",
    tagline: "Patient-facing AI for chronic disease management.",
    status: "Pilot",
    statusColor: "bg-accent",
    url: "",
    img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80&auto=format",
    description: "Tendivo Health is a patient-facing AI layer built to work on top of existing health records systems like RioMed and Cellma NEHRS. Rather than replacing clinical infrastructure, Tendivo adds an intelligent engagement layer that reaches patients where traditional healthcare systems fail them. Born from the Vital Guardian AI platform (Johns Hopkins Ward Infinity winner), Tendivo focuses on chronic disease populations in underserved markets.",
    features: [
      "FHIR R4 mapping for interoperability with existing EHR systems",
      "Offline-capable sync engine for low-connectivity environments",
      "Community Health Worker (CHW) portal for field-based care",
      "AI-driven patient engagement and medication adherence workflows",
      "Population health analytics for care gap identification",
    ],
    stack: "Next.js, PostgreSQL, FHIR R4, Offline Sync Engine",
    audience: "Health systems, FQHCs, international health ministries, IDB health projects",
  },
  {
    icon: GraduationCap,
    name: "LeapIQ",
    tagline: "Adaptive AI educational delivery.",
    status: "Pilot",
    statusColor: "bg-accent",
    url: "",
    img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80&auto=format",
    description: "LeapIQ is an adaptive AI educational delivery platform that personalizes learning paths in real time. It identifies individual knowledge gaps and dynamically adjusts content, pacing, and assessment difficulty to accelerate student outcomes. Built on the same scientific rigor that drives all JMCB products.",
    features: [
      "Real-time adaptive learning path generation",
      "Knowledge gap identification and targeted remediation",
      "Multi-format content delivery (visual, interactive, text)",
      "Progress analytics for students, parents, and educators",
      "Standards-aligned content mapping (Common Core, state standards)",
    ],
    stack: "React, AI/ML adaptive engine",
    audience: "K-12 students, parents, tutoring centers, school districts",
  },
];

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&q=80&auto=format" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/85 to-gray-900/95" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <p className="text-xs font-body font-semibold tracking-widest uppercase text-accent mb-4">Products</p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Technology we <span className="italic text-accent">build and ship.</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            JMCB Technology Group doesn't just advise on AI strategy. We build digital products that solve real problems across healthcare, education, content management, and government operations.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Products */}
      <section className="py-20 md:py-28 px-4">
        <div className="max-w-5xl mx-auto space-y-20">
          {products.map((product, i) => (
            <div key={product.name} className={`grid md:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? "md:direction-rtl" : ""}`}>
              {/* Image */}
              <div className={`rounded-2xl overflow-hidden border border-gray-200 ${i % 2 === 1 ? "md:order-2" : ""}`}>
                <div className="aspect-[16/10] overflow-hidden">
                  <img src={product.img} alt={product.name} className="w-full h-full object-cover img-grayscale hover:filter-none transition-all duration-500" />
                </div>
              </div>

              {/* Content */}
              <div className={i % 2 === 1 ? "md:order-1" : ""}>
                <div className="flex items-center gap-3 mb-4">
                  <product.icon className="w-6 h-6 text-accent" />
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold text-white px-2.5 py-0.5 rounded-full ${product.statusColor}`}>
                    <span className="w-1.5 h-1.5 bg-white rounded-full" />
                    {product.status}
                  </span>
                </div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900 mb-2">{product.name}</h2>
                <p className="text-accent font-semibold text-sm mb-4">{product.tagline}</p>
                <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

                <h4 className="text-xs font-semibold text-gray-400 tracking-wider uppercase mb-3">Key Capabilities</h4>
                <ul className="space-y-2 mb-6">
                  {product.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center gap-6 text-xs text-gray-400 mb-5">
                  <span><span className="font-semibold text-gray-500">Stack:</span> {product.stack}</span>
                </div>
                <p className="text-xs text-gray-400 mb-5">
                  <span className="font-semibold text-gray-500">Built for:</span> {product.audience}
                </p>

                {product.url && (
                  <a href={product.url} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm">
                    Visit Platform
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Need a product <span className="italic text-accent">built right?</span>
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            We build technology products with the same enterprise discipline and governance rigor we bring to our consulting engagements. If you need a platform built, a product scaled, or a technical co-founder, let's talk.
          </p>
          <Link href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="btn-primary text-base">
            Book a Call
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
