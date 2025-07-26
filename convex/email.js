import { v } from "convex/values";
import { action } from "./_generated/server";
import { Resend } from "resend";

// Action to send email using Resend
export const sendEmail = action({
  args: {
    to: v.string(),
    subject: v.string(),
    html: v.string(),
    text: v.optional(v.string()),
    from: v.optional(v.string()),
    apiKey: v.string(),
  },
  handler: async (ctx, args) => {
    const resend = new Resend(args.apiKey);

    try {
      const result = await resend.emails.send({
        from: args.from || "Splitr <onboarding@resend.dev>",
        to: args.to,
        subject: args.subject,
        html: args.html,
        text: args.text,
      });

      console.log("Email sent successfully:", result);

      // Check if there's an error in the response
      if (result.error) {
        return { success: false, error: result.error.error || result.error };
      }

      return { success: true, id: result.data?.id };
    } catch (error) {
      console.error("Failed to send email:", error);
      return { success: false, error: error?.message || "Unknown error" };
    }
  },
});