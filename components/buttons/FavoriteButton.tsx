"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";
import { toggleFavorite, isFavoritedByUser } from "@/lib/actions";

interface FavoriteButtonProps {
  listingId: string;
  className?: string;
}

export default function FavoriteButton({
  listingId,
  className = "",
}: FavoriteButtonProps) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if listing is favorited when component mounts
    const checkFavorite = async () => {
      try {
        const favorited = await isFavoritedByUser(listingId);
        setIsFavorite(favorited);
      } catch (error) {
        console.error("Error checking favorite:", error);
      } finally {
        setIsChecking(false);
      }
    };

    checkFavorite();
  }, [listingId]);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session?.user) {
      router.push("/sign-in");
      return;
    }

    setIsLoading(true);

    try {
      await toggleFavorite(listingId);

      // After toggle, check the new state
      const newFavoritedState = await isFavoritedByUser(listingId);
      setIsFavorite(newFavoritedState);

      toast.add({
        type: "success",
        title: "Success",
        description: newFavoritedState
          ? "Added to favorites"
          : "Removed from favorites",
      });
    } catch (error) {
      toast.add({
        type: "error",
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update favorite",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isChecking) {
    return (
      <Button variant="outline" disabled className={className}>
        <Heart className="w-4 h-4 mr-2" />
        Loading...
      </Button>
    );
  }

  return (
    <Button
      variant={isFavorite ? "default" : "outline"}
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className={`cursor-pointer ${isFavorite ? "bg-red-500 hover:bg-red-600" : ""} ${className}`}
    >
      <Heart className={`w-4 h-4 mr-2 ${isFavorite ? "fill-current" : ""}`} />
      {isFavorite ? "Added to Favorites" : "Add to Favorites"}
    </Button>
  );
}
