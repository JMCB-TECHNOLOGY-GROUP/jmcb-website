import { createServerClient } from "@/lib/supabase";
import { notFound } from "next/navigation";
import {
  PRIORITY_ACTIONS,
  DIMENSION_SERVICE_MAP,
  REPORT_BRANDING,
  type CompanySize,
} from "@/lib/assessment-content";

export const dynamic = "force-dynamic";

const ASCEND_DOMAINS = [
  { phase: "Assess", color: "#d97706", dims: ["Strategic Alignment", "Data Foundation"] },
  { phase: "Strategize", color: "#2563eb", dims: ["Executive Ownership"] },
  { phase: "Construct", color: "#7c3aed", dims: ["Workforce Enablement"] },
  { phase: "Execute", color: "#059669", dims: ["Operational Integration"] },
  { phase: "Navigate", color: "#dc2626", dims: ["Human Oversight", "Security & Privacy", "Risk Management", "Governance Framework"] },
  { phase: "Develop", color: "#0891b2", dims: ["Continuous Improvement"] },
];

function DonutSVG({ score, max, color, size }: { score: number; max: number; color: string; size: number }) {
  const r = (size - 16) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.round((score / max) * 100);
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f1f5f9" strokeWidth="10" />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} />
    </svg>
  );
}

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
  const date = lead.assessment_completed_at
    ? new Date(lead.assessment_completed_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : new Date(lead.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

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

      {/* Print/Download Bar */}
      <div className="no-print" style={{ position: "sticky", top: 0, zIndex: 50, background: "#0f172a", padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "#fff", fontSize: "14px", fontWeight: 600 }}>JMCB AI Readiness Report</span>
        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={() => {}} style={{ background: "#d97706", color: "#fff", border: "none", padding: "8px 20px", borderRadius: "6px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}
            id="print-btn">
            Save as PDF
          </button>
          <a href="https://calendly.com/jermaine-jmcbtech/ai-strategy-ai-agents-consultation" target="_blank" rel="noopener noreferrer"
            style={{ background: "#fff", color: "#0f172a", textDecoration: "none", padding: "8px 20px", borderRadius: "6px", fontSize: "13px", fontWeight: 600 }}>
            Book Strategy Call
          </a>
        </div>
      </div>
      <script dangerouslySetInnerHTML={{ __html: `document.getElementById('print-btn')?.addEventListener('click', function() { window.print(); });` }} />

      {/* Report Content */}
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 32px", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", color: "#0f172a" }}>

        {/* Header */}
        <div style={{ borderBottom: "3px solid #d97706", paddingBottom: "20px", marginBottom: "32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <h1 style={{ fontSize: "28px", fontWeight: 800, margin: "0 0 4px", color: "#0f172a" }}>AI Readiness Assessment Report</h1>
              <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>{branding.title}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "12px", fontWeight: 700, color: "#d97706", margin: "0 0 2px", letterSpacing: "0.08em" }}>JMCB TECHNOLOGY GROUP</p>
              <p style={{ fontSize: "11px", color: "#94a3b8", margin: 0 }}>AI Strategy & Implementation</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "24px", marginTop: "16px", fontSize: "13px", color: "#64748b" }}>
            <span><strong>Prepared for:</strong> {lead.organization || "Your Organization"}</span>
            <span><strong>Date:</strong> {date}</span>
            {lead.first_name && <span><strong>Contact:</strong> {lead.first_name} {lead.last_name}</span>}
          </div>
        </div>

        {/* Executive Summary */}
        <div style={{ display: "flex", gap: "32px", marginBottom: "36px", alignItems: "center" }}>
          <div style={{ flexShrink: 0, textAlign: "center" }}>
            <div style={{ position: "relative", width: "160px", height: "160px" }}>
              <DonutSVG score={overallScore} max={100} color={levelColor} size={160} />
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: "44px", fontWeight: 800, lineHeight: 1 }}>{overallScore}</span>
                <span style={{ fontSize: "11px", color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>out of 100</span>
              </div>
            </div>
            <div style={{ marginTop: "8px", padding: "4px 16px", borderRadius: "20px", display: "inline-block", fontSize: "13px", fontWeight: 700, color: levelColor, background: `${levelColor}14` }}>
              {level}
            </div>
          </div>
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: 700, margin: "0 0 10px" }}>Executive Summary</h2>
            <p style={{ fontSize: "14px", lineHeight: 1.7, color: "#334155", margin: "0 0 10px" }}>
              {lead.organization || "Your organization"} scored <strong>{overallScore} out of 100</strong> on AI readiness, placing you at the <strong>{level}</strong> level.
              Your strongest capability is <strong style={{ color: "#059669" }}>{strongest}</strong>, while your primary gap is <strong style={{ color: "#dc2626" }}>{weakest}</strong>.
            </p>
            <p style={{ fontSize: "14px", lineHeight: 1.7, color: "#334155", margin: 0 }}>
              {branding.focus}
            </p>
          </div>
        </div>

        {/* Key Metrics */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginBottom: "32px" }}>
          <div style={{ background: "#f8fafc", borderRadius: "12px", padding: "20px", textAlign: "center" }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>Strongest Area</div>
            <div style={{ fontSize: "15px", fontWeight: 700, color: "#059669" }}>{strongest}</div>
            <div style={{ fontSize: "28px", fontWeight: 800, color: "#059669" }}>{dimensionScores[strongest]?.toFixed(1) || "N/A"}<span style={{ fontSize: "14px", fontWeight: 500 }}>/5</span></div>
          </div>
          <div style={{ background: "#f8fafc", borderRadius: "12px", padding: "20px", textAlign: "center" }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>Priority Gap</div>
            <div style={{ fontSize: "15px", fontWeight: 700, color: "#dc2626" }}>{weakest}</div>
            <div style={{ fontSize: "28px", fontWeight: 800, color: "#dc2626" }}>{dimensionScores[weakest]?.toFixed(1) || "N/A"}<span style={{ fontSize: "14px", fontWeight: 500 }}>/5</span></div>
          </div>
          <div style={{ background: "#f8fafc", borderRadius: "12px", padding: "20px", textAlign: "center" }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>Dimensions Assessed</div>
            <div style={{ fontSize: "28px", fontWeight: 800, color: "#0f172a" }}>{Object.keys(dimensionScores).length}</div>
            <div style={{ fontSize: "13px", color: "#64748b" }}>ASCEND Framework</div>
          </div>
        </div>

        {/* Domain Breakdown */}
        <h2 style={{ fontSize: "20px", fontWeight: 700, margin: "0 0 20px", paddingBottom: "8px", borderBottom: "2px solid #e2e8f0" }}>Dimension Analysis by ASCEND Domain</h2>

        {ASCEND_DOMAINS.map(domain => {
          const dims = domain.dims.filter(d => dimensionScores[d] !== undefined);
          if (dims.length === 0) return null;
          const avg = dims.reduce((sum, d) => sum + (dimensionScores[d] || 0), 0) / dims.length;
          return (
            <div key={domain.phase} style={{ marginBottom: "24px", border: "1px solid #e2e8f0", borderRadius: "12px", overflow: "hidden" }}>
              <div style={{ background: `${domain.color}0a`, padding: "14px 20px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: domain.color, textTransform: "uppercase", letterSpacing: "0.06em" }}>ASCEND: {domain.phase}</span>
                  <span style={{ fontSize: "12px", color: "#94a3b8", marginLeft: "12px" }}>Domain Average: {avg.toFixed(1)}/5</span>
                </div>
                <div style={{ width: "48px", height: "48px", position: "relative" }}>
                  <DonutSVG score={parseFloat(avg.toFixed(1))} max={5} color={domain.color} size={48} />
                </div>
              </div>
              <div style={{ padding: "16px 20px" }}>
                {dims.map(dim => {
                  const score = dimensionScores[dim];
                  const isW = dim === weakest;
                  const isS = dim === strongest;
                  const barCol = isW ? "#dc2626" : isS ? "#059669" : domain.color;
                  return (
                    <div key={dim} style={{ marginBottom: dims.indexOf(dim) < dims.length - 1 ? "14px" : 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                        <span style={{ fontSize: "13px", fontWeight: 500, color: isW ? "#dc2626" : isS ? "#059669" : "#334155" }}>
                          {dim} {isW ? "⚠" : isS ? "✓" : ""}
                        </span>
                        <span style={{ fontSize: "14px", fontWeight: 700, color: barCol }}>{score.toFixed(1)}/5</span>
                      </div>
                      <div style={{ height: "10px", background: "#f1f5f9", borderRadius: "5px", overflow: "hidden" }}>
                        <div style={{ height: "100%", borderRadius: "5px", background: barCol, width: `${(score / 5) * 100}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Priority Action */}
        <div className="page-break" />
        <div style={{ background: "#fffbeb", border: "2px solid #d97706", borderRadius: "12px", padding: "24px", marginBottom: "28px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#92400e", margin: "0 0 8px" }}>Your #1 Priority Action</h3>
          <p style={{ fontSize: "13px", color: "#92400e", margin: "0 0 12px" }}>Based on your <strong>{weakest}</strong> score, focus here first:</p>
          <div style={{ background: "#fff", borderRadius: "8px", padding: "16px", fontSize: "14px", lineHeight: 1.7, color: "#334155" }}>
            {priorityActions[0]}
          </div>
          {priorityActions.length > 1 && (
            <ul style={{ margin: "12px 0 0", paddingLeft: "20px", fontSize: "13px", color: "#92400e" }}>
              {priorityActions.slice(1).map((a, i) => <li key={i} style={{ marginBottom: "4px" }}>{a}</li>)}
            </ul>
          )}
        </div>

        {/* Service Recommendations */}
        {services.length > 0 && (
          <div style={{ marginBottom: "28px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: 700, margin: "0 0 16px", paddingBottom: "8px", borderBottom: "2px solid #e2e8f0" }}>Recommended Services</h2>
            {services.map(svc => (
              <div key={svc.dimension} style={{ border: "1px solid #e2e8f0", borderRadius: "10px", padding: "18px", marginBottom: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ fontSize: "15px", fontWeight: 700, color: "#0f172a" }}>{svc.service}</span>
                  <span style={{ fontSize: "11px", fontWeight: 600, color: "#dc2626", textTransform: "uppercase" }}>Gap: {svc.dimension}</span>
                </div>
                <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 6px", lineHeight: 1.6 }}>{svc.description}</p>
                <p style={{ fontSize: "12px", color: "#d97706", fontWeight: 600, margin: 0 }}>Deliverable: {svc.deliverable}</p>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="no-print" style={{ background: "#0f172a", borderRadius: "16px", padding: "36px", textAlign: "center", marginBottom: "24px" }}>
          <h3 style={{ fontSize: "22px", fontWeight: 700, color: "#fff", margin: "0 0 8px" }}>Ready to Close the Gaps?</h3>
          <p style={{ fontSize: "14px", color: "#94a3b8", margin: "0 0 20px" }}>Book a free 30-minute AI Strategy Call. We'll review your results and build a 90-day action plan.</p>
          <a href="https://calendly.com/jermaine-jmcbtech/ai-strategy-ai-agents-consultation" target="_blank" rel="noopener noreferrer"
            style={{ display: "inline-block", background: "#d97706", color: "#fff", textDecoration: "none", padding: "14px 36px", borderRadius: "8px", fontSize: "15px", fontWeight: 700 }}>
            Book Your Free Strategy Call
          </a>
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", paddingTop: "20px", borderTop: "2px solid #d97706" }}>
          <p style={{ fontSize: "12px", fontWeight: 700, color: "#d97706", letterSpacing: "0.08em", margin: "0 0 4px" }}>JMCB TECHNOLOGY GROUP</p>
          <p style={{ fontSize: "11px", color: "#94a3b8", margin: "0 0 2px" }}>AI Strategy & Implementation | jmcbtech.com</p>
          <p style={{ fontSize: "11px", color: "#94a3b8", margin: 0 }}>Powered by the JMCB ASCEND™ Framework</p>
        </div>
      </div>
    </>
  );
}
