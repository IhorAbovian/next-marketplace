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

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) throw new Error("User not found");

  await prisma.image.deleteMany({
    where: { listingId },
  });

  return await prisma.listing.delete({
    where: {
      id: listingId,
      authorId: user.id,
    },
  });
}

export async function createListing(data: {
  title: string;
  description: string;
  price: string;
  imageUrl: string;
  categoryId: string;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.email) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) throw new Error("User not found");

  const listing = await prisma.listing.create({
    data: {
      title: data.title,
      description: data.description || null,
      price: parseFloat(data.price),
      categoryId: data.categoryId,
      authorId: user.id,
      images: {
        create: {
          url: data.imageUrl,
        },
      },
    },
  });

  return listing;
}

export async function editListing(
  listingId: string,
  data: {
    title?: string;
    description?: string;
    price?: string;
    categoryId?: string;
    imageUrl?: string;
  },
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.email) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) throw new Error("User not found");

  const updateData: any = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined)
    updateData.description = data.description || null;
  if (data.price !== undefined) updateData.price = parseFloat(data.price);
  if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;

  if (data.imageUrl !== undefined) {
    await prisma.image.deleteMany({
      where: { listingId },
    });

    if (data.imageUrl) {
      updateData.images = {
        create: {
          url: data.imageUrl,
        },
      };
    }
  }

  return await prisma.listing.update({
    where: {
      id: listingId,
      authorId: user.id,
    },
    data: updateData,
  });
}
