import { Card, CardContent } from "@/components/ui/card";
import type { Prisma } from "@/generated/prisma/client";
import { IMAGE_PLACEHOLDER } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";

export type ListingWithRelations = Prisma.ListingGetPayload<{
  select: {
    id: true;
    title: true;
    price: true;
    location: true;
    description: true;
    images: { take: 1; select: { url: true } };
    category: { select: { slug: true; parent: { select: { slug: true } } } };
  };
}>;

export default function HorizontalListingCard({
  listing,
}: {
  listing: ListingWithRelations;
}) {
  const { id, title, price, images, location, description, category } = listing;

  const isSubcategory = category.parent?.slug;

  const href = isSubcategory
    ? `/${category.parent?.slug}/${category.slug}/${id}`
    : `/${category.slug}/${id}`;

  const mainImageSrc = images[0]?.url || IMAGE_PLACEHOLDER;

  return (
    <Link href={href}>
      <Card className="w-full hover:shadow-md transition-shadow">
        <CardContent className="p-3 flex gap-3">
          <div className="relative w-48 h-48 shrink-0">
            <Image
              src={mainImageSrc}
              alt={title}
              fill
              className="object-cover rounded"
              unoptimized
            />
          </div>

          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-lg mb-1">{title}</h3>

              <p className="text-gray-500 text-sm mb-2">{location}</p>

              {description && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {description}
                </p>
              )}
            </div>

            <p className="text-lg font-bold text-gray-800 mt-2">
              ${Number(price)}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
