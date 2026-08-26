#!/usr/bin/env node
'use strict';
/**
 * nist-scan — JMCB NIST compliance scorecard
 *
 *   nist-scan [repoPath]               scan one repo (default: cwd), print scorecard
 *   nist-scan . --md out.md --json out.json
 *   nist-scan --fleet fleet.json --out reports/     scan every platform in the manifest
 *   nist-scan . --fail-under 60        exit 1 if score < threshold (CI gate)
 *   nist-scan . --overlay hipaa,pci    override overlays from config
 */
const fs = require('fs');
const path = require('path');
const { scan } = require('../lib/scan');
const { md, fleetMd, soc2Md, soc2FleetMd, ICON } = require('../lib/report');

const args = process.argv.slice(2);
const flag = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
const has = (n) => args.includes(n);
const positional = args.filter((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1].startsWith('--') && !['--fleet', '--ci'].includes(args[i - 1]) ));

function printSummary(r) {
  console.log(`\n${r.platform}  [${r.stack.join(', ')}]  →  ${r.overall.pct}%   (${r.overall.pass}✅ ${r.overall.warn}⚠️ ${r.overall.fail}❌ ${r.overall.na}➖)`);
  for (const [fn, s] of Object.entries(r.byFunction)) console.log(`  ${fn.padEnd(9)} ${s.pct === null ? ' —' : String(s.pct).padStart(3) + '%'}`);
  const all = [...r.controls, ...Object.values(r.overlays).flatMap(o => o.controls)];
  for (const c of all) if (c.status !== 'NA') console.log(`  ${ICON[c.status]} ${c.id.padEnd(5)} ${c.title.slice(0, 60).padEnd(60)} ${c.evidence.slice(0, 90)}`);
}

if (has('--fleet')) {
  const manifest = JSON.parse(fs.readFileSync(flag('--fleet'), 'utf8'));
  const base = path.dirname(path.resolve(flag('--fleet')));
  const out = flag('--out') || path.join(base, 'reports');
  fs.mkdirSync(out, { recursive: true });
  const results = [];
  for (const p of manifest.platforms) {
    const root = path.resolve(base, p.path);
    if (!fs.existsSync(root)) { console.error(`skip ${p.name}: ${root} missing`); continue; }
    process.stdout.write(`scanning ${p.name} ...`);
    const r = scan(root, { overlays: p.overlays });
    r.platform = p.name; if (p.tier) r.tier = p.tier;
    results.push(r);
    fs.writeFileSync(path.join(out, `${p.name}.md`), md(r));
    fs.writeFileSync(path.join(out, `${p.name}.json`), JSON.stringify(r, null, 2));
    fs.writeFileSync(path.join(out, `${p.name}.SOC2.md`), soc2Md(r));
    console.log(` ${r.overall.pct}%`);
  }
  fs.writeFileSync(path.join(out, 'FLEET.md'), fleetMd(results));
  fs.writeFileSync(path.join(out, 'SOC2-FINDINGS.md'), soc2FleetMd(results));
  fs.writeFileSync(path.join(out, 'fleet.json'), JSON.stringify(results.map(r => ({ platform: r.platform, tier: r.tier, stack: r.stack, overall: r.overall, byFunction: r.byFunction, overlays: Object.keys(r.overlays), topFindings: r.topFindings, soc2: r.soc2, controls: [...r.controls, ...Object.values(r.overlays).flatMap(o => o.controls)].map(c => ({ id: c.id, fn: c.fn, title: c.title, status: c.status, weight: c.weight, evidence: c.evidence, csf: c.csf, sp80053: c.sp80053, sp800171: c.sp800171, privacy: c.privacy, waived: c.waived, findings: c.findings })) })), null, 2));
  console.log(`\nwrote ${results.length} reports + FLEET.md → ${out}`);
} else {
  const root = positional[0] || process.cwd();
  const overlays = flag('--overlay') ? flag('--overlay').split(',') : undefined;
  const r = scan(root, { overlays });
  if (flag('--md')) { fs.writeFileSync(flag('--md'), md(r)); fs.writeFileSync(flag('--md').replace(/.md$/i, '') + '.SOC2.md', soc2Md(r)); }
  if (flag('--json')) fs.writeFileSync(flag('--json'), JSON.stringify(r, null, 2));
  if (!has('--quiet')) { printSummary(r); console.log(`
  SOC 2 readiness: ${r.soc2.overall.pct}% — ${r.soc2.readiness}`); }
  const min = Number(flag('--fail-under') || 0);
  if (r.overall.pct < min) { console.error(`\nscore ${r.overall.pct}% < ${min}% threshold`); process.exit(1); }
}
