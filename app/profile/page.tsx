import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ProfileTabs from "@/components/profile/ProfileTabs";
import ProfileInfoTab from "@/components/profile/ProfileInfoTab";
import ProfileListingsTab from "@/components/profile/ProfileListingsTab";
import ProfileFavoritesTab from "@/components/profile/ProfileFavoritesTab";
import ProfileSettingsTab from "@/components/profile/ProfileSettingsTab";

export const dynamic = "force-dynamic";

type ProfilePageProps = {
  searchParams: Promise<{
    tab?: string;
  }>;
};

export default async function ProfilePage({ searchParams }: ProfilePageProps) {
  const params = await searchParams;
  const sessionData = await auth.api.getSession({
    headers: await headers(),
  });

  // Get user data from Prisma using email (since BetterAuth ID differs from Prisma ID)
  const user = sessionData?.user
    ? await prisma.user.findUnique({
        where: { email: sessionData.user.email },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          image: true,
          createdAt: true,
          _count: {
            select: {
              listings: true,
              favorites: true,
            },
          },
        },
      })
    : null;

  const { tab: activeTab = "info" } = params;

  async function updateProfile(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;

    try {
      // Update user through Prisma using email to find the right record
      await prisma.user.update({
        where: { email: sessionData?.user.email },
        data: { name, phone },
      });
    } catch (error) {
      console.error("Failed to update profile:", error);
    }

    // Redirect to refresh the page with updated data
    redirect("/profile?tab=settings");
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8 ">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar Menu */}
        <div className="md:col-span-1">
          <ProfileTabs activeTab={activeTab} />
        </div>

        {/* Main Content */}
        <div className="md:col-span-3">
          {activeTab === "info" && <ProfileInfoTab user={user} />}
          {activeTab === "listings" && (
            <ProfileListingsTab userId={user?.id || ""} />
          )}
          {activeTab === "favorites" && (
            <ProfileFavoritesTab userId={user?.id || ""} />
          )}
          {activeTab === "settings" && (
            <ProfileSettingsTab
              initialName={user?.name || ""}
              initialPhone={user?.phone || ""}
              initialAvatar={user?.image || null}
            />
          )}
        </div>
      </div>
    </div>
  );
}
