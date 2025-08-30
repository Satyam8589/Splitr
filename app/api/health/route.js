import { NextRequest, NextResponse } from "next/server";
import {
  validateProductionConfig,
  logProductionError,
} from "@/lib/production-error-handler";

export async function GET() {
  try {
    // Validate production configuration
    const configCheck = validateProductionConfig();

    const healthCheck = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      configuration: configCheck,
      services: {
        convex: {
          url: process.env.NEXT_PUBLIC_CONVEX_URL ? "configured" : "missing",
          deployment: process.env.CONVEX_DEPLOYMENT || "not-set",
        },
        resend: {
          apiKey: process.env.RESEND_API_KEY ? "configured" : "missing",
        },
        gemini: {
          apiKey: process.env.GEMINI_API_KEY ? "configured" : "missing",
        },
        clerk: {
          publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
            ? "configured"
            : "missing",
          secretKey: process.env.CLERK_SECRET_KEY ? "configured" : "missing",
        },
      },
    };

    // If configuration is invalid, return error status
    if (!configCheck.valid) {
      healthCheck.status = "unhealthy";
      return NextResponse.json(healthCheck, { status: 500 });
    }

    return NextResponse.json(healthCheck);
  } catch (error) {
    const errorData = logProductionError(error, "health-check");

    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        error: error.message,
        details: errorData,
      },
      { status: 500 }
    );
  }
}
