import { Quote, TrendingUp, Clock, AlertTriangle } from "lucide-react";

const caseStudies = [
  {
    icon: Clock,
    industry: "Federal Contractor",
    size: "200+ employees",
    challenge: "Manual report generation consuming 40+ hours/week across compliance teams",
    result: "Deployed AI-powered document processing workflow in 60 days",
    metric: "62% reduction in processing time",
    metricDetail: "Saving ~25 hours/week with human-in-the-loop review",
  },
  {
    icon: TrendingUp,
    industry: "Healthcare Practice Group",
    size: "50+ staff across 3 locations",
    challenge: "Inconsistent patient intake and scheduling causing revenue leakage",
    result: "Implemented AI triage agent with appointment optimization",
    metric: "3.2x improvement in lead response time",
    metricDetail: "From 4+ hours to under 75 minutes average first response",
  },
  {
    icon: AlertTriangle,
    industry: "Trade Association",
    size: "15-person team, 2,000+ members",
    challenge: "Member inquiries overwhelming small staff, knowledge scattered across documents",
    result: "Built internal knowledge assistant with source-cited answers",
    metric: "85% of routine inquiries handled automatically",
    metricDetail: "Staff redirected to high-value member engagement",
  },
];

const testimonials = [
  {
    quote: "We went from 'AI sounds interesting' to having a production workflow in 8 weeks. The governance framework alone was worth the engagement.",
    role: "COO",
    org: "Mid-Atlantic Federal Contractor",
  },
  {
    quote: "Jermaine brought a level of rigor we hadn't seen from other consultants. He understood our compliance requirements from day one.",
    role: "Managing Partner",
    org: "Healthcare Practice Group",
  },
];

export default function SocialProof() {
  return (
    <section className="py-16 md:py-24 px-4 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-4">
            Results That Matter
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            From assessment to production in 90 days
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real outcomes from organizations that used the ASCEND™ framework to
            deploy AI with confidence.
          </p>
        </div>

        {/* Case Studies */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {caseStudies.map((cs) => (
            <div key={cs.industry} className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <cs.icon className="w-5 h-5 text-accent" />
                <div>
                  <span className="text-sm font-semibold text-gray-900">{cs.industry}</span>
                  <span className="text-xs text-gray-400 ml-2">{cs.size}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                <span className="font-medium text-gray-700">Challenge:</span> {cs.challenge}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                <span className="font-medium text-gray-700">Solution:</span> {cs.result}
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="text-xl font-bold text-green-700">{cs.metric}</div>
                <div className="text-xs text-green-600">{cs.metricDetail}</div>
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
