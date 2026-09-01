import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

export type CategoryWithChildren = Prisma.CategoryGetPayload<{
  include: {
    children: true;
  };
}>;

export type ListingWithCategory = Prisma.ListingGetPayload<{
  include: {
    images: true;
    category: {
      include: {
        parent: true;
      };
    };
    author: true;
  };
}>;

export async function getHomePageData(): Promise<{
  categories: CategoryWithChildren[];
  autosListings: ListingWithCategory[];
  realEstateListings: ListingWithCategory[];
}> {
  const [categories, autosListings, realEstateListings] = await Promise.all([
    prisma.category.findMany({
      where: { parentId: null, name: { not: "General" } },
      include: {
        children: true,
      },
    }),
    prisma.listing.findMany({
      where: {
        OR: [
          { category: { slug: "autos" } },
          { category: { parent: { slug: "autos" } } },
        ],
      },
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        images: { take: 1 },
        category: { include: { parent: true } },
        author: true,
      },
    }),
    prisma.listing.findMany({
      where: {
        OR: [
          { category: { slug: "real-estate" } },
          { category: { parent: { slug: "real-estate" } } },
        ],
      },
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        images: { take: 1 },
        category: { include: { parent: true } },
        author: true,
      },
    }),
  ]);

  return { categories, autosListings, realEstateListings };
}

export type UserWithCounts = Prisma.UserGetPayload<{
  select: {
    id: true;
    name: true;
    email: true;
    phone: true;
    image: true;
    createdAt: true;
    _count: {
      select: {
        listings: true;
        favorites: true;
      };
    };
  };
}>;

export async function getProfilePageData(
  userEmail: string,
): Promise<UserWithCounts | null> {
  return await prisma.user.findUnique({
    where: { email: userEmail },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      image: true,
      createdAt: true,
      _count: {
        select: {
          listings: true,
          favorites: true,
        },
      },
    },
  });
}

export async function getUserListings(
  userId: string,
): Promise<ListingWithCategory[]> {
  return await prisma.listing.findMany({
    where: { authorId: userId },
    orderBy: { createdAt: "desc" },
    include: {
      images: { take: 1 },
      category: { include: { parent: true } },
      author: true,
    },
  });
}

export async function getUserFavorites(
  userId: string,
): Promise<ListingWithCategory[]> {
  return await prisma.listing.findMany({
    where: {
      favorites: {
        some: {
          userId: userId,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    include: {
      images: { take: 1 },
      category: { include: { parent: true } },
      author: true,
    },
  });
}

export async function getSearchValue(
  query: string,
  category: string,
  sort: string,
  page: number,
): Promise<{
  listings: ListingWithCategory[];
  totalPages: number;
}> {
  const skip = (page - 1) * 20;
  const where: Prisma.ListingWhereInput = {};

  if (query) {
    where.OR = [
      { title: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
    ];
  }

  if (category) {
    where.category = {
      OR: [{ slug: category }, { parent: { slug: category } }],
    };
  }

  const orderBy: Prisma.ListingOrderByWithRelationInput = {};
  if (sort === "newest") orderBy.createdAt = "desc";
  if (sort === "oldest") orderBy.createdAt = "asc";
  if (sort === "price-low") orderBy.price = "asc";
  if (sort === "price-high") orderBy.price = "desc";

  const [listings, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      orderBy,
      skip,
      take: 20,
      include: {
        images: { take: 1 },
        category: { include: { parent: true } },
        author: true,
      },
    }),
    prisma.listing.count({ where }),
  ]);

  return {
    listings,
    totalPages: Math.ceil(total / 20),
  };
}

export async function getCategoryListings(
  categorySlug: string,
): Promise<ListingWithCategory[]> {
  return await prisma.listing.findMany({
    where: { category: { slug: categorySlug } },
    orderBy: { createdAt: "desc" },
    include: {
      images: { take: 1 },
      category: { include: { parent: true } },
      author: true,
    },
  });
}

export async function getListingById(
  id: string,
  subcategory: string,
): Promise<ListingWithCategory | null> {
  return await prisma.listing.findFirst({
    where: {
      id,
      category: { slug: subcategory },
    },
    include: {
      images: true,
      category: { include: { parent: true } },
      author: true,
    },
  });
}
