import { Card, CardContent } from "@/components/ui/card";
import type { Prisma } from "@/generated/prisma/client";
import { IMAGE_PLACEHOLDER } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";

export type VerticalListingWithRelations = Prisma.ListingGetPayload<{
  select: {
    id: true;
    title: true;
    price: true;
    location: true;
    images: { take: 1; select: { url: true } };
    category: { select: { slug: true; parent: { select: { slug: true } } } };
  };
}>;

export default function VerticalListingCard({
  listing,
}: {
  listing: VerticalListingWithRelations;
}) {
  const { id, title, price, images, location, category } = listing;

  const isSubcategory = category.parent?.slug;

  const href = isSubcategory
    ? `/${category.parent?.slug}/${category.slug}/${id}`
    : `/${category.slug}/${id}`;

  const mainImageSrc = images[0]?.url || IMAGE_PLACEHOLDER;

  return (
    <Link href={href}>
      <Card className="w-full hover:shadow-md transition-shadow">
        <CardContent className="p-2">
          <div className="relative h-36 mb-2">
            <Image
              src={mainImageSrc}
              alt={title}
              fill
              className="object-cover rounded"
              unoptimized
            />
          </div>
          <h3 className="font-medium text-sm mb-1 truncate">{title}</h3>
          <p className="text-gray-500 text-xs mb-1 truncate">{location}</p>
          <p className="text-gray-800 font-bold text-sm truncate">
            ${Number(price)}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
