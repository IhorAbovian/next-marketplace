import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { headers } from "next/headers";
import SortDropdown from "@/components/SortDropdown";

interface Listing {
  id: string;
  title: string;
  price: number;
  images: { url: string }[];
  category: {
    name: string;
    slug: string;
    parent?: { slug: string; name: string } | null;
  };
  createdAt: string;
}

async function SearchResults({
  query,
  category,
  sort,
}: {
  query: string;
  category: string;
  sort: string;
}) {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (category) params.set("category", category);
  if (sort) params.set("sort", sort);

  const headersList = await headers();
  const protocol = headersList.get("x-forwarded-proto") || "http";
  const host = headersList.get("host") || "localhost:3000";
  const baseUrl = `${protocol}://${host}`;

  const res = await fetch(`${baseUrl}/api/search?${params.toString()}`, {
    next: { tags: ["search"] },
  });
  const data = await res.json();

  if (!data.listings || data.listings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No listings found for "{query}"</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.listings.map((listing: Listing) => (
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
            <p className="text-sm text-gray-600">{listing.category.name}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; sort?: string }>;
}) {
  const { q = "", category = "", sort = "newest" } = await searchParams;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Search Listings</h1>
        <SortDropdown currentSort={sort} />
      </div>

      <Suspense key={q + category + sort} fallback={<div>Loading...</div>}>
        <SearchResults query={q} category={category} sort={sort} />
      </Suspense>
    </div>
  );
}
