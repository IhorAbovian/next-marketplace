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
    name: string;
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
      where: {
        OR: [
          { category: { slug: "autos" } },
          { category: { parent: { slug: "autos" } } },
        ],
      },
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        price: true,
        description: true,
        images: { take: 1, select: { url: true } },
        category: {
          select: {
            slug: true,
            name: true,
            parent: { select: { slug: true } },
          },
        },
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
      select: {
        id: true,
        title: true,
        price: true,
        description: true,
        images: { take: 1, select: { url: true } },
        category: {
          select: {
            slug: true,
            name: true,
            parent: { select: { slug: true } },
          },
        },
      },
    }),
  ]);

  return { categories, autosListings, realEstateListings };
}

export type ProfileUser = {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  image: string | null;
  createdAt: Date;
  _count: {
    listings: number;
    favorites: number;
  };
};

export async function getProfilePageData(
  userEmail: string,
): Promise<ProfileUser | null> {
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

export async function getUserListings(userId: string): Promise<Listing[]> {
  return await prisma.listing.findMany({
    where: { authorId: userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      price: true,
      description: true,
      images: { take: 1, select: { url: true } },
      category: {
        select: { slug: true, name: true, parent: { select: { slug: true } } },
      },
    },
  });
}

export async function getUserFavorites(userId: string): Promise<Listing[]> {
  return await prisma.listing.findMany({
    where: {
      favorites: {
        some: {
          userId: userId,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      price: true,
      description: true,
      images: { take: 1, select: { url: true } },
      category: {
        select: { slug: true, name: true, parent: { select: { slug: true } } },
      },
    },
  });
}
