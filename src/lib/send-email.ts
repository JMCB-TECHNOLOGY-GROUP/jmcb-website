// ============================================================
// SEND-EMAIL: Resend wrapper with fallback logging
// Single source of truth for all outbound email
// ============================================================

const RESEND_FROM = process.env.RESEND_FROM || "Jermaine Barker <jermaine@jmcbtech.com>";

export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  replyTo?: string
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log(`[EMAIL SKIP] No RESEND_API_KEY. Would send to: ${to} | Subject: ${subject}`);
    return false;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: RESEND_FROM,
        to: [to],
        subject,
        html,
        reply_to: replyTo || undefined,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error(`[EMAIL ERROR] ${res.status} to ${to}: ${err}`);
      return false;
    }

    const data = await res.json();
    console.log(`[EMAIL SENT] ${subject} -> ${to} (ID: ${data.id})`);
    return true;
  } catch (err) {
    console.error(`[EMAIL EXCEPTION] to ${to}:`, err);
    return false;
  }
}
