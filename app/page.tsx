import CategoryGrid from "@/components/sections/CategoryGrid";
import PopularListingsGrid from "@/components/sections/PopularListingsGrid";
import type { Category } from "@/components/sections/CategoryGrid";
import { popularAutosListings, popularRealEstateListings } from "@/lib/data";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const categories = await prisma.category.findMany({
    select: {
      name: true,
      slug: true,
      children: { select: { name: true, slug: true } },
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
        listings={popularAutosListings}
      />

      {/* Popular Real Estate Listings Section */}
      <PopularListingsGrid
        title="Popular listings in Real Estate"
        listings={popularRealEstateListings}
      />
    </main>
  );
}
