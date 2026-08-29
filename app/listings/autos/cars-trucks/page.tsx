import ListingSection from "@/components/sections/ListingSection";
import { getCategoryListings } from "@/lib/data";

export default async function CarsTrucksPage() {
  const listings = await getCategoryListings("cars-trucks");

  return <ListingSection title="Cars & Trucks" listings={listings} />;
}
