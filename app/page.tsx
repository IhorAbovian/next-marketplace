import { getHomePageData } from "@/lib/data";
import SubCategoryGrid from "@/components/sections/SubCategoryGrid";
import PopularListingsGrid from "@/components/sections/PopularListingsGrid";

export default async function HomePage() {
  const { categories, autosListings, realEstateListings } =
    await getHomePageData();

  return (
    <div className="container max-w-7xl mx-auto px-4 pt-8">
      {categories.map((category) => (
        <SubCategoryGrid
          key={category.slug}
          title={category.name}
          categories={category.children}
          parentSlug={category.slug}
        />
      ))}
      <PopularListingsGrid title="Popular Autos" listings={autosListings} />
      <PopularListingsGrid
        title="Popular Real Estate"
        listings={realEstateListings}
      />
    </div>
  );
}
