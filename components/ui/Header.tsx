import Link from "next/link";
import SearchBar from "@/components/ui/SearchBar";
import ProfileMenu from "@/components/ui/ProfileMenu";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./navigation-menu";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Header() {
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });

  const isLoggedIn = !!session?.user;

  const categories = await prisma.category.findMany({
    where: {
      parentId: null,
      name: { not: "General" },
    },
    select: {
      slug: true,
      name: true,
      children: {
        select: {
          slug: true,
          name: true,
        },
      },
    },
  });

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="container max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-6">
        <Link href="/" className="font-bold text-2xl whitespace-nowrap">
          Marketplace
        </Link>

        <div className="flex-1">
          <SearchBar categories={categories} />
        </div>

        {!isLoggedIn ? (
          <div className="flex items-center gap-2">
            <Link href="/sign-in" className="hover:underline">
              Sign In
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link href="/create-listing">
              <Button>Create Listing</Button>
            </Link>
            <ProfileMenu userName={session?.user?.name} />
          </div>
        )}
      </div>

      <div className="container max-w-7xl mx-auto px-1 py-2">
        <NavigationMenu className="w-full justify-center">
          <NavigationMenuList className="gap-8">
            {categories.map((category) => (
              <NavigationMenuItem key={category.slug}>
                <NavigationMenuTrigger className="px-4 py-2">
                  {category.name}
                </NavigationMenuTrigger>

                <NavigationMenuContent>
                  <div className="flex flex-col gap-2 p-4 w-48">
                    {category.children.map((child) => (
                      <NavigationMenuLink
                        key={child.slug}
                        href={`/listings/${category.slug}/${child.slug}`}
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
    </header>
  );
}
