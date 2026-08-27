'use strict';
/**
 * Evidence probes. Each returns { status: PASS|WARN|FAIL|NA, evidence: string, findings?: [{file,line,text}] }.
 * Probes read the real repo — nothing is asserted on paper.
 */
const { execFileSync } = require('child_process');
const path = require('path');

const PASS = (evidence, findings) => ({ status: 'PASS', evidence, findings });
const WARN = (evidence, findings) => ({ status: 'WARN', evidence, findings });
const FAIL = (evidence, findings) => ({ status: 'FAIL', evidence, findings });
const NA = (evidence) => ({ status: 'NA', evidence });

const DOC_FILES = ['SECURITY.md', '.github/SECURITY.md', 'docs/SECURITY.md', 'COMPLIANCE.md', 'SECURITY-ROADMAP.md', 'docs/security.md', 'docs/compliance.md'];
const docText = (r) => DOC_FILES.filter(f => r.exists(f)).map(f => r.read(f)).join('\n') + '\n' + r.read('README.md') + '\n' + r.read('CLAUDE.md') + '\n' + r.find(f => /^docs\/.*\.md$/i.test(f)).map(f => r.read(f)).join('\n');

const probes = {
  // ── GOVERN ──
  securityPolicy(r) {
    const f = DOC_FILES.filter(x => r.exists(x));
    if (f.length) return PASS(`policy doc(s): ${f.join(', ')}`);
    const readme = r.read('README.md');
    if (/#+\s*(security|compliance)/i.test(readme)) return WARN('README has a Security section but no standalone SECURITY.md');
    return FAIL('no SECURITY.md / COMPLIANCE.md');
  },
  codeowners(r) {
    if (r.exists('.github/CODEOWNERS') || r.exists('CODEOWNERS')) return PASS('CODEOWNERS present');
    if (r.exists('.github/pull_request_template.md')) return WARN('PR template but no CODEOWNERS');
    return FAIL('no CODEOWNERS or PR template');
  },
  dependabot(r) {
    if (!r.pkg) return NA('no package manifest');
    const local = r.exists('.github/dependabot.yml');
    const rm = r.remote();
    let alerts = null;
    if (rm) {
      const a = r.gh(`repos/${rm.owner}/${rm.repo}/dependabot/alerts?state=open&per_page=100`);
      if (Array.isArray(a)) alerts = a;
    }
    if (alerts) {
      const crit = alerts.filter(x => ['critical', 'high'].includes(x.security_advisory?.severity)).length;
      if (alerts.length === 0) return PASS(`Dependabot alerts enabled, 0 open${local ? ' (+ dependabot.yml)' : ''}`);
      if (crit) return FAIL(`${alerts.length} open Dependabot alerts (${crit} high/critical)`);
      return WARN(`${alerts.length} open Dependabot alerts (none high/critical)`);
    }
    if (local) return WARN('dependabot.yml present; could not read alert state via gh');
    return FAIL('no dependabot.yml and alerts not readable (scanning likely disabled)');
  },
  disclosureChannel(r) {
    const t = docText(r);
    if (/report(ing)?\s+a\s+vulnerabilit|security@|responsible disclosure/i.test(t)) return PASS('disclosure instructions found in docs');
    return FAIL('no vulnerability-reporting instructions');
  },

  // ── IDENTIFY ──
  architectureDoc(r) {
    const hits = r.find(f => /(architecture|adr|design|blueprint)/i.test(f) && f.endsWith('.md'));
    if (hits.length) return PASS(`architecture docs: ${hits.slice(0, 3).join(', ')}${hits.length > 3 ? ` (+${hits.length - 3})` : ''}`);
    const readme = r.read('README.md');
    if (/#+\s*(architecture|stack|tech stack|how it works)/i.test(readme)) return WARN('README describes the stack; no dedicated architecture/ADR doc');
    return FAIL('no architecture / ADR documentation');
  },
  lockfile(r) {
    if (!r.pkg) return NA('no package manifest');
    const lf = ['package-lock.json', 'pnpm-lock.yaml', 'yarn.lock', 'bun.lockb', 'bun.lock'].find(f => r.exists(f));
    if (!lf) return FAIL('no lockfile committed');
    const tracked = r.git(['ls-files', '--error-unmatch', lf]);
    if (r.git(['rev-parse']) !== null && tracked === null) return FAIL(`${lf} exists but is not tracked by git`);
    return PASS(`${lf} committed`);
  },
  npmAudit(r) {
    if (!r.pkg || !r.exists('package-lock.json')) return r.pkg ? WARN('no package-lock.json; npm audit cannot run') : NA('no package manifest');
    let out;
    try { out = execFileSync(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['audit', '--json', '--omit=dev'], { cwd: r.root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], timeout: 120000 }); }
    catch (e) { out = e.stdout; }
    let j; try { j = JSON.parse(out); } catch { return WARN('npm audit produced no parseable output (offline?)'); }
    const v = j.metadata?.vulnerabilities || {};
    const total = (v.critical || 0) + (v.high || 0) + (v.moderate || 0) + (v.low || 0);
    if (total === 0) return PASS('npm audit (prod deps): 0 vulnerabilities');
    const findings = Object.values(j.vulnerabilities || {}).slice(0, 15).map(x => ({ file: 'package-lock.json', line: 0, text: `${x.name} ${x.severity} — ${x.range || ''} ${(x.via || []).map(y => typeof y === 'string' ? y : y.title).filter(Boolean).slice(0, 2).join('; ')}` }));
    if (v.critical || v.high) return FAIL(`npm audit: ${v.critical || 0} critical, ${v.high || 0} high, ${v.moderate || 0} moderate, ${v.low || 0} low`, findings);
    return WARN(`npm audit: ${v.moderate || 0} moderate, ${v.low || 0} low`, findings);
  },
  piiInventory(r) {
    const sqlFiles = r.find(f => r.isSql(f));
    const schemaFiles = r.find(f => /schema\.(ts|js|prisma)$/.test(f) || /(^|\/)db\/schema\//.test(f));
    if (!sqlFiles.length && !schemaFiles.length) return r.hasDatastore() ? WARN('datastore present but no schema/migrations in repo to inventory') : NA('no datastore');
    const re = /\b(email|phone|mobile|ssn|social_security|dob|date_of_birth|birth|address|street|zip|postal|first_name|last_name|full_name|passport|national_id|nin|tax_id|ein|itin|diagnosis|medication|blood|patient|card_number|iban|account_number|salary|income)\w*\b/gi;
    const cols = new Map();
    for (const f of [...sqlFiles, ...schemaFiles]) {
      const t = r.read(f); let m;
      while ((m = re.exec(t))) cols.set(m[0].toLowerCase(), f);
    }
    if (!cols.size) return PASS('no personal-data columns detected in schema');
    const findings = [...cols].map(([c, f]) => ({ file: f, line: 0, text: c }));
    const documented = /(pii|personal data|data inventory|phi)/i.test(docText(r));
    return documented ? PASS(`${cols.size} personal-data column(s) detected and documented`, findings) : WARN(`${cols.size} personal-data column(s) detected; no written data inventory`, findings);
  },

  // ── PROTECT ──
  authProvider(r) {
    if (!r.hasServer()) return NA('no server / accounts');
    const providers = [['@supabase/supabase-js', 'Supabase Auth'], ['@supabase/ssr', 'Supabase Auth (SSR)'], ['next-auth', 'NextAuth'], ['@clerk/nextjs', 'Clerk'], ['@auth0/nextjs-auth0', 'Auth0'], ['firebase', 'Firebase Auth'], ['jsonwebtoken', 'JWT'], ['jose', 'JWT (jose)'], ['bcrypt', 'password hashing'], ['bcryptjs', 'password hashing'], ['@node-rs/argon2', 'argon2']];
    const found = providers.filter(([d]) => r.hasDep(d)).map(([, n]) => n);
    const uses = r.grep(/auth\.getUser|getSession|requireUser|requireAdmin|verifyToken|getServerSession|currentUser\(|auth\(\)|verifyJwt|jwtVerify/, f => r.isCode(f) && r.isServer(f), 5);
    if (found.length && uses.length) return PASS(`${found.join(', ')}; server-side session checks in ${uses.length}+ file(s)`);
    if (found.length) return WARN(`${found.join(', ')} installed but no server-side session verification found`);
    const anyAuth = r.grep(/authorization|bearer|api[_-]?key/i, f => r.isCode(f) && r.isServer(f), 3);
    if (anyAuth.length) return WARN('ad-hoc bearer/API-key check only; no identity provider');
    return FAIL('no authentication provider or server-side identity check');
  },
  mfa(r) {
    if (!r.hasServer()) return NA('no accounts');
    const hits = r.grep(/mfa|totp|two[-_ ]?factor|2fa|enrollFactor|challengeAndVerify|webauthn|passkey/i, f => r.isCode(f) || r.isDoc(f), 5);
    if (hits.some(h => r.isCode(h.file))) return PASS('MFA / TOTP / passkey code paths present', hits);
    if (hits.length) return WARN('MFA referenced only in docs; not implemented', hits);
    if (r.has('supabase')) return WARN('Supabase Auth supports MFA (TOTP) but nothing enrolls or enforces it');
    return FAIL('no MFA capability');
  },
  serverSideAuthz(r) {
    if (!r.hasServer()) return NA('no server');
    const mw = r.find(f => /^(src\/)?(middleware|proxy)\.(ts|js)$/.test(f));
    const serverFiles = r.find(f => r.isCode(f) && r.isServer(f) && !/middleware|proxy/.test(f));
    const GUARD = /getUser|getSession|requireUser|requireAdmin|getServerSession|currentUser|auth\(\)|verify(Token|Jwt|Signature)|validSignature|jwtVerify|authorization|x-api-key|CRON_SECRET|webhook.*secret|constructEvent|requireRole|assert(User|Admin|Auth)|isAdmin|checkAuth|withAuth|protectedProcedure|unauthenticated by design|public by design/i;
    const guarded = serverFiles.filter(f => GUARD.test(r.read(f)));
    const isMutating = (t) => /export\s+(async\s+)?function\s+(POST|PUT|PATCH|DELETE)\b/.test(t) || /app\.(post|put|delete|patch)\(/.test(t)
      || (/exports\.handler|export\s+(default\s+)?(async\s+)?function\s+handler/.test(t) && /(httpMethod|method)\s*(===|==|!==|!=)\s*['"](POST|PUT|PATCH|DELETE)['"]|\.(insert|update|upsert|delete)\(|INSERT INTO|UPDATE\s+\w+\s+SET|DELETE FROM/i.test(t));
    const unguarded = serverFiles.filter(f => !guarded.includes(f) && isMutating(r.read(f)));
    if (!serverFiles.length && !mw.length) return r.hasDatastore() ? WARN('datastore present but no server route handlers found; relying on RLS alone') : NA('no server routes');
    const findings = unguarded.slice(0, 12).map(f => ({ file: f, line: 0, text: 'mutating handler without a visible auth guard' }));
    if (unguarded.length === 0) return PASS(`${mw.length ? 'middleware + ' : ''}${guarded.length} guarded server file(s); 0 unguarded mutating handlers`);
    if (unguarded.length <= 2 || mw.length) return WARN(`${unguarded.length} mutating handler(s) with no visible guard${mw.length ? ' (middleware may cover them)' : ''}`, findings);
    return FAIL(`${unguarded.length} mutating handler(s) with no visible auth guard`, findings);
  },
  rls(r) {
    if (!r.has('supabase')) return r.hasDatastore() ? NA('non-Supabase datastore (row security handled in app layer — see PR-03)') : NA('no datastore');
    const sql = r.find(f => r.isSql(f) && /(supabase|migrations|schema)/i.test(f));
    if (!sql.length) return WARN('Supabase used but no SQL schema/migrations in repo; RLS state unverifiable here');
    const text = sql.map(f => r.read(f)).join('\n');
    const tables = new Set(); let m;
    const tre = /create\s+table\s+(?:if\s+not\s+exists\s+)?(?:public\.)?"?([a-z_][a-z0-9_]*)"?/gi;
    while ((m = tre.exec(text))) tables.add(m[1].toLowerCase());
    const rlsOn = new Set();
    const rre = /alter\s+table\s+(?:if\s+exists\s+)?(?:only\s+)?(?:public\.)?"?([a-z_][a-z0-9_]*)"?\s+enable\s+row\s+level\s+security/gi;
    while ((m = rre.exec(text))) rlsOn.add(m[1].toLowerCase());
    const loopAll = /foreach[\s\S]{0,400}enable\s+row\s+level\s+security/i.test(text) || /for\s+\w+\s+in\s+select[\s\S]{0,400}enable\s+row\s+level\s+security/i.test(text);
    const missing = [...tables].filter(t => !rlsOn.has(t) && !loopAll);
    const findings = missing.map(t => ({ file: 'supabase/', line: 0, text: `table "${t}" has no ENABLE ROW LEVEL SECURITY` }));
    if (!tables.size) return WARN('no CREATE TABLE statements found in SQL');
    if (!missing.length) return PASS(`${tables.size} table(s), RLS enabled on all`);
    if (missing.length / tables.size < 0.25) return WARN(`RLS on ${tables.size - missing.length}/${tables.size} tables`, findings);
    return FAIL(`RLS on ${tables.size - missing.length}/${tables.size} tables`, findings);
  },
  serviceRoleLeak(r) {
    if (!r.hasServer() && !r.has('static-html')) return NA('no client/server split');
    const hits = r.grep(/NEXT_PUBLIC_\w*(SERVICE_ROLE|SECRET|PRIVATE)|VITE_\w*(SERVICE_ROLE|SECRET)|SUPABASE_SERVICE_ROLE_KEY/, f => r.isCode(f) && r.isClient(f), 10)
      .concat(r.grep(/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{10,}/, f => f.endsWith('.html') || (r.isCode(f) && r.isClient(f)), 10).filter(h => /service_role/.test(Buffer.from((h.text.match(/eyJ[^"'`\s]+/) || [''])[0].split('.')[1] || '', 'base64').toString())));
    const pubPrefix = r.grep(/NEXT_PUBLIC_\w*(SERVICE|SECRET|PRIVATE|STRIPE_SECRET|API_KEY)/, f => r.isCode(f) || f.startsWith('.env'), 10);
    if (hits.length) return FAIL('privileged key referenced from client code', hits);
    if (pubPrefix.length) return WARN('secret-looking names exposed under a public env prefix', pubPrefix);
    return PASS('no privileged keys in client code');
  },
  hardcodedSecrets(r) {
    const pats = [
      [/sk_live_[0-9a-zA-Z]{20,}/, 'Stripe live secret'], [/sk-ant-[A-Za-z0-9_-]{20,}/, 'Anthropic key'], [/sk-[A-Za-z0-9]{40,}/, 'OpenAI-style key'],
      [/AKIA[0-9A-Z]{16}/, 'AWS access key'], [/AC[a-f0-9]{32}/, 'Twilio SID'], [/ghp_[A-Za-z0-9]{30,}/, 'GitHub token'], [/xox[bap]-[0-9A-Za-z-]{20,}/, 'Slack token'],
      [/-----BEGIN (RSA |EC )?PRIVATE KEY-----/, 'private key'], [/re_[A-Za-z0-9]{20,}/, 'Resend key'],
      [/(password|passwd|secret|api[_-]?key|token)\s*[:=]\s*['"][A-Za-z0-9_\-/+.]{16,}['"]/i, 'credential literal'],
    ];
    const findings = [];
    for (const [re, label] of pats) {
      for (const h of r.grep(re, f => (r.isCode(f) || f.endsWith('.html') || f.endsWith('.json') || f.endsWith('.py')) && !/\.example$/.test(f) && !/lock\.json$/.test(f) && !/package\.json$/.test(f), 10)) {
        if (/process\.env|import\.meta\.env|Deno\.env|os\.environ|\$\{|placeholder|your[_-]|example|xxx|<[^>]+>|REPLACE|TODO|\.test\.|mock/i.test(h.text)) continue;
        // JWTs: only flag service_role
        findings.push({ ...h, text: `${label}: ${h.text.slice(0, 100)}` });
      }
    }
    const jwt = r.grep(/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{10,}/, f => r.isCode(f) || f.endsWith('.html') || f.endsWith('.py'), 20);
    for (const h of jwt) {
      const payload = Buffer.from((h.text.match(/eyJ[^"'`\s]+/) || [''])[0].split('.')[1] || '', 'base64').toString();
      if (/service_role/.test(payload)) findings.push({ ...h, text: 'Supabase service_role JWT literal' });
    }
    if (!findings.length) return PASS('no credential literals detected in source');
    return FAIL(`${findings.length} credential-looking literal(s) in source`, findings);
  },
  envHygiene(r) {
    if (!r.git(['rev-parse'])) return NA('not a git repo');
    const gi = r.read('.gitignore');
    const ignores = /^\s*\.env(\.\*|\*|\.local|\.production)?\s*$/m.test(gi) || /^\s*\*\.env/m.test(gi) || /^\s*\.env\.\*/m.test(gi);
    const tracked = (r.git(['ls-files']) || '').split('\n').filter(f => /(^|\/)\.env(\.|$)/.test(f) && !/\.example$|\.sample$|\.template$/.test(f));
    if (tracked.length) return FAIL(`env file(s) tracked in git: ${tracked.join(', ')}`, tracked.map(f => ({ file: f, line: 0, text: 'tracked env file' })));
    const envs = r.find(f => /(^|\/)\.env(\.|$)/.test(f) && !/\.example$|\.sample$|\.template$/.test(f));
    if (envs.length && !ignores) return FAIL(`.env files present but .gitignore does not ignore .env*`);
    if (!ignores && r.pkg) return WARN('.gitignore does not ignore .env*');
    return PASS('.env* ignored, none tracked');
  },
  hsts(r) {
    if (!r.hasServer() && !r.has('vercel') && !r.has('static-html')) return NA('no web surface');
    const hits = r.grep(/strict-transport-security/i, f => /next\.config|vercel\.json|netlify\.toml|_headers|middleware|proxy|_adapter|headers\.(ts|js)/i.test(f) || r.isServer(f), 3);
    if (hits.length) return PASS('HSTS header set', hits);
    if (r.has('vercel') || r.has('next') || r.has('netlify')) return WARN('no explicit HSTS header; platform serves TLS but HSTS is not preloaded');
    return FAIL('no HSTS / TLS enforcement found');
  },
  encryptedAtRest(r) {
    if (r.has('supabase')) return PASS('Supabase Postgres (AES-256 at rest, managed)');
    if (r.has('drizzle') || r.has('prisma') || r.has('postgres')) {
      const t = docText(r) + r.read('.env.example');
      if (/neon|supabase|rds|cloud\s*sql|planetscale|vercel postgres/i.test(t)) return PASS('managed Postgres host referenced (encrypted at rest by provider)');
      return WARN('Postgres via ORM; host not identified in repo — confirm provider encrypts at rest');
    }
    if (r.has('tauri')) return WARN('local desktop storage; relies on OS disk encryption');
    if (!r.hasDatastore()) return NA('no persistent datastore');
    return WARN('datastore encryption posture unknown');
  },
  securityHeaders(r) {
    if (!r.hasServer() && !r.has('vercel') && !r.has('static-html')) return NA('no web surface');
    const cfg = r.find(f => /next\.config|vercel\.json|netlify\.toml|_headers$|middleware\.(ts|js)$|proxy\.(ts|js)$|_adapter|headers\.(ts|js)$/i.test(f)).map(f => r.read(f)).join('\n');
    const want = { 'Content-Security-Policy': /content-security-policy/i, 'X-Frame-Options / frame-ancestors': /x-frame-options|frame-ancestors/i, 'X-Content-Type-Options': /x-content-type-options/i, 'Referrer-Policy': /referrer-policy/i, 'Permissions-Policy': /permissions-policy/i };
    const have = Object.entries(want).filter(([, re]) => re.test(cfg)).map(([k]) => k);
    const missing = Object.keys(want).filter(k => !have.includes(k));
    if (have.length === 5) return PASS('all 5 baseline headers configured');
    if (have.length >= 3) return WARN(`headers present: ${have.join(', ')}; missing: ${missing.join(', ')}`);
    return FAIL(`security headers missing: ${missing.join(', ')}`);
  },
  inputValidation(r) {
    if (!r.hasServer()) return NA('no server');
    const lib = ['zod', 'yup', 'joi', 'valibot', 'ajv', 'class-validator', 'superstruct'].filter(d => r.hasDep(d));
    const uses = r.grep(/\.(safeParse|parse)\(|validate\(|schema\.validate|z\.object/, f => r.isCode(f) && r.isServer(f), 5);
    if (lib.length && uses.length) return PASS(`${lib.join(', ')} used in ${uses.length}+ server file(s)`);
    if (lib.length) return WARN(`${lib.join(', ')} installed but not seen in server handlers`);
    const manual = r.grep(/typeof\s+\w+\s*!==\s*['"]string['"]|\.trim\(\)\.length|isNaN\(|new URL\(/, f => r.isCode(f) && r.isServer(f), 3);
    if (manual.length) return WARN('manual validation only; no schema library');
    return FAIL('no input validation on server boundaries');
  },
  rateLimit(r) {
    if (!r.hasServer()) return NA('no server');
    const hits = r.grep(/rate[-_ ]?limit|@upstash\/ratelimit|express-rate-limit|Ratelimit|tooManyRequests|429/i, f => r.isCode(f) && !/\.test\./.test(f), 5);
    if (hits.some(h => /rate[-_ ]?limit|Ratelimit/i.test(h.text))) return PASS('rate limiting implemented', hits.slice(0, 3));
    if (r.has('vercel')) return WARN('no app-level rate limiting; Vercel firewall / WAF not verifiable from repo');
    return FAIL('no rate limiting');
  },
  cors(r) {
    if (!r.hasServer()) return NA('no server');
    const hits = r.grep(/access-control-allow-origin/i, f => r.isCode(f) || /vercel\.json|netlify\.toml/.test(f), 10);
    if (!hits.length) return r.has('next') ? PASS('same-origin only (no CORS headers emitted)') : WARN('no CORS configuration found');
    const star = hits.filter(h => /['"`]\*['"`]|:\s*\*\s*$|\*'/.test(h.text));
    if (star.length) return WARN('wildcard CORS (*) on some endpoints', star);
    return PASS('CORS with explicit origins', hits.slice(0, 3));
  },
  ciGates(r) {
    const wf = r.find(f => /^\.github\/workflows\/.*\.ya?ml$/.test(f));
    if (!wf.length) return r.pkg ? FAIL('no CI workflows') : NA('no build pipeline');
    const t = wf.map(f => r.read(f)).join('\n');
    const gates = [['lint', /\blint\b/], ['typecheck', /tsc|typecheck|type-check/], ['test', /\btest\b|vitest|jest|playwright/], ['build', /\bbuild\b/]].filter(([, re]) => re.test(t)).map(([n]) => n);
    if (gates.length >= 3) return PASS(`CI gates: ${gates.join(', ')} (${wf.length} workflow(s))`);
    if (gates.length) return WARN(`CI runs ${gates.join(', ')} only`);
    return WARN('CI present but no lint/test/typecheck/build gate detected');
  },
  branchProtection(r) {
    const rm = r.remote();
    if (!rm) return NA('no GitHub remote');
    const repo = r.gh(`repos/${rm.owner}/${rm.repo}`);
    if (!repo) return WARN('could not read repo via gh');
    const br = repo.default_branch;
    const prot = r.gh(`repos/${rm.owner}/${rm.repo}/branches/${br}/protection`);
    const rules = r.gh(`repos/${rm.owner}/${rm.repo}/rules/branches/${br}`);
    const hasRules = Array.isArray(rules) && rules.some(x => ['pull_request', 'required_status_checks', 'deletion', 'non_fast_forward'].includes(x.type));
    if (prot && (prot.required_pull_request_reviews || prot.required_status_checks)) return PASS(`${br} protected: ${[prot.required_pull_request_reviews && 'PR reviews', prot.required_status_checks && 'status checks'].filter(Boolean).join(', ')}`);
    if (hasRules) return PASS(`${br} governed by rulesets (${rules.map(x => x.type).join(', ')})`);
    return FAIL(`${br} has no branch protection / rulesets (direct pushes allowed)`);
  },
  migrations(r) {
    if (!r.hasDatastore()) return NA('no datastore');
    const dirs = ['supabase/migrations', 'drizzle', 'prisma/migrations', 'migrations', 'db/migrations'].filter(d => r.exists(d));
    if (dirs.length) return PASS(`versioned migrations: ${dirs.join(', ')}`);
    if (r.exists('supabase/schema.sql')) return WARN('single schema.sql, no versioned migrations');
    return FAIL('schema not under version control');
  },
  staticAnalysis(r) {
    const t = r.find(f => /^\.github\/workflows\//.test(f)).map(f => r.read(f)).join('\n');
    if (/codeql|semgrep|snyk|trivy|gitleaks|trufflehog/i.test(t)) return PASS('SAST / secret scanning in CI');
    if (r.hasDep('eslint-plugin-security')) return WARN('eslint-plugin-security only');
    if (!r.pkg) return NA('no build pipeline');
    return FAIL('no SAST / secret scanning in CI');
  },

  // ── DETECT ──
  errorMonitoring(r) {
    if (!r.hasServer() && !r.has('static-html')) return NA('no runtime');
    const tools = [['@sentry/nextjs', 'Sentry'], ['@sentry/node', 'Sentry'], ['@sentry/react', 'Sentry'], ['@vercel/analytics', 'Vercel Analytics'], ['@vercel/speed-insights', 'Vercel Speed Insights'], ['pino', 'pino'], ['winston', 'winston'], ['@axiomhq/js', 'Axiom'], ['posthog-js', 'PostHog'], ['@highlight-run/next', 'Highlight']].filter(([d]) => r.hasDep(d)).map(([, n]) => n);
    const uniq = [...new Set(tools)];
    if (uniq.some(x => /Sentry|Axiom|Highlight|pino|winston/.test(x))) return PASS(`${uniq.join(', ')}`);
    if (uniq.length) return WARN(`${uniq.join(', ')} only (analytics, not error monitoring)`);
    if (r.has('vercel') || r.has('next')) return WARN('relies on platform logs only; no error-monitoring SDK');
    return FAIL('no monitoring');
  },
  auditLog(r) {
    if (!r.hasDatastore()) return NA('no datastore');
    const sql = r.grep(/create\s+table\s+(?:if\s+not\s+exists\s+)?(?:public\.)?"?\w*(audit|activity_log|event_log|_log)\b/i, f => r.isSql(f) || /schema\.(ts|js)$/.test(f), 5);
    const code = r.grep(/audit[_-]?log|logActivity|recordEvent|writeAudit/i, f => r.isCode(f) && r.isServer(f), 5);
    if (sql.length && code.length) return PASS('audit table + server writes', sql.slice(0, 2));
    if (sql.length || code.length) return WARN('partial audit trail (table or writer, not both)', (sql.length ? sql : code).slice(0, 3));
    if (r.has('supabase')) return WARN('no application audit table; only Supabase auth/pg logs (short retention)');
    return FAIL('no audit trail');
  },
  piiInLogs(r) {
    if (!r.hasServer()) return NA('no server');
    // strip string literals so words inside log *messages* ("token refresh failed") don't count — only logged identifiers do
    const stripStr = (s) => s.replace(/`(?:\\.|[^`\\])*`|'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"/g, '""');
    const SENS = /(^|[^\w.])(email|phone|password|passwd|ssn|dob|patient|card_?number|cvv)\b|\.(email|phone|password|ssn|dob|address|token|access_token|refresh_token|api_key|apiKey|secret)\b|\b(token|access_token|refresh_token|api_key|apiKey|secret|password)\s*[,)]/i;
    const hits = r.grep(/console\.(log|info|debug|warn|error)\(/, f => r.isCode(f) && !/\.test\./.test(f), 200)
      .filter(h => SENS.test(stripStr(h.text)))
      .filter(h => !/\.length|count|error\.message|err\.message|typeof|has(Email|Phone)|!!|Boolean\(|\?\s*['"]set['"]|redact|mask|\.slice\(|\.substring\(|\*\*\*/i.test(h.text))
      .slice(0, 20);
    if (!hits.length) return PASS('no sensitive identifiers passed to console logging');
    if (hits.length <= 3) return WARN(`${hits.length} log call(s) reference sensitive fields`, hits);
    return FAIL(`${hits.length} log call(s) reference sensitive fields`, hits);
  },

  // ── RESPOND ──
  incidentResponse(r) {
    const t = docText(r);
    if (/incident[- ]response|incident response plan|IRP\b|runbook/i.test(t)) return PASS('incident-response procedure documented');
    if (/report(ing)?\s+a\s+vulnerabilit|security@/i.test(t)) return WARN('vulnerability intake exists but no incident-response procedure');
    return FAIL('no incident-response documentation');
  },
  breachNotification(r) {
    if (!r.hasDatastore()) return NA('no stored personal data');
    const t = docText(r);
    if (/breach[- ]notif|notice of breach|\b(30|45|60|72)[- ](day|hour)s?\b.*(breach|notif)/i.test(t)) return PASS('breach-notification obligations documented');
    return FAIL('breach-notification obligations not documented');
  },

  // ── RECOVER ──
  backups(r) {
    if (!r.hasDatastore()) return NA('no datastore');
    const t = docText(r);
    if (/backup|point[- ]in[- ]time|PITR|restore|disaster recovery|\bRPO\b|\bRTO\b/i.test(t)) return PASS('backup / restore posture documented');
    if (r.has('supabase')) return WARN('Supabase daily backups (Pro) assumed; not documented, PITR not confirmed');
    return FAIL('no backup / restore documentation');
  },
  reproducibleDeploy(r) {
    const f = ['vercel.json', 'netlify.toml', 'Dockerfile', 'docker-compose.yml', 'fly.toml', 'render.yaml', 'wrangler.toml', 'serverless.yml'].filter(x => r.exists(x));
    if (f.length) return PASS(`deploy config: ${f.join(', ')}`);
    if (r.has('next') && r.remote()) return WARN('Vercel git-integration assumed; no deploy config committed');
    if (!r.pkg) return NA('static or scripts only');
    return WARN('no deploy configuration committed');
  },

  // ── PRIVACY ──
  privacyNotice(r) {
    if (!r.hasServer() && !r.has('static-html')) return NA('no user-facing surface');
    const pages = r.find(f => /privacy/i.test(f) && /\.(tsx|jsx|html|md|mdx)$/.test(f));
    const links = r.grep(/href=["'][^"']*privacy/i, f => r.isClient(f) || f.endsWith('.html') || /(^|\/)app\/.*\.(tsx|jsx)$/.test(f), 3);
    if (pages.length) return PASS(`privacy page: ${pages[0]}`);
    if (links.length) return WARN('privacy link present but page not in repo', links);
    return FAIL('no privacy notice');
  },
  consentOptOut(r) {
    const comms = r.hasDep('resend', 'nodemailer', '@sendgrid/mail', 'twilio', 'postmark', 'mailgun.js', 'mailgun-js') || r.grep(/api\.resend\.com|sendgrid|twilio/i, f => r.isCode(f), 1).length;
    if (!comms) return NA('no outbound email/SMS');
    const hits = r.grep(/unsubscribe|opt[_-]?out|consent|STOP\b/i, f => r.isCode(f) || r.isSql(f), 5);
    if (hits.length) return PASS('consent / opt-out handled', hits.slice(0, 3));
    return FAIL('outbound comms with no unsubscribe / opt-out path');
  },
  dataDeletion(r) {
    if (!r.hasDatastore()) return NA('no stored personal data');
    const code = r.grep(/delete[_-]?(account|user|my[_-]?data)|deleteUser|admin\.deleteUser|right to (erasure|be forgotten)|retention/i, f => r.isCode(f) || r.isSql(f) || r.isDoc(f), 5);
    if (code.some(h => r.isCode(h.file) || r.isSql(h.file))) return PASS('deletion / retention implemented', code.slice(0, 3));
    if (code.length) return WARN('retention/deletion mentioned in docs only', code.slice(0, 3));
    return FAIL('no account-deletion or retention mechanism');
  },
  trackers(r) {
    if (!r.hasServer() && !r.has('static-html')) return NA('no web surface');
    const hits = r.grep(/googletagmanager|google-analytics|gtag\(|fbq\(|connect\.facebook\.net|hotjar|clarity\.ms|segment\.com|analytics\.js|tiktok\.com\/i18n\/pixel/i, f => r.isClient(f) || f.endsWith('.html') || /layout\.(tsx|jsx)$/.test(f), 5);
    const sensitive = r.has('supabase') || r.has('stripe') || r.hasDatastore();
    if (!hits.length) return PASS('no third-party trackers');
    if (sensitive) return WARN('third-party tracker on an app that stores personal data — keep off data-entry surfaces', hits);
    return PASS('tracker on marketing-only surface', hits);
  },
};

module.exports = { probes, PASS, WARN, FAIL, NA };
