"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";
import { toggleFavorite, isFavoritedByUser } from "@/lib/actions";

interface FavoriteButtonCompactProps {
  listingId: string;
  className?: string;
}

export default function FavoriteButtonCompact({
  listingId,
  className = "",
}: FavoriteButtonCompactProps) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkFavorite = async () => {
      try {
        const favorited = await isFavoritedByUser(listingId);
        setIsFavorite(favorited);
      } catch (error) {
        console.error("Error checking favorite:", error);
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

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className={`inline-flex items-center justify-center transition-all hover:scale-110 cursor-pointer ${className}`}
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
