import { prisma } from "@/lib/prisma";
import ListingSection from "@/components/sections/ListingSection";

export default async function BoatsPage() {
  const listings = await prisma.listing.findMany({
    where: { category: { slug: "boats" } },
    take: 10,
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

  return <ListingSection title="Boats" listings={listings} />;
}
