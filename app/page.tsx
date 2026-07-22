import CategoryGrid from "@/components/sections/CategoryGrid";
import PopularListingsGrid from "@/components/sections/PopularListingsGrid";
import type { Category } from "@/components/sections/CategoryGrid";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const categories = await prisma.category.findMany({
    select: {
      name: true,
      slug: true,
      children: { select: { name: true, slug: true } },
    },
  });

  const popularAutosListings = await prisma.listing.findMany({
    where: { category: { slug: "autos" } },
    take: 5,
    select: {
      id: true,
      title: true,
      price: true,
      location: true,
      images: { take: 1, select: { url: true } },
      category: { select: { slug: true } },
    },
  });

  const popularRealEstateListings = await prisma.listing.findMany({
    where: { category: { slug: "real-estate" } },
    take: 5,
    select: {
      id: true,
      title: true,
      price: true,
      location: true,
      images: { take: 1, select: { url: true } },
      category: { select: { slug: true } },
    },
  });

  const autoCategories: Category[] =
    categories
      .find((c) => c.slug === "autos")
      ?.children.map((child) => ({
        id: child.slug,
        name: child.name,
        href: `/autos/${child.slug}`,
      })) || [];

  const realEstateCategories: Category[] =
    categories
      .find((c) => c.slug === "real-estate")
      ?.children.map((child) => ({
        id: child.slug,
        name: child.name,
        href: `/real-estate/${child.slug}`,
      })) || [];

  const popularAutosListingsWithImages = popularAutosListings.map(
    (listing) => ({
      id: listing.id.toString(),
      title: listing.title,
      price: Number(listing.price),
      location: listing.location,
      image: listing.images[0]?.url || "https://placehold.co/400x300",
      category: "autos",
      subcategory: listing.category.slug,
    }),
  );

  const popularRealEstateListingsWithImages = popularRealEstateListings.map(
    (listing) => ({
      id: listing.id.toString(),
      title: listing.title,
      price: Number(listing.price),
      location: listing.location,
      image: listing.images[0]?.url || "https://placehold.co/400x300",
      category: "real-estate",
      subcategory: listing.category.slug,
    }),
  );

  return (
    <main className="container max-w-7xl mx-auto px-4 pt-8">
      {/* Auto Categories Section */}
      <CategoryGrid title="Auto Categories" categories={autoCategories} />

      {/* Real Estate Categories Section */}
      <CategoryGrid
        title="Real Estate Categories"
        categories={realEstateCategories}
      />

      {/* Popular Autos Listings Section */}
      <PopularListingsGrid
        title="Popular listings in Autos"
        listings={popularAutosListingsWithImages}
      />

      {/* Popular Real Estate Listings Section */}
      <PopularListingsGrid
        title="Popular listings in Real Estate"
        listings={popularRealEstateListingsWithImages}
      />
    </main>
  );
}
