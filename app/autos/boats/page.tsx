import { getCategoryListings } from "@/lib/data";
import ListingSection from "@/components/sections/ListingSection";

export default async function BoatsPage() {
  const listings = await getCategoryListings("boats");

  return <ListingSection title="Boats" listings={listings} />;
}
