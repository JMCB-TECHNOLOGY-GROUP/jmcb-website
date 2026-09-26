// ============================================================
// src/lib/lab.ts — server-only helpers for the Proof of Work Lab.
// Tokens, student lookup, and Stripe Checkout (via the REST API, no SDK).
// ============================================================

import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";
import { createServerClient } from "./supabase";
import type { LabStudentView } from "./lab-shared";

export const LAB_COHORT = "cohort-1";

export const STUDENT_COLUMNS =
  "id, first_name, last_name, email, phone, real_task, status, github_username, github_verified_at, intro, linkedin, target_role, role_postings, role_skills, route, route_reason, paid_at, agreement_signed_at, address_request, jmcb_address";

export function newToken(): { token: string; hash: string } {
  const token = randomBytes(24).toString("base64url");
  return { token, hash: hashToken(token) };
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

// Tokens are 32 base64url characters; reject anything else before touching
// the database.
export function isTokenShape(token: string): boolean {
  return /^[A-Za-z0-9_-]{32}$/.test(token);
}

export async function studentByToken(token: string): Promise<LabStudentView | null> {
  if (!isTokenShape(token)) return null;
  const supabase = createServerClient();
  const { data } = await supabase
    .from("lab_students")
    .select(STUDENT_COLUMNS)
    .eq("token_hash", hashToken(token))
    .neq("status", "withdrawn")
    .maybeSingle();
  return (data as LabStudentView | null) ?? null;
}

export function portalUrl(token: string): string {
  const base = process.env.NEXT_PUBLIC_APP_URL || "https://www.jmcbtech.com";
  return `${base.replace(/\/$/, "")}/lab/${token}`;
}

export function checkAdmin(request: NextRequest): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const provided = (request.headers.get("authorization") || "").replace("Bearer ", "");
  if (provided.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(provided), Buffer.from(expected));
}

// Track fee in cents. Unset means the fee is not decided yet, and the portal
// says so instead of showing a checkout button.
export function trackFeeCents(): number | null {
  const n = Number(process.env.LAB_TRACK_FEE_CENTS);
  return Number.isInteger(n) && n > 0 ? n : null;
}

async function stripe(path: string, init?: { method?: string; form?: Record<string, string> }) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY not set");
  const res = await fetch(`https://api.stripe.com/v1/${path}`, {
    method: init?.method || "GET",
    headers: {
      Authorization: `Bearer ${key}`,
      ...(init?.form ? { "Content-Type": "application/x-www-form-urlencoded" } : {}),
    },
    body: init?.form ? new URLSearchParams(init.form).toString() : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || `Stripe ${res.status}`);
  return data;
}

export async function createCheckout(student: LabStudentView, token: string, cents: number): Promise<string> {
  const url = portalUrl(token);
  const session = await stripe("checkout/sessions", {
    method: "POST",
    form: {
      mode: "payment",
      customer_email: student.email,
      "line_items[0][quantity]": "1",
      "line_items[0][price_data][currency]": "usd",
      "line_items[0][price_data][unit_amount]": String(cents),
      "line_items[0][price_data][product_data][name]": "Proof of Work — Certification Track",
      "metadata[lab_student_id]": student.id,
      success_url: `${url}?paid={CHECKOUT_SESSION_ID}`,
      cancel_url: url,
    },
  });
  return session.url as string;
}

// Returns true when the Checkout Session is paid and belongs to this student.
export async function verifyCheckout(sessionId: string, studentId: string): Promise<boolean> {
  if (!/^cs_[A-Za-z0-9_]+$/.test(sessionId)) return false;
  const s = await stripe(`checkout/sessions/${sessionId}`);
  return s.payment_status === "paid" && s.metadata?.lab_student_id === studentId;
}
