// server/api/inngest.ts

import { inngest } from "../../config/inngest";  // adjust path if needed
import { functions } from "../../config/inngest";
import { serve } from "inngest/nitro";
import { eventHandler } from "h3";
// This creates GET, POST, and PUT handlers automatically for Inngest
export default eventHandler(
  serve({ client: inngest, functions })
);