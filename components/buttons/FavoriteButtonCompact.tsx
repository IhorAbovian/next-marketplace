"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { toast } from "@/components/ui/toast";

interface FavoriteButtonCompactProps {
  listingId: string;
  className?: string;
}

export default function FavoriteButtonCompact({
  listingId,
  className = "",
}: FavoriteButtonCompactProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkFavorite = async () => {
      try {
        const response = await fetch(`/api/favorites/${listingId}`);
        if (response.ok) {
          const data = await response.json();
          setIsFavorite(data.favorited);
        }
      } catch (error) {
        console.error("Error checking favorite:", error);
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

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className={`inline-flex items-center justify-center transition-all hover:scale-110 ${className}`}
    >
      <Heart
        className={`w-6 h-6 transition-all ${
          isFavorite
            ? "fill-red-500 text-red-500 drop-shadow-md"
            : "fill-none text-white stroke-gray-400 drop-shadow"
        } ${isLoading ? "opacity-50" : ""}`}
        strokeWidth={2}
      />
    </button>
  );
}
