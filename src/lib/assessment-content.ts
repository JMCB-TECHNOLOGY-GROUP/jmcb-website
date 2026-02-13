// ============================================================
// ASSESSMENT-CONTENT: Questions, Benchmarks, ASCEND Mapping
// Data contract consumed by Assessment-UX and Assessment-Backend
// ============================================================

export type CompanySize = "1-10" | "11-50" | "51-200" | "200+";
export type Role =
  | "c-suite"
  | "vp"
  | "director"
  | "manager"
  | "individual-contributor"
  | "business-owner"
  | "consultant"
  | "student";

export interface AnswerOption {
  value: number; // 1-5
  label: string;
  description: string;
}

export interface BenchmarkData {
  "1-10": number;
  "11-50": number;
  "51-200": number;
  "200+": number;
}

export interface AssessmentQuestion {
  id: string;
  dimension: string;
  ascendPhase: AscendPhase;
  questionText: string;
  helpText: string; // Why this dimension matters - expand/collapse
  options: AnswerOption[];
  benchmarks: BenchmarkData; // Average score by company size
  microInsightTemplate: string; // Template with {{score}}, {{benchmark}}, {{percentile}}
  // Adaptive logic
  applicableTo: CompanySize[] | "all";
  smallBusinessAlternativeId?: string; // If this Q is skipped for small biz, use this one instead
}

export type AscendPhase =
  | "Assess"
  | "Strategize"
  | "Construct"
  | "Execute"
  | "Normalize"
  | "Develop";

// ============================================================
// THE 10 DIMENSIONS + 4 SMALL BUSINESS ALTERNATIVES = 14 TOTAL
// ============================================================

export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  // ── QUESTION 1: Data Foundation ──
  {
    id: "q1-data-foundation",
    dimension: "Data Foundation",
    ascendPhase: "Assess",
    questionText:
      "How would you describe the state of your organization's data?",
    helpText:
      "AI runs on data. The quality, accessibility, and structure of your data determines the ceiling for every AI initiative you'll ever pursue. Companies that skip this step waste 60-80% of their AI budget cleaning up messes later.",
    options: [
      {
        value: 1,
        label: "Scattered and siloed",
        description:
          "Data lives in spreadsheets, email threads, and individual drives. No single source of truth.",
      },
      {
        value: 2,
        label: "Partially organized",
        description:
          "Some data is centralized (CRM, ERP) but major gaps exist. Manual data entry is common.",
      },
      {
        value: 3,
        label: "Structured but disconnected",
        description:
          "Key systems hold good data, but they dont talk to each other well. Reporting requires manual work.",
      },
      {
        value: 4,
        label: "Integrated and accessible",
        description:
          "Most data flows between systems. Team members can pull what they need without IT help.",
      },
      {
        value: 5,
        label: "Unified data ecosystem",
        description:
          "Single source of truth across the organization. Real-time dashboards. Data quality is actively monitored.",
      },
    ],
    benchmarks: { "1-10": 1.8, "11-50": 2.4, "51-200": 3.1, "200+": 3.5 },
    microInsightTemplate:
      "You scored {{score}}/5 on Data Foundation. {{percentile}}% of {{sizeLabel}} companies score {{benchmark}} or higher.",
    applicableTo: "all",
  },

  // ── QUESTION 2: AI Strategy & Vision ──
  {
    id: "q2-ai-strategy",
    dimension: "AI Strategy & Vision",
    ascendPhase: "Strategize",
    questionText:
      "Does your organization have a clear plan for how AI fits into your business?",
    helpText:
      "Without a strategy, AI adoption becomes a collection of random experiments. Organizations with a documented AI strategy are 3x more likely to see measurable ROI within 12 months.",
    options: [
      {
        value: 1,
        label: "No plan at all",
        description:
          "AI hasnt been discussed seriously. No one owns the topic.",
      },
      {
        value: 2,
        label: "General interest, no plan",
        description:
          "Leadership knows AI matters but there is no documented strategy or assigned ownership.",
      },
      {
        value: 3,
        label: "Informal roadmap",
        description:
          "Some goals around AI exist. A few people are exploring tools. Nothing formalized.",
      },
      {
        value: 4,
        label: "Documented strategy",
        description:
          "Written AI strategy with clear goals, timeline, and budget. Ownership is assigned.",
      },
      {
        value: 5,
        label: "Living strategy with KPIs",
        description:
          "AI strategy is integrated into business planning. Regular reviews. Measurable targets tracked quarterly.",
      },
    ],
    benchmarks: { "1-10": 1.5, "11-50": 2.1, "51-200": 2.8, "200+": 3.2 },
    microInsightTemplate:
      "You scored {{score}}/5 on AI Strategy. {{percentile}}% of {{sizeLabel}} companies have a more defined AI roadmap.",
    applicableTo: "all",
  },

  // ── QUESTION 3: Team AI Literacy ──
  {
    id: "q3-team-literacy",
    dimension: "Team AI Literacy",
    ascendPhase: "Develop",
    questionText:
      "How comfortable is your team with using AI tools in their daily work?",
    helpText:
      "Technology doesnt fail -- adoption does. The #1 reason AI projects stall is people, not tech. Teams that receive structured AI training see 4x higher tool adoption rates.",
    options: [
      {
        value: 1,
        label: "Mostly unfamiliar",
        description:
          "Most team members havent used AI tools beyond maybe ChatGPT casually.",
      },
      {
        value: 2,
        label: "A few early adopters",
        description:
          "One or two people experiment with AI. Most of the team hasnt engaged.",
      },
      {
        value: 3,
        label: "Growing awareness",
        description:
          "Several team members use AI tools. Some informal knowledge sharing happens.",
      },
      {
        value: 4,
        label: "Broadly competent",
        description:
          "Most team members use AI tools regularly. Some have completed formal training.",
      },
      {
        value: 5,
        label: "AI-fluent culture",
        description:
          "AI literacy is part of onboarding. Team actively seeks new AI applications. Regular training.",
      },
    ],
    benchmarks: { "1-10": 2.0, "11-50": 2.3, "51-200": 2.7, "200+": 3.0 },
    microInsightTemplate:
      "You scored {{score}}/5 on Team AI Literacy. The average for {{sizeLabel}} organizations is {{benchmark}}.",
    applicableTo: "all",
  },

  // ── QUESTION 4: Process Automation Readiness ──
  {
    id: "q4-process-automation",
    dimension: "Process Automation",
    ascendPhase: "Construct",
    questionText:
      "How much of your core business workflow is automated today?",
    helpText:
      "AI amplifies existing automation. If your processes are still manual, AI becomes a shiny tool sitting on top of broken workflows. Companies that automate before AI-ifying see 2x faster implementation.",
    options: [
      {
        value: 1,
        label: "Almost entirely manual",
        description:
          "Most tasks done by hand. Heavy reliance on email, paper, or basic spreadsheets.",
      },
      {
        value: 2,
        label: "Basic digital tools",
        description:
          "Using some cloud software but processes still require a lot of manual steps.",
      },
      {
        value: 3,
        label: "Partially automated",
        description:
          "Key workflows have some automation (email sequences, basic integrations). Gaps remain.",
      },
      {
        value: 4,
        label: "Mostly automated",
        description:
          "Core processes are automated. Integration between tools is solid. Manual intervention is the exception.",
      },
      {
        value: 5,
        label: "Intelligent automation",
        description:
          "Workflows are automated end-to-end with smart routing, exception handling, and continuous optimization.",
      },
    ],
    benchmarks: { "1-10": 1.9, "11-50": 2.6, "51-200": 3.2, "200+": 3.6 },
    microInsightTemplate:
      "You scored {{score}}/5 on Process Automation. {{percentile}}% of similar organizations are further along in automating core workflows.",
    applicableTo: "all",
  },

  // ── QUESTION 5: Technology Infrastructure ──
  {
    id: "q5-tech-infrastructure",
    dimension: "Technology Infrastructure",
    ascendPhase: "Construct",
    questionText:
      "How ready is your current tech stack to support AI tools and integrations?",
    helpText:
      "AI tools need APIs, cloud infrastructure, and modern software to plug into. Legacy systems create expensive integration bottlenecks that can double your AI implementation timeline.",
    options: [
      {
        value: 1,
        label: "Legacy or minimal tech",
        description:
          "Outdated systems, on-premise only, limited ability to integrate new tools.",
      },
      {
        value: 2,
        label: "Mixed old and new",
        description:
          "Some cloud tools alongside legacy systems. Integration is painful.",
      },
      {
        value: 3,
        label: "Mostly modern stack",
        description:
          "Cloud-based tools with decent APIs. Some integration capabilities. Room to grow.",
      },
      {
        value: 4,
        label: "Cloud-native and integrated",
        description:
          "Modern stack with strong API ecosystem. Can adopt new tools relatively quickly.",
      },
      {
        value: 5,
        label: "AI-ready platform",
        description:
          "Fully cloud-native. Robust API layer. Data pipelines in place. Ready for ML/AI workloads.",
      },
    ],
    benchmarks: { "1-10": 2.2, "11-50": 2.8, "51-200": 3.3, "200+": 3.7 },
    microInsightTemplate:
      "You scored {{score}}/5 on Tech Infrastructure. {{sizeLabel}} companies average {{benchmark}} -- {{comparison}}.",
    applicableTo: "all",
  },

  // ── QUESTION 6: AI Governance & Ethics (Enterprise) ──
  {
    id: "q6-governance-enterprise",
    dimension: "AI Governance",
    ascendPhase: "Normalize",
    questionText:
      "Does your organization have policies governing how AI is used, including data privacy and ethical guidelines?",
    helpText:
      "As AI scales, governance becomes critical. Organizations without clear AI policies face regulatory risk, bias liability, and employee trust issues. This is the dimension most companies skip and later regret.",
    options: [
      {
        value: 1,
        label: "No policies exist",
        description:
          "No one has thought about AI governance, ethics, or usage policies.",
      },
      {
        value: 2,
        label: "Informal awareness",
        description:
          "Some people are thinking about it, but nothing is written down or enforced.",
      },
      {
        value: 3,
        label: "Basic guidelines",
        description:
          "Simple usage policies exist (e.g., dont put customer data in ChatGPT). Not comprehensive.",
      },
      {
        value: 4,
        label: "Formal framework",
        description:
          "Documented AI policies covering data privacy, approved tools, and ethical guidelines. Training provided.",
      },
      {
        value: 5,
        label: "Mature governance program",
        description:
          "AI ethics board or committee. Regular audits. Bias testing. Incident response plan. Regulatory compliance tracked.",
      },
    ],
    benchmarks: { "1-10": 1.3, "11-50": 1.8, "51-200": 2.5, "200+": 3.1 },
    microInsightTemplate:
      "You scored {{score}}/5 on AI Governance. This is the most underinvested dimension -- only {{percentile}}% of {{sizeLabel}} companies score higher.",
    applicableTo: ["51-200", "200+"],
    smallBusinessAlternativeId: "q6-governance-small",
  },

  // ── QUESTION 6 ALT: AI Usage & Risk (Small Business) ──
  {
    id: "q6-governance-small",
    dimension: "AI Usage & Risk",
    ascendPhase: "Normalize",
    questionText:
      "How does your team handle AI tool usage, customer data, and potential risks?",
    helpText:
      "Even small teams need guardrails. One employee pasting customer data into a free AI tool can create a data breach. Simple guidelines now prevent expensive problems later.",
    options: [
      {
        value: 1,
        label: "No thought given to it",
        description:
          "People use whatever tools they want. No discussion about data or risks.",
      },
      {
        value: 2,
        label: "Verbal understanding",
        description:
          "General agreement to be careful, but nothing specific or written down.",
      },
      {
        value: 3,
        label: "Basic rules in place",
        description:
          "Simple list of approved/not-approved tools. Team knows not to share sensitive data with AI.",
      },
      {
        value: 4,
        label: "Clear policies",
        description:
          "Written guidelines for AI use. Team trained on what data can/cannot be used. Regular check-ins.",
      },
      {
        value: 5,
        label: "Proactive risk management",
        description:
          "Regular review of AI tools used. Data handling procedures. Vendor assessment for AI services.",
      },
    ],
    benchmarks: { "1-10": 1.4, "11-50": 1.9, "51-200": 2.5, "200+": 3.1 },
    microInsightTemplate:
      "You scored {{score}}/5 on AI Usage & Risk. Most small businesses score {{benchmark}} -- simple guardrails make a big difference.",
    applicableTo: ["1-10", "11-50"],
  },

  // ── QUESTION 7: Leadership Buy-In ──
  {
    id: "q7-leadership",
    dimension: "Leadership Alignment",
    ascendPhase: "Strategize",
    questionText:
      "How aligned is your leadership team on the importance and direction of AI adoption?",
    helpText:
      "AI initiatives without executive sponsorship have a 70% failure rate. When leadership is aligned and vocal, teams move faster, budgets get approved, and resistance drops dramatically.",
    options: [
      {
        value: 1,
        label: "Not on the radar",
        description:
          "Leadership hasnt engaged with AI as a business priority.",
      },
      {
        value: 2,
        label: "Curious but cautious",
        description:
          "Leadership is interested but hasnt committed resources or attention.",
      },
      {
        value: 3,
        label: "Supportive but passive",
        description:
          "Leadership agrees AI matters and has approved some exploration, but isnt actively driving it.",
      },
      {
        value: 4,
        label: "Actively championing",
        description:
          "One or more leaders actively sponsor AI initiatives. Budget and time are allocated.",
      },
      {
        value: 5,
        label: "AI is a strategic pillar",
        description:
          "AI is part of the executive agenda. Regular board/leadership discussions. Clear mandate from the top.",
      },
    ],
    benchmarks: { "1-10": 2.1, "11-50": 2.4, "51-200": 2.9, "200+": 3.3 },
    microInsightTemplate:
      "You scored {{score}}/5 on Leadership Alignment. {{percentile}}% of {{sizeLabel}} organizations report stronger executive buy-in.",
    applicableTo: "all",
  },

  // ── QUESTION 8: Budget & Investment (Enterprise) ──
  {
    id: "q8-budget-enterprise",
    dimension: "AI Investment",
    ascendPhase: "Execute",
    questionText:
      "What level of budget or resources has your organization allocated specifically for AI initiatives?",
    helpText:
      "AI doesnt have to be expensive, but it does require intentional investment. Organizations that earmark specific AI budgets (even small ones) are 5x more likely to see results than those who fund AI ad-hoc.",
    options: [
      {
        value: 1,
        label: "No dedicated budget",
        description:
          "AI spending comes from general IT or gets squeezed into existing budgets.",
      },
      {
        value: 2,
        label: "Small experimental budget",
        description:
          "A few thousand allocated for pilots or tool subscriptions. No formal budget line.",
      },
      {
        value: 3,
        label: "Defined pilot budget",
        description:
          "Specific budget for AI exploration. Enough to run 1-2 serious pilots.",
      },
      {
        value: 4,
        label: "Strategic investment",
        description:
          "Meaningful budget allocated annually. Covers tools, training, and implementation support.",
      },
      {
        value: 5,
        label: "Transformational commitment",
        description:
          "AI investment is a significant line item. Multi-year plan with scaling budget. Dedicated team or partners.",
      },
    ],
    benchmarks: { "1-10": 1.6, "11-50": 2.2, "51-200": 2.8, "200+": 3.4 },
    microInsightTemplate:
      "You scored {{score}}/5 on AI Investment. {{sizeLabel}} companies investing at level {{benchmark}}+ see measurably better outcomes.",
    applicableTo: ["51-200", "200+"],
    smallBusinessAlternativeId: "q8-budget-small",
  },

  // ── QUESTION 8 ALT: Budget & Investment (Small Business) ──
  {
    id: "q8-budget-small",
    dimension: "AI Investment",
    ascendPhase: "Execute",
    questionText:
      "How much time and money are you putting toward AI tools and learning right now?",
    helpText:
      "For small businesses, AI investment doesnt mean six figures. Even $50/month on the right tools plus a few hours of learning per week can transform operations. The question is whether youre investing intentionally or just dabbling.",
    options: [
      {
        value: 1,
        label: "Nothing yet",
        description:
          "No money or time specifically dedicated to AI tools or learning.",
      },
      {
        value: 2,
        label: "Free tools only",
        description:
          "Using free AI tools (free ChatGPT, etc). No paid subscriptions or training time.",
      },
      {
        value: 3,
        label: "Some paid tools",
        description:
          "Paying for 1-2 AI subscriptions. Spending a few hours per month learning.",
      },
      {
        value: 4,
        label: "Regular investment",
        description:
          "Budget set aside monthly for AI tools. Dedicated learning time. May have hired help.",
      },
      {
        value: 5,
        label: "Strategic allocation",
        description:
          "Clear budget for AI. Investing in training, tools, and possibly consulting. Treating it as a business priority.",
      },
    ],
    benchmarks: { "1-10": 1.7, "11-50": 2.3, "51-200": 2.8, "200+": 3.4 },
    microInsightTemplate:
      "You scored {{score}}/5 on AI Investment. Even modest, intentional investment puts you ahead of {{percentile}}% of {{sizeLabel}} businesses.",
    applicableTo: ["1-10", "11-50"],
  },

  // ── QUESTION 9: Use Case Identification ──
  {
    id: "q9-use-cases",
    dimension: "Use Case Clarity",
    ascendPhase: "Assess",
    questionText:
      "How clearly have you identified where AI can create the most value in your business?",
    helpText:
      "The biggest AI wins come from solving the right problems, not from using the fanciest technology. Organizations that start with 1-2 high-impact use cases see ROI 3x faster than those trying to do everything at once.",
    options: [
      {
        value: 1,
        label: "Havent thought about it",
        description:
          "No specific ideas about where AI could help. General curiosity only.",
      },
      {
        value: 2,
        label: "Vague ideas",
        description:
          "Some general notions (maybe customer service, maybe marketing) but nothing specific.",
      },
      {
        value: 3,
        label: "A few specific ideas",
        description:
          "Identified 2-3 specific areas where AI could help. Havent validated or prioritized them.",
      },
      {
        value: 4,
        label: "Prioritized pipeline",
        description:
          "Clear list of AI use cases ranked by impact and feasibility. Working on the top ones.",
      },
      {
        value: 5,
        label: "Proven portfolio",
        description:
          "Multiple AI use cases deployed. Continuous identification of new opportunities. Impact measured.",
      },
    ],
    benchmarks: { "1-10": 1.7, "11-50": 2.3, "51-200": 2.9, "200+": 3.2 },
    microInsightTemplate:
      "You scored {{score}}/5 on Use Case Clarity. Companies that nail this dimension early are {{percentile}}% more likely to see ROI in year one.",
    applicableTo: "all",
  },

  // ── QUESTION 10: Change Management & Culture ──
  {
    id: "q10-change-management",
    dimension: "AI Culture & Change",
    ascendPhase: "Normalize",
    questionText:
      "How does your organization handle the people side of technology changes?",
    helpText:
      "The best AI strategy in the world fails without change management. 82% of AI project failures are attributed to people and process issues, not technology. Culture eats strategy for breakfast, and it definitely eats AI for lunch.",
    options: [
      {
        value: 1,
        label: "Resistance is common",
        description:
          "New technology usually meets pushback. Changes are imposed rather than adopted.",
      },
      {
        value: 2,
        label: "Reluctant acceptance",
        description:
          "People eventually adopt new tools but its slow and frustrating. Limited support provided.",
      },
      {
        value: 3,
        label: "Structured rollouts",
        description:
          "Some process for introducing new tools: training sessions, documentation. Mixed adoption rates.",
      },
      {
        value: 4,
        label: "Change-ready culture",
        description:
          "Team generally embraces new tools. Good communication and training. Champions identified.",
      },
      {
        value: 5,
        label: "Innovation-driven culture",
        description:
          "Continuous improvement is part of the DNA. Team actively seeks better tools. Rapid adoption norm.",
      },
    ],
    benchmarks: { "1-10": 2.3, "11-50": 2.5, "51-200": 2.8, "200+": 3.0 },
    microInsightTemplate:
      "You scored {{score}}/5 on AI Culture. This often-overlooked dimension predicts {{percentile}}% of AI project success.",
    applicableTo: "all",
  },
];

// ============================================================
// ASCEND FRAMEWORK PHASES
// ============================================================

export const ASCEND_PHASES: Record<
  AscendPhase,
  { name: string; description: string; color: string }
> = {
  Assess: {
    name: "Assess",
    description:
      "Evaluate your current state across data, processes, and readiness.",
    color: "#3B82F6",
  },
  Strategize: {
    name: "Strategize",
    description:
      "Define your AI vision, secure leadership alignment, and build your roadmap.",
    color: "#8B5CF6",
  },
  Construct: {
    name: "Construct",
    description:
      "Build the technical and process infrastructure to support AI adoption.",
    color: "#F59E0B",
  },
  Execute: {
    name: "Execute",
    description:
      "Deploy AI solutions, measure results, and invest for scale.",
    color: "#10B981",
  },
  Normalize: {
    name: "Normalize",
    description:
      "Embed AI governance, ethics, and change management into daily operations.",
    color: "#EF4444",
  },
  Develop: {
    name: "Develop",
    description:
      "Grow your teams AI skills and build an AI-fluent culture.",
    color: "#EC4899",
  },
};

// ============================================================
// REPORT BRANDING BY COMPANY SIZE
// ============================================================

export const REPORT_BRANDING: Record<
  CompanySize,
  { title: string; subtitle: string; focus: string }
> = {
  "1-10": {
    title: "AI Quick Start for Small Business",
    subtitle: "Your personalized roadmap to immediate AI-driven results",
    focus: "immediate ROI tools and quick wins",
  },
  "11-50": {
    title: "AI Growth Playbook",
    subtitle: "Scaling your business with intelligent workflow automation",
    focus: "workflow automation and team enablement",
  },
  "51-200": {
    title: "AI Transformation Roadmap",
    subtitle: "Strategic AI adoption for growing enterprises",
    focus: "strategy, governance, and scalable implementation",
  },
  "200+": {
    title: "Enterprise AI Readiness Report",
    subtitle: "Comprehensive ASCEND framework assessment and adoption plan",
    focus: "enterprise ASCEND framework adoption and governance",
  },
};

// ============================================================
// DIMENSION-TO-SERVICE MAPPING (for "How JMCB Can Help" section)
// ============================================================

export const DIMENSION_SERVICE_MAP: Record<
  string,
  { service: string; description: string; deliverable: string }
> = {
  "Data Foundation": {
    service: "Data Readiness Assessment & Architecture",
    description:
      "We audit your existing data landscape, identify gaps, and design a unified data strategy that sets the foundation for everything AI can do for you.",
    deliverable: "Data Architecture Blueprint + 90-Day Cleanup Plan",
  },
  "AI Strategy & Vision": {
    service: "AI Strategy Workshop",
    description:
      "A focused engagement where we build your AI roadmap together -- tied to business outcomes, not buzzwords. You walk away with a prioritized plan your leadership team can rally behind.",
    deliverable: "AI Strategic Roadmap + Business Case Document",
  },
  "Team AI Literacy": {
    service: "AI Literacy & Training Program",
    description:
      "Custom training designed for your teams actual tools and workflows. Not generic AI lectures -- hands-on sessions that get people using AI tools the next day.",
    deliverable: "Custom Training Curriculum + Tool Adoption Playbook",
  },
  "Process Automation": {
    service: "Workflow Automation Implementation",
    description:
      "We identify your highest-impact automation opportunities and build them. From invoice processing to customer follow-ups, we turn manual work into automated workflows.",
    deliverable: "Automation Implementation + ROI Tracking Dashboard",
  },
  "Technology Infrastructure": {
    service: "AI Infrastructure Assessment",
    description:
      "We evaluate your tech stack for AI readiness and design the integration architecture to support your AI initiatives without ripping out what works.",
    deliverable: "Tech Stack Assessment + Integration Architecture Plan",
  },
  "AI Governance": {
    service: "AI Governance Framework Development",
    description:
      "We build your AI policies, usage guidelines, and risk management framework. Practical governance that protects you without slowing you down.",
    deliverable: "AI Governance Policy + Risk Assessment Framework",
  },
  "AI Usage & Risk": {
    service: "AI Usage Policy & Risk Review",
    description:
      "Simple, practical guidelines for how your team should use AI tools safely. No legal jargon -- clear rules everyone can follow.",
    deliverable: "AI Usage Guidelines + Approved Tools List",
  },
  "Leadership Alignment": {
    service: "Executive AI Briefing",
    description:
      "A tailored session for your leadership team that cuts through the hype and connects AI to your specific business challenges and opportunities.",
    deliverable: "Executive AI Brief + Decision Framework",
  },
  "AI Investment": {
    service: "AI ROI Planning & Budget Framework",
    description:
      "We help you right-size your AI investment and build a phased budget that matches your growth trajectory. Every dollar mapped to expected outcomes.",
    deliverable: "AI Investment Plan + ROI Projection Model",
  },
  "Use Case Clarity": {
    service: "AI Use Case Discovery & Prioritization",
    description:
      "We facilitate a structured discovery process to identify, validate, and rank your highest-value AI opportunities. You get a prioritized pipeline, not a wish list.",
    deliverable: "Prioritized AI Use Case Pipeline + Feasibility Scores",
  },
  "AI Culture & Change": {
    service: "Change Management & AI Adoption Program",
    description:
      "We design and support the rollout strategy that gets your team on board. Communication plans, champion networks, and adoption tracking built for your culture.",
    deliverable: "Change Management Plan + Adoption Dashboard",
  },
};

// ============================================================
// PRIORITY ACTION RECOMMENDATIONS (based on lowest scoring dimension)
// ============================================================

export const PRIORITY_ACTIONS: Record<string, string[]> = {
  "Data Foundation": [
    "Audit all the places your team stores data this week. Make a simple list: what tool, what data, who uses it.",
    "Pick your single most important dataset (usually customer or financial) and centralize it into one system within 30 days.",
    "Set a recurring monthly check: is your critical data clean, current, and accessible to the people who need it?",
  ],
  "AI Strategy & Vision": [
    "Block 2 hours this week with your leadership team. One agenda item: what are the 3 biggest business problems AI could help us solve?",
    "Write a one-page AI vision document. Not a strategy yet -- just a clear statement of where you want AI to take your business in 12 months.",
    "Assign an AI champion. One person who owns the AI agenda and reports on progress monthly.",
  ],
  "Team AI Literacy": [
    "Survey your team this week: who is already using AI tools? What tools? How often? Youll be surprised by what you find.",
    "Pick one team and one AI tool. Give them 30 days to integrate it into one specific workflow. Measure before and after.",
    "Schedule a monthly AI show-and-tell. 30 minutes where anyone can demo an AI tool or technique theyve found useful.",
  ],
  "Process Automation": [
    "Map your top 5 most time-consuming repetitive tasks. Time them. Calculate the annual hours spent.",
    "Pick the simplest one and automate it within 2 weeks using tools like Zapier, Make.com, or built-in automations in your current software.",
    "Set a goal: automate one workflow per month for the next quarter. Build the muscle before you add AI.",
  ],
  "Technology Infrastructure": [
    "List every software tool your organization uses. Note which ones have APIs and which are dead ends for integration.",
    "Identify your biggest integration bottleneck -- the one manual data transfer that causes the most pain -- and solve it first.",
    "Evaluate whether your current tools can support AI features. Many modern platforms (CRM, marketing, support) already have AI built in.",
  ],
  "AI Governance": [
    "Write a simple one-page AI usage policy this week. Cover: approved tools, data that should never go into AI, and who to ask questions.",
    "Brief your team on the policy. Make it a 15-minute conversation, not a compliance lecture.",
    "Schedule a quarterly review of your AI tools and policies. Technology changes fast; your guidelines should keep up.",
  ],
  "AI Usage & Risk": [
    "Write a simple one-page AI usage policy this week. Cover: approved tools, data that should never go into AI, and who to ask questions.",
    "Brief your team on the policy. Make it a 15-minute conversation, not a compliance lecture.",
    "Schedule a quarterly review of your AI tools and policies. Technology changes fast; your guidelines should keep up.",
  ],
  "Leadership Alignment": [
    "Share 3 specific examples of AI success in your industry with your leadership team this week. Make it relevant, not theoretical.",
    "Request a dedicated 30-minute slot on the next leadership meeting agenda for AI discussion. Come with a specific proposal, not a general pitch.",
    "Identify one quick AI win that could demonstrate value to leadership within 30 days. Nothing builds buy-in like results.",
  ],
  "AI Investment": [
    "Calculate what youre already spending on AI (subscriptions, time, consultants). Most organizations are spending more than they realize.",
    "Build a simple business case for one AI initiative: cost to implement, expected time savings, projected ROI. One page maximum.",
    "Propose a 90-day AI pilot budget. Even $500-2000/month can fund a meaningful experiment with measurable results.",
  ],
  "Use Case Clarity": [
    "Spend 1 hour this week listing every place in your business where someone does repetitive work that follows a pattern. Thats your AI opportunity list.",
    "Pick the top 3 by impact (time saved x frequency x value). Validate each one: is the data available? Is the process consistent enough?",
    "Start with one. Define success criteria before you build anything. What does good look like? How will you measure it?",
  ],
  "AI Culture & Change": [
    "Have honest conversations with 5 team members this week. Ask: whats your biggest concern about AI in our work? Listen without defending.",
    "Address the #1 concern directly and publicly. If its job security, talk about it. If its learning curve, provide support. Silence breeds resistance.",
    "Celebrate early AI adopters. Make their wins visible. Nothing shifts culture faster than peers showing peers what works.",
  ],
};

// ============================================================
// HELPER: Get questions for a given company size
// ============================================================

export function getQuestionsForSize(
  companySize: CompanySize
): AssessmentQuestion[] {
  return ASSESSMENT_QUESTIONS.filter((q) => {
    if (q.applicableTo === "all") return true;
    return q.applicableTo.includes(companySize);
  });
}

// ============================================================
// HELPER: Calculate overall score (0-100)
// ============================================================

export function calculateOverallScore(
  answers: Record<string, number>
): number {
  const values = Object.values(answers);
  if (values.length === 0) return 0;
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  return Math.round((avg / 5) * 100);
}

// ============================================================
// HELPER: Generate micro-insight text
// ============================================================

export function generateMicroInsight(
  question: AssessmentQuestion,
  score: number,
  companySize: CompanySize
): string {
  const benchmark = question.benchmarks[companySize];
  const sizeLabels: Record<CompanySize, string> = {
    "1-10": "small business (1-10 employee)",
    "11-50": "mid-size (11-50 employee)",
    "51-200": "growing enterprise (51-200 employee)",
    "200+": "enterprise (200+ employee)",
  };

  // Calculate a realistic percentile
  const diff = score - benchmark;
  let percentile: number;
  if (diff >= 2) percentile = Math.min(95, 75 + diff * 10);
  else if (diff >= 1) percentile = 60 + diff * 15;
  else if (diff >= 0) percentile = 45 + diff * 15;
  else if (diff >= -1) percentile = 25 + (diff + 1) * 20;
  else percentile = Math.max(5, 15 + (diff + 2) * 10);

  percentile = Math.round(percentile);

  const comparison =
    score >= benchmark
      ? "you're ahead of the curve"
      : "there's room to close the gap";

  return question.microInsightTemplate
    .replace("{{score}}", String(score))
    .replace("{{benchmark}}", String(benchmark))
    .replace("{{percentile}}", String(percentile))
    .replace("{{sizeLabel}}", sizeLabels[companySize])
    .replace("{{comparison}}", comparison);
}
