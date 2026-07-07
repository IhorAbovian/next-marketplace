"use client";

import Link from "next/link";
import SearchBar from "@/components/ui/SearchBar";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  NavigationMenuPositioner,
} from "./navigation-menu";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="container max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-6">
        <Link href="/" className="font-bold text-2xl whitespace-nowrap">
          Marketplace
        </Link>

        <div className="flex-1">
          <SearchBar />
        </div>

        <div className="flex items-center gap-2">
          <Link href="/sign-up" className="hover:underline">
            Register
          </Link>
          <span>or</span>
          <Link href="/sign-in" className="hover:underline">
            Sign In
          </Link>
        </div>
      </div>
      {pathname === "/" && (
        <div className="container max-w-7xl mx-auto px-1 py-2">
          <NavigationMenu className="w-full justify-center">
            <NavigationMenuList className="gap-8">
              <NavigationMenuItem>
                <NavigationMenuTrigger className="px-4 py-2">
                  Cars & Vehicles
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="flex flex-col gap-2 p-4 w-48">
                    <NavigationMenuLink
                      href="/cars"
                      className="px-4 py-2 hover:bg-gray-100 rounded"
                    >
                      Cars & Trucks
                    </NavigationMenuLink>
                    <NavigationMenuLink
                      href="/cars"
                      className="px-4 py-2 hover:bg-gray-100 rounded"
                    >
                      Motorcycles
                    </NavigationMenuLink>
                    <NavigationMenuLink
                      href="/cars"
                      className="px-4 py-2 hover:bg-gray-100 rounded"
                    >
                      Boats
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="px-4 py-2">
                  Real Estate
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="flex flex-col gap-2 p-4 w-48">
                    <NavigationMenuLink
                      href="/real-estate"
                      className="px-4 py-2 hover:bg-gray-100 rounded"
                    >
                      For Sale
                    </NavigationMenuLink>
                    <NavigationMenuLink
                      href="/real-estate"
                      className="px-4 py-2 hover:bg-gray-100 rounded"
                    >
                      For Rent
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      )}
    </header>
  );
}
