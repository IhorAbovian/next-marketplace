import ListingSection from "@/components/sections/ListingSection";
import { prisma } from "@/lib/prisma";

export default async function ForRentPage() {
  const rawListings = await prisma.listing.findMany({
    where: { category: { slug: "for-rent" } },
    take: 20,
    select: {
      id: true,
      title: true,
      price: true,
      location: true,
      description: true,
      images: { take: 1, select: { url: true } },
    },
  });

  const forRentListings = rawListings.map((listing) => ({
    id: listing.id.toString(),
    title: listing.title,
    price: Number(listing.price),
    location: listing.location,
    description: listing.description ?? undefined,
    image: listing.images[0]?.url || "https://placehold.co/400x300",
    category: "real-estate",
    subcategory: "for-rent",
  }));

  return <ListingSection title="For Rent" listings={forRentListings} />;
}


