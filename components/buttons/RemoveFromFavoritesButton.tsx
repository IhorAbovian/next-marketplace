"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";

interface RemoveFromFavoritesButtonProps {
  listingId: string;
}

export default function RemoveFromFavoritesButton({
  listingId,
}: RemoveFromFavoritesButtonProps) {
  const router = useRouter();
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemoveFromFavorites = async () => {
    setIsRemoving(true);
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

      router.refresh();
    } catch (error) {
      toast.add({
        type: "error",
        title: "Error",
        description: "Failed to remove from favorites",
      });
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <Button
      variant="outline"
      disabled={isRemoving}
      className="w-full cursor-pointer"
      onClick={handleRemoveFromFavorites}
    >
      <Heart className="w-4 h-4 mr-2" />
      {isRemoving ? "Removing..." : "Remove from Favorites"}
    </Button>
  );
}
