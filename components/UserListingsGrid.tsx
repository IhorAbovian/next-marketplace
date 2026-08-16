"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Trash2Icon, Heart, EditIcon } from "lucide-react";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
  listings: initialListings,
  isFavoritesView = false,
}: UserListingsGridProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [listings, setListings] = useState(initialListings);

  const handleRemoveFromFavorites = async (listingId: string) => {
    setDeletingId(listingId);
    try {
      const response = await fetch(`/api/favorites/${listingId}`, {
        method: "POST",
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Remove favorite error:", error);
        toast.add({
          type: "error",
          title: "Error",
          description: error.error || "Failed to remove from favorites",
        });
        return;
      }

      toast.add({
        type: "success",
        title: "Success",
        description: "Removed from favorites",
      });

      setListings((prev) => {
        return prev.filter((l) => l.id !== listingId);
      });
    } catch (error) {
      toast.add({
        type: "error",
        title: "Error",
        description: "Failed to remove from favorites",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleDelete = async (listingId: string) => {
    setDeletingId(listingId);
    try {
      const response = await fetch(`/api/listings/${listingId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Delete error:", error);
        toast.add({
          type: "error",
          title: "Error",
          description: error.error || "Failed to delete listing",
        });
        return;
      }

      const data = await response.json();

      toast.add({
        type: "success",
        title: "Success",
        description: "Listing deleted successfully",
      });

      // Remove the deleted listing from local state

      setListings((prev) => {
        const filtered = prev.filter((l) => l.id !== listingId);

        return filtered;
      });
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
                <Button
                  variant="outline"
                  disabled={deletingId === listing.id}
                  className="w-full"
                  onClick={() => handleRemoveFromFavorites(listing.id)}
                >
                  <Heart className="w-4 h-4 mr-2" />
                  {deletingId === listing.id
                    ? "Removing..."
                    : "Remove from Favorites"}
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Link href={`/edit-listing/${listing.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      <EditIcon className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        disabled={deletingId === listing.id}
                        className="flex-1"
                      >
                        {deletingId === listing.id ? "Deleting..." : "Delete"}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent size="sm">
                      <AlertDialogHeader>
                        <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                          <Trash2Icon />
                        </AlertDialogMedia>
                        <AlertDialogTitle>Delete listing?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete listing.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel variant="outline">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          variant="destructive"
                          onClick={() => handleDelete(listing.id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
