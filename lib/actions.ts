"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function updateProfile(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.email) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;

  return await prisma.user.update({
    where: { email: session.user.email },
    data: { name, phone },
  });
}

export async function deleteListing(listingId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.email) throw new Error("Unauthorized");

  return await prisma.listing.delete({
    where: { id: listingId, user: { email: session.user.email } },
  });
}
