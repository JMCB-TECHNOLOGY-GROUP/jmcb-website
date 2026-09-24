"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import {
  CONTACT_METHODS,
  EXAMS,
  EXPERIENCE_LEVELS,
  PATHS,
  TIMEZONES,
  type ExamValue,
  type PathValue,
} from "@/lib/certification";

// Client island for /certification/intake. Same bot screening as the
// programme form (hidden honeypot + form-load timestamp, see lib/bot-check).
export default function IntakeForm({ initialPath }: { initialPath: PathValue }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    timezone: "",
    organization: "",
    role: "",
    linkedin: "",
    github: "",
    targetExamDate: "",
    addressRequest: "",
    goal: "",
  });
  const [path, setPath] = useState<PathValue>(initialPath);
  const [exam, setExam] = useState<ExamValue>("ccdv_f");
  const [experience, setExperience] = useState("some");
  const [preferredContact, setPreferredContact] = useState<(typeof CONTACT_METHODS)[number]>("text");
  const [hoursPerWeek, setHoursPerWeek] = useState(6);
  const [smsOk, setSmsOk] = useState(true);
  const [acknowledgeFee, setAcknowledgeFee] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");
  const [website, setWebsite] = useState("");
  const [formStartedAt] = useState(() => Date.now());

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [k]: e.target.value });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/certification/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          addressRequest: path === "associate" ? form.addressRequest : "",
          path,
          exam,
          experience,
          preferredContact,
          hoursPerWeek,
          smsOk,
          acknowledgeFee,
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
        <h3 className="font-display text-2xl font-bold text-gray-900 mb-3">Got it</h3>
        <p className="text-gray-600 leading-relaxed max-w-md mx-auto">
          Check your inbox for a confirmation. {path === "associate"
            ? "Your associate agreement comes next."
            : "The Sprint fee and payment link come next."}
        </p>
      </div>
    );
  }

  const field =
    "w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-accent bg-white";
  const label = "block text-sm font-semibold text-gray-900 mb-2";
  const opt = <span className="font-normal text-gray-400">optional</span>;

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-10 space-y-6">
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off"
          value={website} onChange={(e) => setWebsite(e.target.value)} />
      </div>

      <fieldset>
        <legend className={label}>Which path are you on?</legend>
        <div className="grid gap-3">
          {PATHS.map((p) => (
            <label key={p.value}
              className={`flex gap-3 items-start p-4 rounded-lg border cursor-pointer ${path === p.value ? "border-accent bg-amber-50" : "border-gray-200"}`}>
              <input type="radio" name="path" value={p.value} checked={path === p.value}
                onChange={() => setPath(p.value)} className="mt-1 accent-[#D97706]" />
              <span>
                <span className="block text-sm font-semibold text-gray-900">{p.label}</span>
                <span className="block text-sm text-gray-600 leading-relaxed">{p.desc}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className={label} htmlFor="firstName">Legal first name</label>
          <input id="firstName" required autoComplete="given-name" value={form.firstName} onChange={set("firstName")} className={field} />
        </div>
        <div>
          <label className={label} htmlFor="lastName">Legal last name</label>
          <input id="lastName" required autoComplete="family-name" value={form.lastName} onChange={set("lastName")} className={field} />
        </div>
      </div>
      <p className="text-xs text-gray-500 -mt-3">Use the name on your ID. The exam is proctored and checks it.</p>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className={label} htmlFor="email">Personal email</label>
          <input id="email" type="email" required autoComplete="email" value={form.email} onChange={set("email")} className={field} />
        </div>
        <div>
          <label className={label} htmlFor="phone">Cell phone</label>
          <input id="phone" type="tel" required minLength={7} autoComplete="tel" placeholder="+1 301 555 0123"
            value={form.phone} onChange={set("phone")} className={field} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className={label} htmlFor="preferredContact">Best way to reach you</label>
          <select id="preferredContact" value={preferredContact}
            onChange={(e) => setPreferredContact(e.target.value as (typeof CONTACT_METHODS)[number])} className={field}>
            <option value="text">Text</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="call">Phone call</option>
            <option value="email">Email</option>
          </select>
        </div>
        <label className="flex gap-3 items-center cursor-pointer sm:pt-7">
          <input type="checkbox" checked={smsOk} onChange={(e) => setSmsOk(e.target.checked)} className="w-4 h-4 accent-[#D97706]" />
          <span className="text-sm text-gray-700">It&apos;s OK to text me about the track</span>
        </label>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className={label} htmlFor="location">City, state / country</label>
          <input id="location" required value={form.location} onChange={set("location")} className={field} />
        </div>
        <div>
          <label className={label} htmlFor="timezone">Time zone</label>
          <select id="timezone" required value={form.timezone} onChange={set("timezone")} className={field}>
            <option value="" disabled>Choose…</option>
            {TIMEZONES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className={label} htmlFor="organization">Where you work or study {opt}</label>
          <input id="organization" value={form.organization} onChange={set("organization")} className={field} />
        </div>
        <div>
          <label className={label} htmlFor="role">Your role there {opt}</label>
          <input id="role" value={form.role} onChange={set("role")} className={field} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className={label} htmlFor="linkedin">LinkedIn URL {opt}</label>
          <input id="linkedin" value={form.linkedin} onChange={set("linkedin")} className={field} />
        </div>
        <div>
          <label className={label} htmlFor="github">GitHub username {opt}</label>
          <input id="github" value={form.github} onChange={set("github")} className={field} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className={label} htmlFor="exam">Which exam?</label>
          <select id="exam" value={exam} onChange={(e) => setExam(e.target.value as ExamValue)} className={field}>
            {EXAMS.map((x) => <option key={x.value} value={x.value}>{x.label}</option>)}
          </select>
        </div>
        <div>
          <label className={label} htmlFor="targetExamDate">Target exam date {opt}</label>
          <input id="targetExamDate" type="date" value={form.targetExamDate} onChange={set("targetExamDate")} className={field} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className={label} htmlFor="experience">Where you are today</label>
          <select id="experience" value={experience} onChange={(e) => setExperience(e.target.value)} className={field}>
            {EXPERIENCE_LEVELS.map((x) => <option key={x.value} value={x.value}>{x.label}</option>)}
          </select>
        </div>
        <div>
          <label className={label} htmlFor="hoursPerWeek">Hours a week you can study</label>
          <input id="hoursPerWeek" type="number" min={1} max={40} required value={hoursPerWeek}
            onChange={(e) => setHoursPerWeek(Number(e.target.value))} className={field} />
        </div>
      </div>

      {path === "associate" && (
        <div>
          <label className={label} htmlFor="addressRequest">Preferred jmcbtech.com address {opt}</label>
          <div className="flex items-center gap-2">
            <input id="addressRequest" value={form.addressRequest} onChange={set("addressRequest")}
              placeholder="first.last" pattern="[A-Za-z0-9._-]*" className={field} />
            <span className="text-sm text-gray-500 whitespace-nowrap">@jmcbtech.com</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Issued after the associate agreement is signed.</p>
        </div>
      )}

      <div>
        <label className={label} htmlFor="goal">What do you want the certification to do for you?</label>
        <textarea id="goal" required rows={4} minLength={10} maxLength={2000} value={form.goal} onChange={set("goal")} className={field} />
      </div>

      <label className="flex gap-3 items-start cursor-pointer">
        <input type="checkbox" required checked={acknowledgeFee} onChange={(e) => setAcknowledgeFee(e.target.checked)}
          className="mt-1 w-4 h-4 accent-[#D97706]" />
        <span className="text-sm text-gray-700 leading-relaxed">
          I understand the exam fee ($125) is paid by me directly to Anthropic when I book, and that no
          one can buy exam access for me.
        </span>
      </label>

      {status === "error" && <p className="text-sm text-red-600" role="alert">{error}</p>}

      <button type="submit" disabled={status === "sending"}
        className="btn-primary w-full text-base disabled:opacity-60 disabled:cursor-not-allowed">
        {status === "sending" ? "Sending…" : "Send my details"}
        {status !== "sending" && <ArrowRight className="w-5 h-5" />}
      </button>

      <p className="text-xs text-gray-500 text-center leading-relaxed">
        Used only to run your certification track. Nothing is charged by this form.
      </p>
    </form>
  );
}
