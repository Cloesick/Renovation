import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { subject, html, to } = (await req.json()) as {
      subject: string;
      html: string;
      to?: string;
    };

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: "RESEND_API_KEY is not configured." },
        { status: 500 }
      );
    }

   const toEnv = process.env.EMAIL_TO;
if (!toEnv) {
  return NextResponse.json(
    { error: "No recipient email configured." },
    { status: 500 }
  );
}

const toAddresses = to
  ? [to]
  : toEnv.split(",").map((s) => s.trim()).filter(Boolean);

const { data, error } = await resend.emails.send({
  from: process.env.EMAIL_FROM || "Renovation App <no-reply@example.com>",
  to: toAddresses,
  subject,
  html,
});

if (error) {
  console.error("Resend send error", error);
  return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
}

return NextResponse.json({ id: data?.id });
  } catch (err) {
    console.error("Error in /api/send-email", err);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}