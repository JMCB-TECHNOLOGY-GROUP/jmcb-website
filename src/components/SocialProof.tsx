import { Quote, Stethoscope, Building2, Users } from "lucide-react";

const engagementTypes = [
  {
    icon: Stethoscope,
    industry: "Healthcare Organizations",
    challenge: "Clinical teams overwhelmed by documentation, care gaps slipping through the cracks, and patient follow-up falling behind.",
    approach: "We map clinical workflows, identify where AI creates the most value for patient outcomes, and build governance-first implementations with human oversight at every step.",
    focus: "Better outcomes, less burnout",
  },
  {
    icon: Building2,
    industry: "Mid-Market Companies",
    challenge: "Leadership knows AI matters but can't figure out where to start. Pilots stall. Vendors overpromise. Nothing reaches production.",
    approach: "Our ASCEND assessment pinpoints the highest-impact workflows, then we build a 90-day plan to get your first AI workflow live with clear success metrics.",
    focus: "From idea to production in 90 days",
  },
  {
    icon: Users,
    industry: "Associations & Nonprofits",
    challenge: "Small teams doing the work of organizations three times their size. Member engagement, content creation, and operations all competing for the same hours.",
    approach: "We identify the repetitive work that's eating your team's time and build AI workflows that give you capacity back, without losing the personal touch your members expect.",
    focus: "Multiply your impact without adding headcount",
  },
];

const testimonials = [
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
];

export default function SocialProof() {
  return (
    <section className="py-16 md:py-24 px-4 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-4">
            How We Help
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            AI strategy that connects to real outcomes
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Every engagement starts with a clear understanding of what success looks like 
            for your organization. Here's how we approach it.
          </p>
        </div>

        {/* How We Help by Vertical */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {engagementTypes.map((et) => (
            <div key={et.industry} className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <et.icon className="w-5 h-5 text-accent" />
                <span className="text-sm font-semibold text-gray-900">{et.industry}</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                <span className="font-medium text-gray-700">The challenge:</span> {et.challenge}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                <span className="font-medium text-gray-700">Our approach:</span> {et.approach}
              </p>
              <div className="bg-accent/10 border border-accent/20 rounded-lg p-3">
                <div className="text-sm font-semibold text-accent">{et.focus}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-6">
              <Quote className="w-8 h-8 text-accent/30 mb-3" />
              <p className="text-gray-700 italic mb-4 leading-relaxed">"{t.quote}"</p>
              <div>
                <div className="text-sm font-semibold text-gray-900">{t.role}</div>
                <div className="text-xs text-gray-500">{t.org}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
