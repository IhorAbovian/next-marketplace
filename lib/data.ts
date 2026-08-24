import { prisma } from "@/lib/prisma";

export type Category = {
  name: string;
  slug: string;
  children: { name: string; slug: string }[];
};

export type Listing = {
  id: string;
  title: string;
  price: number;
  description: string | null;
  images: { url: string }[];
  category: {
    slug: string;
    parent: { slug: string } | null;
  };
};

export async function getHomePageData(): Promise<{
  categories: Category[];
  autosListings: Listing[];
  realEstateListings: Listing[];
}> {
  const [categories, autosListings, realEstateListings] = await Promise.all([
    prisma.category.findMany({
      where: { parentId: null, name: { not: "General" } },
      select: {
        name: true,
        slug: true,
        children: { select: { name: true, slug: true } },
      },
    }),
    prisma.listing.findMany({
      where: { category: { slug: "autos" } },
      take: 10,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        price: true,
        description: true,
        images: { take: 1, select: { url: true } },
        category: {
          select: { slug: true, parent: { select: { slug: true } } },
        },
      },
    }),
    prisma.listing.findMany({
      where: { category: { slug: "real-estate" } },
      take: 10,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        price: true,
        description: true,
        images: { take: 1, select: { url: true } },
        category: {
          select: { slug: true, parent: { select: { slug: true } } },
        },
      },
    }),
  ]);

  return { categories, autosListings, realEstateListings };
}
