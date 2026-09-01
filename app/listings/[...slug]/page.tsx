import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";
import { getCategoryListings, getListingById } from "@/lib/data";
import ListingSection from "@/components/sections/ListingSection";
import ListingPageSection from "@/components/sections/ListingPage";

export default async function ListingRoutePage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const [categorySlug, second, third] = slug;

  // Case 1: Listing detail page (/listings/autos/cars-trucks/abc123)
  if (third) {
    const user = await getAuthenticatedUser();
    const currentUserId = user?.id || null;

    const listing = await getListingById(third, second);

    if (!listing) return <div>Not found</div>;

    return (
      <ListingPageSection listing={listing} currentUserId={currentUserId} />
    );
  }

  // Case 2: second segment is either a subcategory slug or a listing id
  // directly under the top-level category (listings without a subcategory)
  if (second) {
    const subcategory = await prisma.category.findFirst({
      where: { slug: second, parent: { slug: categorySlug } },
      select: { name: true },
    });

    if (subcategory) {
      const listings = await getCategoryListings(second);
      return <ListingSection title={subcategory.name} listings={listings} />;
    }

    // Not a subcategory — treat it as a listing id under categorySlug
    const user = await getAuthenticatedUser();
    const currentUserId = user?.id || null;

    const listing = await getListingById(second, categorySlug);

    if (!listing) return <div>Not found</div>;

    return (
      <ListingPageSection listing={listing} currentUserId={currentUserId} />
    );
  }

  // Case 3: Category page (/listings/autos)
  if (categorySlug) {
    const category = await prisma.category.findUnique({
      where: { slug: categorySlug },
      include: { children: true },
    });

    if (!category) return <div>Category not found</div>;

    // If category has children, show subcategories
    if (category.children.length > 0) {
      return (
        <div className="container max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">{category.name}</h1>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {category.children.map((child) => (
              <a
                key={child.id}
                href={`/listings/${categorySlug}/${child.slug}`}
                className="bg-gray-100 hover:bg-gray-200 rounded-lg p-6 text-center transition"
              >
                <span className="font-semibold">{child.name}</span>
              </a>
            ))}
          </div>
        </div>
      );
    }

    // If no children, show listings
    const listings = await getCategoryListings(categorySlug);
    return <ListingSection title={category.name} listings={listings} />;
  }

  return <div>Category not found</div>;
}
