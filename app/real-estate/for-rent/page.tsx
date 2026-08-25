import ListingSection from "@/components/sections/ListingSection";
import { getCategoryListings } from "@/lib/data";

export default async function ForRentPage() {
  const listings = await getCategoryListings("for-rent");

  return <ListingSection title="For Rent" listings={listings} />;
}
