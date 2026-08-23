import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import UserListingsGrid from "@/components/UserListingsGrid";

interface ProfileFavoritesTabProps {
  userId: string;
}

export default async function ProfileFavoritesTab({
  userId,
}: ProfileFavoritesTabProps) {
  const favorites = await prisma.favorite.findMany({
    where: { userId },
    include: {
      listing: {
        include: {
          images: true,
          category: {
            include: {
              parent: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const favoriteListings = favorites.map((fav) => fav.listing);

  return (
    <Card>
      <CardContent className="p-8">
        <h2 className="text-2xl font-bold mb-6">My Favorites</h2>
        {favoriteListings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-2">No favorites yet</p>
          </div>
        ) : (
          <UserListingsGrid
            listings={favoriteListings}
            isFavoritesView={true}
          />
        )}
      </CardContent>
    </Card>
  );
}
