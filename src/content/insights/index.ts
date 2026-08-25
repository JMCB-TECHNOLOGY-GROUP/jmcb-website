// Git-native registry for Insights posts. Adding a post means:
//   1. create src/content/insights/<slug>.tsx exporting `meta` + a default body component
//   2. import it here and add it to the array below
// Listing order, static params, sitemap, and the RSS feed all derive from this file.
import type { ComponentType } from "react";
import type { PostMeta } from "./types";
import WhyAiPilotsDie, { meta as whyAiPilotsDieMeta } from "./why-ai-pilots-die";
import MedicareRpm2026, { meta as medicareRpm2026Meta } from "./medicare-rpm-2026-small-practices";
import WhatAiGovernanceActuallyCosts, {
  meta as whatAiGovernanceActuallyCostsMeta,
} from "./what-ai-governance-actually-costs";
import ThirtyNinetyRule, { meta as thirtyNinetyRuleMeta } from "./30-90-rule-what-fits-what-doesnt";
import AiWroteMostOfMyCodeThisYear, {
  meta as aiWroteMostOfMyCodeThisYearMeta,
} from "./ai-wrote-most-of-my-code-this-year";
import OfflineFirstIsAWorldview, { meta as offlineFirstIsAWorldviewMeta } from "./offline-first-is-a-worldview";

export type { PostMeta } from "./types";

export interface InsightsPost {
  meta: PostMeta;
  Component: ComponentType;
}

export const insightsPosts: InsightsPost[] = [
  { meta: whyAiPilotsDieMeta, Component: WhyAiPilotsDie },
  { meta: medicareRpm2026Meta, Component: MedicareRpm2026 },
  { meta: whatAiGovernanceActuallyCostsMeta, Component: WhatAiGovernanceActuallyCosts },
  { meta: thirtyNinetyRuleMeta, Component: ThirtyNinetyRule },
  { meta: aiWroteMostOfMyCodeThisYearMeta, Component: AiWroteMostOfMyCodeThisYear },
  { meta: offlineFirstIsAWorldviewMeta, Component: OfflineFirstIsAWorldview },
].sort((a, b) => (a.meta.date < b.meta.date ? 1 : -1));

export function getInsightPost(slug: string): InsightsPost | undefined {
  return insightsPosts.find((post) => post.meta.slug === slug);
}
