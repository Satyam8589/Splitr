// Debug Inngest Email Issues
// This script will help identify problems with email sending

const issues = {
  "Environment Variables": [],
  "Inngest Configuration": [],
  "Email Service": [],
  "Function Registration": [],
};

// Check 1: Environment Variables
console.log("🔍 CHECKING ENVIRONMENT VARIABLES...");
console.log("=====================================");

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  issues["Environment Variables"].push("❌ NEXT_PUBLIC_CONVEX_URL missing");
} else {
  console.log("✅ NEXT_PUBLIC_CONVEX_URL:", process.env.NEXT_PUBLIC_CONVEX_URL);
}

if (!process.env.RESEND_API_KEY) {
  issues["Environment Variables"].push("❌ RESEND_API_KEY missing");
} else {
  console.log("✅ RESEND_API_KEY: Present (hidden for security)");
}

if (!process.env.GEMINI_API_KEY) {
  issues["Environment Variables"].push("❌ GEMINI_API_KEY missing");
} else {
  console.log("✅ GEMINI_API_KEY: Present (hidden for security)");
}

console.log("\n🔍 POTENTIAL ISSUES IDENTIFIED:");
console.log("================================");

// Known issues from analysis
issues["Inngest Configuration"].push(
  "⚠️  Payment reminders hardcoded to 'gabbar656521@gmail.com' instead of user.email"
);
issues["Email Service"].push(
  "⚠️  Resend 'from' address uses 'onboarding@resend.dev' which may be restricted"
);
issues["Function Registration"].push(
  "⚠️  Cron schedules may not be properly configured in production"
);

// Additional potential issues
issues["Environment Variables"].push(
  "⚠️  TEST_EMAIL variable present but may not be used correctly"
);
issues["Inngest Configuration"].push(
  "⚠️  step.ai.wrap usage for Gemini might have authentication issues"
);
issues["Email Service"].push(
  "⚠️  Email HTML templates not validated for deliverability"
);

// Display all issues
Object.entries(issues).forEach(([category, categoryIssues]) => {
  if (categoryIssues.length > 0) {
    console.log(`\n📋 ${category}:`);
    categoryIssues.forEach((issue) => console.log(`   ${issue}`));
  }
});

console.log("\n🛠️  RECOMMENDED FIXES:");
console.log("======================");
console.log("1. Fix hardcoded email in payment-reminders.js (line 39)");
console.log("2. Configure proper 'from' domain in Resend settings");
console.log("3. Add error handling for failed email sends");
console.log("4. Validate Gemini API configuration");
console.log("5. Test email deliverability with real addresses");
console.log("6. Add logging for Inngest function execution");
console.log("7. Verify cron schedules are working in production mode");
