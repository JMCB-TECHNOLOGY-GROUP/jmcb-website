import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Serves the full early-access edition of The Laboratory Method, but only to
 * someone who has just paid. The Stripe Payment Link redirects buyers to
 * /book/thanks?session_id=cs_..., and that page links here with the same id.
 * We verify the Checkout Session with Stripe before sending a byte, so the
 * book file lives in src/content (bundled, never under public/).
 */
export async function GET(request: Request) {
  const sessionId = new URL(request.url).searchParams.get("session_id") || "";
  if (!/^cs_(live|test)_[A-Za-z0-9]+$/.test(sessionId)) {
    return NextResponse.json({ error: "Missing or malformed session id." }, { status: 400 });
  }

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return NextResponse.json({ error: "Downloads are temporarily unavailable." }, { status: 503 });
  }

  const res = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}`, {
    headers: { Authorization: `Bearer ${key}` },
    cache: "no-store",
  });
  if (!res.ok) {
    return NextResponse.json({ error: "We could not find that purchase." }, { status: 404 });
  }
  const session = (await res.json()) as { payment_status?: string; status?: string };
  if (session.payment_status !== "paid") {
    return NextResponse.json({ error: "That purchase has not completed yet." }, { status: 402 });
  }

  const file = path.join(process.cwd(), "src", "content", "book", "The-Laboratory-Method.html");
  const html = await readFile(file, "utf8");
  return new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": 'inline; filename="The-Laboratory-Method-Early-Access.html"',
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}
