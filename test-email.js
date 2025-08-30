// Test email functionality
import { ConvexHttpClient } from "convex/browser";
import { api } from "./convex/_generated/api.js";

async function testEmail() {
  console.log("Testing email functionality...");

  // Initialize Convex client
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

  try {
    console.log("Convex URL:", process.env.NEXT_PUBLIC_CONVEX_URL);
    console.log(
      "Resend API Key:",
      process.env.RESEND_API_KEY ? "✓ Present" : "❌ Missing"
    );

    // Test email sending
    const result = await convex.action(api.email.sendEmail, {
      to: process.env.TEST_EMAIL || "gabbar656521@gmail.com",
      from: "Splitr <onboarding@resend.dev>",
      subject: "Test Email from Splitr",
      html: "<h1>Test Email</h1><p>This is a test email from Splitr to verify email functionality.</p>",
      apiKey: process.env.RESEND_API_KEY,
    });

    console.log("Email test result:", result);

    if (result.success) {
      console.log("✅ Email sent successfully!");
    } else {
      console.log("❌ Email failed:", result.error);
    }
  } catch (error) {
    console.error("❌ Test failed with error:", error.message);
    console.error("Full error:", error);
  }
}

testEmail();
