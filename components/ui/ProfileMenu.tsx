"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuList,
} from "./navigation-menu";

interface ProfileMenuProps {
  userName?: string | null;
}

export default function ProfileMenu({ userName }: ProfileMenuProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="px-4 py-2">
            {userName || "Account"}
          </NavigationMenuTrigger>

          <NavigationMenuContent>
            <div className="flex flex-col gap-0 p-2 w-48">
              <Link
                href="/profile"
                className="px-4 py-3 hover:bg-gray-100 rounded text-gray-900 block"
              >
                Profile
              </Link>
              <Link
                href="/profile?tab=listings"
                className="px-4 py-3 hover:bg-gray-100 rounded text-gray-900 block"
              >
                My Listings
              </Link>
              <Link
                href="/profile?tab=favorites"
                className="px-4 py-3 hover:bg-gray-100 rounded text-gray-900 block"
              >
                Favorites
              </Link>
              <Link
                href="/profile?tab=settings"
                className="px-4 py-3 hover:bg-gray-100 rounded text-gray-900 block"
              >
                Settings
              </Link>
              <button
                onClick={handleSignOut}
                className="px-4 py-3 hover:bg-gray-100 rounded text-left text-gray-900 w-full cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
