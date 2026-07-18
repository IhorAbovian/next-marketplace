"use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export type HorizontalListingCardProps = {
  id: string;
  title: string;
  price: number;
  image: string;
  location: string;
  description?: string;
  category?: string;
  subcategory?: string;
};

export default function HorizontalListingCard({
  id,
  title,
  price,
  image,
  location,
  description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  category = "autos",
  subcategory,
}: HorizontalListingCardProps) {
  const href = subcategory
    ? `/${category}/${subcategory}/${id}`
    : `/${category}/${id}`;
  return (
    <Link href={href}>
      <Card className="w-full hover:shadow-md transition-shadow">
        <CardContent className="p-3 flex gap-3">
          <div className="relative w-48 h-48 shrink-0">
            <Image
              src={image}
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
              <p className="text-sm text-gray-600 line-clamp-2">
                {description}
              </p>
            </div>

            <p className="text-lg font-bold text-gray-800 mt-2">${price}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
