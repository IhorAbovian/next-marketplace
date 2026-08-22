import Image from "next/image";
import Link from "next/link";
import { EditIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import RemoveFromFavoritesButton from "@/components/buttons/RemoveFromFavoritesButton";
import DeleteListingButton from "@/components/buttons/DeleteListingButton";

interface Listing {
  id: string;
  title: string;
  price: number;
  images: { url: string }[];
  category: {
    name: string;
    slug: string;
    parent?: { slug: string } | null;
  };
}

interface UserListingsGridProps {
  listings: Listing[];
  isFavoritesView?: boolean;
}

export default function UserListingsGrid({
  listings,
  isFavoritesView = false,
}: UserListingsGridProps) {
  if (!listings || listings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">You have no listings yet</p>
        <Link href="/create-listing">
          <Button>Create Your First Listing</Button>
        </Link>
      </div>
    );
  }

  return (
    <div
      key={listings.length}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {listings.map((listing) => {
        const detailHref = listing.category.parent
          ? `/${listing.category.parent.slug}/${listing.category.slug}/${listing.id}`
          : `/${listing.category.slug}/${listing.id}`;

        return (
          <div
            key={listing.id}
            className="border rounded-lg overflow-hidden hover:shadow-lg transition"
          >
            <Link href={detailHref} className="block">
              {/* Image */}
              {listing.images && listing.images.length > 0 ? (
                <div className="relative h-48 bg-gray-200">
                  <Image
                    src={listing.images[0].url}
                    alt={listing.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">No image</span>
                </div>
              )}

              {/* Content */}
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2 line-clamp-2">
                  {listing.title}
                </h3>
                <p className="mb-2">${listing.price}</p>
                <p className="text-sm text-gray-600 mb-4">
                  Category: {listing.category?.name || "Unknown"}
                </p>
              </div>
            </Link>

            {/* Action Buttons */}
            <div className="p-4 pt-0">
              {isFavoritesView ? (
                <RemoveFromFavoritesButton listingId={listing.id} />
              ) : (
                <div className="flex gap-2">
                  <Link href={`/edit-listing/${listing.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      <EditIcon className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </Link>
                  <DeleteListingButton listingId={listing.id} />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
