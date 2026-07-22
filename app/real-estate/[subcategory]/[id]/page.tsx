import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default async function ListingPage({
  params,
}: {
  params: Promise<{ subcategory: string; id: string }>;
}) {
  const { subcategory, id } = await params;

  const listing = await prisma.listing.findFirst({
    where: {
      id: parseInt(id),
      category: { slug: subcategory },
    },
    select: {
      id: true,
      title: true,
      price: true,
      location: true,
      description: true,
      images: { select: { url: true } },
      category: { select: { slug: true, name: true } },
    },
  });

  if (!listing) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-6">
        <p className="text-red-600 font-semibold">Listing not found</p>
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

  const label = subcategoryLabels[subcategory] || subcategory;

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
          {label}
        </Link>
        <span className="mx-2">›</span>
        <span className="text-gray-800">{listing.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Images */}
        <div className="lg:col-span-2">
          <div className="bg-gray-100 rounded-lg overflow-hidden mb-4">
            <Image
              src={listing.images[0]?.url || "https://placehold.co/600x400"}
              alt={listing.title}
              width={600}
              height={400}
              className="w-full h-auto object-cover"
              unoptimized
            />
          </div>
        </div>

        {/* Info */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">{listing.title}</h1>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">${Number(listing.price)}</span>
            <span className="text-sm text-gray-500">USD</span>
          </div>
          <p className="text-gray-600">{listing.location}</p>
          <Button className="w-full py-3">Contact Seller</Button>

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
      {listing.description && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Description</h2>
          <p className="text-gray-700 leading-relaxed">{listing.description}</p>
        </div>
      )}
    </div>
  );
}
