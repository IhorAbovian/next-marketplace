"use server";

import { contactSchema } from "@/app/test-forms/_lib/schema";
import { saveSubmission } from "@/app/test-forms/_lib/data";

export type ActionState = {
  errors: Partial<Record<"name" | "email" | "message", string[]>>;
  values: { name: string; email: string; message: string };
  success?: boolean;
};

export async function submitValidatedAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const values = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    message: String(formData.get("message") ?? ""),
  };

  const parsed = contactSchema.safeParse(values);

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors, values };
  }

  await saveSubmission(parsed.data);

  return {
    errors: {},
    values: { name: "", email: "", message: "" },
    success: true,
  };
}
