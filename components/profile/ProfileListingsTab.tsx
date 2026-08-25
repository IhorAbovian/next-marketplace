import { Card, CardContent } from "@/components/ui/card";
import UserListingsGrid from "@/components/UserListingsGrid";
import { getUserListings } from "@/lib/data";

interface ProfileListingsTabProps {
  userId: string;
}

export default async function ProfileListingsTab({
  userId,
}: ProfileListingsTabProps) {
  const listings = await getUserListings(userId);

  return (
    <Card>
      <CardContent className="p-8">
        <h2 className="text-2xl font-bold mb-6">My Listings</h2>
        <UserListingsGrid listings={listings} />
      </CardContent>
    </Card>
  );
}
