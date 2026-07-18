"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { listings } from "@/lib/data";
import { use } from "react";

export default function ListingPage({
  params,
}: {
  params: Promise<{ subcategory: string; id: string }>;
}) {
  const { subcategory, id } = use(params);
  const product = listings.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-6">
        <p className="text-red-600 font-semibold">
          listing not found - ID: {id}
        </p>
        <Link
          href="/"
          className="text-blue-600 hover:underline mt-4 inline-block"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  const subcategoryLabels: Record<string, string> = {
    "for-sale": "For Sale",
    "for-rent": "For Rent",
  };

  const subcategoryLabel = subcategoryLabels[subcategory] || subcategory;

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-4">
        <Link href="/" className="hover:text-gray-700">
          Home
        </Link>
        <span className="mx-2">›</span>
        <Link href="/real-estate" className="hover:text-gray-700">
          Real Estate
        </Link>
        <span className="mx-2">›</span>
        <Link
          href={`/real-estate/${subcategory}`}
          className="hover:text-gray-700"
        >
          {subcategoryLabel}
        </Link>
        <span className="mx-2">›</span>
        <span className="text-gray-800">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Image Gallery */}
        <div className="lg:col-span-2">
          <div className="bg-gray-100 rounded-lg overflow-hidden mb-4">
            <Image
              src={product.image}
              alt={product.title}
              width={600}
              height={400}
              className="w-full h-auto object-cover rounded-lg"
              unoptimized
            />
          </div>

          {/* Thumbnail gallery */}
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-gray-100 rounded cursor-pointer hover:opacity-80 overflow-hidden"
              >
                <Image
                  src={product.image}
                  alt={`${product.title} ${i}`}
                  width={80}
                  height={80}
                  className="w-20 h-20 object-cover rounded"
                  unoptimized
                />
              </div>
            ))}
          </div>
        </div>

        {/* listing Info */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">{product.title}</h1>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-800">
              ${product.price}
            </span>
            <span className="text-sm text-gray-500">USD</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="bg-gray-100 px-2 py-1 rounded">
              📍 {product.location}
            </span>
            <span className="bg-gray-100 px-2 py-1 rounded">
              📅 Posted 2 days ago
            </span>
          </div>

          <Button className="w-full py-3 text-base">Contact Seller</Button>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Seller Information</h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-gray-600">JD</span>
              </div>
              <div>
                <p className="font-medium">John Doe</p>
                <p className="text-sm text-gray-500">Member since 2020</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Description</h2>
        <p className="text-gray-700 leading-relaxed">
          Well-maintained property with excellent condition. Clean title, no
          accidents. Recent service records available. Serious inquiries only,
          please. Located in {product.location}.
        </p>
      </div>

      {/* Details */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Details</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Year:</span>
            <span className="ml-2 font-medium">2015</span>
          </div>
          <div>
            <span className="text-gray-500">Type:</span>
            <span className="ml-2 font-medium">Apartment</span>
          </div>
          <div>
            <span className="text-gray-500">Bedrooms:</span>
            <span className="ml-2 font-medium">2</span>
          </div>
          <div>
            <span className="text-gray-500">Bathrooms:</span>
            <span className="ml-2 font-medium">2</span>
          </div>
        </div>
      </div>
    </div>
  );
}
