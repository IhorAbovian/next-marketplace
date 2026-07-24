import SubCategoryGrid from "@/components/sections/SubCategoryGrid";
import PopularListingsGrid from "@/components/sections/PopularListingsGrid";
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

  return (
    <div className="container max-w-7xl mx-auto px-4 pt-8">
      {categories.map((category) => (
        <SubCategoryGrid
          key={category.slug}
          title={category.name}
          parentSlug={category.slug}
          categories={category.children}
        />
      ))}

      {/* Popular Autos Listings Section */}
      {/* <PopularListingsGrid
        title="Popular listings in Autos"
        listings={popularAutosListingsWithImages}
      /> */}

      {/* Popular Real Estate Listings Section */}
      {/* <PopularListingsGrid
        title="Popular listings in Real Estate"
        listings={popularRealEstateListingsWithImages}
      /> */}
    </div>
  );
}
