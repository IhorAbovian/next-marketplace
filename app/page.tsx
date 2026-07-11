import CategoryGrid from "@/components/sections/CategoryGrid";
import type { Category } from "@/components/sections/CategoryGrid";

const autoCategories: Category[] = [
  {
    id: 1,
    name: "Cars & Trucks",
    href: "/cars",
  },
  {
    id: 2,
    name: "Motorcycles",
    href: "/cars/motorcycles",
  },
  {
    id: 3,
    name: "Boats",
    href: "/cars/boats",
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

export default function HomePage() {
  return (
    <main className="container max-w-7xl mx-auto px-4 pt-8">
      {/* Auto Categories Section */}
      <CategoryGrid
        title="Auto Categories"
        linkText="View all categories"
        categories={autoCategories}
        viewAllHref="/cars"
      />

      {/* Real Estate Categories Section */}
      <CategoryGrid
        title="Real Estate Categories"
        linkText="View all properties"
        categories={realEstateCategories}
        viewAllHref="/real-estate"
      />
    </main>
  );
}
