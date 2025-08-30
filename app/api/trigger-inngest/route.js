import { NextRequest, NextResponse } from "next/server";
import { inngest } from "@/lib/inngest/client";

export async function POST(request) {
  try {
    const { type } = await request.json();

    console.log(`🚀 Manually triggering Inngest function: ${type}`);

    let result;

    if (type === "payment-reminders") {
      // Trigger payment reminders manually
      result = await inngest.send({
        name: "send-payment-reminders",
        data: {
          manual: true,
          timestamp: Date.now(),
        },
      });
    } else if (type === "spending-insights") {
      // Trigger spending insights manually
      result = await inngest.send({
        name: "generate-spending-insights",
        data: {
          manual: true,
          timestamp: Date.now(),
        },
      });
    } else {
      throw new Error(
        'Invalid type. Use "payment-reminders" or "spending-insights"'
      );
    }

    return NextResponse.json({
      success: true,
      message: `Triggered ${type} successfully`,
      result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Manual trigger error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Manual Inngest Trigger Endpoint",
    usage: {
      method: "POST",
      body: {
        type: "payment-reminders | spending-insights",
      },
    },
    timestamp: new Date().toISOString(),
  });
}
