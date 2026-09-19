"use client";

import Image from "next/image";
import Link from "next/link";
import { EditIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import RemoveFromFavoritesButton from "@/components/buttons/RemoveFromFavoritesButton";
import DeleteListingButton from "@/components/buttons/DeleteListingButton";
import { toggleListingStatus } from "@/lib/actions";
import { useTransition } from "react";
import type { ListingWithCategory } from "@/lib/data";

type ListingWithStatus = ListingWithCategory & {
  status?: "ACTIVE" | "HIDDEN" | "SOLD";
};

type UserListingsGridProps = {
  listings: ListingWithStatus[];
  isFavoritesView?: boolean;
  showStatus?: boolean;
};

export default function UserListingsGrid({
  listings,
  isFavoritesView = false,
  showStatus = false,
}: UserListingsGridProps) {
  const [isPending, startTransition] = useTransition();

  const handleToggleStatus = (listingId: string, currentStatus: string) => {
    const newStatus = currentStatus === "ACTIVE" ? "HIDDEN" : "ACTIVE";
    startTransition(() => {
      toggleListingStatus(listingId, newStatus as "ACTIVE" | "HIDDEN" | "SOLD");
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">Active</span>;
      case "HIDDEN":
        return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium">Hidden</span>;
      case "SOLD":
        return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">Sold</span>;
      default:
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">Active</span>;
    }
  };

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
          ? `/listings/${listing.category.parent.slug}/${listing.category.slug}/${listing.id}`
          : `/listings/${listing.category.slug}/${listing.id}`;

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
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-lg line-clamp-2">
                    {listing.title}
                  </h3>
                  {showStatus && listing.status && getStatusBadge(listing.status)}
                </div>
                <p className="mb-2">${listing.price}</p>
                <p className="text-sm text-gray-600 mb-4">
                  Category: {listing.category?.name || "Unknown"}
                </p>
              </div>
            </Link>

            {/* Action Buttons */}
            <div className="px-4 pb-4">
              {isFavoritesView ? (
                <RemoveFromFavoritesButton listingId={listing.id} />
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  <Link href={`/edit-listing/${listing.id}`}>
                    <Button variant="outline" className="w-full justify-center">
                      <EditIcon className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </Link>
                  {showStatus && listing.status && (
                    <Button
                      variant="outline"
                      className="w-full justify-center"
                      onClick={() => handleToggleStatus(listing.id, listing.status)}
                      disabled={isPending}
                    >
                      {listing.status === "ACTIVE" ? (
                        <>
                          <EyeOffIcon className="w-4 h-4 mr-1" />
                          Hide
                        </>
                      ) : (
                        <>
                          <EyeIcon className="w-4 h-4 mr-1" />
                          Show
                        </>
                      )}
                    </Button>
                  )}
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
