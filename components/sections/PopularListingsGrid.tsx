import VerticalListingCard, {
  type VerticalListingWithRelations,
} from "@/components/cards/VerticalListingCard";

export default function PopularListingsGrid({
  title,
  listings,
}: {
  title: string;
  listings: VerticalListingWithRelations[];
}) {
  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {listings.map((listing) => (
          <VerticalListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </section>
  );
}
