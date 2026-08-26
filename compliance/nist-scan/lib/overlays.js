'use strict';
/**
 * Regulatory overlays layered on the NIST base. Each overlay adds controls
 * (same shape as catalog entries) with their own probes. Activated per repo
 * via compliance/nist-scan.config.json → "overlays": [...].
 */
const { PASS, WARN, FAIL, NA } = require('./probes');

const docText = (r) => ['SECURITY.md', '.github/SECURITY.md', 'COMPLIANCE.md', 'SECURITY-ROADMAP.md', 'README.md', 'CLAUDE.md'].map(f => r.read(f)).join('\n') + r.find(f => /^docs\/.*\.md$/i.test(f)).map(f => r.read(f)).join('\n');

const OVERLAYS = {
  hipaa: {
    title: 'HIPAA Security Rule (45 CFR 164.3xx) — crosswalk via NIST SP 800-66r2',
    controls: [
      { id: 'HI-01', fn: 'PRIVACY', title: 'PHI never committed: synthetic test data policy', csf: 'PR.DS-01', sp80053: ['SA-3(2)', 'SI-12'], hipaa: '164.530(c)', weight: 3,
        probe: r => /synthetic|fake|never commit real patient|no real (patient|phi)/i.test(docText(r)) ? PASS('synthetic-data policy documented') : FAIL('no policy forbidding real PHI in repo') },
      { id: 'HI-02', fn: 'PROTECT', title: 'PHI access is logged (audit controls)', csf: 'DE.CM-01', sp80053: ['AU-2', 'AU-12'], hipaa: '164.312(b)', weight: 3,
        probe: r => { const h = r.grep(/audit|access_log|phi_access/i, f => r.isSql(f), 3); return h.length ? PASS('audit/access-log table in schema', h) : FAIL('no PHI access-log table'); } },
      { id: 'HI-03', fn: 'PROTECT', title: 'Client-side cached PHI is encrypted (offline stores)', csf: 'PR.DS-01', sp80053: ['SC-28(1)'], hipaa: '164.312(a)(2)(iv)', weight: 3,
        probe: r => { const idb = r.grep(/indexedDB|localforage|dexie|idb\b/i, f => r.isCode(f), 3); if (!idb.length) return NA('no client-side persistence'); const enc = r.grep(/crypto\.subtle|AES-GCM|encrypt\(|webcrypto/i, f => r.isCode(f), 3); return enc.length ? PASS('WebCrypto encryption alongside client persistence', enc) : FAIL('client-side store (IndexedDB) without encryption', idb); } },
      { id: 'HI-04', fn: 'PROTECT', title: 'Automatic session timeout', csf: 'PR.AA-03', sp80053: ['AC-11', 'AC-12'], hipaa: '164.312(a)(2)(iii)', weight: 2,
        probe: r => { const h = r.grep(/idle[_-]?timeout|session[_-]?timeout|inactivity|autoLogout|auto[_-]?logout/i, f => r.isCode(f), 3); return h.length ? PASS('session/idle timeout implemented', h) : FAIL('no automatic logoff'); } },
      { id: 'HI-05', fn: 'GOVERN', title: 'Business Associate Agreements identified for PHI processors', csf: 'GV.SC-05', sp80053: ['SA-9', 'PS-7'], hipaa: '164.308(b)', weight: 2,
        probe: r => /\bBAA\b|business associate/i.test(docText(r)) ? PASS('BAA requirements documented') : FAIL('no BAA inventory (Supabase, Vercel, Sentry, AI vendors all need one)') },
      { id: 'HI-06', fn: 'PROTECT', title: 'PHI not sent to third-party AI/telemetry without safeguards', csf: 'PR.DS-02', sp80053: ['SC-7(10)'], hipaa: '164.312(e)(1)', weight: 3,
        probe: r => { const ai = r.grep(/anthropic|openai|api\.anthropic\.com|generateText|createClient\(.*ai/i, f => r.isCode(f) && r.isServer(f), 3); const sentry = r.hasDep('@sentry/nextjs'); const scrub = r.grep(/beforeSend|sendDefaultPii\s*:\s*false|scrub|redact|deidentif/i, f => r.isCode(f), 3); if (!ai.length && !sentry) return NA('no AI / telemetry egress'); return scrub.length ? PASS('egress present with redaction/scrub controls', scrub) : WARN('AI/telemetry egress with no visible de-identification or PII scrubbing', ai.slice(0, 2)); } },
    ],
  },
  glba: {
    title: 'GLBA Safeguards Rule (16 CFR 314) + IRC §7216 — tax data',
    controls: [
      { id: 'GL-01', fn: 'GOVERN', title: 'Qualified Individual + written information security program (WISP)', csf: 'GV.RR-01', sp80053: ['PM-2', 'PL-2'], glba: '314.4(a),(b)', weight: 3,
        probe: r => { const t = docText(r); const qi = /qualified individual/i.test(t), wisp = /\bWISP\b|written (information )?security program/i.test(t); return qi && wisp ? PASS('QI designated and WISP referenced') : (qi || wisp ? WARN(`${qi ? 'QI named' : 'WISP referenced'} but not both`) : FAIL('no QI / WISP')); } },
      { id: 'GL-02', fn: 'PROTECT', title: 'MFA mandatory for access to customer information (no opt-out)', csf: 'PR.AA-03', sp80053: ['IA-2(1)'], glba: '314.4(c)(5)', weight: 3,
        probe: r => { const h = r.grep(/mfa|totp|enrollFactor|challengeAndVerify|two[-_ ]?factor/i, f => r.isCode(f), 3); const enforce = r.grep(/aal2|requireMfa|mfa.*required|assuranceLevel/i, f => r.isCode(f), 3); if (enforce.length) return PASS('MFA enforced (AAL2 check)', enforce); if (h.length) return WARN('MFA available but not enforced', h); return FAIL('no MFA — GLBA requires it once customer data is stored server-side'); } },
      { id: 'GL-03', fn: 'PRIVACY', title: '§7216: no analytics/ad pixels on tax-document surfaces; no secondary use', csf: 'PR.DS-02', sp80053: ['PT-3', 'PT-4'], glba: 'IRC 7216', weight: 3,
        probe: r => { const t = r.grep(/gtag\(|googletagmanager|fbq\(|posthog|hotjar|clarity\.ms/i, f => r.isClient(f) || f.endsWith('.html') || /layout\.(tsx|jsx)$/.test(f), 5); return t.length ? FAIL('third-party pixel/analytics present on a tax-data app', t) : PASS('no ad/analytics pixels'); } },
      { id: 'GL-04', fn: 'PROTECT', title: 'Encryption of customer information at rest and in transit', csf: 'PR.DS-01', sp80053: ['SC-28', 'SC-8'], glba: '314.4(c)(3)', weight: 3,
        probe: r => r.has('supabase') ? PASS('Supabase at-rest + TLS in transit') : WARN('confirm encryption of customer information') },
      { id: 'GL-05', fn: 'RESPOND', title: 'FTC breach notification (30 days, 500+ consumers) documented', csf: 'RS.CO-02', sp80053: ['IR-6'], glba: '314.4(j)', weight: 2,
        probe: r => /30[- ]day|notification event|FTC/i.test(docText(r)) ? PASS('FTC notification rule documented') : FAIL('FTC 30-day notification not documented') },
      { id: 'GL-06', fn: 'PROTECT', title: 'Secure disposal of customer information (retention limit)', csf: 'PR.DS-01', sp80053: ['MP-6', 'SI-12'], glba: '314.4(c)(6)', weight: 2,
        probe: r => { const h = r.grep(/retention|dispos|purge|delete.*after|ttl/i, f => r.isCode(f) || r.isSql(f) || r.isDoc(f), 3); return h.length ? PASS('disposal / retention addressed', h) : FAIL('no disposal or retention rule'); } },
    ],
  },
  pci: {
    title: 'PCI DSS v4.0 touchpoints (SAQ-A posture: card data never touches the app)',
    controls: [
      { id: 'PC-01', fn: 'PROTECT', title: 'Card data handled only by PCI-compliant processor (no PAN in app)', csf: 'PR.DS-01', sp80053: ['SC-28'], pci: '3.x', weight: 3,
        probe: r => { const pan = r.grep(/card[_-]?number|\bpan\b|cvv|cvc|expiry/i, f => r.isCode(f) || r.isSql(f), 5).filter(h => !/stripe|last4|brand|exp_month|exp_year/i.test(h.text)); return pan.length ? FAIL('raw card fields referenced in app code/schema', pan) : PASS('no raw card data; processor-hosted (Stripe)'); } },
      { id: 'PC-02', fn: 'PROTECT', title: 'Payment webhooks verify processor signature', csf: 'PR.AA-05', sp80053: ['SC-8', 'SI-10'], pci: '6.4', weight: 3,
        probe: r => { const wh = r.grep(/webhook/i, f => r.isCode(f) && r.isServer(f), 10); if (!wh.length) return NA('no payment webhooks'); const sig = r.grep(/constructEvent|webhooks\.constructEvent|stripe-signature/i, f => r.isCode(f), 3); return sig.length ? PASS('Stripe signature verification', sig) : FAIL('webhook handler without signature verification', wh.slice(0, 3)); } },
      { id: 'PC-03', fn: 'PROTECT', title: 'Processor secret keys server-side only', csf: 'PR.AA-05', sp80053: ['IA-5'], pci: '8.6', weight: 3,
        probe: r => { const h = r.grep(/sk_(live|test)_|STRIPE_SECRET/i, f => r.isCode(f) && r.isClient(f), 3); return h.length ? FAIL('Stripe secret referenced client-side', h) : PASS('Stripe secret confined to server'); } },
    ],
  },
  sp800171: {
    title: 'NIST SP 800-171 Rev 2 / CMMC 2.0 Level 2 — CUI-handling posture (defense / gov)',
    controls: [
      { id: 'CU-01', fn: 'GOVERN', title: 'System Security Plan (SSP) exists', csf: 'GV.PO-01', sp80053: ['PL-2'], sp800171: ['3.12.4'], weight: 3,
        probe: r => r.find(f => /ssp|system[- ]security[- ]plan/i.test(f)).length || /system security plan|\bSSP\b/i.test(docText(r)) ? PASS('SSP present/referenced') : FAIL('no System Security Plan') },
      { id: 'CU-02', fn: 'GOVERN', title: 'Plan of Action & Milestones (POA&M)', csf: 'ID.IM-04', sp80053: ['CA-5'], sp800171: ['3.12.2'], weight: 2,
        probe: r => /poa&m|poam|plan of action/i.test(docText(r)) ? PASS('POA&M referenced') : FAIL('no POA&M') },
      { id: 'CU-03', fn: 'PROTECT', title: 'FIPS-validated cryptography / gov-cloud hosting posture declared', csf: 'PR.DS-01', sp80053: ['SC-13'], sp800171: ['3.13.11'], weight: 3,
        probe: r => /fips|gcc high|govcloud|fedramp/i.test(docText(r)) ? PASS('FIPS / gov-cloud posture declared') : FAIL('no FIPS / gov-cloud hosting declaration') },
      { id: 'CU-04', fn: 'PROTECT', title: 'Zero-egress / data-flow boundary documented', csf: 'PR.IR-01', sp80053: ['SC-7', 'AC-4'], sp800171: ['3.13.1', '3.1.3'], weight: 2,
        probe: r => /zero[- ]egress|data[- ]flow|boundary/i.test(docText(r)) ? PASS('egress boundary documented') : FAIL('no data-flow / boundary documentation') },
      { id: 'CU-05', fn: 'IDENTIFY', title: 'CUI identification & marking', csf: 'ID.AM-07', sp80053: ['PM-5(1)'], sp800171: ['3.8.4'], weight: 2,
        probe: r => /\bCUI\b|controlled unclassified/i.test(docText(r)) ? PASS('CUI handling referenced') : FAIL('CUI scope not identified') },
    ],
  },
};

module.exports = { OVERLAYS };
