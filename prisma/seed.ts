import { prisma } from "../lib/prisma";

async function upsertCategory(name: string, slug: string, parentId?: string) {
  return prisma.category.upsert({
    where: { slug },
    update: {},
    create: { name, slug, parentId },
  });
}

async function main() {
  await upsertCategory("General", "general");

  const autos = await upsertCategory("Autos", "autos");
  const realEstate = await upsertCategory("Real Estate", "real-estate");

  await upsertCategory("Cars & Trucks", "cars-trucks", autos.id);
  await upsertCategory("Motorcycles", "motorcycles", autos.id);
  await upsertCategory("Boats", "boats", autos.id);
  await upsertCategory("For Sale", "for-sale", realEstate.id);
  await upsertCategory("For Rent", "for-rent", realEstate.id);

  console.log("Seeded categories");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    process.exit(0);
  });
