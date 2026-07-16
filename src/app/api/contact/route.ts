import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { sendEmail } from "@/lib/send-email";

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rl = checkRateLimit(`contact:${ip}`, 5, 60_000);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many requests, slow down" },
        { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } }
      );
    }

    const body = await request.json();
    const { name, email, organization, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }
    if (String(message).length > 5000 || String(name).length > 200) {
      return NextResponse.json({ error: "Message too long" }, { status: 400 });
    }

    const [firstName, ...rest] = String(name).trim().split(/\s+/);
    const lastName = rest.join(" ") || null;
    const note = `[Contact form ${new Date().toISOString()}]\n${message}`;

    const supabase = createServerClient();
    const { data: existingLead } = await supabase
      .from("leads")
      .select("id, notes")
      .eq("email", email.toLowerCase())
      .single();

    if (existingLead) {
      await supabase
        .from("leads")
        .update({
          notes: existingLead.notes ? `${existingLead.notes}\n\n${note}` : note,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingLead.id);
    } else {
      await supabase.from("leads").insert({
        email: email.toLowerCase(),
        first_name: firstName,
        last_name: lastName,
        organization: organization || null,
        source: "contact_form",
        status: "new",
        notes: note,
      });
    }

    // Notify Jermaine; the lead is already saved, so a mail failure is non-fatal.
    const esc = (s: string) =>
      String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    await sendEmail(
      "jermaine@jmcbtech.com",
      `New contact form message from ${name}`,
      `<p><strong>From:</strong> ${esc(name)} &lt;${esc(email)}&gt;</p>
       <p><strong>Organization:</strong> ${esc(organization || "—")}</p>
       <p style="white-space:pre-wrap">${esc(message)}</p>`,
      email
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
