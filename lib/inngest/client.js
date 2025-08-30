import { Inngest } from "inngest";

// Create a client to send and receive events
export const inngest = new Inngest({
  id: "splitr",
  // Add production configuration
  isDev: process.env.NODE_ENV !== "production",
  eventKey: process.env.INNGEST_EVENT_KEY, // Optional: for additional security
});
