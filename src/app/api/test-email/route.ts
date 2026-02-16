import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/send-email";

export async function GET() {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM || "Jermaine Barker <jermaine@info.jmcbtech.com>";
  const testTo = process.env.JERMAINE_EMAIL || "jermaine@jmcbtech.com";
  
  const diagnostics: string[] = [];
  diagnostics.push(`RESEND_API_KEY: ${apiKey ? `SET (${apiKey.substring(0, 8)}...)` : "!! NOT SET !!"}`);
  diagnostics.push(`RESEND_FROM: ${from}`);
  diagnostics.push(`JERMAINE_EMAIL: ${testTo}`);
  diagnostics.push(`NODE_ENV: ${process.env.NODE_ENV}`);

  let emailResult = "not attempted";
  
  if (!apiKey) {
    diagnostics.push("CRITICAL: No RESEND_API_KEY in Vercel env vars. Emails will never send.");
    diagnostics.push("FIX: Go to Vercel > Settings > Environment Variables > Add RESEND_API_KEY");
  } else {
    try {
      const success = await sendEmail(
        testTo,
        "JMCB Email Test - Pipeline Working",
        `<div style="font-family:sans-serif;padding:24px;max-width:500px">
          <h2 style="color:#d97706;margin:0 0 12px">Email Pipeline Active</h2>
          <p>If you're reading this, your assessment emails are working.</p>
          <p><strong>From:</strong> ${from}</p>
          <p><strong>To:</strong> ${testTo}</p>
          <p><strong>Time:</strong> ${new Date().toISOString()}</p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0"/>
          <p style="color:#64748b;font-size:13px">JMCB Technology Group | jmcbtech.com</p>
        </div>`
      );
      emailResult = success ? "SENT SUCCESSFULLY" : "FAILED (check logs above)";
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      emailResult = `EXCEPTION: ${msg}`;
    }
  }

  diagnostics.push(`Email send result: ${emailResult}`);

  return NextResponse.json({ diagnostics, timestamp: new Date().toISOString() });
}
