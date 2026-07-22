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
        <Link href="/" className="text-blue-600 hover:underline mt-4 inline-block">
          Back to Home
        </Link>
      </div>
    );
  }

  const subcategoryLabels: Record<string, string> = {
    "cars-trucks": "Cars & Trucks",
    motorcycles: "Motorcycles",
    boats: "Boats",
  };

  const label = subcategoryLabels[subcategory] || subcategory;

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-4">
        <Link href="/" className="hover:text-gray-700">Home</Link>
        <span className="mx-2">›</span>
        <Link href="/autos" className="hover:text-gray-700">Autos</Link>
        <span className="mx-2">›</span>
        <Link href={`/autos/${subcategory}`} className="hover:text-gray-700">
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
          <p className="text-gray-700">{listing.description}</p>
          <Button className="w-full py-3">Contact Seller</Button>
        </div>
      </div>
    </div>
  );
}