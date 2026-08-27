'use strict';
const fs = require('fs');
const path = require('path');
const { Repo } = require('./repo');
const { CONTROLS, FUNCTIONS } = require('./catalog');
const { probes } = require('./probes');
const { OVERLAYS } = require('./overlays');
const { evaluateSoc2 } = require('./soc2');

const SCORE = { PASS: 1, WARN: 0.5, FAIL: 0 };

function loadConfig(repo) {
  return repo.json('compliance/nist-scan.config.json') || repo.json('nist-scan.config.json') || {};
}

function runControl(repo, c) {
  let res;
  try { res = typeof c.probe === 'function' ? c.probe(repo) : probes[c.probe](repo); }
  catch (e) { res = { status: 'WARN', evidence: `probe error: ${e.message}` }; }
  return { ...c, probe: typeof c.probe === 'string' ? c.probe : c.id, ...res, findings: (res.findings || []).slice(0, 15) };
}

function scan(root, opts = {}) {
  const repo = new Repo(root);
  const cfg = loadConfig(repo);
  const overlays = opts.overlays || cfg.overlays || [];
  const platform = cfg.platform || repo.name;
  const controls = CONTROLS.map(c => runControl(repo, c));
  const overlayResults = {};
  for (const o of overlays) {
    if (!OVERLAYS[o]) continue;
    overlayResults[o] = { title: OVERLAYS[o].title, controls: OVERLAYS[o].controls.map(c => runControl(repo, c)) };
  }
  // accepted-risk waivers: { "PR-02": "reason" }
  const waivers = cfg.waivers || {};
  const all = [...controls, ...Object.values(overlayResults).flatMap(o => o.controls)];
  for (const c of all) if (waivers[c.id] && c.status !== 'PASS') { c.waived = waivers[c.id]; }

  const score = (list) => {
    const applicable = list.filter(c => c.status !== 'NA');
    const w = applicable.reduce((s, c) => s + c.weight, 0);
    const got = applicable.reduce((s, c) => s + c.weight * (c.waived ? 1 : SCORE[c.status]), 0);
    return { applicable: applicable.length, na: list.length - applicable.length, pass: list.filter(c => c.status === 'PASS').length, warn: list.filter(c => c.status === 'WARN').length, fail: list.filter(c => c.status === 'FAIL').length, pct: w ? Math.round(100 * got / w) : null };
  };
  const byFunction = Object.fromEntries(FUNCTIONS.map(f => [f, score(controls.filter(c => c.fn === f))]));
  const overall = score(all);
  const base = score(controls);
  const soc2 = evaluateSoc2(repo, all, cfg);
  return {
    soc2,
    platform, repo: repo.name, root: repo.root, stack: repo.stack, remote: repo.remote(), scannedAt: new Date().toISOString(),
    frameworks: ['NIST CSF 2.0', 'NIST SP 800-53 Rev 5', 'NIST SP 800-171 Rev 2', 'NIST Privacy Framework 1.0', ...overlays.map(o => OVERLAYS[o]?.title).filter(Boolean)],
    overall, base, byFunction, controls, overlays: overlayResults, waivers,
    topFindings: all.filter(c => c.status === 'FAIL' && !c.waived).sort((a, b) => b.weight - a.weight).slice(0, 8).map(c => `${c.id} ${c.title} — ${c.evidence}`),
  };
}

module.exports = { scan, SCORE };
