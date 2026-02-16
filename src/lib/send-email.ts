// ============================================================
// SEND-EMAIL: Resend wrapper
// Uses verified domain if available, falls back to Resend test sender
// ============================================================

const RESEND_FROM = process.env.RESEND_FROM || "Jermaine Barker <jermaine@info.jmcbtech.com>";

export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  replyTo?: string
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log(`[EMAIL SKIP] No RESEND_API_KEY set. Would send to: ${to} | Subject: ${subject}`);
    return false;
  }

  try {
    const payload = {
      from: RESEND_FROM,
      to: [to],
      subject,
      html,
      reply_to: replyTo || "jermaine@jmcbtech.com",
    };

    console.log(`[EMAIL SENDING] To: ${to} | From: ${RESEND_FROM} | Subject: ${subject}`);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const responseText = await res.text();

    if (!res.ok) {
      console.error(`[EMAIL ERROR] Status ${res.status} to ${to}: ${responseText}`);
      return false;
    }

    let data;
    try { data = JSON.parse(responseText); } catch { data = { id: "unknown" }; }
    console.log(`[EMAIL SENT] ${subject} -> ${to} (ID: ${data.id})`);
    return true;
  } catch (err) {
    console.error(`[EMAIL EXCEPTION] to ${to}:`, err);
    return false;
  }
}
