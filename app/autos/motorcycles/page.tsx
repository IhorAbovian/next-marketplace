import ListingSection from "@/components/sections/ListingSection";
import { prisma } from "@/lib/prisma";

export default async function MotorcyclesPage() {
  const listings = await prisma.listing.findMany({
    where: { category: { slug: "motorcycles" } },
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

  return <ListingSection title="Motorcycles" listings={listings} />;
}
