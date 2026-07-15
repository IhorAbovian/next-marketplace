"use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export type VerticalProductCardProps = {
  id: string;
  title: string;
  price: number;
  image: string;
  location: string;
  description?: string;
  category?: string;
  subcategory?: string;
};

export default function VerticalProductCard({
  id,
  title,
  price,
  image,
  location,
  category = "autos",
  subcategory,
}: VerticalProductCardProps) {
  const href = subcategory
    ? `/${category}/${subcategory}/${id}`
    : `/${category}/${id}`;
  return (
    <Link href={href}>
      <Card className="w-full hover:shadow-md transition-shadow">
        <CardContent className="p-2">
          <div className="relative h-36 mb-2">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover rounded"
              unoptimized
            />
          </div>
          <h3 className="font-medium text-sm mb-1 truncate">{title}</h3>
          <p className="text-gray-500 text-xs mb-1 truncate">{location}</p>
          <p className="text-gray-800 font-bold text-sm truncate">${price}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
