import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

// Result profiles for the report
const resultProfiles = {
  early: {
    level: "Foundation",
    risk: "Higher Risk Profile",
    title: "Foundation Stage: Building AI Readiness",
    summary: "is in the early stages of AI readiness. While foundational capabilities are emerging, there are significant opportunities to strengthen governance, strategic alignment, and operational integration.",
  },
  developing: {
    level: "Developing", 
    risk: "Moderate Risk Profile",
    title: "Developing Stage: Strengthening AI Capabilities",
    summary: "has established early foundations for AI adoption but gaps remain that may limit scale or introduce risk if adoption accelerates.",
  },
  advanced: {
    level: "Advanced",
    risk: "Lower Risk Profile", 
    title: "Advanced Stage: Optimizing AI Value",
    summary: "demonstrates strong preparation for responsible AI adoption with mature governance, clear ownership, and integrated operations.",
  },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      organization,
      role,
      companySize,
      score,
      band,
      dimensions,
    } = body;

    const profile = resultProfiles[band as keyof typeof resultProfiles];
    const reportDate = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    // Generate HTML report
    const htmlReport = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Helvetica', 'Arial', sans-serif; color: #1e293b; line-height: 1.6; }
    .page { padding: 40px; max-width: 800px; margin: 0 auto; }
    .header { text-align: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 3px solid #d97706; }
    .logo { font-size: 24px; font-weight: bold; color: #0f172a; }
    .logo span { color: #d97706; }
    .title { font-size: 28px; font-weight: bold; color: #0f172a; margin: 20px 0 10px; }
    .subtitle { color: #64748b; font-size: 14px; }
    .score-section { text-align: center; padding: 30px; background: #f8fafc; border-radius: 12px; margin: 30px 0; }
    .score { font-size: 72px; font-weight: bold; color: ${band === 'early' ? '#dc2626' : band === 'developing' ? '#d97706' : '#059669'}; }
    .score span { font-size: 24px; color: #94a3b8; }
    .band { display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: 600; font-size: 14px; 
      background: ${band === 'early' ? '#fef2f2' : band === 'developing' ? '#fffbeb' : '#f0fdf4'};
      color: ${band === 'early' ? '#dc2626' : band === 'developing' ? '#d97706' : '#059669'}; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 30px 0; }
    .info-box { background: #f8fafc; padding: 15px; border-radius: 8px; }
    .info-label { font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
    .info-value { font-size: 16px; font-weight: 600; color: #0f172a; margin-top: 4px; }
    .section-title { font-size: 18px; font-weight: bold; color: #0f172a; margin: 30px 0 15px; padding-bottom: 10px; border-bottom: 2px solid #e2e8f0; }
    .dimension { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #f1f5f9; }
    .dimension-name { font-weight: 500; }
    .dimension-score { display: flex; align-items: center; gap: 10px; }
    .bar { width: 100px; height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden; }
    .bar-fill { height: 100%; border-radius: 4px; }
    .cta-section { text-align: center; padding: 30px; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border-radius: 12px; margin-top: 40px; }
    .cta-title { color: white; font-size: 20px; font-weight: bold; margin-bottom: 10px; }
    .cta-text { color: #94a3b8; margin-bottom: 20px; }
    .cta-button { display: inline-block; padding: 12px 30px; background: #d97706; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; }
    .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 12px; }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div class="logo">JMCB <span>Technology Group</span></div>
      <h1 class="title">AI Readiness Assessment Report</h1>
      <p class="subtitle">Prepared for ${organization} · ${reportDate}</p>
    </div>

    <div class="score-section">
      <div class="score">${score}<span>/50</span></div>
      <div class="band">${profile.level} Stage</div>
      <p style="margin-top: 15px; color: #64748b;">${profile.title}</p>
    </div>

    <div class="info-grid">
      <div class="info-box">
        <div class="info-label">Prepared For</div>
        <div class="info-value">${firstName} ${lastName}</div>
      </div>
      <div class="info-box">
        <div class="info-label">Organization</div>
        <div class="info-value">${organization}</div>
      </div>
      <div class="info-box">
        <div class="info-label">Role</div>
        <div class="info-value">${role}</div>
      </div>
      <div class="info-box">
        <div class="info-label">Company Size</div>
        <div class="info-value">${companySize} employees</div>
      </div>
    </div>

    <h2 class="section-title">Assessment Breakdown</h2>
    ${dimensions.map((dim: { title: string; score: number; benchmark: number }) => `
      <div class="dimension">
        <div>
          <div class="dimension-name">${dim.title}</div>
          <div style="font-size: 12px; color: #94a3b8;">Benchmark: ${dim.benchmark}</div>
        </div>
        <div class="dimension-score">
          <div class="bar">
            <div class="bar-fill" style="width: ${(dim.score / 5) * 100}%; background: ${dim.score >= 4 ? '#059669' : dim.score >= 3 ? '#d97706' : '#dc2626'};"></div>
          </div>
          <span style="font-weight: 600; color: ${dim.score >= 4 ? '#059669' : dim.score >= 3 ? '#d97706' : '#dc2626'};">${dim.score}/5</span>
        </div>
      </div>
    `).join('')}

    <div class="cta-section">
      <div class="cta-title">Ready to Accelerate Your AI Journey?</div>
      <p class="cta-text">Schedule a complimentary strategy session to review your results and plan next steps.</p>
      <a href="https://calendly.com/jermaine-jmcbtech/ai-strategy-ai-agents-consultation" class="cta-button">Book Your Strategy Call →</a>
    </div>

    <div class="footer">
      <p>© 2026 JMCB Technology Group · jmcbtech.com</p>
      <p style="margin-top: 5px;">Powered by the JMCB ASCEND™ Framework</p>
    </div>
  </div>
</body>
</html>`;

    // Store the HTML report and generate a unique ID
    const reportId = `report-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    
    const supabase = createServerClient();

    // Store HTML report in Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('reports')
      .upload(`${reportId}.html`, htmlReport, {
        contentType: 'text/html',
        upsert: true,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      // Continue without storage - return HTML directly
    }

    // Get public URL if upload succeeded
    let reportUrl = null;
    if (uploadData) {
      const { data: urlData } = supabase.storage
        .from('reports')
        .getPublicUrl(`${reportId}.html`);
      reportUrl = urlData.publicUrl;
    }

    return NextResponse.json({
      success: true,
      reportId,
      reportUrl,
      htmlReport, // Include HTML so Make.com can convert to PDF
    });

  } catch (error) {
    console.error("Report generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 }
    );
  }
}
