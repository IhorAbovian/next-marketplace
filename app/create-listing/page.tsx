import { prisma } from "@/lib/prisma";
import CreateListingForm from "@/components/CreateListingForm";

export default async function CreateListingPage() {
  const categories = await prisma.category.findMany({
    where: {
      parentId: null,
      name: { not: "General" },
    },
    include: {
      children: true,
    },
  });

  return <CreateListingForm categories={categories} />;
}
