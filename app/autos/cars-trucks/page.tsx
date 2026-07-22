import ListingSection from "@/components/sections/ListingSection";
import { prisma } from "@/lib/prisma";

export default async function CarsTrucksPage() {
  const rawListings = await prisma.listing.findMany({
    where: { category: { slug: "cars-trucks" } },
    take: 10,
    select: {
      id: true,
      title: true,
      price: true,
      location: true,
      description: true,
      images: { take: 1, select: { url: true } },
      category: { select: { slug: true } },
    },
  });

  const listings = rawListings.map((listing) => ({
    id: listing.id.toString(),
    title: listing.title,
    price: Number(listing.price),
    location: listing.location,
    description: listing.description ?? undefined,
    image: listing.images[0]?.url || "https://placehold.co/400x300",
    category: "autos",
    subcategory: "cars-trucks",
  }));

  return <ListingSection title="Cars & Trucks" listings={listings} />;
}
