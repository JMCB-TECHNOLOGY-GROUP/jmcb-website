# Compliance — NIST scorecard

This folder holds the vendored JMCB NIST scanner and this platform's config.

- Frameworks: NIST CSF 2.0 · SP 800-53 Rev 5 · SP 800-171 Rev 2 · NIST Privacy Framework 1.0
- Every control is scored from **evidence in this repo** (files, schema, CI, GitHub API) — nothing is asserted on paper.

## Run

```powershell
npm run scan:nist          # writes compliance/SCORECARD.md + scorecard.json
```

Non-node checkout: `.\scan-nist.ps1`

## Config — `nist-scan.config.json`

- `overlays`: any of `hipaa`, `glba`, `pci`, `sp800171`
- `waivers`: `{ "PR-02": "reason accepted-risk" }` — counts as PASS but stays visible in the report
- `remote`: git remote name to use for GitHub-API probes (Dependabot, branch protection)

## CI

`.github/workflows/nist-scan.yml` runs on every PR, on main, and weekly; the scorecard lands in the job summary and as an artifact.
Add `--fail-under 60` to the run step to make it a blocking gate.

Source of truth for the scanner: `~/dev/jmcb-compliance-scan` (re-sync with `node install.js` there).
