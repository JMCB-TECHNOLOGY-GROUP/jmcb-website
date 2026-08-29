"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { COHORT, SESSION_DAY, SESSION_TIME, formatSessionDate } from "@/lib/program";

// Client island for the otherwise-static /program page. Mirrors the contact
// form's bot screening (hidden honeypot + form-load timestamp, see
// lib/bot-check) — keep both in step if that changes.
export default function ApplyForm() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    organization: "",
    role: "",
    realTask: "",
    motivation: "",
    referral: "",
  });
  const [capstoneInterest, setCapstoneInterest] = useState(false);
  const [canAttend, setCanAttend] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");
  const [website, setWebsite] = useState("");
  const [formStartedAt] = useState(() => Date.now());

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/program/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          tier: capstoneInterest ? "capstone_interest" : "core",
          canAttend,
          website,
          formStartedAt,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      setStatus("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-10 text-center">
        <CheckCircle2 className="w-12 h-12 text-accent mx-auto mb-5" />
        <h3 className="font-display text-2xl font-bold text-gray-900 mb-3">Application received</h3>
        <p className="text-gray-600 leading-relaxed max-w-md mx-auto">
          Check your inbox for a confirmation. Applications close{" "}
          {formatSessionDate(COHORT.applicationsClose)}, and everyone hears back within a week of
          that — accepted or not.
        </p>
        <p className="text-gray-600 leading-relaxed max-w-md mx-auto mt-4">
          Between now and then, start timing that task. You will need the baseline in week one.
        </p>
      </div>
    );
  }

  const field =
    "w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-accent";
  const label = "block text-sm font-semibold text-gray-900 mb-2";

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-10 space-y-5">
      {/* Honeypot — hidden from real users, see lib/bot-check */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className={label} htmlFor="firstName">First name</label>
          <input id="firstName" required value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })} className={field} />
        </div>
        <div>
          <label className={label} htmlFor="lastName">Last name</label>
          <input id="lastName" required value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })} className={field} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className={label} htmlFor="email">Email</label>
          <input id="email" type="email" required value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} className={field} />
        </div>
        <div>
          <label className={label} htmlFor="phone">
            Phone <span className="font-normal text-gray-400">optional</span>
          </label>
          <input id="phone" type="tel" value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })} className={field} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className={label} htmlFor="location">
            City / country <span className="font-normal text-gray-400">optional</span>
          </label>
          <input id="location" value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })} className={field} />
        </div>
        <div>
          <label className={label} htmlFor="organization">
            Where you work or study <span className="font-normal text-gray-400">optional</span>
          </label>
          <input id="organization" value={form.organization}
            onChange={(e) => setForm({ ...form, organization: e.target.value })} className={field} />
        </div>
      </div>

      <div>
        <label className={label} htmlFor="role">
          What you do there <span className="font-normal text-gray-400">optional</span>
        </label>
        <input id="role" value={form.role} placeholder="Student, care assistant, office manager, unemployed and retraining…"
          onChange={(e) => setForm({ ...form, role: e.target.value })} className={field} />
      </div>

      {/* The question that decides the application. Everything a participant
          builds over eight weeks attaches to the task they name here. */}
      <div>
        <label className={label} htmlFor="realTask">
          Name one recurring task you personally do at least weekly, and roughly how long it takes.
        </label>
        <p className="text-sm text-gray-500 mb-2 leading-relaxed">
          This is the part that matters. It does not need to be technical or impressive — chasing
          invoices, writing the same report, sorting a rota, answering the same twelve emails. Every
          project you build in the eight weeks attaches to this task.
        </p>
        <textarea id="realTask" required rows={5} minLength={20} maxLength={2000} value={form.realTask}
          onChange={(e) => setForm({ ...form, realTask: e.target.value })} className={field} />
      </div>

      <div>
        <label className={label} htmlFor="motivation">
          Why now? <span className="font-normal text-gray-400">optional</span>
        </label>
        <textarea id="motivation" rows={3} maxLength={2000} value={form.motivation}
          onChange={(e) => setForm({ ...form, motivation: e.target.value })} className={field} />
      </div>

      <div>
        <label className={label} htmlFor="referral">
          How did you hear about this? <span className="font-normal text-gray-400">optional</span>
        </label>
        <input id="referral" value={form.referral}
          onChange={(e) => setForm({ ...form, referral: e.target.value })} className={field} />
      </div>

      <label className="flex gap-3 items-start cursor-pointer">
        <input type="checkbox" required checked={canAttend} onChange={(e) => setCanAttend(e.target.checked)}
          className="mt-1 w-4 h-4 accent-[#D97706]" />
        <span className="text-sm text-gray-700 leading-relaxed">
          I can attend live on {SESSION_DAY}s, {SESSION_TIME}, and can put aside about four hours a
          week for the eight weeks.
        </span>
      </label>

      <label className="flex gap-3 items-start cursor-pointer">
        <input type="checkbox" checked={capstoneInterest} onChange={(e) => setCapstoneInterest(e.target.checked)}
          className="mt-1 w-4 h-4 accent-[#D97706]" />
        <span className="text-sm text-gray-700 leading-relaxed">
          Tell me about the paid Capstone track later. <span className="text-gray-500">Ticking this
          changes nothing about your free place — Capstone is applied for separately after week six.</span>
        </span>
      </label>

      {status === "error" && (
        <p className="text-sm text-red-600" role="alert">{error}</p>
      )}

      <button type="submit" disabled={status === "sending"}
        className="btn-primary w-full text-base disabled:opacity-60 disabled:cursor-not-allowed">
        {status === "sending" ? "Sending…" : "Apply for a place"}
        {status !== "sending" && <ArrowRight className="w-5 h-5" />}
      </button>

      <p className="text-xs text-gray-500 text-center leading-relaxed">
        Free, and it stays free. We will email you about this programme and nothing else unless you
        ask. {COHORT.seats} places in {COHORT.label}.
      </p>
    </form>
  );
}
