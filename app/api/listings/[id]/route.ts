import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(
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

    // Get the listing to verify ownership
    const listing = await prisma.listing.findUnique({
      where: { id },
      select: { authorId: true, images: true },
    });

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    if (listing.authorId !== user.id) {
      return NextResponse.json(
        { error: "Unauthorized - not your listing" },
        { status: 403 },
      );
    }

    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = formData.get("price") as string;
    const imageUrl = formData.get("imageUrl") as string;
    const categoryId = formData.get("categoryId") as string;

    // Validate required fields
    if (!title || !price || !categoryId) {
      return NextResponse.json(
        { error: "Title, price, and category are required" },
        { status: 400 },
      );
    }

    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    // Update listing
    const updatedListing = await prisma.listing.update({
      where: { id },
      data: {
        title,
        description: description || null,
        price: parseInt(price, 10),
        categoryId: category.id,
      },
    });

    // Update images if new image URL is provided
    if (imageUrl) {
      // Delete old images
      await prisma.image.deleteMany({
        where: { listingId: id },
      });

      // Create new image
      await prisma.image.create({
        data: {
          url: imageUrl,
          listingId: id,
        },
      });
    }

    return NextResponse.json(updatedListing, { status: 200 });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Update listing error:", errorMessage);
    return NextResponse.json(
      { error: errorMessage || "Failed to update listing" },
      { status: 500 },
    );
  }
}

export async function DELETE(
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

    // Get the listing to verify ownership
    const listing = await prisma.listing.findUnique({
      where: { id },
      select: { authorId: true },
    });

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    if (listing.authorId !== user.id) {
      return NextResponse.json(
        { error: "Unauthorized - not your listing" },
        { status: 403 },
      );
    }

    // First delete all related images, then delete the listing
    await prisma.image.deleteMany({
      where: { listingId: id },
    });

    await prisma.listing.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete listing error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to delete listing: ${errorMessage}` },
      { status: 500 },
    );
  }
}
