import ListingSection from "@/components/sections/ListingSection";
import { getCategoryListings } from "@/lib/data";

export default async function ForSalePage() {
  const listings = await getCategoryListings("for-sale");

  return <ListingSection title="For Sale" listings={listings} />;
}
