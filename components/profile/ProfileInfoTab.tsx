import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { Prisma } from "@/generated/prisma/client";

type UserWithCounts = Prisma.UserGetPayload<{
  select: {
    id: true;
    name: true;
    email: true;
    phone: true;
    image: true;
    createdAt: true;
    _count: {
      select: {
        listings: true;
        favorites: true;
      };
    };
  };
}>;

type ProfileInfoTabProps = {
  user: UserWithCounts | null;
};

export default function ProfileInfoTab({ user }: ProfileInfoTabProps) {
  return (
    <Card>
      <CardContent className="p-8">
        <div className="flex items-start gap-8">
          {user?.image ? (
            <Image
              src={user.image}
              alt={user?.name || "User"}
              width={160}
              height={160}
              className="w-40 h-40 rounded-lg object-cover flex-shrink-0"
              unoptimized
            />
          ) : (
            <div className="w-40 h-40 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-gray-400 text-sm">No image</span>
            </div>
          )}

          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-6">{user?.name || "User"}</h1>

            <div className="space-y-4 mb-8">
              <div className="border-b border-gray-200 pb-4">
                <p className="text-xs uppercase text-gray-500 font-semibold mb-1">
                  Email
                </p>
                <p className="text-gray-900">{user?.email}</p>
              </div>

              {user?.phone && (
                <div className="border-b border-gray-200 pb-4">
                  <p className="text-xs uppercase text-gray-500 font-semibold mb-1">
                    Phone
                  </p>
                  <p className="text-gray-900">{user?.phone}</p>
                </div>
              )}

              <div>
                <p className="text-xs uppercase text-gray-500 font-semibold mb-1">
                  Member Since
                </p>
                <p className="text-gray-900">
                  {user?.createdAt && formatDate(user.createdAt)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200">
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-xs uppercase text-gray-500 font-semibold mb-2">
                  Total Listings
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {user?._count.listings}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-xs uppercase text-gray-500 font-semibold mb-2">
                  Favorites
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {user?._count.favorites}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
