"use server";

import { getAuthenticatedUser, getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  createListingSchema,
  editListingSchema,
  type CreateListingInput,
  type EditListingInput,
} from "@/lib/schemas/listing.schema";

export async function updateProfile(
  prevState: { success?: boolean; error?: string } | null,
  formData: FormData,
) {
  try {
    const user = await getAuthenticatedUser();

    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;

    await prisma.user.update({
      where: { email: user.email },
      data: { name, phone: phone.replaceAll(" ", "") },
    });

    return { success: true };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Failed to update profile",
    };
  }
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

export async function createListing(data: CreateListingInput) {
  try {
    const user = await getAuthenticatedUser();

    const parsed = createListingSchema.safeParse(data);

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

export async function editListing(listingId: string, data: EditListingInput) {
  const user = await getAuthenticatedUser();

  const parsed = editListingSchema.safeParse(data);

  if (!parsed.success) {
    const firstError = Object.values(
      parsed.error.flatten().fieldErrors,
    )[0]?.[0];

    return { error: firstError || "Validation failed" };
  }

  const updateData: EditListingInput & {
    images?: { create: { url: string } };
  } = {
    ...parsed.data,
  };

  if (updateData.imageUrl !== undefined) {
    await prisma.image.deleteMany({
      where: { listingId },
    });

    updateData.images = {
      create: {
        url: updateData.imageUrl,
      },
    };
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
