// ============================================================
// EMAIL RENDERER: Branded HTML email templates
// Full autonomous nurture funnel for AI Readiness Assessment
// ============================================================

const B = {
  accent: "#d97706",
  accentDark: "#b45309",
  dark: "#0f172a",
  gray: "#64748b",
  light: "#f8fafc",
  green: "#059669",
  red: "#dc2626",
  white: "#ffffff",
  calendly: "https://calendly.com/jermaine-jmcbtech/ai-strategy-ai-agents-consultation",
  site: "https://jmcbtech.com",
};

function wrap(content: string, preheader: string = ""): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<style>
body{margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#334155;-webkit-text-size-adjust:100%}
.c{max-width:600px;margin:0 auto;background:#fff}
.hd{background:${B.dark};padding:24px 32px;text-align:center}
.hd h1{margin:0;color:#fff;font-size:17px;font-weight:700;letter-spacing:0.04em}
.hd .sub{color:${B.accent};font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;margin-top:3px}
.bd{padding:32px}
.ft{background:#f8fafc;padding:20px 32px;text-align:center;border-top:1px solid #e2e8f0}
.ft p{margin:3px 0;font-size:11px;color:#94a3b8}
.btn{display:inline-block;padding:14px 36px;background:${B.accent};color:#fff!important;text-decoration:none;border-radius:8px;font-weight:700;font-size:15px;text-align:center}
.btn:hover{background:${B.accentDark}}
.btn2{display:inline-block;padding:11px 28px;border:2px solid ${B.accent};color:${B.accent}!important;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px}
.sb{text-align:center;padding:28px;background:${B.light};border-radius:12px;margin:20px 0}
.sn{font-size:56px;font-weight:800;color:${B.dark};line-height:1}
.sl{font-size:12px;color:${B.gray};text-transform:uppercase;letter-spacing:0.06em;margin-top:4px}
.hl{background:linear-gradient(135deg,rgba(217,119,6,0.06),rgba(217,119,6,0.02));border-left:4px solid ${B.accent};padding:16px 20px;border-radius:0 8px 8px 0;margin:16px 0}
.dv{height:1px;background:#e2e8f0;margin:24px 0}
.db{margin-bottom:10px}
.dn{font-size:13px;color:#334155;font-weight:500}
.ds{font-size:13px;font-weight:700;float:right}
.bb{height:8px;background:#e2e8f0;border-radius:4px;margin-top:4px;overflow:hidden}
.bf{height:100%;border-radius:4px}
h2{color:${B.dark};font-size:20px;margin:0 0 12px;font-weight:700}
p{line-height:1.65;margin:0 0 14px;font-size:15px}
.pre{display:none!important;max-height:0;overflow:hidden}
</style></head><body>
<span class="pre">${preheader}</span>
<div class="c">
<div class="hd"><h1>JMCB Technology Group</h1><div class="sub">AI Strategy &amp; Implementation</div></div>
<div class="bd">${content}</div>
<div class="ft">
<p><strong>JMCB Technology Group</strong></p>
<p><a href="${B.site}" style="color:${B.accent};text-decoration:none">jmcbtech.com</a></p>
<p style="margin-top:10px;font-size:10px">You received this because you completed the JMCB AI Readiness Assessment.<br><a href="${B.site}/unsubscribe" style="color:#94a3b8">Unsubscribe</a></p>
</div></div></body></html>`;
}

function bars(scores: Record<string, number>, w: string, s: string): string {
  return Object.entries(scores).sort(([,a],[,b]) => b - a).map(([dim, sc]) => {
    const pct = (sc / 5) * 100;
    const col = dim === w ? B.red : dim === s ? B.green : B.accent;
    const tag = dim === w ? ' <span style="color:#dc2626;font-size:10px">&#9888; Priority</span>' : dim === s ? ' <span style="color:#059669;font-size:10px">&#10003; Strength</span>' : '';
    return `<div class="db"><span class="dn">${dim}${tag}</span><span class="ds" style="color:${col}">${sc.toFixed(1)}/5</span><div class="bb"><div class="bf" style="width:${pct}%;background:${col}"></div></div></div>`;
  }).join('');
}

// ── DAY 0: Immediate results email ──
export function emailDay0(d: {
  firstName: string; organization: string; overallScore: number;
  dimensionScores: Record<string, number>; weakestDimension: string;
  strongestDimension: string; priorityAction: string;
}): { subject: string; html: string } {
  const lvl = d.overallScore >= 80 ? "AI Leader" : d.overallScore >= 60 ? "AI Ready" : d.overallScore >= 40 ? "AI Emerging" : "AI Exploring";
  return {
    subject: `${d.firstName}, your AI Readiness Score: ${d.overallScore}/100`,
    html: wrap(`
      <h2>Your AI Readiness Results</h2>
      <p>${d.firstName}, thanks for completing the assessment for <strong>${d.organization}</strong>. Here's your full breakdown.</p>
      <div class="sb"><div class="sn">${d.overallScore}</div><div class="sl">Overall Score &middot; ${lvl}</div></div>
      <h2>Dimension Scores</h2>
      ${bars(d.dimensionScores, d.weakestDimension, d.strongestDimension)}
      <div class="hl"><strong style="color:${B.accentDark}">Your #1 Priority: ${d.weakestDimension}</strong><p style="margin:8px 0 0;font-size:14px">${d.priorityAction}</p></div>
      <div class="dv"></div>
      <h2>What Happens Next</h2>
      <p>Over the next few days, I'll send you a deeper analysis of your biggest gap, what organizations like yours are doing differently, and a specific action plan you can start this week.</p>
      <p>But if you want to move fast, let's talk. I've helped organizations go from assessment to first AI deployment in 90 days.</p>
      <p style="text-align:center;margin:28px 0"><a href="${B.calendly}" class="btn">Book Your Free Strategy Call &rarr;</a></p>
      <p style="font-size:13px;color:#64748b">Talk soon,<br><strong>Jermaine Barker</strong><br>Founder, JMCB Technology Group</p>
    `, `You scored ${d.overallScore}/100 on AI readiness. Full breakdown inside.`),
  };
}

// ── DAY 1: Deep dive on weakest dimension ──
export function emailDay1(d: {
  firstName: string; organization: string; weakestDimension: string;
  weakestScore: number; priorityAction: string; service: string; serviceDesc: string;
}): { subject: string; html: string } {
  return {
    subject: `${d.firstName}, the gap that's holding ${d.organization} back`,
    html: wrap(`
      <h2>Let's Talk About ${d.weakestDimension}</h2>
      <p>${d.firstName}, yesterday I sent your full AI Readiness breakdown. Today I want to zero in on the area that needs attention first.</p>
      <div class="hl"><strong>Your ${d.weakestDimension} score: ${d.weakestScore.toFixed(1)} out of 5</strong><p style="margin:8px 0 0;font-size:14px">This dimension directly impacts your ability to scale AI safely and effectively.</p></div>
      <h2>Why This Matters</h2>
      <p>Organizations that don't address ${d.weakestDimension.toLowerCase()} early hit walls when they try to move past pilots. The good news: this is fixable, and it's where we see the fastest ROI.</p>
      <h2>Your Recommended Next Step</h2>
      <p>${d.priorityAction}</p>
      <h2>How We Can Help: ${d.service}</h2>
      <p>${d.serviceDesc}</p>
      <p style="text-align:center;margin:28px 0"><a href="${B.calendly}" class="btn">Build Your Action Plan &rarr;</a></p>
      <p style="font-size:13px;color:#64748b">Jermaine Barker<br>JMCB Technology Group</p>
    `, `Your ${d.weakestDimension} score needs attention. Here's what to do about it.`),
  };
}

// ── DAY 3: Social proof + patterns ──
export function emailDay3(d: {
  firstName: string; organization: string; overallScore: number; companySize: string;
}): { subject: string; html: string } {
  const tier = d.overallScore >= 60 ? "AI Ready" : d.overallScore >= 40 ? "AI Emerging" : "AI Exploring";
  return {
    subject: `What organizations scoring ${d.overallScore}/100 do differently`,
    html: wrap(`
      <h2>How Organizations Like ${d.organization} Are Deploying AI</h2>
      <p>${d.firstName}, I wanted to share what I'm seeing with organizations in your range (${d.companySize} employees, ${tier} level).</p>
      <h2>The Pattern I Keep Seeing</h2>
      <p>Most organizations at the ${tier} level share the same challenge: they know AI matters, but they're stuck between "we should do something" and "what exactly should we do."</p>
      <p>The ones that break through do three things differently:</p>
      <div class="hl"><p style="margin:0"><strong>1. They start with ONE workflow, not a strategy deck.</strong><br>Pick the most painful manual process and automate it first.</p></div>
      <div class="hl"><p style="margin:0"><strong>2. They measure before and after.</strong><br>Time saved, errors reduced, cost cut. Hard numbers, not vibes.</p></div>
      <div class="hl"><p style="margin:0"><strong>3. They get the team involved early.</strong><br>AI adoption fails when it's mandated top-down. Wins come from the people closest to the work.</p></div>
      <p>That's exactly what the JMCB ASCEND framework is built for: identify the right workflow, pilot it, measure it, then scale.</p>
      <p style="text-align:center;margin:28px 0"><a href="${B.calendly}" class="btn">Show Me How This Applies to Us &rarr;</a></p>
      <p style="font-size:13px;color:#64748b">Jermaine</p>
    `, `The pattern I see with organizations at your AI readiness level.`),
  };
}

// ── DAY 7: Final urgency CTA ──
export function emailDay7(d: {
  firstName: string; organization: string; weakestDimension: string; overallScore: number;
}): { subject: string; html: string } {
  return {
    subject: `${d.firstName}, are you going to act on your AI readiness score?`,
    html: wrap(`
      <h2>${d.firstName}, One Last Thing</h2>
      <p>A week ago you assessed ${d.organization}'s AI readiness and scored ${d.overallScore}/100. I've sent you your breakdown, dug into your ${d.weakestDimension} gap, and shared what's working for similar organizations.</p>
      <p>Now I just have one question: <strong>are you going to act on it?</strong></p>
      <div class="hl"><p style="margin:0">Every week you wait, the gap between where you are and where your competitors are gets wider. AI adoption isn't slowing down.</p></div>
      <p>I have a few strategy call slots open this week. 30 minutes, no pitch, just a straight conversation about your results and what the first 90 days look like.</p>
      <p style="text-align:center;margin:28px 0"><a href="${B.calendly}" class="btn">Claim Your Strategy Call &rarr;</a></p>
      <p>If now isn't the right time, no worries. But your data stays in my system and I'll check back in when things shift.</p>
      <p style="font-size:13px;color:#64748b">Jermaine Barker<br>Founder, JMCB Technology Group<br><a href="${B.site}" style="color:${B.accent}">jmcbtech.com</a></p>
    `, `You scored ${d.overallScore}/100. Let's talk about what happens next.`),
  };
}

// ── PARTIAL RECOVERY: Abandoned at Q5 ──
export function emailPartialRecovery(d: {
  firstName: string; resumeToken: string; questionsAnswered: number;
}): { subject: string; html: string } {
  const left = 10 - d.questionsAnswered;
  return {
    subject: `${d.firstName}, you're ${d.questionsAnswered}/10 done. Finish in 2 minutes.`,
    html: wrap(`
      <h2>Your Assessment Is Waiting</h2>
      <p>${d.firstName}, you answered ${d.questionsAnswered} questions and stopped. You're past the hardest part.</p>
      <p>You have ${left} questions left. That's about 2 minutes. Then you get a full AI readiness report with dimension scores, benchmarks against similar organizations, and a priority action plan.</p>
      <p style="text-align:center;margin:28px 0"><a href="${B.site}/assessment?resume=${d.resumeToken}" class="btn">Finish Your Assessment &rarr;</a></p>
      <p style="font-size:13px;color:#64748b">Jermaine Barker<br>JMCB Technology Group</p>
    `, `You're ${d.questionsAnswered}/10 done with your AI Readiness Assessment. Pick up where you left off.`),
  };
}

// ── HOT LEAD ALERT TO JERMAINE ──
export function emailHotLeadAlert(d: {
  firstName: string; lastName: string; email: string; organization: string;
  role: string; companySize: string; overallScore: number;
  leadScore: string; weakestDimension: string; strongestDimension: string;
  reason: string;
}): { subject: string; html: string } {
  return {
    subject: `HOT LEAD: ${d.firstName} ${d.lastName} at ${d.organization} (${d.overallScore}/100)`,
    html: wrap(`
      <h2 style="color:${B.red}">&#128293; Hot Lead Alert</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tr><td style="padding:8px;border-bottom:1px solid #e2e8f0;font-weight:600;width:130px">Name</td><td style="padding:8px;border-bottom:1px solid #e2e8f0">${d.firstName} ${d.lastName}</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #e2e8f0;font-weight:600">Email</td><td style="padding:8px;border-bottom:1px solid #e2e8f0"><a href="mailto:${d.email}">${d.email}</a></td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #e2e8f0;font-weight:600">Organization</td><td style="padding:8px;border-bottom:1px solid #e2e8f0">${d.organization}</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #e2e8f0;font-weight:600">Role</td><td style="padding:8px;border-bottom:1px solid #e2e8f0">${d.role}</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #e2e8f0;font-weight:600">Size</td><td style="padding:8px;border-bottom:1px solid #e2e8f0">${d.companySize} employees</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #e2e8f0;font-weight:600">Score</td><td style="padding:8px;border-bottom:1px solid #e2e8f0"><strong>${d.overallScore}/100</strong></td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #e2e8f0;font-weight:600">Lead Score</td><td style="padding:8px;border-bottom:1px solid #e2e8f0"><span style="background:${B.red};color:#fff;padding:2px 10px;border-radius:4px;font-weight:700;font-size:12px">${d.leadScore.toUpperCase()}</span></td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #e2e8f0;font-weight:600">Weakest</td><td style="padding:8px;border-bottom:1px solid #e2e8f0">${d.weakestDimension}</td></tr>
        <tr><td style="padding:8px;font-weight:600">Strongest</td><td style="padding:8px">${d.strongestDimension}</td></tr>
      </table>
      <div class="hl"><strong>Why hot:</strong> ${d.reason}</div>
      <p><strong>Action:</strong> Reach out within 24 hours. This lead has high buying signals.</p>
      <p style="text-align:center;margin:20px 0"><a href="mailto:${d.email}" class="btn">Email ${d.firstName} Now &rarr;</a></p>
    `, `Hot lead: ${d.firstName} from ${d.organization}`),
  };
}
