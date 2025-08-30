import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { paymentReminders } from "@/lib/inngest/payment-reminders";
import { spendingInsights } from "@/lib/inngest/spending-insights";

// Production-ready serve configuration
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [spendingInsights, paymentReminders],
  streaming: false, // Disable streaming for better compatibility
  landingPage: process.env.NODE_ENV === "development", // Only show landing page in dev
});

// Add CORS headers for production
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
