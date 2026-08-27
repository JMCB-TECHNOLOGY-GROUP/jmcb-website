'use strict';
/**
 * SOC 2 — AICPA Trust Services Criteria (2017, 2022 points of focus).
 * Two kinds of criteria:
 *   technical: derived from NIST base/overlay control results already computed (status = worst of the mapped controls)
 *   organizational: evidence = a policy/document an auditor will request; probed by looking for it in the repo
 *     (policies/, docs/, SECURITY.md, COMPLIANCE.md). Missing document = FAIL with the exact artifact needed.
 *
 * Categories: Security (CC, required for every SOC 2), Availability (A), Confidentiality (C),
 * Processing Integrity (PI), Privacy (P). Category applicability set per platform via config.soc2Categories.
 */
const { PASS, WARN, FAIL, NA } = require('./probes');

const POLICY_DIRS = ['policies', 'docs/policies', 'compliance/policies', 'docs/compliance', 'docs'];
const policyText = (r) => {
  const files = r.find(f => f.endsWith('.md') && (POLICY_DIRS.some(d => f.startsWith(d + '/')) || /^(SECURITY|COMPLIANCE|SECURITY-ROADMAP|CONTRIBUTING|CODE_OF_CONDUCT|README|CLAUDE)\.md$/i.test(f) || /^\.github\/(SECURITY|CONTRIBUTING|CODE_OF_CONDUCT)\.md$/i.test(f)));
  return { files, text: files.map(f => r.read(f)).join('\n') };
};
// doc probe: pass if any policy file name or heading matches `names`, or body matches `body` strongly
const doc = (names, body, artifact) => (r) => {
  const { files, text } = policyText(r);
  const byName = files.filter(f => names.some(n => n.test(f)));
  if (byName.length) {
    const confirms = byName.reduce((n, f) => n + (r.read(f).match(/\[CONFIRM/g) || []).length, 0);
    const pending = byName.some(f => /\bPENDING\b/.test(r.read(f)) && /restore|test log/i.test(f));
    if (pending) return FAIL(`document exists but the test has not been performed: ${byName[0]}`);
    if (confirms) return WARN(`document exists (${byName[0]}) with ${confirms} [CONFIRM] item(s) awaiting owner decision — not audit-ready until resolved`);
    return PASS(`document: ${byName.slice(0, 2).join(', ')}`);
  }
  const heading = new RegExp('^#+\\s*.*(' + names.map(n => n.source).join('|') + ')', 'im');
  if (heading.test(text)) return PASS('covered by a section in existing docs');
  if (body && body.test(text)) return WARN(`referenced in docs but no standalone document — auditor will ask for: ${artifact}`);
  return FAIL(`missing: ${artifact}`);
};

const CRITERIA = [
  // ── CC1 Control Environment ──
  { id: 'CC1.1', cat: 'Security', area: 'CC1 Control environment', title: 'Commitment to integrity and ethical values (code of conduct)', kind: 'org', probe: doc([/code[-_ ]?of[-_ ]?conduct/i, /ethics/i], /integrity|ethic/i, 'Code of Conduct / Acceptable Use Policy') },
  { id: 'CC1.2', cat: 'Security', area: 'CC1 Control environment', title: 'Board / owner oversight of internal control', kind: 'org', probe: doc([/governance/i, /oversight/i], /board|oversight|quarterly review/i, 'Governance charter (owner review cadence for security posture)') },
  { id: 'CC1.3', cat: 'Security', area: 'CC1 Control environment', title: 'Organizational structure, reporting lines, authorities', kind: 'org', probe: (r) => (r.exists('.github/CODEOWNERS') || /roles? and responsibilit|RACI|owner:/i.test(policyText(r).text)) ? PASS('ownership documented (CODEOWNERS / roles section)') : FAIL('missing: Roles & Responsibilities (who owns security, who approves changes)') },
  { id: 'CC1.4', cat: 'Security', area: 'CC1 Control environment', title: 'Competence: hiring, onboarding, security training', kind: 'org', probe: doc([/onboarding/i, /training/i, /hr[-_ ]?security/i], /onboard|training|background check/i, 'Onboarding/Offboarding + Security Awareness Training policy') },
  { id: 'CC1.5', cat: 'Security', area: 'CC1 Control environment', title: 'Accountability for internal-control responsibilities', kind: 'org', probe: doc([/information[-_ ]?security[-_ ]?policy/i, /\bisp\b/i, /security[-_ ]?policy/i], /security policy|accountab/i, 'Information Security Policy (signed by owner, annual review)') },
  // ── CC2 Communication ──
  { id: 'CC2.1', cat: 'Security', area: 'CC2 Communication', title: 'Relevant, quality information to support internal control', kind: 'tech', map: ['ID-01', 'ID-04'] },
  { id: 'CC2.2', cat: 'Security', area: 'CC2 Communication', title: 'Internal communication of objectives and responsibilities', kind: 'org', probe: (r) => (r.exists('CONTRIBUTING.md') || r.exists('.github/CONTRIBUTING.md') || r.exists('SECURITY.md') || r.exists('.github/SECURITY.md')) ? PASS('CONTRIBUTING / SECURITY communicate expectations to contributors') : FAIL('missing: CONTRIBUTING.md + SECURITY.md (how contributors must handle security)') },
  { id: 'CC2.3', cat: 'Security', area: 'CC2 Communication', title: 'External communication (privacy notice, disclosure channel, commitments)', kind: 'tech', map: ['GV-04', 'PV-01'] },
  // ── CC3 Risk Assessment ──
  { id: 'CC3.1', cat: 'Security', area: 'CC3 Risk assessment', title: 'Objectives specified clearly enough to identify risks', kind: 'org', probe: doc([/security[-_ ]?objectives/i, /risk[-_ ]?management/i], /objective/i, 'Risk Management Policy (objectives, risk appetite)') },
  { id: 'CC3.2', cat: 'Security', area: 'CC3 Risk assessment', title: 'Risks identified and analyzed (risk register)', kind: 'org', probe: doc([/risk[-_ ]?register/i, /risk[-_ ]?assessment/i], /risk register|risk assessment|threat model/i, 'Risk Assessment / Risk Register (annual, with likelihood × impact)') },
  { id: 'CC3.3', cat: 'Security', area: 'CC3 Risk assessment', title: 'Fraud risk considered', kind: 'org', probe: doc([/fraud/i], /fraud|abuse|insider/i, 'Fraud/abuse risk section in the Risk Assessment') },
  { id: 'CC3.4', cat: 'Security', area: 'CC3 Risk assessment', title: 'Changes that could affect internal control are identified', kind: 'tech', map: ['GV-03', 'PR-16'] },
  // ── CC4 Monitoring ──
  { id: 'CC4.1', cat: 'Security', area: 'CC4 Monitoring', title: 'Ongoing / separate evaluations of controls', kind: 'tech', map: ['GV-03', 'ID-03', 'PR-17'], note: 'this scan in CI is itself the evidence' },
  { id: 'CC4.2', cat: 'Security', area: 'CC4 Monitoring', title: 'Deficiencies evaluated and communicated / tracked', kind: 'org', probe: (r) => { const rm = r.remote(); if (!rm) return WARN('no GitHub remote; deficiency tracking unverifiable'); const iss = r.gh(`repos/${rm.owner}/${rm.repo}/issues?state=all&labels=security&per_page=1`); return Array.isArray(iss) && iss.length ? PASS('security-labelled issues tracked in GitHub') : WARN('no security-labelled issues — track scan findings as GitHub issues with a `security` label'); } },
  // ── CC5 Control Activities ──
  { id: 'CC5.1', cat: 'Security', area: 'CC5 Control activities', title: 'Control activities selected to mitigate risk', kind: 'org', probe: (r) => r.exists('compliance/nist-scan.config.json') ? PASS('control set declared in compliance/nist-scan.config.json') : FAIL('missing: declared control set') },
  { id: 'CC5.2', cat: 'Security', area: 'CC5 Control activities', title: 'General controls over technology', kind: 'tech', map: ['PR-10', 'PR-11', 'PR-14'] },
  { id: 'CC5.3', cat: 'Security', area: 'CC5 Control activities', title: 'Controls deployed through policies and procedures', kind: 'org', probe: (r) => { const n = policyText(r).files.filter(f => POLICY_DIRS.some(d => f.startsWith(d + '/'))).length; return n >= 5 ? PASS(`${n} policy/procedure docs`) : n ? WARN(`${n} policy doc(s); auditors expect ~10–15 (ISP, access, change, IR, BCP, vendor, data classification, retention, AUP, risk)`) : FAIL('missing: policies/ folder with the standard SOC 2 policy set'); } },
  // ── CC6 Logical & Physical Access ──
  { id: 'CC6.1', cat: 'Security', area: 'CC6 Logical & physical access', title: 'Logical access security software, infrastructure, architectures', kind: 'tech', map: ['PR-01', 'PR-04', 'PR-06', 'PR-07'] },
  { id: 'CC6.2', cat: 'Security', area: 'CC6 Logical & physical access', title: 'User registration, authorization, and de-provisioning', kind: 'tech', map: ['PR-01', 'PV-03'], org: doc([/access[-_ ]?control/i, /offboarding/i], /deprovision|offboard|access review/i, 'Access Control Policy (provisioning, quarterly access review, offboarding within 24h)') },
  { id: 'CC6.3', cat: 'Security', area: 'CC6 Logical & physical access', title: 'Role-based access, least privilege, periodic review', kind: 'tech', map: ['PR-03', 'PR-05'] },
  { id: 'CC6.4', cat: 'Security', area: 'CC6 Logical & physical access', title: 'Physical access (inherited from cloud provider)', kind: 'org', probe: doc([/vendor/i, /subprocessor/i], /SOC ?2 report|vendor.*(review|assessment)|inherited/i, 'Vendor register listing Supabase/Vercel/Netlify SOC 2 reports (physical controls inherited)') },
  { id: 'CC6.5', cat: 'Security', area: 'CC6 Logical & physical access', title: 'Disposal of data and assets', kind: 'tech', map: ['PV-03'] },
  { id: 'CC6.6', cat: 'Security', area: 'CC6 Logical & physical access', title: 'Boundary protection against external threats', kind: 'tech', map: ['PR-08', 'PR-12', 'PR-13'] },
  { id: 'CC6.7', cat: 'Security', area: 'CC6 Logical & physical access', title: 'Restrict transmission / movement of data', kind: 'tech', map: ['PR-08', 'PR-09'] },
  { id: 'CC6.8', cat: 'Security', area: 'CC6 Logical & physical access', title: 'Prevent / detect unauthorized or malicious software', kind: 'tech', map: ['ID-02', 'PR-17'] },
  // ── CC7 System Operations ──
  { id: 'CC7.1', cat: 'Security', area: 'CC7 System operations', title: 'Detect configuration changes and new vulnerabilities', kind: 'tech', map: ['GV-03', 'ID-03'] },
  { id: 'CC7.2', cat: 'Security', area: 'CC7 System operations', title: 'Monitor for anomalies and security events', kind: 'tech', map: ['DE-01', 'DE-02'] },
  { id: 'CC7.3', cat: 'Security', area: 'CC7 System operations', title: 'Evaluate security events to determine incidents', kind: 'tech', map: ['DE-02', 'RS-01'] },
  { id: 'CC7.4', cat: 'Security', area: 'CC7 System operations', title: 'Respond to identified incidents', kind: 'tech', map: ['RS-01', 'RS-02'] },
  { id: 'CC7.5', cat: 'Security', area: 'CC7 System operations', title: 'Recover from incidents', kind: 'tech', map: ['RC-01'] },
  // ── CC8 Change Management ──
  { id: 'CC8.1', cat: 'Security', area: 'CC8 Change management', title: 'Authorize, design, test, approve, and implement changes', kind: 'tech', map: ['PR-14', 'PR-15', 'PR-16'], org: doc([/change[-_ ]?management/i, /sdlc/i], /change management|pull request.*review|peer review/i, 'Change Management / SDLC Policy') },
  // ── CC9 Risk Mitigation ──
  { id: 'CC9.1', cat: 'Security', area: 'CC9 Risk mitigation', title: 'Mitigate risk of business disruption', kind: 'tech', map: ['RC-01', 'RC-02'], org: doc([/business[-_ ]?continuity/i, /disaster[-_ ]?recovery/i, /\bbcp\b/i, /\bdr[-_ ]?plan/i], /continuity|disaster recovery|RTO|RPO/i, 'Business Continuity / DR Plan with RTO/RPO') },
  { id: 'CC9.2', cat: 'Security', area: 'CC9 Risk mitigation', title: 'Vendor and business-partner risk management', kind: 'org', probe: doc([/vendor/i, /third[-_ ]?part/i, /subprocessor/i], /vendor|subprocessor|third-party/i, 'Vendor Management Policy + subprocessor list (Supabase, Vercel, Anthropic, Stripe, Resend, Twilio…)') },
  // ── A Availability ──
  { id: 'A1.1', cat: 'Availability', area: 'A1 Availability', title: 'Capacity monitoring and management', kind: 'tech', map: ['DE-01'] },
  { id: 'A1.2', cat: 'Availability', area: 'A1 Availability', title: 'Environmental protections, backups, recovery infrastructure', kind: 'tech', map: ['RC-01', 'RC-02'] },
  { id: 'A1.3', cat: 'Availability', area: 'A1 Availability', title: 'Recovery plan testing', kind: 'org', probe: doc([/restore[-_ ]?test/i, /dr[-_ ]?test/i], /restore test|tested.*(backup|restore)|tabletop/i, 'Evidence of a backup-restore test (dated log)') },
  // ── C Confidentiality ──
  { id: 'C1.1', cat: 'Confidentiality', area: 'C1 Confidentiality', title: 'Identify and maintain confidential information', kind: 'tech', map: ['ID-04', 'PR-04'], org: doc([/data[-_ ]?classification/i], /classif/i, 'Data Classification Policy (public / internal / confidential / restricted)') },
  { id: 'C1.2', cat: 'Confidentiality', area: 'C1 Confidentiality', title: 'Dispose of confidential information', kind: 'tech', map: ['PV-03'], org: doc([/retention/i], /retention|dispos/i, 'Data Retention & Disposal Policy') },
  // ── PI Processing Integrity ──
  { id: 'PI1.1', cat: 'Processing integrity', area: 'PI1 Processing integrity', title: 'Definitions of data and processing are documented', kind: 'tech', map: ['ID-01', 'PR-16'] },
  { id: 'PI1.2', cat: 'Processing integrity', area: 'PI1 Processing integrity', title: 'Inputs are complete, accurate, timely (validation)', kind: 'tech', map: ['PR-11'] },
  { id: 'PI1.3', cat: 'Processing integrity', area: 'PI1 Processing integrity', title: 'Processing is complete and accurate (tests)', kind: 'tech', map: ['PR-14'] },
  { id: 'PI1.4', cat: 'Processing integrity', area: 'PI1 Processing integrity', title: 'Outputs are complete, accurate, and protected', kind: 'tech', map: ['DE-03', 'PR-05'] },
  { id: 'PI1.5', cat: 'Processing integrity', area: 'PI1 Processing integrity', title: 'Stored data is complete and accurate (migrations, backups)', kind: 'tech', map: ['PR-16', 'RC-01'] },
  // ── P Privacy ──
  { id: 'P1.1', cat: 'Privacy', area: 'P1 Notice', title: 'Privacy notice provided', kind: 'tech', map: ['PV-01'] },
  { id: 'P2.1', cat: 'Privacy', area: 'P2 Choice & consent', title: 'Choice and consent obtained', kind: 'tech', map: ['PV-02'] },
  { id: 'P3.1', cat: 'Privacy', area: 'P3 Collection', title: 'Collection limited to what the notice states', kind: 'tech', map: ['ID-04', 'PV-04'] },
  { id: 'P4.1', cat: 'Privacy', area: 'P4 Use, retention, disposal', title: 'Use limited to identified purposes; retention; disposal', kind: 'tech', map: ['PV-03'] },
  { id: 'P5.1', cat: 'Privacy', area: 'P5 Access', title: 'Data-subject access and correction', kind: 'org', probe: (r) => { const h = r.grep(/export[_-]?(my)?[_-]?data|data[_-]?export|download my data|dsar|subject access/i, f => r.isCode(f) || r.isDoc(f), 3); return h.length ? PASS('data export / DSAR path', h) : FAIL('missing: data-subject access request (DSAR) procedure or export feature'); } },
  { id: 'P6.1', cat: 'Privacy', area: 'P6 Disclosure', title: 'Disclosure to third parties limited and tracked (subprocessors)', kind: 'org', probe: doc([/subprocessor/i, /vendor/i], /subprocessor|third part/i, 'Subprocessor list published in the privacy notice') },
  { id: 'P7.1', cat: 'Privacy', area: 'P7 Quality', title: 'Personal data accurate and complete', kind: 'tech', map: ['PR-11'] },
  { id: 'P8.1', cat: 'Privacy', area: 'P8 Monitoring', title: 'Privacy complaints and breach notification', kind: 'tech', map: ['RS-02', 'GV-04'] },
];

const RANK = { FAIL: 0, WARN: 1, PASS: 2, NA: 3 };

function evaluateSoc2(repo, nistControls, cfg = {}) {
  const cats = cfg.soc2Categories || ['Security', 'Availability', 'Confidentiality', 'Processing integrity', 'Privacy'];
  const byId = Object.fromEntries(nistControls.map(c => [c.id, c]));
  const results = CRITERIA.map(cr => {
    if (!cats.includes(cr.cat)) return { ...cr, status: 'NA', evidence: 'category out of scope for this platform', findings: [] };
    let res;
    if (cr.kind === 'tech') {
      const mapped = cr.map.map(id => byId[id]).filter(Boolean);
      const applicable = mapped.filter(c => c.status !== 'NA');
      if (!applicable.length) res = { status: 'NA', evidence: 'mapped NIST controls not applicable', findings: [] };
      else {
        const worst = applicable.reduce((w, c) => RANK[c.waived ? 'PASS' : c.status] < RANK[w] ? (c.waived ? 'PASS' : c.status) : w, 'PASS');
        res = { status: worst, evidence: applicable.map(c => `${c.id} ${c.waived ? 'waived' : c.status}: ${c.evidence}`).join(' · '), findings: applicable.flatMap(c => (c.findings || []).slice(0, 5)) };
      }
      if (cr.org) {
        let o; try { o = cr.org(repo); } catch (e) { o = WARN('probe error ' + e.message); }
        if (RANK[o.status] < RANK[res.status]) res.status = o.status;
        res.evidence += ` · policy: ${o.evidence}`;
      }
    } else {
      try { res = cr.probe(repo); } catch (e) { res = WARN('probe error ' + e.message); }
      res.findings = res.findings || [];
    }
    return { ...cr, ...res, probe: undefined, org: undefined };
  });
  const score = (list) => { const a = list.filter(c => c.status !== 'NA'); const pts = a.reduce((s, c) => s + (c.status === 'PASS' ? 1 : c.status === 'WARN' ? .5 : 0), 0); return { applicable: a.length, pass: a.filter(c => c.status === 'PASS').length, warn: a.filter(c => c.status === 'WARN').length, fail: a.filter(c => c.status === 'FAIL').length, pct: a.length ? Math.round(100 * pts / a.length) : null }; };
  const byCategory = {};
  for (const cat of ['Security', 'Availability', 'Confidentiality', 'Processing integrity', 'Privacy']) byCategory[cat] = score(results.filter(c => c.cat === cat));
  const orgGaps = results.filter(c => c.kind === 'org' && c.status === 'FAIL').map(c => c.evidence.replace(/^missing: /, ''));
  return { categories: cats, criteria: results, overall: score(results), byCategory, orgGaps, readiness: readinessLabel(score(results.filter(c => c.cat === 'Security'))) };
}

function readinessLabel(sec) {
  if (sec.pct === null) return 'n/a';
  if (sec.pct >= 85 && sec.fail === 0) return 'audit-ready (engage auditor, start observation window)';
  if (sec.pct >= 65) return 'remediation phase (close FAILs, then readiness assessment)';
  if (sec.pct >= 40) return 'foundation phase (policies + core technical controls missing)';
  return 'not started';
}

module.exports = { CRITERIA, evaluateSoc2 };
