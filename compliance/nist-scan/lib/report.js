'use strict';
const ICON = { PASS: '✅', WARN: '⚠️', FAIL: '❌', NA: '➖' };

function md(result) {
  const L = [];
  L.push(`# NIST Compliance Scorecard — ${result.platform}`);
  L.push('');
  L.push(`Repo: \`${result.repo}\` · Stack: ${result.stack.join(', ') || 'n/a'} · Scanned: ${result.scannedAt.slice(0, 16).replace('T', ' ')} UTC`);
  L.push('');
  L.push(`Frameworks: ${result.frameworks.join(' · ')}`);
  L.push('');
  L.push(`## Score: **${result.overall.pct}%** (${result.overall.pass} pass · ${result.overall.warn} warn · ${result.overall.fail} fail · ${result.overall.na} n/a)`);
  L.push('');
  L.push('| CSF 2.0 Function | Score | Pass | Warn | Fail | N/A |');
  L.push('|---|---|---|---|---|---|');
  for (const [fn, s] of Object.entries(result.byFunction)) L.push(`| ${fn} | ${s.pct === null ? '—' : s.pct + '%'} | ${s.pass} | ${s.warn} | ${s.fail} | ${s.na} |`);
  L.push('');
  if (result.topFindings.length) { L.push('## Priority findings'); L.push(''); result.topFindings.forEach((f, i) => L.push(`${i + 1}. ${f}`)); L.push(''); }
  const table = (controls, extraCol) => {
    L.push(`| | ID | Control | CSF 2.0 | SP 800-53 | SP 800-171 | ${extraCol || 'Privacy Fw'} | Evidence |`);
    L.push('|---|---|---|---|---|---|---|---|');
    for (const c of controls) {
      const extra = extraCol ? (c.hipaa || c.glba || c.pci || (c.sp800171 || []).join(' ') || '') : (c.privacy || '');
      L.push(`| ${ICON[c.status]}${c.waived ? ' (waived)' : ''} | ${c.id} | ${c.title} | ${c.csf} | ${(c.sp80053 || []).join(', ')} | ${(c.sp800171 || []).join(', ')} | ${extra} | ${c.evidence.replace(/\|/g, '/')} |`);
    }
    L.push('');
    const withFindings = controls.filter(c => c.findings && c.findings.length && c.status !== 'PASS');
    if (withFindings.length) {
      L.push('<details><summary>Finding details</summary>'); L.push('');
      for (const c of withFindings) {
        L.push(`**${c.id} ${c.title}**${c.waived ? ` — waived: ${c.waived}` : ''}`); L.push('');
        for (const f of c.findings) L.push(`- \`${f.file}${f.line ? ':' + f.line : ''}\` ${f.text.replace(/\|/g, '/')}`);
        L.push('');
      }
      L.push('</details>'); L.push('');
    }
  };
  L.push('## NIST base controls'); L.push('');
  table(result.controls);
  for (const [key, o] of Object.entries(result.overlays)) {
    L.push(`## Overlay: ${o.title}`); L.push('');
    table(o.controls, key.toUpperCase() + ' ref');
  }
  L.push('---'); L.push('Scoring: PASS=1, WARN=0.5, FAIL=0, weighted (3 critical / 2 important / 1 hygiene). N/A excluded. Waivers in `compliance/nist-scan.config.json` count as PASS but stay visible.');
  return L.join('\n');
}

function fleetMd(results) {
  const L = ['# JMCB Fleet — NIST Compliance Scorecard', '', `Scanned ${results[0]?.scannedAt.slice(0, 10)} · ${results.length} platforms · NIST CSF 2.0 / SP 800-53 r5 / SP 800-171 r2 / Privacy Framework + overlays`, ''];
  L.push('| Platform | Score | GOVERN | IDENTIFY | PROTECT | DETECT | RESPOND | RECOVER | PRIVACY | Overlays | Critical fails |');
  L.push('|---|---|---|---|---|---|---|---|---|---|---|');
  for (const r of [...results].sort((a, b) => (b.overall.pct ?? -1) - (a.overall.pct ?? -1))) {
    const f = r.byFunction; const p = x => x.pct === null ? '—' : x.pct + '%';
    const crit = [...r.controls, ...Object.values(r.overlays).flatMap(o => o.controls)].filter(c => c.status === 'FAIL' && c.weight === 3 && !c.waived).map(c => c.id).join(' ');
    L.push(`| ${r.platform} | **${r.overall.pct}%** | ${p(f.GOVERN)} | ${p(f.IDENTIFY)} | ${p(f.PROTECT)} | ${p(f.DETECT)} | ${p(f.RESPOND)} | ${p(f.RECOVER)} | ${p(f.PRIVACY)} | ${Object.keys(r.overlays).join(', ') || '—'} | ${crit || '—'} |`);
  }
  L.push('');
  // fleet-wide control heatmap
  L.push('## Control heatmap (base controls)'); L.push('');
  const ids = results[0].controls.map(c => c.id);
  L.push(`| Control | ${results.map(r => r.platform).join(' | ')} |`);
  L.push(`|---|${results.map(() => '---').join('|')}|`);
  for (const id of ids) {
    const title = results[0].controls.find(c => c.id === id).title;
    L.push(`| ${id} ${title} | ${results.map(r => ICON[r.controls.find(c => c.id === id).status]).join(' | ')} |`);
  }
  L.push('');
  L.push('## Fleet-wide gaps (FAIL on ≥ half of applicable platforms)'); L.push('');
  for (const id of ids) {
    const cs = results.map(r => r.controls.find(c => c.id === id)).filter(c => c.status !== 'NA');
    const fails = cs.filter(c => c.status === 'FAIL').length;
    if (cs.length && fails >= cs.length / 2) L.push(`- **${id}** ${cs[0].title} — fails on ${fails}/${cs.length} (${cs[0].csf}; ${cs[0].sp80053.join(', ')})`);
  }
  return L.join('\n');
}

function soc2Md(result) {
  const s = result.soc2; const L = [];
  L.push(`# SOC 2 Readiness — ${result.platform}`); L.push('');
  L.push(`Trust Services Criteria (AICPA TSC 2017 / 2022 PoF) · categories in scope: ${s.categories.join(', ')} · scanned ${result.scannedAt.slice(0, 10)}`); L.push('');
  L.push(`> **This is a readiness assessment, not a SOC 2 report.** A SOC 2 Type I attests control *design* at a point in time; Type II attests *operating effectiveness* over 3–12 months. Both require an independent CPA firm. Technical criteria below are scored from repo evidence; organizational criteria are scored on whether the document an auditor will request exists.`); L.push('');
  L.push(`## Readiness: **${s.overall.pct}%** — ${s.readiness}`); L.push('');
  L.push('| Category | Score | Pass | Warn | Fail |'); L.push('|---|---|---|---|---|');
  for (const [k, v] of Object.entries(s.byCategory)) L.push(`| ${k} | ${v.pct === null ? '— (out of scope)' : v.pct + '%'} | ${v.pass} | ${v.warn} | ${v.fail} |`);
  L.push('');
  if (s.orgGaps.length) { L.push('## Documents an auditor will ask for that do not exist'); L.push(''); s.orgGaps.forEach(g => L.push(`- [ ] ${g}`)); L.push(''); }
  const techFails = s.criteria.filter(c => c.kind === 'tech' && c.status === 'FAIL');
  if (techFails.length) { L.push('## Technical criteria failing'); L.push(''); techFails.forEach(c => L.push(`- **${c.id}** ${c.title} — ${c.evidence}`)); L.push(''); }
  L.push('## All criteria'); L.push('');
  let area = '';
  for (const c of s.criteria) {
    if (c.area !== area) { area = c.area; L.push(`### ${area}`); L.push(''); L.push('| | TSC | Criterion | Type | Evidence / gap |'); L.push('|---|---|---|---|---|'); }
    L.push(`| ${ICON[c.status]} | ${c.id} | ${c.title} | ${c.kind === 'tech' ? 'technical ← ' + (c.map || []).join(' ') : 'organizational'} | ${c.evidence.replace(/\|/g, '/')} |`);
    const next = s.criteria[s.criteria.indexOf(c) + 1]; if (!next || next.area !== area) L.push('');
  }
  return L.join('\n');
}

function soc2FleetMd(results) {
  const L = ['# JMCB Fleet — SOC 2 Readiness Findings', '', `Scanned ${results[0]?.scannedAt.slice(0, 10)} · ${results.length} platforms · AICPA Trust Services Criteria`, ''];
  L.push('> Readiness assessment from repo evidence + policy-document presence. Not an attestation. See per-platform reports for criterion-level detail.'); L.push('');
  L.push('| Platform | Tier | Readiness | Security (CC) | Availability | Confidentiality | Proc. integrity | Privacy | Phase |'); L.push('|---|---|---|---|---|---|---|---|---|');
  const p = v => v.pct === null ? '—' : v.pct + '%';
  for (const r of [...results].sort((a, b) => (b.soc2.overall.pct ?? -1) - (a.soc2.overall.pct ?? -1))) {
    const b = r.soc2.byCategory;
    L.push(`| ${r.platform} | T${r.tier || '?'} | **${r.soc2.overall.pct}%** | ${p(b.Security)} | ${p(b.Availability)} | ${p(b.Confidentiality)} | ${p(b['Processing integrity'])} | ${p(b.Privacy)} | ${r.soc2.readiness.split(' (')[0]} |`);
  }
  L.push('');
  L.push('## Findings'); L.push('');
  // organizational gaps — fleet-wide, since policies are org-level and one policy set covers all platforms
  const gapCount = new Map();
  for (const r of results) for (const g of r.soc2.orgGaps) gapCount.set(g, (gapCount.get(g) || 0) + 1);
  L.push('### F-1 · Organizational controls: no policy set exists anywhere in the fleet'); L.push('');
  L.push('SOC 2 CC1, CC3, CC5.3, CC9.2 and the A/C/P organizational criteria are satisfied by **company-level** documents, not per-repo code. One policy set covers every platform. Missing today:'); L.push('');
  for (const [g, n] of [...gapCount].sort((a, b) => b[1] - a[1])) L.push(`- [ ] ${g} — absent on ${n}/${results.length}`);
  L.push('');
  L.push('### F-2 · Technical criteria failing on ≥ half of applicable platforms'); L.push('');
  const ids = [...new Set(results.flatMap(r => r.soc2.criteria.filter(c => c.kind === 'tech').map(c => c.id)))];
  for (const id of ids) {
    const cs = results.map(r => r.soc2.criteria.find(c => c.id === id)).filter(c => c && c.status !== 'NA');
    const fails = cs.filter(c => c.status === 'FAIL').length;
    if (cs.length && fails >= cs.length / 2) L.push(`- **${id}** ${cs[0].title} — FAIL on ${fails}/${cs.length} · driven by NIST ${cs[0].map.join(', ')}`);
  }
  L.push('');
  L.push('### F-3 · Per-platform technical fails'); L.push('');
  for (const r of results) {
    const f = r.soc2.criteria.filter(c => c.kind === 'tech' && c.status === 'FAIL');
    if (f.length) L.push(`- **${r.platform}** (${f.length}): ${f.map(c => c.id).join(', ')}`);
  }
  L.push('');
  L.push('### F-4 · Scope recommendation'); L.push('');
  L.push('Pursue SOC 2 only where a buyer will ask for it: Tier-1 platforms with B2B/enterprise or healthcare procurement (TendivoHealth, Runwei Provider Portal, CaughtUp-B2B). Type I first on one platform is the cheapest proof; the policy set (F-1) is shared, so the second platform is incremental. Marketing/static sites (Tier 3) should not be in any SOC 2 system boundary.'); L.push('');
  L.push('### What a SOC 2 engagement still needs beyond this scan'); L.push('');
  ['Defined system boundary (which platforms, which infra, which people)', 'Vendor SOC 2 reports collected: Supabase, Vercel, Netlify, GitHub, Anthropic, Stripe, Twilio, Resend', 'Evidence of controls *operating*: access reviews (quarterly), restore test (annual), IR tabletop (annual), training completion', 'Readiness assessment by the audit firm, then 3-month minimum Type II observation window', 'Budget: ~$12k–25k first year for a small SaaS (audit + automation platform), per the Aug-2026 market scan in taxfolder/SECURITY-ROADMAP.md'].forEach(x => L.push(`- ${x}`));
  return L.join('\n');
}

module.exports = { md, fleetMd, soc2Md, soc2FleetMd, ICON };
