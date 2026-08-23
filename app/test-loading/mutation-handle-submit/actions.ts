"use server";

import { addItem } from "@/app/test-loading/_lib/delay";

export async function createItemAction(formData: FormData) {
  const name = String(formData.get("name") ?? "");
  const item = await addItem(name);
  return { created: item.name };
}
