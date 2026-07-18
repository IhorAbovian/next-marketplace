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
import { prisma } from "@/lib/prisma";

export default async function Header() {
  const categories = await prisma.category.findMany({
    where: {
      parentId: null,
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
    </header>
  );
}
