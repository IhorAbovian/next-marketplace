"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

interface FavoriteButtonProps {
  listingId: string;
  className?: string;
}

export default function FavoriteButton({
  listingId,
  className = "",
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if listing is favorited
    const checkFavorite = async () => {
      try {
        const response = await fetch(`/api/favorites/${listingId}`);
        if (response.ok) {
          const data = await response.json();
          setIsFavorite(data.favorited);
        }
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

    setIsLoading(true);

    try {
      const response = await fetch(`/api/favorites/${listingId}`, {
        method: "POST",
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
          toast.add({
            type: "error",
            title: "Error",
            description: "Please sign in to add favorites",
          });
        } else {
          throw new Error(errorData.error || "Failed to toggle favorite");
        }
        return;
      }

      const data = await response.json();
      setIsFavorite(data.favorited);

      toast.add({
        type: "success",
        title: "Success",
        description: data.favorited
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
      className={`${isFavorite ? "bg-red-500 hover:bg-red-600" : ""} ${className}`}
    >
      <Heart className={`w-4 h-4 mr-2 ${isFavorite ? "fill-current" : ""}`} />
      {isFavorite ? "Added to Favorites" : "Add to Favorites"}
    </Button>
  );
}
