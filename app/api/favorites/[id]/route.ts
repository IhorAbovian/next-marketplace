import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const sessionData = await auth.api.getSession({
      headers: await headers(),
    });

    if (!sessionData?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: sessionData.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if listing exists
    const listing = await prisma.listing.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    // Check if already favorited
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_listingId: { userId: user.id, listingId: id },
      },
    });

    if (existing) {
      // Remove from favorites
      await prisma.favorite.delete({
        where: {
          userId_listingId: { userId: user.id, listingId: id },
        },
      });
      return NextResponse.json({ favorited: false });
    }

    // Add to favorites
    await prisma.favorite.create({
      data: { userId: user.id, listingId: id },
    });

    return NextResponse.json({ favorited: true });
  } catch (error) {
    console.error("Favorites error:", error);
    return NextResponse.json(
      { error: "Failed to toggle favorite" },
      { status: 500 },
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const sessionData = await auth.api.getSession({
      headers: await headers(),
    });

    if (!sessionData?.user) {
      return NextResponse.json({ favorited: false });
    }

    const user = await prisma.user.findUnique({
      where: { email: sessionData.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ favorited: false });
    }

    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_listingId: { userId: user.id, listingId: id },
      },
    });

    return NextResponse.json({ favorited: !!favorite });
  } catch (error) {
    console.error("Get favorite status error:", error);
    return NextResponse.json({ favorited: false });
  }
}
