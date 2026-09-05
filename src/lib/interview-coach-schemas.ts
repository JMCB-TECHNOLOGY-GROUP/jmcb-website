// Zod shapes shared by the two Interview Coach routes. Kept out of the route
// files because Next only allows handler and config exports there.
import { z } from "zod";

const short = z.string().trim().max(400);

export const coachQuestionSchema = z.object({
  id: z.string().trim().max(40),
  kind: z.enum(["opener", "claim", "figure", "gap", "discrepancy", "generic", "closer"]),
  text: z.string().trim().max(600),
  why: z.string().trim().max(600),
  lookingFor: z.string().trim().max(600),
});

export const answerScoreSchema = z.object({
  structure: z.number().int().min(1).max(5),
  evidence: z.number().int().min(1).max(5),
  relevance: z.number().int().min(1).max(5),
  concision: z.number().int().min(1).max(5),
  note: z.string().max(1000),
  betterAnswer: z.string().max(2000).optional().nullable(),
});

export const coachSessionSchema = z.object({
  targetTitle: short,
  targetField: short.optional().nullable(),
  firstName: z.string().trim().max(120).optional().nullable(),
  persona: z.string().trim().max(3000),
  cvFacts: z.string().trim().max(8000),
  cvText: z.string().max(60_000).optional().nullable(),
  questions: z.array(coachQuestionSchema).min(2).max(8),
});

export const coachTurnSchema = z.object({
  questionId: z.string().trim().max(40),
  question: z.string().trim().max(600),
  answer: z.string().trim().max(6000),
  score: answerScoreSchema,
  followUp: z.string().max(600).optional().nullable(),
  followUpAnswer: z.string().max(6000).optional().nullable(),
});
