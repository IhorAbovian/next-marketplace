import CategoryGrid from "@/components/sections/CategoryGrid";
import PopularListingsGrid from "@/components/sections/PopularListingsGrid";
import type { Category } from "@/components/sections/CategoryGrid";
import { popularAutosListings, popularRealEstateListings } from "@/lib/data";
import { prisma } from "@/lib/prisma";

const autoCategories: Category[] = [
  {
    id: 1,
    name: "Cars & Trucks",
    href: "/autos/cars-trucks",
  },
  {
    id: 2,
    name: "Motorcycles",
    href: "/autos/motorcycles",
  },
  {
    id: 3,
    name: "Boats",
    href: "/autos/boats",
  },
];

const realEstateCategories: Category[] = [
  {
    id: 1,
    name: "For Sale",
    href: "/real-estate/for-sale",
  },
  {
    id: 2,
    name: "For Rent",
    href: "/real-estate/for-rent",
  },
];

export default async function HomePage() {
  const users = await prisma.user.findMany();

  console.log({ users });

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
