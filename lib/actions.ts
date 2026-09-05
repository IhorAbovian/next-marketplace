"use server";

import { getAuthenticatedUser, getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  createListingSchema,
  editListingSchema,
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

export async function createListing(
  prevState: { success?: boolean; error?: string } | null,
  formData: FormData,
) {
  try {
    const user = await getAuthenticatedUser();

    const parsed = createListingSchema.safeParse({
      title: formData.get("title"),
      description: formData.get("description"),
      price: formData.get("price"),
      categoryId: formData.get("categoryId"),
      imageUrl: formData.get("imageUrl"),
    });

    if (!parsed.success) {
      const firstError = Object.values(
        parsed.error.flatten().fieldErrors,
      )[0]?.[0];

      return { error: firstError || "Validation failed" };
    }

    await prisma.listing.create({
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

    return { success: true };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return { error: errorMessage };
  }
}

export async function editListing(
  prevState: { success?: boolean; error?: string } | null,
  formData: FormData,
) {
  try {
    const user = await getAuthenticatedUser();

    const listingId = formData.get("listingId") as string;
    const imageUrl = formData.get("imageUrl");

    const parsed = editListingSchema.safeParse({
      title: formData.get("title") ?? undefined,
      description: formData.get("description") ?? undefined,
      price: formData.get("price") ?? undefined,
      categoryId: formData.get("categoryId") ?? undefined,
      imageUrl: imageUrl === null ? undefined : imageUrl,
    });

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

    await prisma.listing.update({
      where: {
        id: listingId,
        authorId: user.id,
      },
      data: updateData,
    });

    return { success: true };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return { error: errorMessage };
  }
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

export async function getUserChats() {
  const user = await getAuthenticatedUser();

  const chats = await prisma.chat.findMany({
    where: { OR: [{ buyerId: user.id }, { sellerId: user.id }] },
  });

  return Promise.all(
    chats.map(async (chat) => {
      const otherUserId =
        chat.buyerId === user.id ? chat.sellerId : chat.buyerId;

      const [listing, otherUser, lastMessage] = await Promise.all([
        prisma.listing.findUnique({
          where: { id: chat.listingId },
          select: { title: true },
        }),
        prisma.user.findUnique({
          where: { id: otherUserId },
          select: { name: true, email: true },
        }),
        prisma.chatMessage.findFirst({
          where: { chatId: chat.id },
          orderBy: { createdAt: "desc" },
        }),
      ]);

      return {
        id: chat.id,
        title: `${listing?.title ?? "Listing"} - ${otherUser?.name ?? otherUser?.email ?? "User"}`,
        lastMessage: lastMessage?.content ?? "",
        isSeller: chat.sellerId === user.id,
      };
    }),
  );
}

export async function getChatMessages(chatId: string) {
  await getAuthenticatedUser();

  return prisma.chatMessage.findMany({
    where: { chatId },
    orderBy: { createdAt: "asc" },
  });
}

export async function sendChatMessage(chatId: string, content: string) {
  const user = await getAuthenticatedUser();

  return prisma.chatMessage.create({
    data: { chatId, senderId: user.id, content },
  });
}

export async function createOrFindChat(listingId: string, sellerId: string) {
  const user = await getAuthenticatedUser();

  const existing = await prisma.chat.findFirst({
    where: { listingId, buyerId: user.id, sellerId },
  });

  if (existing) return existing;

  return prisma.chat.create({
    data: { listingId, buyerId: user.id, sellerId },
  });
}
