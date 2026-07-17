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

interface CategoryFromDB {
  id: number;
  name: string;
  slug: string;
  children: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
}

interface HeaderProps {
  categories?: CategoryFromDB[];
}

export default function Header({
  categories: categoriesFromLayout,
}: HeaderProps) {
  const pathname = usePathname();
  const isAuthPage =
    pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

  const categories = categoriesFromLayout || [];

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
                      {category.children.map((child) => (
                        <NavigationMenuLink
                          key={child.id}
                          href={`/${category.slug}/${child.slug}`}
                          className="px-4 py-2 hover:bg-gray-100 rounded"
                        >
                          {child.name}
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
