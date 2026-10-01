#!/usr/bin/env node
// Smoke test against a DEPLOYED url — not against the source.
//
// CI already proves the code parses and the compliance gates pass. It has never
// proved the deployed thing works: the 1 Oct 2026 Annual Report release was
// verified by hand with curl, which is exactly the gap this closes.
//
// The checks are a recorded baseline of how the live site answers, so the test
// catches a CHANGE rather than asserting a guess. That keeps false failures near
// zero and still catches the two things that actually matter:
//   · a route that broke                  (200 -> 500, or an alias that stopped resolving)
//   · a route that stopped being private  (401 -> 200, the leak nobody notices)
//
// Usage
//   node scripts/smoke.mjs --record              record the baseline from the live site
//   node scripts/smoke.mjs --record --rediscover re-scan the repo for new routes first
//   node scripts/smoke.mjs                       check the live site against it
//   node scripts/smoke.mjs --url https://...     check some other deployment (a preview)
//   SMOKE_URL=https://... node scripts/smoke.mjs
//
// It sends no credentials and no cookies, so every expectation is the
// unauthenticated view — which is the view an outsider gets.
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const CONFIG = join(root, 'smoke.config.json');
const TIMEOUT_MS = 20000;
const args = process.argv.slice(2);
const flag = (n) => args.includes(n);
const opt = (n) => { const i = args.indexOf(n); return i === -1 ? null : args[i + 1]; };

function loadConfig() {
  if (!existsSync(CONFIG)) return { baseUrl: null, checks: [] };
  return JSON.parse(readFileSync(CONFIG, 'utf8'));
}

// Routes worth probing, discovered from the repo so a new endpoint is not
// silently untested. Covers every layout in use across these projects:
//   api/*.js              Vercel functions (Polintel, the static sites)
//   app|src/app/**/route  Next.js App Router handlers (Pinnacle, ASCEND, civic)
//   app|src/app/**/page   Next.js pages
//   pages/api/*           Next.js Pages Router
//   *.html                static pages next to index.html
function discoverPaths() {
  const found = new Set(['/']);

  // A route group like (marketing) and a private folder like _lib do not appear
  // in the url; a dynamic segment [id] needs a real value, so skip that subtree.
  const segment = (name) => {
    if (name.startsWith('_') || name.startsWith('.')) return null;
    if (name.startsWith('[')) return undefined;          // undefined = skip subtree
    if (name.startsWith('(') && name.endsWith(')')) return '';  // group: contributes nothing
    return '/' + name;
  };

  const walkFlat = (dir, prefix) => {
    if (!existsSync(dir)) return;
    for (const f of readdirSync(dir)) {
      if (f.startsWith('_') || !/\.(js|mjs|ts|tsx)$/.test(f)) continue;
      const name = f.replace(/\.(js|mjs|ts|tsx)$/, '');
      if (name.startsWith('[')) continue;
      found.add(prefix + (name === 'index' ? '' : '/' + name) || '/');
    }
  };

  walkFlat(join(root, 'api'), '/api');
  walkFlat(join(root, 'pages/api'), '/api');

  for (const base of ['app', 'src/app']) {
    const dir = join(root, base);
    if (!existsSync(dir)) continue;
    const walk = (d, url) => {
      for (const e of readdirSync(d)) {
        const p = join(d, e);
        let isDir = false;
        try { isDir = statSync(p).isDirectory(); } catch { continue; }
        if (isDir) {
          const seg = segment(e);
          if (seg === null || seg === undefined) continue;
          walk(p, url + seg);
        } else if (/^(route|page)\.(ts|js|tsx|jsx)$/.test(e)) {
          found.add(url || '/');
        }
      }
    };
    walk(dir, '');
  }

  for (const f of readdirSync(root)) {
    if (/\.html$/.test(f) && f !== 'index.html') found.add('/' + f.replace(/\.html$/, ''));
  }

  return [...found].sort();
}

async function probe(base, path) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(base + path, {
      redirect: 'manual',
      signal: ctl.signal,
      headers: { 'user-agent': 'jmcb-smoke/1' },
    });
    let body = '';
    try { body = (await res.text()).slice(0, 2000); } catch {}
    return { status: res.status, body };
  } catch (e) {
    return { status: 0, error: e.name === 'AbortError' ? 'timeout' : e.message, body: '' };
  } finally { clearTimeout(t); }
}

async function record(base) {
  const cfg = loadConfig();
  const paths = cfg.checks.length && !flag('--rediscover')
    ? cfg.checks.map((c) => c.path)
    : discoverPaths();
  console.log(`Recording baseline from ${base} (${paths.length} path(s))\n`);
  const checks = [];
  for (const path of paths) {
    const r = await probe(base, path);
    if (r.status === 0) { console.log(`  ${path}  UNREACHABLE (${r.error}) — skipped`); continue; }
    const check = { path, expect: r.status };
    // Pin a short, stable marker so a 200 that renders an error page still fails.
    const title = /<title>([^<]{1,80})<\/title>/i.exec(r.body);
    const err = /"error"\s*:\s*"([^"]{1,60})"/.exec(r.body);
    if (r.status === 200 && title) check.bodyIncludes = title[1].trim();
    else if (r.status >= 400 && err) check.bodyIncludes = err[1];
    checks.push(check);
    console.log(`  ${path}  ${r.status}${check.bodyIncludes ? '  ~ "' + check.bodyIncludes + '"' : ''}`);
  }
  writeFileSync(CONFIG, JSON.stringify({ baseUrl: cfg.baseUrl || base, checks }, null, 2) + '\n');
  console.log(`\nWrote ${checks.length} check(s) to smoke.config.json. Commit it.`);
  return 0;
}

async function check(base) {
  const cfg = loadConfig();
  if (!cfg.checks.length) {
    console.error('No checks recorded. Run: node scripts/smoke.mjs --record');
    return 0; // nothing recorded is not a regression
  }

  console.log(`Smoke: ${base}  (${cfg.checks.length} check(s))\n`);
  const results = await Promise.all(cfg.checks.map(async (c) => ({ c, r: await probe(base, c.path) })));

  let failed = 0;
  for (const { c, r } of results) {
    const want = Array.isArray(c.expect) ? c.expect : [c.expect];
    const problems = [];
    if (!want.includes(r.status)) {
      problems.push(`expected ${want.join(' or ')}, got ${r.status}${r.error ? ' (' + r.error + ')' : ''}`);
      // Name the leak rather than leaving it as a number that changed.
      if (want.every((w) => w === 401 || w === 403) && r.status === 200) {
        problems.push('A PRIVATE ROUTE IS ANSWERING PUBLICLY');
      }
    }
    if (c.bodyIncludes && !r.body.includes(c.bodyIncludes)) problems.push(`body no longer contains "${c.bodyIncludes}"`);
    if (c.bodyExcludes && r.body.includes(c.bodyExcludes)) problems.push(`body now contains "${c.bodyExcludes}"`);

    if (problems.length) { failed++; console.log(`  FAIL  ${c.path}\n          ${problems.join('\n          ')}`); }
    else console.log(`  ok    ${c.path}  ${r.status}`);
  }

  console.log(`\n${results.length - failed} passed, ${failed} failed`);
  return failed ? 1 : 0;
}

const base = (opt('--url') || process.env.SMOKE_URL || loadConfig().baseUrl || '').replace(/\/$/, '');

if (!base) {
  console.error('No url. Set "baseUrl" in smoke.config.json, or pass --url / SMOKE_URL.');
  // An unconfigured project must not fail its own CI; only --record insists.
  process.exitCode = flag('--record') ? 1 : 0;
} else {
  // process.exitCode, never process.exit(): the probes leave keep-alive sockets
  // open, and tearing the loop down on top of them asserts inside libuv on
  // Windows and exits 127, which CI reads as a broken runner, not a result.
  process.exitCode = flag('--record') ? await record(base) : await check(base);
}
