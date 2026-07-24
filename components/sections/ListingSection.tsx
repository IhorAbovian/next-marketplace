import HorizontalListingCard, {
  type ListingWithRelations,
} from "@/components/cards/HorizontalListingCard";

export default function ListingSection({
  title,
  listings,
}: {
  title: string;
  listings: ListingWithRelations[];
}) {
  return (
    <div className="container max-w-7xl mx-auto px-4 pt-8">
      <h1 className="text-2xl font-bold mb-6">{title}</h1>

      <div className="flex flex-col gap-4">
        {listings.map((listing) => (
          <HorizontalListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  );
}
