'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const SKIP_DIRS = new Set(['node_modules', '.git', '.next', 'dist', 'build', 'out', '.vercel', '.turbo', 'coverage', '.netlify', 'target', 'src-tauri/target', 'archive', 'corpus']);
const SRC_EXT = new Set(['.js', '.mjs', '.cjs', '.ts', '.tsx', '.jsx', '.sql', '.html', '.json', '.toml', '.yml', '.yaml', '.md', '.py', '.rs', '.env', '.example']);

class Repo {
  constructor(root) {
    this.root = path.resolve(root);
    this.name = path.basename(this.root);
    this._files = null;
    this._cache = new Map();
    this.pkg = this.json('package.json') || null;
    this.deps = Object.assign({}, this.pkg?.dependencies, this.pkg?.devDependencies);
    this.stack = this.detectStack();
  }

  files() {
    if (this._files) return this._files;
    const out = [];
    const walk = (dir, depth) => {
      if (depth > 8) return;
      let ents;
      try { ents = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
      for (const e of ents) {
        if (e.name.startsWith('.') && e.name !== '.github' && e.name !== '.gitignore' && !e.name.startsWith('.env')) continue;
        const full = path.join(dir, e.name);
        const rel = path.relative(this.root, full).replace(/\\/g, '/');
        if (e.isDirectory()) { if (!SKIP_DIRS.has(e.name) && rel !== 'compliance/nist-scan') walk(full, depth + 1); continue; }
        if (rel === 'compliance/scorecard.json' || rel === 'compliance/SCORECARD.md') continue;
        const ext = path.extname(e.name).toLowerCase();
        if (SRC_EXT.has(ext) || e.name.startsWith('.env') || e.name === 'CODEOWNERS' || e.name === '.gitignore') out.push(rel);
      }
    };
    walk(this.root, 0);
    this._files = out;
    return out;
  }

  exists(rel) { return fs.existsSync(path.join(this.root, rel)); }
  read(rel) {
    if (this._cache.has(rel)) return this._cache.get(rel);
    let s = '';
    try { s = fs.readFileSync(path.join(this.root, rel), 'utf8'); } catch { s = ''; }
    this._cache.set(rel, s);
    return s;
  }
  json(rel) { try { return JSON.parse(this.read(rel)); } catch { return null; } }
  readFirst(rels) { for (const r of rels) if (this.exists(r)) return { rel: r, text: this.read(r) }; return null; }

  /** files matching a predicate on relative path */
  find(pred) { return this.files().filter(pred); }
  /** grep across files: returns [{file, line, text}] */
  grep(re, filter = () => true, max = 50) {
    const hits = [];
    for (const f of this.files()) {
      if (!filter(f)) continue;
      const txt = this.read(f);
      if (!re.test(txt)) { re.lastIndex = 0; continue; }
      re.lastIndex = 0;
      const lines = txt.split('\n');
      for (let i = 0; i < lines.length; i++) {
        if (re.test(lines[i])) { hits.push({ file: f, line: i + 1, text: lines[i].trim().slice(0, 160) }); re.lastIndex = 0; if (hits.length >= max) return hits; }
        re.lastIndex = 0;
      }
    }
    return hits;
  }
  hasDep(...names) { return names.some(n => n in this.deps); }
  isCode(f) { return /\.(js|mjs|cjs|ts|tsx|jsx)$/.test(f) && !/\.(test|spec)\./.test(f) && !/(^|\/)(test|tests|__tests__|e2e|scripts)\//.test(f); }
  isSql(f) { return f.endsWith('.sql'); }
  isDoc(f) { return f.endsWith('.md'); }
  isClient(f) {
    // heuristic: files under app/, components/, pages/ (not api), public/, or .html, or 'use client'
    if (f.endsWith('.html')) return true;
    if (/(^|\/)(components|hooks|extension|public)\//.test(f)) return true;
    if (/(^|\/)pages\/(?!api\/)/.test(f)) return true;
    if (/(^|\/)app\//.test(f) && !/route\.(ts|js)$/.test(f) && !/(^|\/)app\/api\//.test(f)) {
      const t = this.read(f); return /^['"]use client['"]/m.test(t);
    }
    return false;
  }
  isServer(f) {
    return /(^|\/)(api|app\/api|netlify\/functions|server|lib\/server|src\/server|functions)\//.test(f) || /route\.(ts|js)$/.test(f) || /actions?\.(ts|js)$/.test(f) || /middleware\.(ts|js)$/.test(f) || /proxy\.(ts|js)$/.test(f);
  }

  git(args) { try { return execFileSync('git', args, { cwd: this.root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch { return null; } }
  remote() {
    const names = (this.git(['remote']) || '').split(/\r?\n/).filter(Boolean);
    const cfg = this.json('compliance/nist-scan.config.json') || {};
    const urls = names.map(n => ({ n, url: this.git(['remote', 'get-url', n]) || '' }));
    const pick = urls.find(x => cfg.remote && x.n === cfg.remote) || urls.find(x => /JMCB-TECHNOLOGY-GROUP/i.test(x.url)) || urls.find(x => x.n === 'origin') || urls[0];
    const url = pick ? pick.url : null;
    if (!url) return null;
    const m = url.match(/github\.com[:/]([^/]+)\/([^/.]+)/);
    return m ? { owner: m[1], repo: m[2] } : null;
  }
  gh(endpoint) {
    try { return JSON.parse(execFileSync('gh', ['api', endpoint], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })); } catch { return null; }
  }

  detectStack() {
    const s = new Set();
    if (this.hasDep('next')) s.add('next');
    else if (this.hasDep('react')) s.add('react-spa');
    if (this.hasDep('@supabase/supabase-js', '@supabase/ssr') || this.exists('supabase')) s.add('supabase');
    if (this.hasDep('drizzle-orm')) s.add('drizzle');
    if (this.hasDep('@prisma/client', 'prisma')) s.add('prisma');
    if (this.hasDep('pg', 'postgres')) s.add('postgres');
    if (this.exists('netlify/functions') || this.exists('netlify.toml')) s.add('netlify');
    if (this.exists('vercel.json') || this.exists('.vercel')) s.add('vercel');
    if (this.hasDep('stripe')) s.add('stripe');
    if (this.hasDep('@tauri-apps/api') || this.exists('src-tauri')) s.add('tauri');
    if (this.exists('extension/manifest.json') || this.exists('manifest.json')) s.add('browser-extension');
    if (!this.pkg) {
      if (this.find(f => f.endsWith('.html')).length) s.add('static-html');
      if (this.find(f => f.endsWith('.py')).length) s.add('python');
    } else if (!s.has('next') && !s.has('react-spa')) {
      if (this.find(f => f.endsWith('.html') && !f.includes('/')).length) s.add('static-html');
      else s.add('node');
    }
    if (this.exists('api') && !s.has('next')) s.add('serverless-api');
    return [...s];
  }
  has(stack) { return this.stack.includes(stack); }
  hasDatastore() { return this.has('supabase') || this.has('drizzle') || this.has('prisma') || this.has('postgres'); }
  hasServer() { return this.has('next') || this.has('netlify') || this.has('serverless-api') || this.has('node') || this.hasDatastore(); }
}

module.exports = { Repo };
