import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import SortDropdown from "@/components/SortDropdown";
import Pagination from "@/components/Pagination";
import { getSearchValue, type Listing } from "@/lib/data";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    sort?: string;
    page?: string;
  }>;
}) {
  const {
    q = "",
    category = "",
    sort = "newest",
    page = "1",
  } = await searchParams;
  const currentPage = Number(page) || 1;

  const { listings, totalPages } = await getSearchValue(
    q,
    category,
    sort,
    currentPage,
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Search Listings</h1>
        <SortDropdown currentSort={sort} />
      </div>

      <Suspense
        key={q + category + sort + currentPage}
        fallback={<div>Loading...</div>}
      >
        {listings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No listings found for "{q}"</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing: Listing) => (
              <Link
                key={listing.id}
                href={`/${listing.category.parent?.slug || listing.category.slug}/${listing.category.slug}/${listing.id}`}
                className="block border rounded-lg overflow-hidden hover:shadow-lg transition"
              >
                <div className="relative h-48 bg-gray-200">
                  {listing.images && listing.images.length > 0 ? (
                    <Image
                      src={listing.images[0].url}
                      alt={listing.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <span className="text-gray-400">No image</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 line-clamp-2">
                    {listing.title}
                  </h3>
                  <p className="text-lg font-semibold mb-2">
                    ${listing.price.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    {listing.category.name}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Suspense>

      <Pagination totalPages={totalPages} />
    </div>
  );
}
