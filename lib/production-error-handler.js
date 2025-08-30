// Production Error Handler for Inngest Email System
// Add this to your production monitoring

export function logProductionError(error, context) {
  const errorData = {
    timestamp: new Date().toISOString(),
    error: error.message,
    stack: error.stack,
    context,
    environment: process.env.NODE_ENV,
    convexUrl: process.env.NEXT_PUBLIC_CONVEX_URL ? "present" : "missing",
    resendKey: process.env.RESEND_API_KEY ? "present" : "missing",
    geminiKey: process.env.GEMINI_API_KEY ? "present" : "missing",
  };

  // Log to console (production logs)
  console.error("🚨 PRODUCTION ERROR:", JSON.stringify(errorData, null, 2));

  // You can add other logging services here:
  // - Sentry
  // - LogRocket
  // - DataDog
  // - Custom webhook

  return errorData;
}

export function validateProductionConfig() {
  const issues = [];

  if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    issues.push("NEXT_PUBLIC_CONVEX_URL missing");
  }

  if (!process.env.RESEND_API_KEY) {
    issues.push("RESEND_API_KEY missing");
  }

  if (!process.env.GEMINI_API_KEY) {
    issues.push("GEMINI_API_KEY missing");
  }

  if (!process.env.CLERK_SECRET_KEY) {
    issues.push("CLERK_SECRET_KEY missing");
  }

  if (issues.length > 0) {
    console.error("❌ Production Configuration Issues:", issues);
    return { valid: false, issues };
  }

  console.log("✅ Production configuration validated");
  return { valid: true, issues: [] };
}
