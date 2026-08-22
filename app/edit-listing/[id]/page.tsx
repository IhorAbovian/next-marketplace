import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import EditListingForm from "@/components/EditListingForm";

interface EditListingPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditListingPage({
  params,
}: EditListingPageProps) {
  const { id } = await params;

  const sessionData = await auth.api.getSession({
    headers: await headers(),
  });

  if (!sessionData?.user?.email) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { email: sessionData.user.email },
    select: { id: true },
  });

  if (!user) {
    redirect("/sign-in");
  }

  // Fetch listing and verify ownership
  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      images: true,
      category: {
        include: {
          parent: true,
        },
      },
    },
  });

  if (!listing) {
    return <div className="text-center py-12">Listing not found</div>;
  }

  if (listing.authorId !== user.id) {
    return (
      <div className="text-center py-12">
        You don't have permission to edit this listing
      </div>
    );
  }

  // Fetch categories
  const categories = await prisma.category.findMany({
    where: {
      parentId: null,
      name: { not: "General" },
    },
    include: {
      children: true,
    },
  });

  return <EditListingForm listing={listing} categories={categories} />;
}
