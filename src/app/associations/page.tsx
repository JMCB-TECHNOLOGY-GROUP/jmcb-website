"use client";

import Link from "next/link";
import { ArrowRight, Users, Megaphone, FileText, Calendar, CheckCircle2, Zap, BarChart3, Clock, MessageSquare } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const CALENDLY_URL = "https://calendly.com/jermaine-jmcbtech/ai-strategy-ai-agents-consultation";

export default function AssociationsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1920&q=80&auto=format" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-900/80 to-gray-900/70" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-32 pb-20">
          <p className="text-accent font-body font-semibold text-sm tracking-widest uppercase mb-6">Associations & Nonprofits</p>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.08] mb-6">
            Your team of five does the
            <br />
            <span className="text-accent italic">work of fifty.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-xl leading-relaxed mb-10">
            AI won't replace your team's passion. It'll multiply their capacity. We help associations and nonprofits automate the repetitive work so your people can focus on the mission that brought them here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="btn-primary text-base">
              Schedule Consultation
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/assessment" className="btn-outline-white text-base">
              Take Free AI Assessment
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* The Problem */}
      <section className="py-20 md:py-28 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-body font-semibold tracking-widest uppercase text-accent mb-4">The Challenge</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-6">
                Same mission. <span className="italic text-accent">Half the resources.</span>
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Your members expect more communication, more events, more advocacy, and more value. Your budget didn't grow. Your team didn't grow. But expectations did.
                </p>
                <p>
                  Meanwhile, someone on your team is spending 15 hours a week on member emails. Someone else is manually updating spreadsheets that should talk to each other. And that content calendar? It's always behind because creating quality content takes time nobody has.
                </p>
                <p className="font-semibold text-gray-800">
                  AI changes that equation. Not by replacing people, but by giving your team back the hours they're losing to repetitive work.
                </p>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden border border-gray-200">
              <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&q=80&auto=format" alt="Team collaboration" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* What AI Can Do */}
      <section className="py-20 md:py-28 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-body font-semibold tracking-widest uppercase text-accent mb-4">Where AI Helps Most</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
              Multiply impact <span className="italic text-accent">without adding headcount.</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Megaphone,
                title: "Member Communications",
                before: "15+ hours/week writing emails, newsletters, and updates",
                after: "AI drafts personalized content in your voice. Your team reviews and sends. Same quality, fraction of the time.",
              },
              {
                icon: FileText,
                title: "Content Creation",
                before: "Content calendar always behind. Blog posts, social media, event promos competing for the same hours",
                after: "AI generates first drafts, repurposes content across channels, and keeps your calendar on track without burning out your comms team.",
              },
              {
                icon: Calendar,
                title: "Event Management",
                before: "Manual registration tracking, follow-ups, and post-event surveys eating up staff time",
                after: "Automated workflows handle registration confirmations, reminders, follow-ups, and feedback collection. Your team focuses on the experience.",
              },
              {
                icon: Users,
                title: "Member Engagement",
                before: "One-size-fits-all outreach. Low open rates. Members feel like a number",
                after: "AI segments members by interest, engagement level, and behavior. Personalized outreach that feels human because your team still drives the strategy.",
              },
              {
                icon: BarChart3,
                title: "Reporting & Insights",
                before: "Hours spent pulling data from multiple systems for board reports",
                after: "AI aggregates data across platforms and generates board-ready reports. Your team adds context and narrative, not formatting.",
              },
              {
                icon: MessageSquare,
                title: "Member Support",
                before: "Staff answering the same 20 questions over and over by email and phone",
                after: "AI handles routine inquiries instantly. Complex questions route to your team with full context. Members get faster answers. Staff get their time back.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-white border border-gray-200 rounded-xl p-6 card-hover">
                <item.icon className="w-6 h-6 text-accent mb-4" />
                <h3 className="font-display font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-xs font-semibold text-red-500 uppercase tracking-wide mb-1">Before</p>
                <p className="text-sm text-gray-500 mb-3 leading-relaxed">{item.before}</p>
                <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">After</p>
                <p className="text-sm text-gray-700 leading-relaxed">{item.after}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 md:py-28 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-body font-semibold tracking-widest uppercase text-accent mb-4">Right-Sized Engagements</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
              Scoped for mission-driven <span className="italic text-accent">organizations.</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Every engagement is custom-scoped to deliver maximum impact for your organization. We'll discuss investment during our strategy call.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "AI Readiness Scan", price: "", duration: "2 weeks", desc: "Find out where AI can save your team the most time and which workflows to automate first.", popular: false },
              { name: "AI Strategy Sprint", price: "", duration: "30 days", desc: "A complete AI playbook with prioritized workflows, tool recommendations, and a 90-day implementation plan.", popular: true },
              { name: "AI Pilot Program", price: "", duration: "90 days", desc: "Strategy plus hands-on implementation of your first AI workflow with team training and ongoing support.", popular: false },
            ].map((tier) => (
              <div key={tier.name} className={`relative flex flex-col bg-white rounded-xl p-7 card-hover ${tier.popular ? "border-2 border-accent shadow-lg shadow-accent/10" : "border border-gray-200"}`}>
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent text-white text-xs font-bold rounded-full tracking-wide">Most Popular</div>
                )}
                <h3 className="font-display text-lg font-bold text-gray-900 mb-1">{tier.name}</h3>
                {tier.price && <p className="text-accent font-bold text-sm mb-0.5">{tier.price}</p>}
                <p className="text-xs text-gray-400 mb-4">{tier.duration}</p>
                <p className="text-sm text-gray-600 leading-relaxed mb-6 flex-1">{tier.desc}</p>
                <Link href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className={tier.popular ? "btn-primary text-sm justify-center" : "btn-outline text-sm justify-center"}>
                  Discuss This Option
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 px-4 bg-gray-50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
            Your mission deserves <span className="italic text-accent">more capacity.</span>
          </h2>
          <p className="text-lg text-gray-600 mb-10 max-w-lg mx-auto leading-relaxed">
            Let's find the workflows where AI gives your team the most time back. Start with a free assessment or schedule a call.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="btn-primary text-base">Schedule Consultation <ArrowRight className="w-5 h-5" /></Link>
            <Link href="/assessment" className="btn-outline text-base">Take Free Assessment</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
