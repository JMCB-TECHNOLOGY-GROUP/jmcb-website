import { Resend } from "resend";

// Lazy initialization to avoid build-time errors
let resend: Resend | null = null;

function getResendClient() {
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

interface SendAssessmentReportParams {
  to: string;
  firstName: string;
  organization: string;
  score: number;
  band: "early" | "developing" | "advanced";
  assessmentId: string;
}

const bandLabels = {
  early: {
    title: "Foundation Stage",
    color: "#DC2626",
  },
  developing: {
    title: "Developing Stage",
    color: "#D97706",
  },
  advanced: {
    title: "Advanced Stage",
    color: "#059669",
  },
};

export async function sendAssessmentReport({
  to,
  firstName,
  organization,
  score,
  band,
  assessmentId,
}: SendAssessmentReportParams) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://jmcbtech.com";
  const dashboardUrl = `${appUrl}/dashboard/results/${assessmentId}`;
  const bandInfo = bandLabels[band];

  try {
    const { data, error } = await getResendClient().emails.send({
      from: "JMCB Technology Group <assessments@jmcbtech.com>",
      to: [to],
      subject: `Your AI Readiness Assessment Results - ${organization}`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #374151; max-width: 600px; margin: 0 auto; padding: 20px;">

  <div style="text-align: center; margin-bottom: 30px;">
    <img src="${appUrl}/logo.png" alt="JMCB Technology Group" style="height: 40px; width: auto;">
  </div>

  <div style="background-color: #f9fafb; border-radius: 12px; padding: 30px; margin-bottom: 20px;">
    <h1 style="color: #111827; font-size: 24px; margin: 0 0 10px 0;">Hi ${firstName},</h1>
    <p style="color: #6b7280; margin: 0;">Thank you for completing the AI Readiness Assessment for ${organization}.</p>
  </div>

  <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 30px; margin-bottom: 20px; text-align: center;">
    <p style="color: #6b7280; text-transform: uppercase; font-size: 12px; letter-spacing: 1px; margin: 0 0 10px 0;">Your Score</p>
    <div style="font-size: 48px; font-weight: bold; color: ${bandInfo.color}; margin-bottom: 10px;">
      ${score}<span style="font-size: 24px; opacity: 0.6;">/50</span>
    </div>
    <div style="display: inline-block; background-color: ${bandInfo.color}20; color: ${bandInfo.color}; padding: 8px 16px; border-radius: 20px; font-weight: 600; font-size: 14px;">
      ${bandInfo.title}
    </div>
  </div>

  <div style="background-color: #f9fafb; border-radius: 12px; padding: 30px; margin-bottom: 20px;">
    <h2 style="color: #111827; font-size: 18px; margin: 0 0 15px 0;">What's Next?</h2>
    <ul style="color: #6b7280; padding-left: 20px; margin: 0;">
      <li style="margin-bottom: 10px;">View your detailed results and recommendations in your dashboard</li>
      <li style="margin-bottom: 10px;">Download your comprehensive PDF report</li>
      <li style="margin-bottom: 10px;">Schedule a strategy session to discuss your AI roadmap</li>
    </ul>
  </div>

  <div style="text-align: center; margin-bottom: 30px;">
    <a href="${dashboardUrl}" style="display: inline-block; background-color: #F59E0B; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 16px;">View Full Results</a>
  </div>

  <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e5e7eb;">
    <p style="color: #9ca3af; font-size: 14px; margin: 0 0 10px 0;">
      Questions? Reply to this email or schedule a call.
    </p>
    <a href="https://calendly.com/jermaine-jmcbtech/ai-strategy-ai-agents-consultation" style="color: #F59E0B; text-decoration: none; font-size: 14px;">Schedule a Strategy Session</a>
    <p style="color: #d1d5db; font-size: 12px; margin-top: 20px;">
      © 2026 JMCB Technology Group. All rights reserved.<br>
      Powered by the ASCEND™ Framework
    </p>
  </div>

</body>
</html>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error };
    }

    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, error };
  }
}

export async function sendWelcomeEmail(to: string, firstName: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://jmcbtech.com";

  try {
    const { data, error } = await getResendClient().emails.send({
      from: "JMCB Technology Group <welcome@jmcbtech.com>",
      to: [to],
      subject: "Welcome to JMCB Technology Group",
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #374151; max-width: 600px; margin: 0 auto; padding: 20px;">

  <div style="text-align: center; margin-bottom: 30px;">
    <img src="${appUrl}/logo.png" alt="JMCB Technology Group" style="height: 40px; width: auto;">
  </div>

  <div style="background-color: #f9fafb; border-radius: 12px; padding: 30px; margin-bottom: 20px;">
    <h1 style="color: #111827; font-size: 24px; margin: 0 0 10px 0;">Welcome, ${firstName}!</h1>
    <p style="color: #6b7280; margin: 0;">Your account has been created. You now have access to save assessment results, track your AI readiness journey, and receive personalized recommendations.</p>
  </div>

  <div style="text-align: center; margin-bottom: 30px;">
    <a href="${appUrl}/dashboard" style="display: inline-block; background-color: #F59E0B; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 16px;">Go to Dashboard</a>
  </div>

  <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e5e7eb;">
    <p style="color: #d1d5db; font-size: 12px; margin-top: 20px;">
      © 2026 JMCB Technology Group. All rights reserved.
    </p>
  </div>

</body>
</html>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error };
    }

    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, error };
  }
}
