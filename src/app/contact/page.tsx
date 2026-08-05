"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Mail, CheckCircle2, Clock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CALENDLY_URL } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", organization: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  // Bot screening: hidden honeypot field + form-load timestamp (see lib/bot-check)
  const [website, setWebsite] = useState("");
  const [formStartedAt] = useState(() => Date.now());

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, website, formStartedAt }),
      });
      if (!res.ok) throw new Error();
      trackEvent("contact_submitted");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="pt-32 pb-20 px-4">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-body font-semibold tracking-widest uppercase text-accent mb-4">
            Contact
          </p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
            Tell us what you&apos;re <span className="italic text-accent">working on.</span>
          </h1>
          <p className="text-gray-600 leading-relaxed mb-10">
            Not ready for the assessment or a call yet? Send a note — Jermaine reads
            every message and replies within one business day.
          </p>

          {status === "sent" ? (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
              <CheckCircle2 className="w-10 h-10 text-accent mx-auto mb-4" />
              <h2 className="font-display text-xl font-bold text-gray-900 mb-2">Message sent.</h2>
              <p className="text-sm text-gray-600 mb-6">
                You&apos;ll hear back within one business day. Want to move faster?
              </p>
              <Link href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm" onClick={() => trackEvent("calendly_click", { location: "contact_success" })}>
                Book a Strategy Briefing
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Honeypot — hidden from real users; bots auto-fill it */}
              <div style={{ position: "absolute", left: "-9999px", top: "auto" }} aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">Name *</label>
                  <input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-accent" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Work email *</label>
                  <input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-accent" />
                </div>
              </div>
              <div>
                <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-1.5">Organization</label>
                <input id="organization" value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-accent" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1.5">What are you trying to accomplish? *</label>
                <textarea id="message" required rows={5} maxLength={5000} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-accent" />
              </div>
              {status === "error" && (
                <p className="text-sm text-red-600">Something went wrong — please try again or email jermaine@jmcbtech.com directly.</p>
              )}
              <button type="submit" disabled={status === "sending"} className="btn-primary text-sm disabled:opacity-60">
                {status === "sending" ? "Sending…" : "Send Message"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <div className="mt-10 flex flex-col sm:flex-row gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-accent" />
              <a href="mailto:jermaine@jmcbtech.com" className="hover:text-gray-900 transition-colors">jermaine@jmcbtech.com</a>
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-accent" />
              Replies within one business day
            </span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
