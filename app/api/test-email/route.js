import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

// Initialize Convex client
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

export async function POST(request) {
  try {
    console.log("🔍 Testing email functionality manually...");

    // 1. Test basic email send
    const testResult = await convex.action(api.email.sendEmail, {
      to: process.env.TEST_EMAIL || "gabbar656521@gmail.com",
      from: "Splitr <onboarding@resend.dev>",
      subject: "Manual Test Email from Splitr",
      html: `
        <h1>🧪 Test Email</h1>
        <p>This is a manual test email to verify Splitr's email functionality.</p>
        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
        <p><strong>Environment:</strong> ${process.env.NODE_ENV || "development"}</p>
      `,
      apiKey: process.env.RESEND_API_KEY,
    });

    console.log("Test email result:", testResult);

    // 2. Check for users with outstanding debts
    const usersWithDebts = await convex.query(
      api.inngest.getUsersWithOutstandingDebts
    );
    console.log("Users with debts:", usersWithDebts.length);

    // 3. Check for users with expenses
    const usersWithExpenses = await convex.query(
      api.inngest.getUsersWithExpenses
    );
    console.log("Users with expenses:", usersWithExpenses.length);

    return NextResponse.json({
      success: true,
      testEmail: testResult,
      usersWithDebts: usersWithDebts.length,
      usersWithExpenses: usersWithExpenses.length,
      usersWithDebtsData: usersWithDebts,
      environment: {
        hasConvexUrl: !!process.env.NEXT_PUBLIC_CONVEX_URL,
        hasResendKey: !!process.env.RESEND_API_KEY,
        hasGeminiKey: !!process.env.GEMINI_API_KEY,
        nodeEnv: process.env.NODE_ENV,
      },
    });
  } catch (error) {
    console.error("Test endpoint error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        stack: error.stack,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Email Test Endpoint",
    usage: "Send POST request to test email functionality",
    timestamp: new Date().toISOString(),
  });
}
