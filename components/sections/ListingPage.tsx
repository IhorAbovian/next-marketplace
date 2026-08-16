import type { Prisma } from "@/generated/prisma/client";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { formatPrice, formatDate } from "@/lib/utils";
import FavoriteButton from "@/components/FavoriteButton";

type ListingWithRelations = Prisma.ListingGetPayload<{
  select: {
    id: true;
    title: true;
    price: true;
    description: true;
    images: { select: { url: true } };
    category: {
      select: {
        slug: true;
        name: true;
        parent: { select: { slug: true; name: true } };
      };
    };
    author: { select: { name: true; image: true; createdAt: true } };
    authorId: true;
  };
}>;

export default function ListingPage({
  listing,
  currentUserId,
}: {
  listing: ListingWithRelations;
  currentUserId: string | null;
}) {
  if (!listing) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-6">
        <p className="text-red-600 font-semibold">Listing not found</p>
        <Link
          href="/"
          className="text-blue-600 hover:underline mt-4 inline-block"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  const isSubcategory = listing.category.parent;

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-4">
        <Link href="/">Home</Link>
        <span className="mx-2">›</span>
        {isSubcategory && (
          <>
            <span className="text-gray-500">
              {listing.category.parent?.name}
            </span>
            <span className="mx-2">›</span>
          </>
        )}
        <Link
          href={`/${listing.category.parent?.slug}/${listing.category.slug}`}
        >
          {listing.category.name}
        </Link>
        <span className="mx-2">›</span>
        <span className="text-gray-800">{listing.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Images */}
        <div className="lg:col-span-2">
          <div className="bg-gray-100 rounded-lg overflow-hidden mb-4">
            <Image
              src={listing.images[0]?.url || "https://placehold.co/600x400"}
              alt={listing.title}
              width={600}
              height={400}
              className="w-full h-auto object-cover"
              unoptimized
            />
          </div>
        </div>

        {/* Info */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">{listing.title}</h1>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">
              {formatPrice(listing.price)}
            </span>
          </div>
          {currentUserId !== listing.authorId && (
            <Button className="w-full py-3">Contact Seller</Button>
          )}

          <FavoriteButton listingId={listing.id} className="w-full py-3" />

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Seller Information</h3>
            <div className="flex items-center gap-3">
              {listing.author?.image ? (
                <Image
                  src={listing.author.image}
                  alt={listing.author.name || "Seller"}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-gray-600">
                    {listing.author?.name?.charAt(0) || "S"}
                  </span>
                </div>
              )}
              <div>
                <p className="font-medium">
                  {listing.author?.name || "Seller"}
                </p>
                <p className="text-sm text-gray-500">
                  Member since {formatDate(listing.author?.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      {listing.description && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Description</h2>
          <p className="text-gray-700 leading-relaxed">{listing.description}</p>
        </div>
      )}
    </div>
  );
}
