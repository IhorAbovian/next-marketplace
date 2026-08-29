"use server";

import { revalidatePath } from "next/cache";
import { saveSubmission } from "@/app/test-forms/_lib/data";

export async function submitBasicAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  await saveSubmission({ name });
  revalidatePath("/test-forms/server-form-basic");
}
