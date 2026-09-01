"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { toggleFavorite } from "@/lib/actions";

type RemoveFromFavoritesButtonProps = {
  listingId: string;
};

export default function RemoveFromFavoritesButton({
  listingId,
}: RemoveFromFavoritesButtonProps) {
  const router = useRouter();
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemoveFromFavorites = async () => {
    setIsRemoving(true);
    try {
      await toggleFavorite(listingId);

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
        description:
          error instanceof Error
            ? error.message
            : "Failed to remove from favorites",
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
