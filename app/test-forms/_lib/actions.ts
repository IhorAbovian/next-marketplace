"use server";

import { contactSchema, type ContactInput } from "@/app/test-forms/_lib/schema";
import { saveSubmission } from "@/app/test-forms/_lib/data";

// Shared Server Action used by every client-driven form on the RHF side
// (client-form-rhf-zod and the manual-validation comparison). It re-runs the
// same Zod schema the client already validated with — never trust that a
// request actually came from the form you rendered.
export async function submitContactAction(data: ContactInput) {
  const parsed = contactSchema.parse(data);
  return await saveSubmission(parsed);
}
