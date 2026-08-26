'use strict';
/**
 * JMCB NIST control catalog.
 * Every control maps to: NIST CSF 2.0 subcategory, SP 800-53 Rev 5 control(s),
 * SP 800-171 Rev 2 requirement(s) (where applicable), NIST Privacy Framework
 * subcategory (where applicable), and the probe that produces evidence.
 *
 * weight: 3 = critical, 2 = important, 1 = hygiene.
 */
const CONTROLS = [
  // ───────────── GOVERN ─────────────
  { id: 'GV-01', fn: 'GOVERN', title: 'Security policy is documented and published',
    csf: 'GV.PO-01', sp80053: ['PL-1', 'PM-1'], sp800171: ['3.12.4'], probe: 'securityPolicy', weight: 2 },
  { id: 'GV-02', fn: 'GOVERN', title: 'Ownership / accountability for code review is assigned',
    csf: 'GV.RR-02', sp80053: ['PM-2', 'CM-3'], sp800171: ['3.4.3'], probe: 'codeowners', weight: 1 },
  { id: 'GV-03', fn: 'GOVERN', title: 'Third-party dependency risk is managed (automated supply-chain monitoring)',
    csf: 'GV.SC-07', sp80053: ['SR-3', 'SA-9', 'RA-5'], sp800171: ['3.11.2'], probe: 'dependabot', weight: 2 },
  { id: 'GV-04', fn: 'GOVERN', title: 'Vulnerability disclosure channel exists',
    csf: 'GV.PO-02', sp80053: ['SI-5', 'IR-6'], sp800171: ['3.6.2'], probe: 'disclosureChannel', weight: 1 },

  // ───────────── IDENTIFY ─────────────
  { id: 'ID-01', fn: 'IDENTIFY', title: 'System / architecture is documented (asset inventory)',
    csf: 'ID.AM-01', sp80053: ['CM-8', 'PL-2'], sp800171: ['3.4.1'], probe: 'architectureDoc', weight: 1 },
  { id: 'ID-02', fn: 'IDENTIFY', title: 'Software inventory is pinned (lockfile committed)',
    csf: 'ID.AM-02', sp80053: ['CM-8', 'CM-2'], sp800171: ['3.4.1'], probe: 'lockfile', weight: 2 },
  { id: 'ID-03', fn: 'IDENTIFY', title: 'Known vulnerabilities in dependencies are identified (npm audit)',
    csf: 'ID.RA-01', sp80053: ['RA-5', 'SI-2'], sp800171: ['3.11.2', '3.14.1'], probe: 'npmAudit', weight: 3 },
  { id: 'ID-04', fn: 'IDENTIFY', title: 'Data inventory: personal / sensitive data columns are identified',
    csf: 'ID.AM-07', sp80053: ['PM-5(1)', 'PT-2'], privacy: 'ID.IM-P8', probe: 'piiInventory', weight: 2 },

  // ───────────── PROTECT ─────────────
  { id: 'PR-01', fn: 'PROTECT', title: 'Identity management: an authentication provider is integrated',
    csf: 'PR.AA-01', sp80053: ['IA-2', 'IA-8'], sp800171: ['3.5.1', '3.5.2'], probe: 'authProvider', weight: 3 },
  { id: 'PR-02', fn: 'PROTECT', title: 'Multi-factor authentication is available / enforced',
    csf: 'PR.AA-03', sp80053: ['IA-2(1)', 'IA-2(2)'], sp800171: ['3.5.3'], probe: 'mfa', weight: 2 },
  { id: 'PR-03', fn: 'PROTECT', title: 'Access is enforced server-side (middleware / route guards)',
    csf: 'PR.AA-05', sp80053: ['AC-3', 'AC-6'], sp800171: ['3.1.1', '3.1.2'], probe: 'serverSideAuthz', weight: 3 },
  { id: 'PR-04', fn: 'PROTECT', title: 'Row-level security enabled on every data table',
    csf: 'PR.AA-05', sp80053: ['AC-3', 'AC-6', 'SC-4'], sp800171: ['3.1.3'], probe: 'rls', weight: 3 },
  { id: 'PR-05', fn: 'PROTECT', title: 'Least privilege: privileged (service-role) keys never reach the client',
    csf: 'PR.AA-05', sp80053: ['AC-6', 'AC-6(5)'], sp800171: ['3.1.5'], probe: 'serviceRoleLeak', weight: 3 },
  { id: 'PR-06', fn: 'PROTECT', title: 'Secrets are not committed to source',
    csf: 'PR.DS-10', sp80053: ['IA-5', 'IA-5(7)', 'SC-28'], sp800171: ['3.5.10'], probe: 'hardcodedSecrets', weight: 3 },
  { id: 'PR-07', fn: 'PROTECT', title: 'Environment files are git-ignored and not tracked',
    csf: 'PR.DS-10', sp80053: ['IA-5', 'CM-6'], sp800171: ['3.5.10'], probe: 'envHygiene', weight: 3 },
  { id: 'PR-08', fn: 'PROTECT', title: 'Data in transit is protected (HSTS / HTTPS enforcement)',
    csf: 'PR.DS-02', sp80053: ['SC-8', 'SC-8(1)', 'SC-23'], sp800171: ['3.13.8'], probe: 'hsts', weight: 2 },
  { id: 'PR-09', fn: 'PROTECT', title: 'Data at rest is on an encrypted managed datastore',
    csf: 'PR.DS-01', sp80053: ['SC-28', 'SC-28(1)'], sp800171: ['3.13.16'], probe: 'encryptedAtRest', weight: 2 },
  { id: 'PR-10', fn: 'PROTECT', title: 'Secure configuration baseline: browser security headers',
    csf: 'PR.PS-01', sp80053: ['CM-6', 'SC-18', 'SI-10'], sp800171: ['3.4.2'], probe: 'securityHeaders', weight: 2 },
  { id: 'PR-11', fn: 'PROTECT', title: 'Input validation on server boundaries',
    csf: 'PR.PS-01', sp80053: ['SI-10'], sp800171: ['3.14.1'], probe: 'inputValidation', weight: 2 },
  { id: 'PR-12', fn: 'PROTECT', title: 'Rate limiting / denial-of-service protection on APIs',
    csf: 'PR.IR-04', sp80053: ['SC-5', 'SC-5(2)'], sp800171: [], probe: 'rateLimit', weight: 2 },
  { id: 'PR-13', fn: 'PROTECT', title: 'Boundary protection: CORS origin allowlist',
    csf: 'PR.IR-01', sp80053: ['SC-7', 'AC-4'], sp800171: ['3.13.1'], probe: 'cors', weight: 1 },
  { id: 'PR-14', fn: 'PROTECT', title: 'Secure SDLC: CI enforces lint / typecheck / tests',
    csf: 'PR.PS-06', sp80053: ['SA-11', 'SA-15'], sp800171: [], probe: 'ciGates', weight: 2 },
  { id: 'PR-15', fn: 'PROTECT', title: 'Change control: protected default branch, PRs required',
    csf: 'PR.PS-01', sp80053: ['CM-3', 'CM-5'], sp800171: ['3.4.3', '3.4.5'], probe: 'branchProtection', weight: 2 },
  { id: 'PR-16', fn: 'PROTECT', title: 'Schema changes are versioned migrations',
    csf: 'PR.PS-01', sp80053: ['CM-3', 'CM-2'], sp800171: ['3.4.3'], probe: 'migrations', weight: 1 },
  { id: 'PR-17', fn: 'PROTECT', title: 'Static analysis / CodeQL or equivalent in CI',
    csf: 'PR.PS-06', sp80053: ['SA-11(1)', 'RA-5'], sp800171: ['3.11.2'], probe: 'staticAnalysis', weight: 1 },

  // ───────────── DETECT ─────────────
  { id: 'DE-01', fn: 'DETECT', title: 'Runtime error / exception monitoring',
    csf: 'DE.CM-09', sp80053: ['SI-4', 'AU-6'], sp800171: ['3.14.6'], probe: 'errorMonitoring', weight: 2 },
  { id: 'DE-02', fn: 'DETECT', title: 'Audit trail of security-relevant events (auth, admin, data changes)',
    csf: 'DE.CM-01', sp80053: ['AU-2', 'AU-3', 'AU-12'], sp800171: ['3.3.1', '3.3.2'], probe: 'auditLog', weight: 3 },
  { id: 'DE-03', fn: 'DETECT', title: 'Sensitive data is not written to logs',
    csf: 'DE.CM-09', sp80053: ['AU-3(3)', 'SI-12'], privacy: 'CT.DP-P4', probe: 'piiInLogs', weight: 3 },

  // ───────────── RESPOND ─────────────
  { id: 'RS-01', fn: 'RESPOND', title: 'Incident response procedure is documented',
    csf: 'RS.MA-01', sp80053: ['IR-1', 'IR-4', 'IR-8'], sp800171: ['3.6.1'], probe: 'incidentResponse', weight: 2 },
  { id: 'RS-02', fn: 'RESPOND', title: 'Breach-notification obligations are identified',
    csf: 'RS.CO-02', sp80053: ['IR-6', 'PT-1'], privacy: 'GV.PO-P5', probe: 'breachNotification', weight: 1 },

  // ───────────── RECOVER ─────────────
  { id: 'RC-01', fn: 'RECOVER', title: 'Backup / restore posture is documented',
    csf: 'RC.RP-01', sp80053: ['CP-9', 'CP-10'], sp800171: ['3.8.9'], probe: 'backups', weight: 2 },
  { id: 'RC-02', fn: 'RECOVER', title: 'Infrastructure is reproducible (deploy config committed)',
    csf: 'RC.RP-03', sp80053: ['CP-10', 'CM-2'], sp800171: [], probe: 'reproducibleDeploy', weight: 1 },

  // ───────────── PRIVACY (NIST Privacy Framework) ─────────────
  { id: 'PV-01', fn: 'PRIVACY', title: 'Privacy notice is published',
    csf: 'GV.PO-01', sp80053: ['PT-5'], privacy: 'CM.AW-P1', probe: 'privacyNotice', weight: 2 },
  { id: 'PV-02', fn: 'PRIVACY', title: 'Consent / opt-out mechanism for communications',
    csf: 'GV.PO-01', sp80053: ['PT-4'], privacy: 'CT.PO-P2', probe: 'consentOptOut', weight: 1 },
  { id: 'PV-03', fn: 'PRIVACY', title: 'Data retention / deletion capability',
    csf: 'PR.DS-01', sp80053: ['SI-12', 'MP-6'], privacy: 'CT.DM-P4', probe: 'dataDeletion', weight: 2 },
  { id: 'PV-04', fn: 'PRIVACY', title: 'No third-party trackers on data-entry surfaces',
    csf: 'PR.DS-02', sp80053: ['SC-7(10)', 'PT-3'], privacy: 'CT.DP-P1', probe: 'trackers', weight: 1 },
];

const FUNCTIONS = ['GOVERN', 'IDENTIFY', 'PROTECT', 'DETECT', 'RESPOND', 'RECOVER', 'PRIVACY'];

module.exports = { CONTROLS, FUNCTIONS };
