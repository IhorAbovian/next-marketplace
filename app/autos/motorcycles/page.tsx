import ListingSection from "@/components/sections/ListingSection";
import { getCategoryListings } from "@/lib/data";

export default async function MotorcyclesPage() {
  const listings = await getCategoryListings("motorcycles");

  return <ListingSection title="Motorcycles" listings={listings} />;
}
