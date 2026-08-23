"use server";

import { addItem } from "@/app/test-loading/_lib/delay";

export async function likeAction() {
  const item = await addItem("Liked item");
  return item.id;
}
