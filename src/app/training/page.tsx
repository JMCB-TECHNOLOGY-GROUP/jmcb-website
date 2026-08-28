"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Bot,
  Layers,
  Cloud,
  ShieldCheck,
  Users,
  Presentation,
  GraduationCap,
  BookOpen,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { CALENDLY_URL } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";

// Curriculum tracks. The Claude/agentic track is the one carrying delivery
// evidence — the Microsoft and cloud tracks are taught, but deliberately make
// no portfolio claim. Keep that split when editing: the proof section below is
// what makes the rest of this page credible.
const tracks = [
  {
    icon: Bot,
    name: "Claude & Agentic AI",
    tag: "Flagship",
    desc: "The track we are known for. Prompting as an engineering discipline, tool design and MCP, agent orchestration, context management, and the evaluation habits that keep an agent honest in production.",
    outcomes: [
      "Prompting and structured output as repeatable patterns",
      "Tool design and MCP connectors against real systems",
      "Agent orchestration and human-in-the-loop control",
      "Evaluating and monitoring what you shipped",
    ],
  },
  {
    icon: Layers,
    name: "Microsoft 365, Copilot & Power Platform",
    tag: "",
    desc: "For organisations already standardised on Microsoft. Where Copilot genuinely saves time, where it does not, and how to build low-code automation your team can maintain after we leave.",
    outcomes: [
      "Copilot adoption that survives past week three",
      "Power Automate flows for real back-office work",
      "Power Apps for internal tools, with governance",
      "Choosing low-code vs. custom, honestly",
    ],
  },
  {
    icon: Cloud,
    name: "Azure & Cloud Foundations",
    tag: "",
    desc: "The cloud literacy a team needs before it can run AI responsibly: identity, data residency, cost control, and the difference between a demo environment and one you can put a regulator in front of.",
    outcomes: [
      "Identity, access and secrets handling",
      "Data residency and tenancy decisions",
      "Cost visibility before the invoice arrives",
      "What production actually requires",
    ],
  },
  {
    icon: ShieldCheck,
    name: "AI Governance & Readiness",
    tag: "",
    desc: "The track most training programmes skip. How to assess readiness, write usable policy, and stand up oversight aligned to the NIST AI Risk Management Framework — without stopping the work.",
    outcomes: [
      "Readiness assessment across the ASCEND dimensions",
      "Acceptable-use and disclosure policy people follow",
      "NIST AI RMF-aligned oversight practices",
      "Board and executive reporting that lands",
    ],
  },
];

const formats = [
  {
    icon: Presentation,
    name: "Executive Briefing",
    duration: "Single session",
    desc: "For leadership teams that need to make a decision, not learn to prompt. What is real, what is hype, what it costs, and what to do first.",
    best: "Boards, executive teams, ministry and agency leadership",
  },
  {
    icon: Users,
    name: "Team Workshop",
    duration: "Half or full day",
    desc: "Hands-on, using your own systems and your own work. Teams leave with working automations they built themselves, not notes about someone else's.",
    best: "Departments rolling AI out to staff this quarter",
  },
  {
    icon: GraduationCap,
    name: "Multi-Week Cohort",
    duration: "Multi-week",
    desc: "Weekly live sessions plus build time. Every participant ships something real and presents it at a graduation. We document the outcomes — that record is the point.",
    best: "Workforce programmes, youth initiatives, internal academies",
  },
  {
    icon: BookOpen,
    name: "Certification Prep",
    duration: "Scoped per cohort",
    desc: "Structured preparation for Anthropic's practitioner certifications, mapped to your own repositories rather than generic exercises. Exam fees are not included.",
    // GATE: this offer is sold only once JMCB holds the practitioner
    // certifications itself. Do not promote it before then.
    best: "Firms building a certified delivery bench",
  },
];

export default function TrainingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1920&q=80&auto=format"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-900/80 to-gray-900/70" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-32 pb-20">
          <p className="text-accent font-body font-semibold text-sm tracking-widest uppercase mb-6">
            Training &amp; Enablement
          </p>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.08] mb-6">
            We teach the work
            <br />
            <span className="text-accent italic">we actually do.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-xl leading-relaxed mb-10">
            We have run digital-skills cohorts for returning citizens under a county behavioural health programme, and
            taken summer interns through a full AI curriculum. We also build the production systems we teach from.
            Your team leaves having built something, not having watched someone build something.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-base"
              onClick={() => trackEvent("calendly_click", { location: "training_hero" })}
            >
              Discuss a Programme
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/assessment" className="btn-outline-white text-base">
              Take Free AI Assessment
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Why us */}
      <section className="py-20 md:py-28 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-body font-semibold tracking-widest uppercase text-accent mb-4">
              Why This Is Different
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
              AI literacy is free everywhere.
              <br />
              <span className="italic text-accent">Shipping is not.</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              You can learn what a large language model is from countless free courses. What almost nobody teaches is
              the part that fails: connecting a model to your real data, keeping it accountable, and getting it past
              the people who have to sign for it.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Built from live systems",
                desc: "Our teaching examples are our own production code — content automation, legislative intelligence, public-health tooling, civic platforms. Not toy exercises.",
              },
              {
                title: "Governance is in the room",
                desc: "We teach oversight alongside capability. Teams that only learn the fun half get stopped by risk and legal soon after.",
              },
              {
                title: "Everyone ships",
                desc: "Every format ends with something built and working, and cohorts end with a graduation. We document what each participant produced, because that record is what proves the training worked.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-gray-50 rounded-xl p-7 border border-gray-200">
                <h3 className="font-display font-bold text-gray-900 text-lg mb-3">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tracks */}
      <section className="py-20 md:py-28 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-body font-semibold tracking-widest uppercase text-accent mb-4">Curriculum</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
              Tracks, <span className="italic text-accent">mixed to fit you.</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Nobody needs all of them. We scope from where your team actually is, and say so when a track is not
              worth your money.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {tracks.map((track) => (
              <div key={track.name} className="flex flex-col bg-white rounded-xl p-7 border border-gray-200 card-hover">
                <div className="flex items-start justify-between mb-3">
                  <track.icon className="w-7 h-7 text-accent" />
                  {track.tag && (
                    <span className="px-3 py-1 bg-accent/10 text-accent text-xs font-bold rounded-full tracking-wide">
                      {track.tag}
                    </span>
                  )}
                </div>
                <h3 className="font-display text-lg font-bold text-gray-900 mb-3">{track.name}</h3>
                <p className="text-sm text-gray-600 mb-5 leading-relaxed">{track.desc}</p>
                <ul className="space-y-2.5 mt-auto">
                  {track.outcomes.map((o) => (
                    <li key={o} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                      {o}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Proof */}
      <section className="py-20 md:py-28 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-body font-semibold tracking-widest uppercase text-accent mb-4">
              Work We Have Done
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
              We have taught the people
              <br />
              <span className="italic text-accent">most programmes give up on.</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Before this was a service line, it was a standing contract teaching technology to people rebuilding
              their lives. That is where our teaching method comes from, and it is a harder room than any corporate
              training suite.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {[
              {
                title: "The Damascus House Digital Literacy Program",
                desc: "Our founder was contracted as Computer and Technology Trainer to Damascus House Community Development Corporation's RISTORe Program in Largo, Maryland — running digital-skills cohorts for returning citizens under the Prince George's County Health Department's behavioural health reentry programme. Participants were issued equipment, sat a final exam, and graduated at a ceremony.",
              },
              {
                title: "A graduate came back as a co-instructor",
                desc: "One participant finished the programme, kept going, and returned to teach alongside our founder. He later wrote a letter of support in his own name. Of everything on this page, that is the outcome we would point to first.",
              },
              {
                title: "Delivered inside a government-funded programme",
                desc: "The work ran under county behavioural health funding, to a schedule, with invoicing, safeguarding and reporting attached. It ended when county-level funding arrangements changed — not for want of results. We know how public-sector training programmes are actually run and paid for, because we have been inside one.",
              },
              {
                title: "We have trained young people, not only adults",
                desc: "As a host employer for a summer youth employment programme, we took our interns through Anthropic's AI curriculum to completion inside the placement, alongside real project work.",
              },
              {
                title: "Anthropic Claude Partner Network",
                desc: "JMCB Technology Group is a member of Anthropic's partner network for Claude implementation. Our founder has completed Anthropic's AI Fluency, Claude API, Model Context Protocol and Agent Skills courses.",
              },
              {
                title: "Curriculum drawn from production work",
                desc: "Teaching material comes from systems we build and run: a Claude-powered content platform, legislative and grants intelligence tools, a civic services platform for a US city agency, and public-health and maritime tooling for the Caribbean. We also run our own NIST AI Risk Management Framework readiness tooling and teach from what it surfaced.",
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-4">
                <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-1" />
                <div>
                  <h3 className="font-display font-bold text-gray-900 mb-1.5">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-sm text-gray-500 max-w-3xl mx-auto text-center leading-relaxed">
            We list what we hold, not what it implies. Anthropic Academy courses are completed coursework rather than
            proctored certification, and we say so rather than blur the two. References for the Damascus House work
            are available on request, and if a claim matters to your procurement, ask and we will send the evidence.
          </p>
        </div>
      </section>

      {/* Formats */}
      <section className="py-20 md:py-28 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-body font-semibold tracking-widest uppercase text-accent mb-4">Formats</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
              From a single briefing <span className="italic text-accent">to a full cohort.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {formats.map((format) => (
              <div key={format.name} className="flex flex-col bg-white rounded-xl p-7 border border-gray-200 card-hover">
                <format.icon className="w-7 h-7 text-accent mb-3" />
                <h3 className="font-display text-lg font-bold text-gray-900 mb-1">{format.name}</h3>
                <p className="text-xs text-gray-400 mb-4">{format.duration}</p>
                <p className="text-sm text-gray-600 mb-5 leading-relaxed flex-1">{format.desc}</p>
                <p className="text-xs text-gray-400">Best for: {format.best}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Public sector / workforce */}
      <section className="py-20 md:py-28 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-body font-semibold tracking-widest uppercase text-accent mb-4">
            Governments &amp; Workforce Programmes
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-6">
            We build cohorts for
            <br />
            <span className="italic text-accent">ministries and youth programmes.</span>
          </h2>
          <p className="text-gray-600 leading-relaxed mb-8">
            AI capability is arriving in most countries faster than the skills to govern or use it. We design and run
            youth and public-servant cohorts that end in published, verifiable work — participants finishing with a
            registered business, a working automation, or a delivered tool, and a documented record of what each one
            produced. That record is what turns a pilot into a funded programme.
          </p>
          <Link
            href="/contact"
            className="btn-outline text-base"
            onClick={() => trackEvent("training_public_sector_click", { location: "training_gov" })}
          >
            Talk about a national or agency cohort
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 px-4 bg-gray-900">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white leading-tight mb-6">
            Tell us who needs to learn what.
          </h2>
          <p className="text-gray-300 leading-relaxed mb-10">
            Thirty minutes is enough to scope a programme, or to tell you that you do not need one. We will say which
            it is.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-base"
              onClick={() => trackEvent("calendly_click", { location: "training_cta" })}
            >
              Book a Scoping Call
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/contact" className="btn-outline-white text-base">
              Send Us a Note
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
