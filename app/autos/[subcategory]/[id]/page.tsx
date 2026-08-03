import { prisma } from "@/lib/prisma";
import ListingPage from "@/components/sections/ListingPage";

export default async function AutoListingDetailPage({
  params,
}: {
  params: Promise<{ subcategory: string; id: string }>;
}) {
  const { subcategory, id } = await params;

  const listing = await prisma.listing.findFirst({
    where: {
      id,
      category: { slug: subcategory },
    },
    select: {
      id: true,
      title: true,
      price: true,

      description: true,
      images: { select: { url: true } },
      category: {
        select: {
          slug: true,
          name: true,
          parent: { select: { slug: true, name: true } },
        },
      },
      author: { select: { name: true, image: true, createdAt: true } },
    },
  });

  if (!listing) return <div>Not found</div>;

  return <ListingPage listing={listing} />;
}
