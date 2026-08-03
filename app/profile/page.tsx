import { auth } from "@/lib/auth";
import { headers } from "next/headers";
// import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

interface ProfilePageProps {
  searchParams: {
    tab?: string;
  };
}

export default async function ProfilePage({ searchParams }: ProfilePageProps) {
  const sessionData = await auth.api.getSession({
    headers: await headers(),
  });

  // const user = await prisma.user.findUnique({
  //   where: { id: sessionData?.user.id },
  //   select: {
  //     id: true,
  //     name: true,
  //     email: true,
  //     phone: true,
  //     image: true,
  //     createdAt: true,
  //     _count: {
  //       select: {
  //         listings: true,
  //         favorites: true,
  //       },
  //     },
  //   },
  // });

  const user = sessionData?.user
    ? {
        id: sessionData.user.id,
        name: sessionData.user.name,
        email: sessionData.user.email,
        phone: (sessionData.user as any).phone || null,
        image: sessionData.user.image,
        createdAt: sessionData.user.createdAt,
        _count: {
          listings: 0,
          favorites: 0,
        },
      }
    : null;

  const { tab: activeTab = "info" } = await searchParams;

  async function updateProfile(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;

    // await prisma.user.update({
    //   where: { id: sessionData?.user.id },
    //   data: { name, phone },
    // });

    await auth.api.updateUser({
      body: {
        name,
      },
      headers: await headers(),
    });
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8 ">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar Menu */}
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-2">
                <Link
                  href="/profile?tab=info"
                  className={`block px-4 py-3 rounded text-sm font-medium transition ${
                    activeTab === "info"
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Profile Info
                </Link>
                <Link
                  href="/profile?tab=listings"
                  className={`block px-4 py-3 rounded text-sm font-medium transition ${
                    activeTab === "listings"
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  My Listings
                </Link>
                <Link
                  href="/profile?tab=favorites"
                  className={`block px-4 py-3 rounded text-sm font-medium transition ${
                    activeTab === "favorites"
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Favorites
                </Link>
                <Link
                  href="/profile?tab=settings"
                  className={`block px-4 py-3 rounded text-sm font-medium transition ${
                    activeTab === "settings"
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Settings
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3">
          {activeTab === "info" && (
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
                    <h1 className="text-4xl font-bold mb-6">
                      {user?.name || "User"}
                    </h1>

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
          )}

          {activeTab === "listings" && (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500 mb-2">
                  You have {user?._count.listings} listings
                </p>
                <p className="text-sm text-gray-400">
                  Manage your listings here
                </p>
              </CardContent>
            </Card>
          )}

          {activeTab === "favorites" && (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500 mb-2">
                  You have {user?._count.favorites} favorites
                </p>
                <p className="text-sm text-gray-400">
                  View your saved listings here
                </p>
              </CardContent>
            </Card>
          )}

          {activeTab === "settings" && (
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">Settings</h2>
                <form action={updateProfile} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Name
                    </label>
                    <Input
                      name="name"
                      defaultValue={user?.name || ""}
                      placeholder="Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Phone
                    </label>
                    <Input
                      name="phone"
                      defaultValue={user?.phone || ""}
                      placeholder="Phone(optional)"
                    />
                  </div>
                  <Button type="submit">Save Changes</Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
