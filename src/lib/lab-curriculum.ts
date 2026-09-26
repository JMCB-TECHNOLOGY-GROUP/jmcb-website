// ============================================================
// src/lib/lab-curriculum.ts — the Proof of Work Lab lesson plan, weeks 1-6.
//
// Three tracks per week:
//   core        — the Thursday session everyone attends. Follows WEEKS in
//                 src/lib/program.ts exactly (theme, project, rubric).
//   pl400       — Microsoft Power Platform Developer route. IMPORTANT: PL-400
//                 registration closes 16 October 2026 and the exam is then
//                 delivered as AB-400 (same certification, new outline). Cohort
//                 1 books in week 6 (5 November), so this route teaches the
//                 AB-400 "skills measured as of October 16, 2026" outline.
//   claude_arch — Claude Certified Architect, Foundations (CCAR-F).
//
// Every link below was checked to resolve on 26 September 2026. Sources and
// talking points for the facilitator: docs/lab/facilitator-talking-points.md.
// ============================================================

import type { LabLesson, LabResource, TrackKey } from "./lab-types";

const D = {
  w1: "2026-10-01",
  w2: "2026-10-08",
  w3: "2026-10-15",
  w4: "2026-10-22",
  w5: "2026-10-29",
  w6: "2026-11-05",
} as const;

// ---- Exam domains -------------------------------------------------------

// AB-400 (replaces PL-400 from 16 Oct 2026). Weights from the Microsoft Learn
// study guide, "Skills measured as of October 16, 2026".
const MS = {
  build: "Build Microsoft Power Platform solutions (15–20%)",
  ux: "Extend the user experience (25–30%)",
  extend: "Extend Microsoft Power Platform (35–40%)",
  integrate: "Develop integrations (10–15%)",
} as const;

// CCAR-F domains and weights.
const CA = {
  agentic: "Agentic Architecture & Orchestration (27%)",
  code: "Claude Code Configuration (20%)",
  prompt: "Prompt Engineering & Structured Output (20%)",
  tools: "Tool Design & MCP (18%)",
  context: "Context Management & Reliability (15%)",
} as const;

// ---- Resources (all verified 26 Sep 2026) -------------------------------

const R = {
  // Microsoft
  ab400Exam: { label: "Microsoft Learn: Exam AB-400 page (registration, replaces PL-400)", url: "https://learn.microsoft.com/en-us/credentials/certifications/exams/ab-400/" },
  ab400Guide: { label: "Microsoft Learn: AB-400 study guide (skills measured)", url: "https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ab-400" },
  pl400Guide: { label: "Microsoft Learn: PL-400 study guide (transition dates)", url: "https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/pl-400" },
  practice: { label: "Microsoft Learn: free practice assessment (PL-400 set)", url: "https://learn.microsoft.com/en-us/credentials/certifications/exams/pl-400/practice/assessment?assessment-type=practice&assessmentId=66" },
  sandbox: { label: "Microsoft exam sandbox (try the exam interface)", url: "https://aka.ms/examdemo" },
  devEnv: { label: "Microsoft Learn: create a developer environment", url: "https://learn.microsoft.com/en-us/power-platform/developer/create-developer-environment" },
  devResources: { label: "Microsoft Learn module: Power Platform developer resources", url: "https://learn.microsoft.com/en-us/training/modules/introduction-power-platform-developer-resources/" },
  wellArchitected: { label: "Microsoft Learn: Power Platform Well-Architected", url: "https://learn.microsoft.com/en-us/power-platform/well-architected/" },
  dataverseIntro: { label: "Microsoft Learn: what is Dataverse?", url: "https://learn.microsoft.com/en-us/power-apps/maker/data-platform/data-platform-intro" },
  expressions: { label: "Microsoft Learn: use expressions in Power Automate conditions", url: "https://learn.microsoft.com/en-us/power-automate/use-expressions-in-conditions" },
  expressionsModule: { label: "Microsoft Learn module: introduction to expressions in Power Automate", url: "https://learn.microsoft.com/en-us/training/modules/introduction-expressions/" },
  copilotStudio: { label: "Microsoft Learn: what is Copilot Studio?", url: "https://learn.microsoft.com/en-us/microsoft-copilot-studio/fundamentals-what-is-copilot-studio" },
  securityModel: { label: "Microsoft Learn: Dataverse security model", url: "https://learn.microsoft.com/en-us/power-apps/developer/data-platform/security-model" },
  dlp: { label: "Microsoft Learn: data policies (DLP)", url: "https://learn.microsoft.com/en-us/power-platform/admin/wp-data-loss-prevention" },
  envVars: { label: "Microsoft Learn: environment variables", url: "https://learn.microsoft.com/en-us/power-apps/maker/data-platform/environmentvariables" },
  alm: { label: "Microsoft Learn: ALM with solutions", url: "https://learn.microsoft.com/en-us/power-platform/alm/overview-alm" },
  webApi: { label: "Microsoft Learn: Dataverse Web API overview", url: "https://learn.microsoft.com/en-us/power-apps/developer/data-platform/webapi/overview" },
  webApiModule: { label: "Microsoft Learn module: use the Dataverse Web API", url: "https://learn.microsoft.com/en-us/training/modules/dataverse-web-api/" },
  pcf: { label: "Microsoft Learn: Power Apps component framework overview", url: "https://learn.microsoft.com/en-us/power-apps/developer/component-framework/overview" },
  codeApps: { label: "Microsoft Learn: Power Apps code apps overview", url: "https://learn.microsoft.com/en-us/power-apps/developer/code-apps/overview" },
  clientScript: { label: "Microsoft Learn: client scripting in model-driven apps", url: "https://learn.microsoft.com/en-us/power-apps/developer/model-driven-apps/client-scripting" },
  errorHandling: { label: "Microsoft Learn: error handling in Power Automate", url: "https://learn.microsoft.com/en-us/power-automate/guidance/coding-guidelines/error-handling" },
  childFlows: { label: "Microsoft Learn: create child flows", url: "https://learn.microsoft.com/en-us/power-automate/create-child-flows" },
  plugins: { label: "Microsoft Learn: Dataverse plug-ins", url: "https://learn.microsoft.com/en-us/power-apps/developer/data-platform/plug-ins" },
  apiLimits: { label: "Microsoft Learn: Dataverse API limits", url: "https://learn.microsoft.com/en-us/power-apps/developer/data-platform/api-limits" },
  webhooks: { label: "Microsoft Learn: use webhooks with Dataverse", url: "https://learn.microsoft.com/en-us/power-apps/developer/data-platform/use-webhooks" },
  customConnectors: { label: "Microsoft Learn: custom connectors", url: "https://learn.microsoft.com/en-us/connectors/custom-connectors/" },
  customConnectorModule: { label: "Microsoft Learn module: get started with custom connectors", url: "https://learn.microsoft.com/en-us/training/modules/get-started-custom-connector/" },
  pipelines: { label: "Microsoft Learn: Power Platform pipelines", url: "https://learn.microsoft.com/en-us/power-platform/alm/pipelines" },
  flowsStart: { label: "Microsoft Learn: get started with Power Automate", url: "https://learn.microsoft.com/en-us/power-automate/getting-started" },
  // Anthropic / Claude
  aiFluency: { label: "Anthropic Academy: AI Fluency, Framework and Foundations", url: "https://academy.claude.com/courses/ai-fluency-framework-foundations" },
  capabilities: { label: "Anthropic Academy: AI capabilities and limitations", url: "https://academy.claude.com/courses/ai-capabilities-and-limitations" },
  promptBest: { label: "Claude docs: prompting best practices", url: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices" },
  promptOverview: { label: "Claude docs: prompt engineering overview", url: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview" },
  structured: { label: "Claude docs: structured outputs", url: "https://platform.claude.com/docs/en/build-with-claude/structured-outputs" },
  evals: { label: "Claude docs: define success criteria and build evaluations", url: "https://platform.claude.com/docs/en/test-and-evaluate/develop-tests" },
  hallucinations: { label: "Claude docs: reduce hallucinations", url: "https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations" },
  consistency: { label: "Claude docs: increase output consistency", url: "https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/increase-consistency" },
  contextWindows: { label: "Claude docs: context windows", url: "https://platform.claude.com/docs/en/build-with-claude/context-windows" },
  caching: { label: "Claude docs: prompt caching", url: "https://platform.claude.com/docs/en/build-with-claude/prompt-caching" },
  toolUse: { label: "Claude docs: tool use overview", url: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview" },
  defineTools: { label: "Claude docs: define tools", url: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools" },
  agentSdk: { label: "Claude docs: Agent SDK overview", url: "https://platform.claude.com/docs/en/agent-sdk/overview" },
  effectiveAgents: { label: "Anthropic: Building effective agents", url: "https://www.anthropic.com/engineering/building-effective-agents" },
  writingTools: { label: "Anthropic: Writing effective tools for agents", url: "https://www.anthropic.com/engineering/writing-tools-for-agents" },
  contextEng: { label: "Anthropic: Effective context engineering for AI agents", url: "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents" },
  apiCourse: { label: "Anthropic Academy: Building with the Claude API", url: "https://academy.claude.com/courses/building-with-the-claude-api" },
  mcpCourse: { label: "Anthropic Academy: Introduction to Model Context Protocol", url: "https://academy.claude.com/courses/introduction-to-model-context-protocol" },
  mcpAdvanced: { label: "Anthropic Academy: MCP advanced topics", url: "https://academy.claude.com/courses/model-context-protocol-advanced-topics" },
  mcpArch: { label: "MCP: architecture overview", url: "https://modelcontextprotocol.io/docs/learn/architecture" },
  ccCourse: { label: "Anthropic Academy: Claude Code in Action", url: "https://academy.claude.com/courses/claude-code-in-action" },
  subagentsCourse: { label: "Anthropic Academy: Introduction to subagents", url: "https://academy.claude.com/courses/introduction-to-subagents" },
  ccMemory: { label: "Claude Code docs: memory and CLAUDE.md", url: "https://code.claude.com/docs/en/memory" },
  ccSettings: { label: "Claude Code docs: settings and permissions", url: "https://code.claude.com/docs/en/settings" },
  ccHooks: { label: "Claude Code docs: hooks guide", url: "https://code.claude.com/docs/en/hooks-guide" },
  ccHeadless: { label: "Claude Code docs: headless mode", url: "https://code.claude.com/docs/en/headless" },
  ccSubagents: { label: "Claude Code docs: subagents", url: "https://code.claude.com/docs/en/sub-agents" },
  ccMcp: { label: "Claude Code docs: MCP", url: "https://code.claude.com/docs/en/mcp" },
  ccSkills: { label: "Claude Code docs: skills and custom commands", url: "https://code.claude.com/docs/en/skills" },
  projects: { label: "Claude help: what are Projects?", url: "https://support.claude.com/en/articles/9517075-what-are-projects" },
  partners: { label: "Claude Partner Network (exam access)", url: "https://claude.com/partners" },
  // Public data and other free tools
  dataGov: { label: "Data.gov catalogue", url: "https://catalog.data.gov/" },
  dcOpenData: { label: "Open Data DC", url: "https://opendata.dc.gov" },
  appsScript: { label: "Google Apps Script overview", url: "https://developers.google.com/apps-script/overview" },
  nistRmf: { label: "NIST AI Risk Management Framework", url: "https://www.nist.gov/itl/ai-risk-management-framework" },
} satisfies Record<string, LabResource>;

// ---- Lessons ------------------------------------------------------------

export const LAB_LESSONS: LabLesson[] = [
  // ======================= WEEK 1 =======================
  {
    week: 1,
    date: D.w1,
    track: "core",
    title: "Start with the problem, not the tool: The Problem Brief",
    objectives: [
      "Choose one real, recurring task you personally own and do at least weekly",
      "Measure a baseline: minutes per run, runs per week, and who is affected",
      "Map every step of the task, including the waiting and the rework",
      "State a success measure as a number, not an adjective",
    ],
    prep: [
      "Write down three recurring tasks from your job, volunteer role or studies, with a rough guess of how long each takes",
      "Bring one real (anonymised) example of the task's input and output, such as an invoice, a patient recall list or a report template",
      "Start Anthropic Academy's AI Fluency course: the first module is enough",
    ],
    resources: [R.aiFluency, R.capabilities, R.projects],
    exercise:
      "Pick your week-1 task. Time it every time you do it this week, with a stopwatch, not from memory. Map each step on one line: who does it, what tool, how long, and where it waits for someone else. Mark the steps that are judgement and the steps that are copying. Then answer: if this task were half as painful, what number would change: minutes, errors, turnaround days or complaints?",
    deliverable:
      "Your one-page Problem Brief (link to a Google Doc, Word Online or PDF): the task, the measured baseline (minutes per run × runs per week, and who is affected), the step map, and one success measure written as a number.",
  },
  {
    week: 1,
    date: D.w1,
    track: "pl400",
    title: "Where the logic belongs: architecture before apps",
    objectives: [
      "Explain what changes on 16 October 2026 (PL-400 becomes AB-400) and which outline you are studying",
      "Set up a free Power Platform developer environment you control",
      "Decide, for your week-1 task, what out-of-the-box features can do and where code would be needed",
      "Place each step of your task: business rule, cloud flow, plug-in, client script or external service",
      "Say which steps need a deterministic method and which could use a non-deterministic (AI) one",
    ],
    prep: [
      "Read the AB-400 study guide's 'Skills at a glance' and 'Design the technical architecture' sections",
      "Create a developer environment with a personal Microsoft account (not a work account)",
      "Complete the Microsoft Learn module on Power Platform developer resources",
    ],
    resources: [R.ab400Guide, R.pl400Guide, R.devEnv, R.devResources, R.wellArchitected],
    exercise:
      "Take the step map from your Problem Brief. For each step write one line: out-of-the-box, low-code (Power Automate, business rule), pro-code (plug-in, client script, PCF, code app, Azure Function) or not suitable for the platform, and why. For example, an AP specialist matching invoices to purchase orders might put the match itself in a Dataverse plug-in (deterministic, must run every time) and the free-text vendor query in a Copilot Studio agent (non-deterministic, human checks it).",
    deliverable:
      "A short write-up (or table) mapping every step of your week-1 task to a Power Platform component, with a one-line reason each, plus a screenshot of your developer environment.",
    examDomains: [MS.build],
  },
  {
    week: 1,
    date: D.w1,
    track: "claude_arch",
    title: "Workflow or agent? Framing an architecture for your task",
    objectives: [
      "Describe the CCAR-F exam: format, five domains and their weights, and how to get access",
      "Tell the difference between a workflow (fixed steps you control) and an agent (the model chooses the steps)",
      "Name the common workflow patterns: prompt chaining, routing, parallelisation, orchestrator-workers and evaluator-optimiser",
      "Choose the simplest pattern that would handle your week-1 task, and justify it",
    ],
    prep: [
      "Read 'Building effective agents' from Anthropic in full",
      "Start Anthropic Academy's 'Building with the Claude API' course",
      "Confirm you have requested your jmcbtech.com address in onboarding: exam access runs through JMCB's Claude Partner Network membership",
    ],
    resources: [R.effectiveAgents, R.apiCourse, R.agentSdk, R.partners],
    exercise:
      "Take your week-1 step map and draw it as a Claude system. Which steps are a single prompt, which are a chain, which need a router, and does anything genuinely need an agent that decides its own next step? For example, a communications officer drafting a weekly briefing from five source reports might need a chain (extract, then summarise, then draft), not an agent. Write down the one place an agent would be tempting and why a workflow is safer there.",
    deliverable:
      "A one-page architecture sketch for your week-1 task: the pattern you chose, a box-and-arrow diagram (hand-drawn photo is fine), and a paragraph on why you did not choose a more autonomous design.",
    examDomains: [CA.agentic],
  },

  // ======================= WEEK 2 =======================
  {
    week: 2,
    date: D.w2,
    track: "core",
    title: "Prompting is engineering, not conversation: The Reusable Prompt",
    objectives: [
      "Turn your week-1 task into a parameterised prompt someone else could run",
      "Specify an output structure and get it back consistently",
      "Write a five-point rubric for a good answer before you see any output",
      "Run the prompt on five real inputs, score each, and record every failure mode",
    ],
    prep: [
      "Collect five real (anonymised) inputs for your task, including one awkward one",
      "Read Claude's prompting best practices page, at least the sections on being clear and using examples",
      "Write your five-point rubric before Thursday",
    ],
    resources: [R.promptBest, R.promptOverview, R.consistency, R.projects],
    exercise:
      "Write your prompt with clearly marked slots for the parts that change each run (for example {{vendor_name}}, {{invoice_text}}). Tell the model its role, the task, the exact output format and what to do when information is missing. Run it five times on your five real inputs in a fresh chat each time. Score every output against your rubric out of 5. Change one thing, re-run the worst case, and note whether it improved.",
    deliverable:
      "Link to your prompt (as text, versioned: v1, v2), your rubric, a table of five runs with scores, and a list of failure modes including at least one you did not expect.",
  },
  {
    week: 2,
    date: D.w2,
    track: "pl400",
    title: "Expressions and Copilot Studio: deterministic and generative logic side by side",
    objectives: [
      "Write Power Automate expressions to parse, format and validate the data in your task",
      "Configure trigger conditions and explain why they save runs and API calls",
      "Explain where a Copilot Studio agent fits alongside a cloud flow",
      "Decide which parts of your reusable prompt should become a deterministic expression instead",
    ],
    prep: [
      "Complete the Microsoft Learn module 'Introduction to expressions in Power Automate'",
      "Read 'What is Copilot Studio?'",
      "Re-read 'Configure Power Automate cloud flows and Copilot Studio workflows' in the AB-400 study guide",
    ],
    resources: [R.expressionsModule, R.expressions, R.copilotStudio, R.ab400Guide],
    exercise:
      "Look at your week-2 prompt and its failure log. Any failure that is really a formatting or rule problem (dates, currency, totals, missing fields) should not be left to the model. Build a small instant cloud flow in your developer environment that takes one of your five inputs and uses expressions (for example formatDateTime, coalesce, split, if) to do that deterministic part. Add a trigger condition so it only runs when the input is complete.",
    deliverable:
      "Screenshot of the flow run history showing a success, the expressions you used as text, and two sentences on which part of your task stays with the prompt and which moved to the flow.",
    examDomains: [MS.extend],
  },
  {
    week: 2,
    date: D.w2,
    track: "claude_arch",
    title: "Prompts as contracts: structure, examples and structured output",
    objectives: [
      "Structure a prompt with clear sections (XML-style tags) separating instructions, context and data",
      "Use a small set of examples to steer format and tone",
      "Enforce a JSON output shape with structured outputs or a tool schema",
      "Handle the 'I don't know' case explicitly rather than letting the model guess",
    ],
    prep: [
      "Read Claude's prompting best practices and the structured outputs page",
      "Continue 'Building with the Claude API' through the prompting and structured data lessons",
    ],
    resources: [R.promptBest, R.structured, R.consistency, R.apiCourse],
    exercise:
      "Rewrite your week-2 core prompt as a contract. Put instructions, reference material and the input in separately tagged sections. Add two short examples of a correct output. Define a JSON schema for the output that your rubric can check automatically, including a field for 'missing or uncertain'. For example, a fund-reporting analyst might require fields for each figure plus a source_page and a confidence flag. Re-run your five inputs and count how many validate against the schema first time.",
    deliverable:
      "Your v2 prompt, your JSON schema, and a before-and-after table: rubric score and schema-valid (yes/no) for all five inputs.",
    examDomains: [CA.prompt],
  },

  // ======================= WEEK 3 =======================
  {
    week: 3,
    date: D.w3,
    track: "core",
    title: "Assume it is wrong until you have checked: The Red-Team Report",
    objectives: [
      "Find and reproduce at least three concrete failures in your own prompt's output",
      "Do a privacy pass: what data goes in, and whether it should",
      "Write a clear 'do not use this for…' boundary",
      "Write a disclosure line a real recipient of the output would understand",
    ],
    prep: [
      "Prepare three nasty inputs for your week-2 prompt: an edge case, an incomplete one and one that invites the model to invent something",
      "Read Claude's page on reducing hallucinations",
      "Check your organisation's policy on putting work data into AI tools, if there is one",
    ],
    resources: [R.hallucinations, R.capabilities, R.nistRmf],
    exercise:
      "Attack your week-2 prompt. Run your three nasty inputs, then ask a partner to write two more you have not seen. For every failure, save the exact input and output so anyone can reproduce it. Then list every piece of data your prompt consumes and mark it: public, internal, personal or regulated (patient, tax, financial). Decide what must be removed or masked before it goes anywhere near a model.",
    deliverable:
      "A one-page limits-and-disclosure note: three or more reproduced failures (with the inputs), the privacy pass, a 'do not use this for…' statement, and the one-line disclosure that goes with every output.",
  },
  {
    week: 3,
    date: D.w3,
    track: "pl400",
    title: "Security, data policies and secrets: designing so the wrong thing cannot happen",
    objectives: [
      "Explain the Dataverse security model: business units, security roles, teams and row sharing",
      "Explain how data policies (DLP) block connectors from mixing business and non-business data",
      "Store configuration and secrets in environment variables rather than inside flows",
      "Design authentication and authorisation for your task's components",
    ],
    prep: [
      "Read the Dataverse security model page and the data policies page",
      "Read the environment variables page",
    ],
    resources: [R.securityModel, R.dlp, R.envVars, R.alm, R.ab400Guide],
    exercise:
      "Take your red-team privacy pass and turn it into platform controls. For your week-1 task, write down who should see which records (for example: a dental practice's social-media assistant can see appointment reminders but never clinical notes). Create a table in your developer environment with one column you would restrict, a security role that cannot read it, and an environment variable for any URL or setting your week-2 flow hard-coded. Move your flow inside a solution.",
    deliverable:
      "A short write-up of your access design (roles, what each can see, which connectors a data policy should block), plus screenshots of the security role and the environment variable in your solution.",
    examDomains: [MS.build],
  },
  {
    week: 3,
    date: D.w3,
    track: "claude_arch",
    title: "Reliability: grounding, evaluation and what goes in the context window",
    objectives: [
      "Reduce fabrication by grounding answers in supplied sources and requiring quotes or citations",
      "Build a small evaluation set with pass/fail criteria you can re-run after every change",
      "Explain the context window, what fills it, and why more context is not always better",
      "Decide what data should never enter the context, and how to strip it before it does",
    ],
    prep: [
      "Read Claude's pages on reducing hallucinations and on building evaluations",
      "Read 'Effective context engineering for AI agents'",
    ],
    resources: [R.hallucinations, R.evals, R.contextWindows, R.contextEng],
    exercise:
      "Turn your red-team failures into an evaluation set: each failing input becomes a test with the expected behaviour written down (including 'should say it does not know'). Add grounding to your prompt: the model must quote the source line for each claim or return 'not found'. Re-run the whole set. For example, a data-integrity specialist checking records against a source file would require the row reference for every discrepancy reported. Record which failures are fixed, which remain, and which new ones appeared.",
    deliverable:
      "Your evaluation set (at least eight cases, as a table or JSON), the prompt version that passed the most, and pass rates before and after grounding.",
    examDomains: [CA.context, CA.prompt],
  },

  // ======================= WEEK 4 =======================
  {
    week: 4,
    date: D.w4,
    track: "core",
    title: "Numbers you can defend: The One-Chart Answer",
    objectives: [
      "Find a real, messy public dataset connected to your problem or your community",
      "Clean it with AI assistance and document the steps well enough to repeat",
      "Answer exactly one question with exactly one honest chart",
      "Name and answer the three caveats a sceptical reader would raise",
    ],
    prep: [
      "Browse Data.gov or Open Data DC and shortlist two datasets linked to your task's world",
      "Write the one question you want answered before you open the data",
    ],
    resources: [R.dataGov, R.dcOpenData, R.hallucinations],
    exercise:
      "Download your dataset. Ask the model to profile it (row counts, blanks, duplicates, odd values) and then check its claims yourself against the raw file: count at least two things by hand. Clean it step by step, keeping a numbered log of every change. Make one chart with an honest axis and a title that states the finding, for example 'Late vendor payments doubled between Q1 and Q3', not 'Vendor payments'.",
    deliverable:
      "Link to your chart (image or published sheet), the source link to the dataset, your numbered cleaning log, and the three caveats with your answer to each.",
  },
  {
    week: 4,
    date: D.w4,
    track: "pl400",
    title: "Extending the user experience: Web API, client script, PCF and code apps",
    objectives: [
      "Query Dataverse through the Web API, including filters and selected columns",
      "Describe when to use client scripting, a PCF code component or a Power Apps code app",
      "Explain the PCF lifecycle methods (init, updateView, getOutputs, destroy) and the manifest",
      "Put your week-4 data into Dataverse and read it back with an API call",
    ],
    prep: [
      "Complete the Microsoft Learn module 'Use the Dataverse Web API'",
      "Read the PCF overview and the code apps overview",
    ],
    resources: [R.webApi, R.webApiModule, R.pcf, R.codeApps, R.clientScript],
    exercise:
      "Import a cleaned slice of your week-4 dataset into a Dataverse table in your developer environment. Use the Web API (from the browser, Postman or a short script) to answer your one question with a $filter and $select query, and compare the count with your chart. Then write a half-page design: if your manager wanted this chart inside a model-driven form, would you use client script, a PCF component or a code app, and why?",
    deliverable:
      "The Web API query you ran and its result, a note on whether it matched your chart, and your half-page user-experience design choice.",
    examDomains: [MS.ux, MS.extend],
  },
  {
    week: 4,
    date: D.w4,
    track: "claude_arch",
    title: "Configuring Claude Code: CLAUDE.md, settings, permissions and hooks",
    objectives: [
      "Install Claude Code and explain how CLAUDE.md memory files are loaded (user, project, local)",
      "Set permissions in settings files so Claude Code can read your data but not delete it",
      "Add a hook that runs automatically at a defined point, such as after a file is edited",
      "Use Claude Code to clean a dataset reproducibly, with the steps saved as a script",
    ],
    prep: [
      "Start 'Claude Code in Action' on Anthropic Academy",
      "Read the Claude Code memory and settings pages",
    ],
    resources: [R.ccCourse, R.ccMemory, R.ccSettings, R.ccHooks],
    exercise:
      "Create a folder for your week-4 dataset. Write a CLAUDE.md that states the question, the cleaning rules and 'never overwrite the raw file'. Add a project settings file that denies deletion and allows only the commands you need. Add one hook (for example, re-run a row-count check after every edit). Ask Claude Code to write the cleaning as a script rather than editing the data by hand, run it, and compare its output with your core-session numbers.",
    deliverable:
      "Link to a GitHub repo (or zipped folder) containing your CLAUDE.md, settings file, hook and cleaning script, plus two sentences on one thing the permissions or hook stopped or caught.",
    examDomains: [CA.code],
  },

  // ======================= WEEK 5 =======================
  {
    week: 5,
    date: D.w5,
    track: "core",
    title: "Make it run without you: The Automation",
    objectives: [
      "Build an automation for your week-1 task that runs end to end on real input",
      "Measure the new time per run against your week-1 baseline",
      "Handle malformed input deliberately rather than failing silently",
      "Write run steps clear enough for someone else to operate it",
    ],
    prep: [
      "Confirm which tools your workplace actually allows (Power Automate, Apps Script, Zapier, Make, a script, a Claude Project)",
      "Gather three real inputs and one deliberately broken one",
    ],
    resources: [R.flowsStart, R.appsScript, R.errorHandling, R.projects],
    exercise:
      "Build the smallest version of your task that runs from trigger to output without you touching it, for example: a new invoice email arrives, the fields are extracted, a row is added to the tracker and a draft reply is created. Run it on your three real inputs and time each. Feed it the broken input and make sure it stops and tells a person, rather than producing a confident wrong result. Keep your week-3 disclosure line on every output.",
    deliverable:
      "A short screen recording or live demo link of the automation running, a before-and-after timing table against your week-1 baseline, what happens on malformed input, and the written run steps.",
  },
  {
    week: 5,
    date: D.w5,
    track: "pl400",
    title: "Automation that survives: error handling, plug-ins and integrations. Practice assessment week",
    objectives: [
      "Implement error handling in a cloud flow with scopes and 'configure run after'",
      "Split reusable logic into a child flow",
      "Explain the plug-in event pipeline stages and when a plug-in beats a flow",
      "Describe API limits and retry policies, and how webhooks publish Dataverse events",
      "Take the free Microsoft practice assessment and log every wrong answer by domain",
    ],
    prep: [
      "Read the Power Automate error-handling guidance and the plug-ins overview",
      "Take the free practice assessment once, untimed, before Thursday",
      "Try the exam sandbox so the interface holds no surprises",
    ],
    resources: [R.errorHandling, R.childFlows, R.plugins, R.webhooks, R.practice],
    exercise:
      "If your core automation is in Power Automate, add a Try/Catch pattern: a scope for the main steps and a second scope that runs only on failure and notifies you with the error. Move one reused step into a child flow. If your automation is elsewhere, write down how you would rebuild it with a flow or a plug-in and what would trigger it. Then take the practice assessment again, timed, and sort your wrong answers into the four AB-400 domains. Note: the practice set still reflects the pre-16-October outline, so it will not cover code apps or Foundry agents.",
    deliverable:
      "Screenshot of a failed run being caught and reported by your error-handling scope, and your practice-assessment score with wrong answers tallied by domain.",
    examDomains: [MS.extend, MS.integrate],
  },
  {
    week: 5,
    date: D.w5,
    track: "claude_arch",
    title: "Running Claude unattended: headless mode, subagents and orchestration. Practice-question week",
    objectives: [
      "Run Claude Code non-interactively (headless) as a step inside an automation",
      "Define a subagent with its own instructions and limited tools, and explain when to use one",
      "Choose between orchestrator-workers and a fixed chain for a multi-step task",
      "Answer scenario-based practice questions across all five domains and log weak areas",
    ],
    prep: [
      "Read the Claude Code headless mode and subagents pages",
      "Start 'Introduction to subagents' on Anthropic Academy",
      "Write five scenario questions of your own, one per exam domain, with the answer and why the other options are wrong",
    ],
    resources: [R.ccHeadless, R.ccSubagents, R.subagentsCourse, R.effectiveAgents, R.agentSdk],
    exercise:
      "Wire Claude into your core automation as one step that runs without a person present, using headless mode or the API. Give it a narrow job, a structured output and a failure path (if the output does not validate, stop and flag). If your task has an independent sub-job, such as checking each attachment separately, define a subagent for it with only the tools it needs. Then sit the practice-question set Jermaine shares in the portal, timed, and tally wrong answers by domain.",
    deliverable:
      "The command or code that runs Claude unattended, your subagent definition if you made one, a note on what happens when the output is invalid, and your practice score by domain.",
    examDomains: [CA.agentic, CA.code],
  },

  // ======================= WEEK 6 =======================
  {
    week: 6,
    date: D.w6,
    track: "core",
    title: "An assistant that uses tools: The Assistant",
    objectives: [
      "Build an assistant that uses at least two tools against a real system",
      "Put an explicit human approval step in front of anything it changes",
      "Write ten test cases and record honest pass and fail results",
      "Explain why it fails the cases it fails",
    ],
    prep: [
      "List the two systems your assistant will touch (a shared drive, a sheet, a calendar, an inbox, an API) and confirm you are allowed to connect them",
      "Draft ten test cases, including at least three where the right answer is to refuse or ask",
    ],
    resources: [R.toolUse, R.effectiveAgents, R.copilotStudio, R.mcpCourse],
    exercise:
      "Extend your week-5 automation into an assistant for your week-1 task that can do at least two things, for example look up a vendor's last three invoices in a sheet and draft a reply email, but must stop and ask you before it sends, saves or changes anything. Run your ten test cases. For each failure, write the reason: wrong tool chosen, bad input, missing data, or the model misread the request.",
    deliverable:
      "A demo link or recording of the assistant using both tools and pausing for approval, your ten test cases with pass/fail, the pass rate, and a reason for every failure.",
  },
  {
    week: 6,
    date: D.w6,
    track: "pl400",
    title: "Connectors, agents and shipping: custom connectors, Foundry and Copilot Studio agents, ALM. Book your exam",
    objectives: [
      "Build or import a custom connector from an OpenAPI definition and set its authentication",
      "Explain how custom agents connect to Power Platform through MCP servers and Copilot Studio",
      "Move a solution between environments with Power Platform pipelines or Build Tools",
      "Book your AB-400 exam date and set a revision plan for the gap between now and then",
    ],
    prep: [
      "Complete the Microsoft Learn module 'Get started with custom connectors'",
      "Skim 'Build Microsoft Foundry agents by using code' and the ALM section of the AB-400 study guide",
      "Pick two possible exam dates between 19 November and 10 December 2026",
    ],
    resources: [R.customConnectorModule, R.customConnectors, R.pipelines, R.ab400Guide, R.ab400Exam],
    exercise:
      "Give your core-session assistant one tool delivered the Power Platform way: a custom connector to a real API used by your task (or a free public API if your workplace's is off limits), called from a flow or a Copilot Studio agent, with a human approval step before any write. Package it in your solution with environment variables for the connection details. Then, in the session, register for AB-400 through the Microsoft Learn exam page using your personal Microsoft account and book your date.",
    deliverable:
      "Screenshot of your custom connector's test operation succeeding, a one-paragraph note on where an MCP server or Foundry agent would replace it, and your AB-400 booking confirmation date (no personal details needed).",
    examDomains: [MS.integrate, MS.extend, MS.build],
  },
  {
    week: 6,
    date: D.w6,
    track: "claude_arch",
    title: "Tool design and MCP: giving Claude hands safely. Book your exam",
    objectives: [
      "Write tool definitions with clear names, descriptions and input schemas that a model uses correctly",
      "Explain MCP's host, client and server roles, and when to use an MCP server rather than a direct tool",
      "Connect an MCP server to Claude Code and scope what it can do",
      "Put a human approval step in front of every tool that changes something",
      "Book your CCAR-F exam through JMCB's Claude Partner Network access",
    ],
    prep: [
      "Read 'Writing effective tools for agents' and the tool definition page",
      "Complete 'Introduction to Model Context Protocol' on Anthropic Academy",
      "Make sure your jmcbtech.com address is active: you need it to register",
    ],
    resources: [R.writingTools, R.defineTools, R.mcpCourse, R.mcpArch, R.ccMcp],
    exercise:
      "Design the two tools your core-session assistant uses as proper tool definitions: a verb-noun name, a description that says when not to use it, a tight input schema and an error message the model can act on. For example, a vendor-management assistant might have find_vendor_contract (read-only) and draft_renewal_notice (writes a draft, never sends). Connect at least one real MCP server to Claude Code, restrict its permissions, and re-run your ten core test cases. Note which failures better tool descriptions fixed.",
    deliverable:
      "Your two tool definitions (JSON), the MCP server you connected and its permission settings, the before-and-after pass rate on your ten cases, and your CCAR-F booking date.",
    examDomains: [CA.tools, CA.agentic, CA.context],
  },
];

export function lessonsFor(track: TrackKey): LabLesson[] {
  return LAB_LESSONS.filter((l) => l.track === track).sort((a, b) => a.week - b.week);
}

export function lessonFor(week: number, track: TrackKey): LabLesson | undefined {
  return LAB_LESSONS.find((l) => l.week === week && l.track === track);
}
