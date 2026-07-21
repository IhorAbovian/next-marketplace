import { prisma } from "@/lib/prisma";
import ListingSection from "@/components/sections/ListingSection";

export default async function BoatsPage() {
  const rawListings = await prisma.listing.findMany({
    where: { category: { slug: "boats" } },
    take: 10,
    select: {
      id: true,
      title: true,
      price: true,
      location: true,
      description: true,
      images: { take: 1, select: { url: true } },
    },
  });
  const boatListings = rawListings.map((listing) => ({
    id: listing.id.toString(),
    title: listing.title,
    price: Number(listing.price),
    location: listing.location,
    description: listing.description ?? undefined,
    image: listing.images[0]?.url || "https://placehold.co/400x300",
  }));

  return <ListingSection title="Boats" listings={boatListings} />;
}
