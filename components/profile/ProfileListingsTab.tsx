import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import UserListingsGrid from "@/components/UserListingsGrid";

interface ProfileListingsTabProps {
  userId: string;
}

export default async function ProfileListingsTab({
  userId,
}: ProfileListingsTabProps) {
  const listings = await prisma.listing.findMany({
    where: { authorId: userId },
    include: {
      images: true,
      category: {
        include: {
          parent: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <Card>
      <CardContent className="p-8">
        <h2 className="text-2xl font-bold mb-6">My Listings</h2>
        <UserListingsGrid listings={listings} />
      </CardContent>
    </Card>
  );
}
