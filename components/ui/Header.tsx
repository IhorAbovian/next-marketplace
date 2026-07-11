"use client";

import Link from "next/link";
import SearchBar from "@/components/ui/SearchBar";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./navigation-menu";
import { usePathname } from "next/navigation";

const categories = [
  {
    id: 1,
    name: "Cars and Vehicles",
    href: "/cars",
    subcategories: [
      { id: 1, name: "Cars & Trucks", href: "/cars" },
      { id: 2, name: "Motorcycles", href: "/cars/motorcycles" },
      { id: 3, name: "Boats", href: "/cars/boats" },
    ],
  },
  {
    id: 2,
    name: "Real Estate",
    href: "/real-estate",
    subcategories: [
      { id: 1, name: "For Sale", href: "/real-estate/for-sale" },
      { id: 2, name: "For Rent", href: "/real-estate/for-rent" },
    ],
  },
];

export default function Header() {
  const pathname = usePathname();
  const isAuthPage =
    pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="container max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-6">
        <Link href="/" className="font-bold text-2xl whitespace-nowrap">
          Marketplace
        </Link>

        <div className="flex-1">{!isAuthPage && <SearchBar />}</div>

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

      {!isAuthPage && pathname === "/" && (
        <div className="container max-w-7xl mx-auto px-1 py-2">
          <NavigationMenu className="w-full justify-center">
            <NavigationMenuList className="gap-8">
              {categories.map((category) => (
                <NavigationMenuItem key={category.id}>
                  <NavigationMenuTrigger className="px-4 py-2">
                    {category.name}
                  </NavigationMenuTrigger>

                  <NavigationMenuContent>
                    <div className="flex flex-col gap-2 p-4 w-48">
                      <NavigationMenuLink
                        href={category.href}
                        className="px-4 py-2 font-medium hover:bg-gray-100 rounded"
                      >
                        All {category.name}
                      </NavigationMenuLink>
                      {category.subcategories.map((subcategory) => (
                        <NavigationMenuLink
                          key={subcategory.id}
                          href={subcategory.href}
                          className="px-4 py-2 hover:bg-gray-100 rounded"
                        >
                          {subcategory.name}
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      )}

      {isAuthPage && (
        <div className="container max-w-7xl mx-auto px-1 py-2">
          {/* Spacer to maintain header height */}
        </div>
      )}
    </header>
  );
}
