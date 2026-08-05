"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";

interface Listing {
  id: string;
  title: string;
  price: number;
  images: { url: string }[];
  category: { name: string };
}

interface UserListingsGridProps {
  listings: Listing[];
  onListingDeleted?: () => void;
}

export default function UserListingsGrid({
  listings,
  onListingDeleted,
}: UserListingsGridProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (listingId: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) {
      return;
    }

    setDeletingId(listingId);
    try {
      const response = await fetch(`/api/listings/${listingId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        toast.add({
          type: "error",
          title: "Error",
          description: error.error || "Failed to delete listing",
        });
        return;
      }

      toast.add({
        type: "success",
        title: "Success",
        description: "Listing deleted successfully",
      });

      // Reload the page to refresh listings
      window.location.reload();
    } catch (error) {
      toast.add({
        type: "error",
        title: "Error",
        description: "Failed to delete listing",
      });
    } finally {
      setDeletingId(null);
    }
  };

  if (listings.length === 0) {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((listing) => (
        <div
          key={listing.id}
          className="border rounded-lg overflow-hidden hover:shadow-lg transition"
        >
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
            <p className="mb-2">
              ${listing.price}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Category: {listing.category?.name || "Unknown"}
            </p>
            <div className="flex gap-2">
              <Link href={`/autos/cars-trucks/${listing.id}`} className="flex-1">
                <Button variant="outline" className="w-full">
                  View
                </Button>
              </Link>
              <Button
                variant="destructive"
                disabled={deletingId === listing.id}
                onClick={() => handleDelete(listing.id)}
                className="flex-1"
              >
                {deletingId === listing.id ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
