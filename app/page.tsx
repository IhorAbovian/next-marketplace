import SubCategoryGrid from "@/components/sections/SubCategoryGrid";
import PopularListingsGrid from "@/components/sections/PopularListingsGrid";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  try {
    const categories = await prisma.category.findMany({
      where: {
        parentId: null,
        name: { not: "General" },
      },
      select: {
        name: true,
        slug: true,
        children: { select: { name: true, slug: true } },
      },
    });

    // Get popular autos listings
    const autos = await prisma.category.findUnique({
      where: { slug: "autos" },
      select: { id: true },
    });

    const popularAutosListings = autos
      ? await prisma.listing.findMany({
          where: {
            category: {
              OR: [{ id: autos.id }, { parentId: autos.id }],
            },
          },
          take: 10,
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
                parent: { select: { slug: true } },
              },
            },
          },
        })
      : [];

    // Get popular real estate listings
    const realEstate = await prisma.category.findUnique({
      where: { slug: "real-estate" },
      select: { id: true },
    });

    const popularRealEstateListings = realEstate
      ? await prisma.listing.findMany({
          where: {
            category: {
              OR: [{ id: realEstate.id }, { parentId: realEstate.id }],
            },
          },
          take: 10,
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
                parent: { select: { slug: true } },
              },
            },
          },
        })
      : [];

    return (
      <div className="container max-w-7xl mx-auto px-4 pt-8">
        {/* Categories Section */}
        {categories.map((category) => (
          <SubCategoryGrid
            key={category.slug}
            title={category.name}
            parentSlug={category.slug}
            categories={category.children}
          />
        ))}

        {/* Popular Listings Sections */}
        {popularAutosListings.length > 0 && (
          <PopularListingsGrid
            title="Popular listings in Autos"
            listings={popularAutosListings}
          />
        )}

        {popularRealEstateListings.length > 0 && (
          <PopularListingsGrid
            title="Popular listings in Real Estate"
            listings={popularRealEstateListings}
          />
        )}
      </div>
    );
  } catch (error) {
    console.error("Error loading homepage:", error);
    return (
      <div className="container max-w-7xl mx-auto px-4 pt-8">
        <p className="text-red-600">Failed to load page. Please try again later.</p>
      </div>
    );
  }
}
