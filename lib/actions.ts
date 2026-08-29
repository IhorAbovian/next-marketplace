"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { createListingSchema } from "@/lib/schemas/listing.schema";

// Helper functions for authentication
async function getSession() {
  return auth.api.getSession({
    headers: await headers(),
  });
}

async function getAuthenticatedUser() {
  const session = await getSession();

  if (!session?.user?.email) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) throw new Error("User not found");

  return user;
}

export async function updateProfile(formData: FormData) {
  const session = await getSession();
  if (!session?.user?.email) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;

  return await prisma.user.update({
    where: { email: session.user.email },
    data: { name, phone },
  });
}

export async function deleteListing(listingId: string) {
  const user = await getAuthenticatedUser();

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
  try {
    const user = await getAuthenticatedUser();

    const parsed = createListingSchema.safeParse({
      title: data.title,
      description: data.description,
      price: data.price,
      imageUrl: data.imageUrl,
      categoryId: data.categoryId,
    });

    if (!parsed.success) {
      const firstError = Object.values(
        parsed.error.flatten().fieldErrors,
      )[0]?.[0];
      return { error: firstError || "Validation failed" };
    }

    const listing = await prisma.listing.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description || null,
        price: Number(parsed.data.price),
        categoryId: parsed.data.categoryId,
        authorId: user.id,
        images: {
          create: {
            url: parsed.data.imageUrl,
          },
        },
      },
    });

    return { success: true, listing };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return { error: errorMessage };
  }
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
  const user = await getAuthenticatedUser();

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

export async function isFavoritedByUser(listingId: string): Promise<boolean> {
  const session = await getSession();

  if (!session?.user?.email) return false;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) return false;

  const favorite = await prisma.favorite.findUnique({
    where: {
      userId_listingId: {
        userId: user.id,
        listingId,
      },
    },
  });

  return !!favorite;
}

export async function toggleFavorite(listingId: string) {
  const user = await getAuthenticatedUser();

  // Check if favorite exists
  const existingFavorite = await prisma.favorite.findUnique({
    where: {
      userId_listingId: {
        userId: user.id,
        listingId,
      },
    },
  });

  if (existingFavorite) {
    // Remove from favorites
    return await prisma.favorite.delete({
      where: {
        id: existingFavorite.id,
      },
    });
  } else {
    // Add to favorites
    return await prisma.favorite.create({
      data: {
        userId: user.id,
        listingId,
      },
    });
  }
}
