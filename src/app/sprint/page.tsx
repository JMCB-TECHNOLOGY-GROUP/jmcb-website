"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Clock, Users, Zap, MessageSquare, Calendar, ChevronDown } from "lucide-react";

const agentTypes = [
  {
    name: "Knowledge Bot",
    description: "Answers team questions using your internal docs and SOPs",
    bestFor: "Teams spending 10+ hours/week answering the same questions",
  },
  {
    name: "Sales Prep Agent",
    description: "Researches prospects and generates personalized outreach",
    bestFor: "Sales teams who need faster, better meeting prep",
  },
  {
    name: "Process Automation Agent",
    description: "Handles data entry, reports, and repetitive workflows",
    bestFor: "Ops teams drowning in manual tasks",
  },
  {
    name: "Customer Support Agent",
    description: "Responds to common inquiries and routes complex issues",
    bestFor: "Teams with high ticket volume and slow response times",
  },
  {
    name: "Not sure yet",
    description: "We will help you identify the best fit during the discovery call",
    bestFor: "Teams who know they need AI but are not sure where to start",
  },
];

const faqs = [
  {
    question: "What happens after I apply?",
    answer: "We review every application within 48 hours. If it looks like a fit, we schedule a 30-minute discovery call to discuss your specific situation and scope the project. No commitment until we both agree on deliverables.",
  },
  {
    question: "Do I need technical expertise on my team?",
    answer: "No. We handle all the technical work. Your team just needs to be available for a few hours during the sprint to provide input on workflows and attend training.",
  },
  {
    question: "What if the agent does not work as expected?",
    answer: "We include 30-60-90 days of support depending on your package. If the agent is not delivering value, we will fix it or refund the difference.",
  },
  {
    question: "Can I upgrade to a bigger package later?",
    answer: "Yes. Many clients start with a Starter Sprint and upgrade to Growth or Scale after seeing results. We credit your initial investment toward the upgrade.",
  },
  {
    question: "What tools do you integrate with?",
    answer: "Slack, Teams, Notion, Google Workspace, Salesforce, HubSpot, Zendesk, and most tools with APIs. If you use something else, ask and we will let you know.",
  },
  {
    question: "How is this different from ChatGPT or other AI tools?",
    answer: "ChatGPT is a general tool. We build agents trained on YOUR data, connected to YOUR tools, designed for YOUR workflows. The difference is specificity and integration.",
  },
];

export default function SprintPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
    teamSize: "",
    agentType: "",
    painPoint: "",
    budget: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Submit to Formspree (replace YOUR_FORM_ID with actual form ID)
    try {
      const response = await fetch("https://formspree.io/f/YOUR_FORM_ID", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }

    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-navy py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <img
              src="/logo.png"
              alt="JMCB Technology"
              className="h-10 w-auto"
            />
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-300 hover:text-white text-sm font-medium transition-colors">
              Home
            </Link>
            <Link href="/sprint" className="text-white text-sm font-medium">
              Sprint
            </Link>
            <Link href="/solutions" className="text-gray-300 hover:text-white text-sm font-medium transition-colors">
              Solutions
            </Link>
            <Link
              href="#apply"
              className="px-4 py-2 bg-accent text-white text-sm font-semibold rounded-lg hover:bg-amber-600 transition-colors"
            >
              Apply Now
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 md:py-24 bg-navy">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-accent/20 text-accent px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            3 Spots Left for February
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-6">
            AI Deployment Sprint
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto mb-8">
            Your first production AI agent, deployed and working in 30 days. You pick the problem. We handle the build. Your team gets trained.
          </p>
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            <div className="flex items-center gap-2 text-gray-300">
              <Clock className="w-5 h-5 text-accent" />
              <span>30-day delivery</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <Zap className="w-5 h-5 text-accent" />
              <span>Starts at $7,500</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <Users className="w-5 h-5 text-accent" />
              <span>Teams of 5-500</span>
            </div>
          </div>
          <Link
            href="#apply"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-white font-semibold rounded-lg hover:bg-amber-600 transition-all hover:-translate-y-0.5 hover:shadow-lg text-lg"
          >
            Apply for Sprint
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-4">
              The Process
            </p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
              How the Sprint Works
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Week 1: Discovery</h3>
              <p className="text-sm text-gray-600">
                We dig into your workflows, identify the best use case, and define success metrics.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Week 2-3: Build</h3>
              <p className="text-sm text-gray-600">
                We build your custom agent, train it on your data, and connect it to your tools.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Week 4: Deploy</h3>
              <p className="text-sm text-gray-600">
                We launch the agent, train your team, and hand over documentation.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-accent">+</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">30+ Days: Support</h3>
              <p className="text-sm text-gray-600">
                Slack access for questions, bug fixes, and optimization as your team adopts the agent.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Agent Types */}
      <section className="py-16 md:py-24 bg-cream">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-4">
              Pick Your Agent
            </p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
              What Can Your Agent Do?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Most teams start with one of these four agent types. We will help you pick the right one during discovery.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {agentTypes.slice(0, 4).map((agent) => (
              <div key={agent.name} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-2">{agent.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{agent.description}</p>
                <p className="text-xs text-primary font-medium">Best for: {agent.bestFor}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-4">
              Sprint Packages
            </p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
              Choose Your Sprint
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Starter */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Starter Sprint</p>
              <p className="text-4xl font-bold text-gray-900 mb-1">$7,500</p>
              <p className="text-sm text-gray-500 mb-6">one-time</p>

              <p className="text-gray-600 mb-6">
                One production-ready AI agent. Ideal for teams testing AI for the first time.
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">1 custom AI agent</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">Integration with 2 tools</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">2-hour team training</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">30-day Slack support</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">Documentation + SOPs</span>
                </div>
              </div>

              <Link
                href="#apply"
                className="block w-full text-center px-6 py-3 bg-primary/10 text-primary font-semibold rounded-lg hover:bg-primary/20 transition-all"
              >
                Apply Now
              </Link>
            </div>

            {/* Growth */}
            <div className="bg-navy rounded-2xl p-8 border-2 border-accent relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-white text-xs font-semibold px-4 py-1 rounded-full">
                Most Popular
              </div>
              <p className="text-sm font-semibold text-accent uppercase tracking-wide mb-2">Growth Sprint</p>
              <p className="text-4xl font-bold text-white mb-1">$10,000</p>
              <p className="text-sm text-gray-400 mb-6">one-time</p>

              <p className="text-gray-300 mb-6">
                AI agent plus workflow automation. Best for teams ready to see measurable ROI.
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-300">1 custom AI agent</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-300">Integration with 5 tools</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-300">Full workflow automation</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-300">4-hour team training</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-300">60-day priority support</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-300">Monthly optimization call</span>
                </div>
              </div>

              <Link
                href="#apply"
                className="block w-full text-center px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-amber-600 transition-all"
              >
                Apply Now
              </Link>
            </div>

            {/* Scale */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Scale Sprint</p>
              <p className="text-4xl font-bold text-gray-900 mb-1">$15,000</p>
              <p className="text-sm text-gray-500 mb-6">one-time</p>

              <p className="text-gray-600 mb-6">
                Multiple agents working together. For teams transforming an entire department.
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">Up to 3 AI agents</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">Unlimited integrations</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">Cross-agent workflows</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">Full-day team workshop</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">90-day dedicated support</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">Quarterly strategy sessions</span>
                </div>
              </div>

              <Link
                href="#apply"
                className="block w-full text-center px-6 py-3 bg-primary/10 text-primary font-semibold rounded-lg hover:bg-primary/20 transition-all"
              >
                Apply Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="apply" className="py-16 md:py-24 bg-navy">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-accent/20 text-accent px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              3 Spots Left for February
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
              Apply for AI Deployment Sprint
            </h2>
            <p className="text-gray-300">
              Takes 2 minutes. We review every application within 48 hours.
            </p>
          </div>

          {isSubmitted ? (
            <div className="bg-white rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Application Received</h3>
              <p className="text-gray-600 mb-6">
                We will review your application and get back to you within 48 hours. Keep an eye on your inbox.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Response within 48 hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>Check your email</span>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8">
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                      placeholder="Jane Smith"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Work Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                      placeholder="jane@company.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                      Company *
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      required
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                      placeholder="Acme Inc"
                    />
                  </div>
                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Role *
                    </label>
                    <input
                      type="text"
                      id="role"
                      name="role"
                      required
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                      placeholder="Head of Operations"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="teamSize" className="block text-sm font-medium text-gray-700 mb-2">
                      Team Size *
                    </label>
                    <select
                      id="teamSize"
                      name="teamSize"
                      required
                      value={formData.teamSize}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                    >
                      <option value="">Select team size</option>
                      <option value="1-10">1-10 people</option>
                      <option value="11-50">11-50 people</option>
                      <option value="51-200">51-200 people</option>
                      <option value="201-500">201-500 people</option>
                      <option value="500+">500+ people</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                      Budget Range *
                    </label>
                    <select
                      id="budget"
                      name="budget"
                      required
                      value={formData.budget}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                    >
                      <option value="">Select budget</option>
                      <option value="$7,500">$7,500 (Starter)</option>
                      <option value="$10,000">$10,000 (Growth)</option>
                      <option value="$15,000">$15,000 (Scale)</option>
                      <option value="Not sure">Not sure yet</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="agentType" className="block text-sm font-medium text-gray-700 mb-2">
                    What type of agent interests you? *
                  </label>
                  <select
                    id="agentType"
                    name="agentType"
                    required
                    value={formData.agentType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                  >
                    <option value="">Select agent type</option>
                    {agentTypes.map((agent) => (
                      <option key={agent.name} value={agent.name}>
                        {agent.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="painPoint" className="block text-sm font-medium text-gray-700 mb-2">
                    What problem do you want to solve? *
                  </label>
                  <textarea
                    id="painPoint"
                    name="painPoint"
                    required
                    rows={4}
                    value={formData.painPoint}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                    placeholder="Tell us about the repetitive task, bottleneck, or workflow you want to improve. The more specific, the better."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-4 bg-accent text-white font-semibold rounded-lg hover:bg-amber-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                  {!isSubmitting && <ArrowRight className="w-5 h-5" />}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  By submitting, you agree to receive emails about your application. No spam.
                </p>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left"
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      openFaq === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24 bg-cream">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
            Ready to Deploy Your First AI Agent?
          </h2>
          <p className="text-xl text-gray-600 mb-10">
            Apply now. We review every application within 48 hours and schedule a discovery call with qualified teams.
          </p>

          <Link
            href="#apply"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-white font-semibold rounded-lg hover:bg-amber-600 transition-all"
          >
            Apply for AI Deployment Sprint
            <ArrowRight className="w-5 h-5" />
          </Link>

          <p className="mt-6 text-sm text-gray-500">
            Questions?{" "}
            <a href="mailto:jermaine@jmcbtech.com" className="text-accent hover:underline">
              jermaine@jmcbtech.com
            </a>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy py-8 border-t border-gray-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-sm text-gray-500">
            &copy; 2026 JMCB Technology. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
