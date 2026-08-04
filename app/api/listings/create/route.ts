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
    if (!title || !price) {
      return NextResponse.json(
        { error: "Title and price are required" },
        { status: 400 },
      );
    }

    // Get or create default category
    let category = await prisma.category.findUnique({
      where: { slug: "general" },
    });

    if (!category) {
      category = await prisma.category.create({
        data: {
          name: "General",
          slug: "general",
        },
      });
    }

    // Create listing with image
    const listing = await prisma.listing.create({
      data: {
        title,
        description: description || null,
        price: parseFloat(price),
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
    console.error("Create listing error:", error);
    return NextResponse.json({ error: "Failed to " }, { status: 500 });
  }
}
