import ListingSection from "@/components/sections/ListingSection";
import { prisma } from "@/lib/prisma";

export default async function ForSalePage() {
  const listings = await prisma.listing.findMany({
    where: { category: { slug: "for-sale" } },
    take: 20,
    select: {
      id: true,
      title: true,
      price: true,
      location: true,
      description: true,
      images: { take: 1, select: { url: true } },
      category: { select: { slug: true, parent: { select: { slug: true } } } },
    },
  });

  return <ListingSection title="For Sale" listings={listings} />;
}
