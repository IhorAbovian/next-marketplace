import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "newest";
  const limit = parseInt(searchParams.get("limit") || "20");
  const offset = parseInt(searchParams.get("offset") || "0");

  try {
    const where: any = {};

    if (query) {
      where.OR = [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ];
    }

    if (category) {
      where.category = {
        slug: category,
      };
    }

    const orderBy: any = {};
    if (sort === "price-asc") orderBy.price = "asc";
    else if (sort === "price-desc") orderBy.price = "desc";
    else orderBy.createdAt = "desc";

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        take: limit,
        skip: offset,
        include: {
          images: true,
          category: {
            include: {
              parent: true,
            },
          },
        },
        orderBy,
      }),
      prisma.listing.count({ where }),
    ]);

    return NextResponse.json({
      listings,
      total,
      hasMore: offset + limit < total,
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Failed to search listings" },
      { status: 500 },
    );
  }
}
