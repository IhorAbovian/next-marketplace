"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export type ProductCardProps = {
  id: string;
  title: string;
  price: number;
  image: string;
  location: string;
};

export default function ProductCard({
  id,
  title,
  price,
  image,
  location,
}: ProductCardProps) {
  return (
    <Link href={`/product/${id}`}>
      <Card className="w-64 shrink-0">
        <CardContent className="p-2">
          <div className="relative h-32 mb-1">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover rounded"
              unoptimized
            />
          </div>
          <h3 className="font-medium text-lg mb-1 truncate">{title}</h3>
          <p className="text-gray-500 text-sm font-bold mb-1 truncate">
            {location}
          </p>
          <p className="text-gray-800 font-bold text-sm truncate">${price}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
