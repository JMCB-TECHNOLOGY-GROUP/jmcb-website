"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Shield, Brain, Zap, ChevronRight, Clock, Target, Users, CheckCircle2, Building2, Sparkles, ArrowUpRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const CALENDLY_URL = "https://calendly.com/jermaine-jmcbtech/ai-strategy-ai-agents-consultation";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* ===== HERO ===== */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80&auto=format"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-900/80 to-gray-900/70" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-32 pb-20">
          <p className="text-accent font-body font-semibold text-sm tracking-widest uppercase mb-6 animate-fade-in-up opacity-0">
            AI Strategy & Implementation
          </p>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.08] mb-6 animate-fade-in-up-delay opacity-0">
            Deploy AI with
            <br />
            <span className="text-accent italic">confidence.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-xl leading-relaxed mb-10 animate-fade-in-up-delay-2 opacity-0">
            80% of AI projects fail before production. We bring the discipline
            behind large-scale technology programs to help your team deploy AI
            safely and profitably.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up-delay-2 opacity-0">
            <Link href="/assessment" className="btn-primary text-base">
              Take Free AI Assessment
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="btn-outline-white text-base">
              Book Strategy Briefing
            </Link>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* ===== TRUST BAR ===== */}
      <section className="py-10 px-4 border-b border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { stat: "$2B+", label: "Programs Managed" },
              { stat: "15+", label: "Years Enterprise Leadership" },
              { stat: "90", label: "Days to First AI Workflow" },
              { stat: "27+", label: "Years Maritime Operations" },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="text-2xl md:text-3xl font-display font-bold text-gray-900">{item.stat}</div>
                <div className="text-xs font-body font-medium text-gray-500 mt-1 tracking-wide">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PROBLEM / AGITATION ===== */}
      <section className="py-20 md:py-28 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-body font-semibold tracking-widest uppercase text-accent mb-4">
                The Problem
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-6">
                Most AI initiatives stall.
                <br />
                <span className="italic text-accent">Yours won't.</span>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-8">
                The gap between AI ambition and AI execution is where businesses
                lose time, money, and competitive advantage. Pilots that never
                reach production. Vendors that overpromise. Governance gaps that
                keep leadership awake at night.
              </p>
              <Link href="/assessment" className="btn-primary text-sm">
                Find out where you stand
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {[
                { stat: "80%", text: "of AI pilots never reach production", source: "Forbes" },
                { stat: "48%", text: "of leaders cite governance as the top barrier to scaling AI", source: "Gartner" },
                { stat: "67%", text: "of organizations say data quality is their #1 AI challenge", source: "Industry Research" },
              ].map((item) => (
                <div key={item.stat} className="flex items-start gap-5 p-5 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="text-3xl font-display font-bold text-accent shrink-0 w-20">{item.stat}</div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{item.text}</p>
                    <p className="text-xs text-gray-400 mt-1">{item.source}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== LEADERSHIP ===== */}
      <section className="py-20 md:py-28 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-body font-semibold tracking-widest uppercase text-accent mb-4">
              Leadership
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
              Enterprise discipline. <span className="italic text-accent">Operational depth.</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Our leadership combines AI strategy, large-scale program delivery,
              and 27+ years of maritime operations experience across the Caribbean.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Jermaine */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden group card-hover">
              <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                <Image src="/jermaine-barker.jpg" alt="Jermaine Barker, Founder and CEO" width={600} height={450} className="w-full h-full object-cover object-top img-grayscale group-hover:scale-[1.02] transition-transform duration-500" />
              </div>
              <div className="p-7">
                <h3 className="text-xl font-display font-bold text-gray-900 mb-1">Jermaine Barker</h3>
                <p className="text-sm font-semibold text-accent mb-4">Founder & Chief Executive Officer</p>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">
                  Jermaine leads JMCB Technology Group with 15+ years of enterprise technology leadership, including oversight of large-scale programs exceeding $2B in scope. A Johns Hopkins Ward Infinity Fellow focused on Healthcare and AI Safety, he brings scientific rigor and governance-first thinking to every engagement.
                </p>
                <p className="text-sm text-gray-600 leading-relaxed mb-5">
                  He holds an M.S. in Molecular Genetics from Howard University and co-founded Vital Guardian AI, which won both the Johns Hopkins Ward Infinity Pitch Competition and Community Impact Award.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Johns Hopkins Fellow", "Howard M.S.", "$2B+ Programs", "AI Safety"].map((t) => (
                    <span key={t} className="px-3 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-full border border-gray-200">{t}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* David */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden group card-hover">
              <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                <Image src="/david-cheddie.jpg" alt="David Cheddie, Chief Operating Officer" width={600} height={450} className="w-full h-full object-cover object-top img-grayscale group-hover:scale-[1.02] transition-transform duration-500" />
              </div>
              <div className="p-7">
                <h3 className="text-xl font-display font-bold text-gray-900 mb-1">David Cheddie</h3>
                <p className="text-sm font-semibold text-accent mb-4">Chief Operating Officer</p>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">
                  David brings 27+ years of maritime engineering and fleet operations leadership to JMCB Technology Group. He holds an unlimited Chief Engineer certification (3000KW+) with extensive experience managing DP Class 2 vessel operations across the Caribbean and offshore sectors.
                </p>
                <p className="text-sm text-gray-600 leading-relaxed mb-5">
                  His career spans senior engineering roles with Edison Chouest Offshore, Hornbeck Offshore Services, and Svitzer Marine. David operates from Georgetown, Guyana with dual presence in the Washington D.C. metro area.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Unlimited Chief Engineer", "DP Class 2", "Edison Chouest", "Georgetown, GY"].map((t) => (
                    <span key={t} className="px-3 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-full border border-gray-200">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PRODUCTS PREVIEW ===== */}
      <section className="py-20 md:py-28 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14 gap-4">
            <div>
              <p className="text-xs font-body font-semibold tracking-widest uppercase text-accent mb-4">
                Our Products
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                Technology we <span className="italic text-accent">build and ship.</span>
              </h2>
            </div>
            <Link href="/products" className="text-sm font-semibold text-accent hover:text-amber-700 transition-colors inline-flex items-center gap-1.5">
              View all products
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "ASCEND Content Manager",
                tag: "SaaS Platform",
                desc: "AI-powered content strategy and social media management for businesses that need consistent, on-brand output without the overhead of a full marketing team.",
                href: "https://ascend.jmcbtech.com",
                status: "Live",
                color: "bg-green-500",
              },
              {
                name: "Tendivo Health",
                tag: "Healthcare AI",
                desc: "Patient-facing AI layer for chronic disease management. Built to work on top of existing health records systems, reaching patients where traditional care falls short.",
                href: "/products",
                status: "In Development",
                color: "bg-accent",
              },
              {
                name: "LeapIQ",
                tag: "Education AI",
                desc: "Adaptive AI educational delivery platform that personalizes learning paths in real time, targeting knowledge gaps and accelerating student outcomes.",
                href: "/products",
                status: "In Development",
                color: "bg-accent",
              },
            ].map((product) => (
              <div key={product.name} className="group bg-white rounded-xl border border-gray-200 p-7 card-hover flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-gray-400 tracking-wider uppercase">{product.tag}</span>
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold text-white px-2.5 py-0.5 rounded-full ${product.color}`}>
                    <span className="w-1.5 h-1.5 bg-white rounded-full" />
                    {product.status}
                  </span>
                </div>
                <h3 className="font-display text-xl font-bold text-gray-900 mb-3">{product.name}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-5 flex-1">{product.desc}</p>
                <Link href={product.href} target={product.href.startsWith("http") ? "_blank" : undefined} rel={product.href.startsWith("http") ? "noopener noreferrer" : undefined} className="text-sm font-semibold text-accent hover:text-amber-700 transition-colors inline-flex items-center gap-1.5">
                  {product.status === "Live" ? "Visit Platform" : "Learn More"}
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ASCEND METHODOLOGY ===== */}
      <section className="relative py-20 md:py-28 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80&auto=format"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gray-900/92" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-body font-semibold tracking-widest uppercase text-accent mb-4">
              Our Methodology
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
              The JMCB ASCEND&#8482; Framework
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
              A proven methodology for deploying agentic AI, starting
              with the workflows that create measurable impact first.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { letter: "A", word: "Assess", desc: "Identify your highest-impact AI use cases and what's blocking them" },
              { letter: "S", word: "Strategize", desc: "Define priorities, ROI targets, and a 30/60/90-day roadmap" },
              { letter: "C", word: "Construct", desc: "Confirm your tools, data access, and team readiness" },
              { letter: "E", word: "Execute", desc: "Pilot one workflow with clear success metrics" },
              { letter: "N", word: "Navigate", desc: "Implement guardrails for responsible, governed AI" },
              { letter: "D", word: "Deploy", desc: "Roll out, measure, and continuously improve" },
            ].map((step) => (
              <div key={step.letter} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 hover:border-accent/40 transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-10 h-10 bg-accent text-white rounded-lg flex items-center justify-center font-display font-bold text-lg">
                    {step.letter}
                  </span>
                  <span className="font-display font-bold text-white text-lg">{step.word}</span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SERVICES PREVIEW ===== */}
      <section className="py-20 md:py-28 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-body font-semibold tracking-widest uppercase text-accent mb-4">
              How We Work
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
              Engagement models <span className="italic text-accent">built for results.</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Every engagement follows our ASCEND&#8482; methodology. Choose the depth
              that matches where you are today.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "AI Readiness Scan",
                price: "Starting at $3,500",
                duration: "2-week engagement",
                desc: "Find out exactly where AI fits and what's blocking you.",
                features: ["ASCEND\u2122 Assessment across 10 dimensions", "Executive AI Readiness Briefing", "Prioritized roadmap with quick wins", "Risk and governance gap analysis"],
                best: "Teams exploring AI for the first time",
                popular: false,
              },
              {
                name: "AI Strategy Sprint",
                price: "Starting at $10,000",
                duration: "30-day engagement",
                desc: "A complete AI playbook with a 90-day execution plan.",
                features: ["Everything in Readiness Scan", "Detailed 30/60/90-day plan", "Vendor-agnostic tool recommendations", "Workforce enablement roadmap", "Governance framework template"],
                best: "Organizations that need a structured execution plan",
                popular: true,
              },
              {
                name: "AI Pilot Program",
                price: "Starting at $25,000",
                duration: "90-day engagement",
                desc: "Strategy plus hands-on implementation of your first AI workflow.",
                features: ["Everything in Strategy Sprint", "Production-ready AI agent workflow", "Human-in-the-loop oversight setup", "Team training and SOPs", "30-day post-launch support"],
                best: "Teams that want AI running this quarter",
                popular: false,
              },
            ].map((tier) => (
              <div key={tier.name} className={`relative flex flex-col bg-white rounded-xl p-7 card-hover ${tier.popular ? "border-2 border-accent shadow-lg shadow-accent/10" : "border border-gray-200"}`}>
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent text-white text-xs font-bold rounded-full tracking-wide">
                    Most Popular
                  </div>
                )}
                <h3 className="font-display text-lg font-bold text-gray-900 mb-1">{tier.name}</h3>
                <p className="text-accent font-bold text-sm mb-0.5">{tier.price}</p>
                <p className="text-xs text-gray-400 mb-4">{tier.duration}</p>
                <p className="text-sm text-gray-600 mb-5 leading-relaxed">{tier.desc}</p>
                <ul className="space-y-2.5 mb-6 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-gray-400 mb-4">Best for: {tier.best}</p>
                <Link href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className={tier.popular ? "btn-primary text-sm justify-center" : "btn-outline text-sm justify-center"}>
                  Discuss This Option
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-display font-bold text-gray-900">AI Advisory Retainer</h4>
              <p className="text-sm text-gray-500">Ongoing strategy sessions, governance oversight, and scaling support. From $5,000/month.</p>
            </div>
            <Link href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="btn-outline text-sm whitespace-nowrap">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* ===== HOW WE HELP (with photo) ===== */}
      <section className="py-20 md:py-28 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-body font-semibold tracking-widest uppercase text-accent mb-4">
              How We Help
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
              AI strategy that connects to <span className="italic text-accent">real outcomes.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-14">
            {[
              {
                icon: Brain,
                industry: "Healthcare Organizations",
                focus: "Better outcomes, less burnout",
                desc: "We map clinical workflows, identify where AI creates the most value for patient outcomes, and build governance-first implementations.",
                img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80&auto=format",
              },
              {
                icon: Building2,
                industry: "Mid-Market Companies",
                focus: "From idea to production in 90 days",
                desc: "Our ASCEND assessment pinpoints the highest-impact workflows, then we build a 90-day plan to get your first AI workflow live.",
                img: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80&auto=format",
              },
              {
                icon: Users,
                industry: "Associations & Nonprofits",
                focus: "Multiply impact without adding headcount",
                desc: "We identify the repetitive work eating your team's time and build AI workflows that give you capacity back.",
                img: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&q=80&auto=format",
              },
            ].map((v) => (
              <div key={v.industry} className="bg-white rounded-xl border border-gray-200 overflow-hidden group card-hover">
                <div className="aspect-[16/10] overflow-hidden">
                  <img src={v.img} alt={v.industry} className="w-full h-full object-cover img-grayscale group-hover:scale-[1.03] transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <h3 className="font-display font-bold text-gray-900 mb-2">{v.industry}</h3>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">{v.desc}</p>
                  <div className="text-sm font-semibold text-accent">{v.focus}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Testimonials */}
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                quote: "Jermaine brought a level of structure and rigor we hadn't experienced before. He understood our compliance requirements from day one and focused entirely on what would actually move the needle for us.",
                role: "Managing Partner",
                org: "Healthcare Practice Group",
              },
              {
                quote: "We went from talking about AI to having a real plan in weeks. The governance framework alone changed how our leadership thinks about responsible technology adoption.",
                role: "COO",
                org: "Professional Services Firm",
              },
            ].map((t, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-7">
                <div className="w-8 h-1 bg-accent rounded mb-5" />
                <p className="text-gray-700 italic leading-relaxed mb-5">"{t.quote}"</p>
                <div>
                  <div className="text-sm font-semibold text-gray-900">{t.role}</div>
                  <div className="text-xs text-gray-500">{t.org}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== INDUSTRIES ===== */}
      <section className="py-20 md:py-28 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-body font-semibold tracking-widest uppercase text-accent mb-4">
              Industries We Serve
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              AI strategy built for <span className="italic text-accent">your sector.</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { name: "Healthcare", href: "/healthcare", icon: Brain, desc: "HIPAA-conscious AI workflows for providers and health systems" },
              { name: "Enterprise & Mid-Market", href: "/enterprise", icon: Target, desc: "Scalable AI strategy for companies with 50-500 employees" },
              { name: "Associations & Nonprofits", href: "/associations", icon: Users, desc: "Member-focused AI for trade associations and mission-driven orgs" },
              { name: "Small Business & Startups", href: "/services", icon: Sparkles, desc: "Right-sized AI that delivers ROI without enterprise complexity" },
            ].map((v) => (
              <Link key={v.name} href={v.href} className="group bg-white border border-gray-200 rounded-xl p-6 hover:border-accent card-hover">
                <div className="flex items-start justify-between">
                  <div>
                    <v.icon className="w-7 h-7 text-accent mb-3" />
                    <h3 className="font-display font-bold text-gray-900 text-lg mb-1">{v.name}</h3>
                    <p className="text-gray-600 text-sm">{v.desc}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-accent transition-colors mt-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CLIENT WORK ===== */}
      <section className="py-20 md:py-28 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-body font-semibold tracking-widest uppercase text-accent mb-4">
              Client Work
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
              Companies we've <span className="italic text-accent">helped grow.</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
              From product development and platform builds to fractional CTO engagements and AI strategy, we partner with founders and teams to ship real technology.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {[
              {
                name: "Storc",
                type: "Product Build + Fractional CTO + AI Strategy",
                desc: "Built and advised the technology platform for this patented maternal health SaaS startup. Storc connects expecting mothers, healthcare providers, and first responders through a cloud-based patient tracking system for OB-GYN practices.",
                url: "mystorc.com",
                industry: "Healthcare / Maternal Health",
              },
              {
                name: "Runwei",
                type: "Product Build + Fractional CTO + AI Strategy",
                desc: "Developed and provided strategic technology leadership for this AI-powered capital access platform. Runwei helps underrepresented entrepreneurs search, apply to, and track non-dilutive funding opportunities through a chat-based, multilingual interface.",
                url: "runwei.io",
                industry: "Fintech / Economic Mobility",
              },
              {
                name: "Dove Youthology Aesthetic Institute",
                type: "Fractional CTO",
                desc: "Serving as Fractional CTO for this med spa practice. Implemented marketing automation flows, integrated scheduling and CRM systems, and rolling out ASCEND Content Manager as the first med spa client on the platform.",
                url: "",
                industry: "Healthcare / Aesthetics",
              },
              {
                name: "QAPC Global",
                type: "Product Build",
                desc: "Designed and built the web presence for this global quality assurance and professional consulting firm, including scheduling integration and brand positioning for international audiences.",
                url: "qapc-global.com",
                industry: "Professional Services / Consulting",
              },
            ].map((client) => (
              <div key={client.name} className="bg-white rounded-xl border border-gray-200 p-7 card-hover">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-gray-400 tracking-wider uppercase">{client.industry}</span>
                </div>
                <h3 className="font-display text-xl font-bold text-gray-900 mb-1">{client.name}</h3>
                <p className="text-sm font-semibold text-accent mb-3">{client.type}</p>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">{client.desc}</p>
                {client.url && (
                  <a href={`https://${client.url}`} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-gray-400 hover:text-accent transition-colors inline-flex items-center gap-1.5">
                    {client.url}
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section className="relative py-16 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80&auto=format"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gray-900/88" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "$2B+", label: "Programs Managed" },
              { value: "15+", label: "Years Tech Leadership" },
              { value: "90", label: "Days to First AI Workflow" },
              { value: "10", label: "ASCEND\u2122 Dimensions" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl md:text-4xl font-display font-bold text-accent mb-1">{s.value}</div>
                <div className="text-sm text-gray-400">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="py-20 md:py-28 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
            Ready to deploy AI <span className="italic text-accent">with confidence?</span>
          </h2>
          <p className="text-lg text-gray-600 mb-10 max-w-lg mx-auto leading-relaxed">
            Take our free 5-minute assessment to find out exactly where AI
            can help, and what to do first.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/assessment" className="btn-primary text-base">
              Start Free Assessment
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="btn-outline text-base">
              Book Strategy Briefing
            </Link>
          </div>
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-400">
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> 5 minutes</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Free report</span>
            <span className="flex items-center gap-1.5"><Shield className="w-4 h-4" /> No spam</span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
