import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const sessionData = await auth.api.getSession({
      headers: await headers(),
    });

    if (!sessionData?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user from Prisma
    const user = await prisma.user.findUnique({
      where: { email: sessionData.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const formData = await req.formData();
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

    // Create listing with image
    const listing = await prisma.listing.create({
      data: {
        title,
        description: description || null,
        price: parseInt(price, 10),
        categoryId: category.id,
        authorId: user.id,
        images: imageUrl
          ? {
              create: {
                url: imageUrl,
              },
            }
          : undefined,
      },
      include: {
        images: true,
      },
    });

    return NextResponse.json(listing, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Create listing error:", errorMessage);
    return NextResponse.json(
      { error: errorMessage || "Failed to create listing" },
      { status: 500 },
    );
  }
}
