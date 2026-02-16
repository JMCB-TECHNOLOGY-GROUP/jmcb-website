import { createServerClient } from "@/lib/supabase";
import { notFound } from "next/navigation";
import {
  PRIORITY_ACTIONS,
  DIMENSION_SERVICE_MAP,
  REPORT_BRANDING,
  type CompanySize,
} from "@/lib/assessment-content";

export const dynamic = "force-dynamic";

const CALENDLY = "https://calendly.com/jermaine-jmcbtech/ai-strategy-ai-agents-consultation";

const ASCEND_DOMAINS = [
  { phase: "Assess", color: "#d97706", dims: ["Strategic Alignment", "Data Foundation"] },
  { phase: "Strategize", color: "#2563eb", dims: ["Executive Ownership"] },
  { phase: "Construct", color: "#7c3aed", dims: ["Workforce Enablement"] },
  { phase: "Execute", color: "#059669", dims: ["Operational Integration"] },
  { phase: "Navigate", color: "#dc2626", dims: ["Human Oversight", "Security & Privacy", "Risk Management", "Governance Framework"] },
  { phase: "Develop", color: "#0891b2", dims: ["Continuous Improvement"] },
];

export default async function ReportPage({ params }: { params: { id: string } }) {
  const supabase = createServerClient();
  const { data: lead } = await supabase.from("leads").select("*").eq("id", params.id).single();

  if (!lead) return notFound();

  const overallScore = lead.overall_score_v2 || Math.round((lead.assessment_score / 50) * 100);
  const dimensionScores: Record<string, number> = lead.dimension_scores_v2 || {};
  const weakest = lead.weakest_dimension || "N/A";
  const strongest = lead.strongest_dimension || "N/A";
  const size = (lead.company_size || "11-50") as CompanySize;
  const branding = REPORT_BRANDING[size] || REPORT_BRANDING["11-50"];
  const priorityActions = PRIORITY_ACTIONS[weakest] || ["Evaluate current capabilities."];
  const sortedDims = Object.entries(dimensionScores).sort(([,a],[,b]) => a - b);
  const services = sortedDims.filter(([,s]) => s < 3).slice(0, 3).map(([dim]) => ({
    dimension: dim,
    ...(DIMENSION_SERVICE_MAP[dim] || { service: "AI Strategy Session", description: "Personalized guidance.", deliverable: "Action plan" }),
  }));

  const level = overallScore >= 80 ? "AI Leader" : overallScore >= 60 ? "AI Ready" : overallScore >= 40 ? "AI Emerging" : "AI Exploring";
  const levelColor = overallScore >= 70 ? "#059669" : overallScore >= 40 ? "#d97706" : "#dc2626";
  const firstName = lead.first_name || "there";
  const org = lead.organization || "your organization";
  const date = lead.assessment_completed_at
    ? new Date(lead.assessment_completed_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : new Date(lead.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const gapCount = sortedDims.filter(([,s]) => s < 3).length;

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .page-break { page-break-before: always; }
        }
        @page { margin: 0.5in; size: letter; }
      `}</style>

      <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", color: "#0f172a" }}>

        {/* ===== TOP CTA BANNER ===== */}
        <div className="no-print" style={{ background: "#0f172a", padding: "0" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto", padding: "32px 24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <div>
                <p style={{ fontSize: "12px", fontWeight: 700, color: "#d97706", letterSpacing: "0.08em", margin: "0 0 2px" }}>JMCB TECHNOLOGY GROUP</p>
                <p style={{ fontSize: "11px", color: "#94a3b8", margin: 0 }}>AI Strategy & Implementation</p>
              </div>
              <a href={CALENDLY} target="_blank" rel="noopener noreferrer"
                style={{ background: "#d97706", color: "#fff", textDecoration: "none", padding: "10px 24px", borderRadius: "8px", fontSize: "14px", fontWeight: 700 }}>
                Book Your Free Strategy Call
              </a>
            </div>

            <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#fff", margin: "0 0 8px" }}>
              {firstName}, your AI readiness score is {overallScore}/100.
            </h1>
            <p style={{ fontSize: "16px", color: "#94a3b8", margin: "0 0 16px", lineHeight: 1.6 }}>
              {gapCount >= 3
                ? `${org} has ${gapCount} dimensions scoring below industry benchmarks. That's not unusual, but it means there's a clear path to improvement. Let's map it out together.`
                : gapCount >= 1
                ? `${org} is showing solid AI readiness in several areas, with ${gapCount > 1 ? `${gapCount} dimensions` : "one dimension"} that could use focused attention. A quick strategy session can turn those into wins.`
                : `${org} is in a strong position. The question now isn't whether to use AI, it's how to deploy it for maximum impact. Let's talk about your 90-day plan.`
              }
            </p>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <a href={CALENDLY} target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#d97706", color: "#fff", textDecoration: "none", padding: "14px 28px", borderRadius: "8px", fontSize: "15px", fontWeight: 700 }}>
                Book Free 30-Min Strategy Call &#8594;
              </a>
              <a href="mailto:jermaine@jmcbtech.com" 
                style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "transparent", color: "#94a3b8", textDecoration: "none", padding: "14px 28px", borderRadius: "8px", fontSize: "14px", fontWeight: 600, border: "1px solid #334155" }}>
                Email Jermaine Directly
              </a>
            </div>

            <p style={{ fontSize: "12px", color: "#475569", margin: "12px 0 0" }}>
              No sales pitch. We'll review your results and build a focused action plan together.
            </p>
          </div>
        </div>

        {/* ===== REPORT BODY ===== */}
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 24px" }}>

          {/* Header */}
          <div style={{ borderBottom: "3px solid #d97706", paddingBottom: "16px", marginBottom: "32px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h2 style={{ fontSize: "24px", fontWeight: 800, margin: "0 0 4px" }}>AI Readiness Assessment Report</h2>
                <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>{branding.title}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: "12px", fontWeight: 700, color: "#d97706", letterSpacing: "0.08em", margin: "0 0 2px" }}>JMCB TECHNOLOGY GROUP</p>
                <p style={{ fontSize: "11px", color: "#94a3b8", margin: 0 }}>Powered by the ASCEND Framework</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: "24px", marginTop: "12px", fontSize: "13px", color: "#64748b" }}>
              <span><strong>Prepared for:</strong> {org}</span>
              <span><strong>Date:</strong> {date}</span>
              {lead.first_name && <span><strong>Contact:</strong> {lead.first_name} {lead.last_name}</span>}
            </div>
          </div>

          {/* Score + Summary */}
          <div style={{ display: "flex", gap: "32px", marginBottom: "32px", alignItems: "center" }}>
            <div style={{ flexShrink: 0, textAlign: "center" }}>
              <div style={{ width: "140px", height: "140px", borderRadius: "50%", border: `8px solid ${levelColor}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: "44px", fontWeight: 800, lineHeight: 1, color: levelColor }}>{overallScore}</span>
                <span style={{ fontSize: "11px", color: "#64748b", fontWeight: 600 }}>out of 100</span>
              </div>
              <div style={{ marginTop: "8px", padding: "4px 16px", borderRadius: "20px", display: "inline-block", fontSize: "13px", fontWeight: 700, color: levelColor, background: `${levelColor}14` }}>
                {level}
              </div>
            </div>
            <div>
              <p style={{ fontSize: "14px", lineHeight: 1.7, color: "#334155", margin: "0 0 10px" }}>
                <strong>{org}</strong> scored <strong>{overallScore} out of 100</strong> on AI readiness, placing you at the <strong>{level}</strong> level.
                Your strongest area is <strong style={{ color: "#059669" }}>{strongest}</strong>, while your biggest opportunity is <strong style={{ color: "#dc2626" }}>{weakest}</strong>.
              </p>
              <p style={{ fontSize: "14px", lineHeight: 1.7, color: "#334155", margin: 0 }}>
                {branding.focus}
              </p>
            </div>
          </div>

          {/* Key Metrics */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "32px" }}>
            <div style={{ background: "#f0fdf4", borderRadius: "12px", padding: "16px", textAlign: "center" }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#059669", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>Strongest</div>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "#059669" }}>{strongest}</div>
              <div style={{ fontSize: "24px", fontWeight: 800, color: "#059669" }}>{dimensionScores[strongest]?.toFixed(1) || "N/A"}<span style={{ fontSize: "12px", fontWeight: 500 }}>/5</span></div>
            </div>
            <div style={{ background: "#fef2f2", borderRadius: "12px", padding: "16px", textAlign: "center" }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#dc2626", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>Priority Gap</div>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "#dc2626" }}>{weakest}</div>
              <div style={{ fontSize: "24px", fontWeight: 800, color: "#dc2626" }}>{dimensionScores[weakest]?.toFixed(1) || "N/A"}<span style={{ fontSize: "12px", fontWeight: 500 }}>/5</span></div>
            </div>
            <div style={{ background: "#f8fafc", borderRadius: "12px", padding: "16px", textAlign: "center" }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>Assessed</div>
              <div style={{ fontSize: "24px", fontWeight: 800, color: "#0f172a" }}>{Object.keys(dimensionScores).length}</div>
              <div style={{ fontSize: "12px", color: "#64748b" }}>ASCEND Dimensions</div>
            </div>
          </div>

          {/* Dimension Breakdown */}
          <h3 style={{ fontSize: "18px", fontWeight: 700, margin: "0 0 16px", paddingBottom: "8px", borderBottom: "2px solid #e2e8f0" }}>Dimension Scores by ASCEND Domain</h3>

          {ASCEND_DOMAINS.map(domain => {
            const dims = domain.dims.filter(d => dimensionScores[d] !== undefined);
            if (dims.length === 0) return null;
            return (
              <div key={domain.phase} style={{ marginBottom: "20px", border: "1px solid #e2e8f0", borderRadius: "12px", overflow: "hidden" }}>
                <div style={{ background: `${domain.color}0a`, padding: "12px 16px", borderBottom: "1px solid #e2e8f0" }}>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: domain.color, textTransform: "uppercase", letterSpacing: "0.06em" }}>ASCEND: {domain.phase}</span>
                </div>
                <div style={{ padding: "16px" }}>
                  {dims.map((dim, i) => {
                    const score = dimensionScores[dim];
                    const isW = dim === weakest;
                    const isS = dim === strongest;
                    const barCol = isW ? "#dc2626" : isS ? "#059669" : domain.color;
                    return (
                      <div key={dim} style={{ marginBottom: i < dims.length - 1 ? "12px" : 0 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                          <span style={{ fontSize: "13px", fontWeight: 500, color: isW ? "#dc2626" : isS ? "#059669" : "#334155" }}>
                            {dim}
                          </span>
                          <span style={{ fontSize: "13px", fontWeight: 700, color: barCol }}>{score.toFixed(1)}/5</span>
                        </div>
                        <div style={{ height: "8px", background: "#f1f5f9", borderRadius: "4px", overflow: "hidden" }}>
                          <div style={{ height: "100%", borderRadius: "4px", background: barCol, width: `${(score / 5) * 100}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Priority Action */}
          <div style={{ background: "#fffbeb", border: "2px solid #d97706", borderRadius: "12px", padding: "24px", marginBottom: "28px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#92400e", margin: "0 0 8px" }}>Your #1 Priority: {weakest}</h3>
            <p style={{ fontSize: "14px", color: "#92400e", margin: "0 0 12px", lineHeight: 1.6 }}>{priorityActions[0]}</p>
            {priorityActions.length > 1 && (
              <ul style={{ margin: "0", paddingLeft: "20px", fontSize: "13px", color: "#92400e" }}>
                {priorityActions.slice(1).map((a, i) => <li key={i} style={{ marginBottom: "4px" }}>{a}</li>)}
              </ul>
            )}
          </div>

          {/* Service Recommendations */}
          {services.length > 0 && (
            <div style={{ marginBottom: "28px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 700, margin: "0 0 12px", paddingBottom: "8px", borderBottom: "2px solid #e2e8f0" }}>How JMCB Can Help</h3>
              <p style={{ fontSize: "14px", color: "#64748b", margin: "0 0 16px" }}>Based on your gaps, here's where we'd focus in a strategy session:</p>
              {services.map(svc => (
                <div key={svc.dimension} style={{ border: "1px solid #e2e8f0", borderRadius: "10px", padding: "16px", marginBottom: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <span style={{ fontSize: "15px", fontWeight: 700, color: "#0f172a" }}>{svc.service}</span>
                    <span style={{ fontSize: "11px", fontWeight: 600, color: "#dc2626", textTransform: "uppercase" }}>Gap: {svc.dimension}</span>
                  </div>
                  <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 6px", lineHeight: 1.6 }}>{svc.description}</p>
                  <p style={{ fontSize: "12px", color: "#d97706", fontWeight: 600, margin: 0 }}>Deliverable: {svc.deliverable}</p>
                </div>
              ))}
            </div>
          )}

          {/* BOTTOM CTA */}
          <div className="no-print" style={{ background: "#0f172a", borderRadius: "16px", padding: "36px", textAlign: "center", marginBottom: "24px" }}>
            <h3 style={{ fontSize: "22px", fontWeight: 700, color: "#fff", margin: "0 0 8px" }}>Let's Turn This Score Into a Plan</h3>
            <p style={{ fontSize: "14px", color: "#94a3b8", margin: "0 0 20px", lineHeight: 1.6 }}>
              Book a free 30-minute strategy call. We'll review your results together, prioritize your gaps, and map out what to do in the next 90 days.
            </p>
            <a href={CALENDLY} target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-block", background: "#d97706", color: "#fff", textDecoration: "none", padding: "14px 36px", borderRadius: "8px", fontSize: "15px", fontWeight: 700 }}>
              Book Your Free Strategy Call &#8594;
            </a>
            <p style={{ fontSize: "12px", color: "#475569", margin: "12px 0 0" }}>
              Or email jermaine@jmcbtech.com directly
            </p>
          </div>

          {/* Print Button */}
          <div className="no-print" style={{ textAlign: "center", marginBottom: "24px" }}>
            <button id="print-btn" style={{ background: "#f1f5f9", color: "#64748b", border: "1px solid #e2e8f0", padding: "10px 24px", borderRadius: "8px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
              Save as PDF
            </button>
          </div>
          <script dangerouslySetInnerHTML={{ __html: `document.getElementById('print-btn')?.addEventListener('click', function() { window.print(); });` }} />

          {/* Footer */}
          <div style={{ textAlign: "center", paddingTop: "20px", borderTop: "2px solid #d97706" }}>
            <p style={{ fontSize: "12px", fontWeight: 700, color: "#d97706", letterSpacing: "0.08em", margin: "0 0 4px" }}>JMCB TECHNOLOGY GROUP</p>
            <p style={{ fontSize: "11px", color: "#94a3b8", margin: "0 0 2px" }}>AI Strategy & Implementation | jmcbtech.com</p>
            <p style={{ fontSize: "11px", color: "#94a3b8", margin: 0 }}>Powered by the JMCB ASCEND Framework</p>
          </div>
        </div>
      </div>
    </>
  );
}
