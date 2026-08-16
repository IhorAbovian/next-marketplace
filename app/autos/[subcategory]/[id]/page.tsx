import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import ListingPage from "@/components/sections/ListingPage";

export default async function AutoListingDetailPage({
  params,
}: {
  params: Promise<{ subcategory: string; id: string }>;
}) {
  const { subcategory, id } = await params;

  const sessionData = await auth.api.getSession({
    headers: await headers(),
  });

  const currentUserId = sessionData?.user?.userId || null;
  console.log("DEBUG: sessionData =", sessionData);
  console.log("DEBUG: currentUserId =", currentUserId);

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
      authorId: true,
    },
  });

  console.log("DEBUG: listing.authorId =", listing.authorId);
  console.log("DEBUG: Match? currentUserId === listing.authorId?", currentUserId === listing.authorId);

  if (!listing) return <div>Not found</div>;

  return <ListingPage listing={listing} currentUserId={currentUserId} />;
}
