"use client";

import HorizontalListingCard, {
  HorizontalListingCardProps,
} from "@/components/cards/HorizontalListingCard";

export type ListingSectionProps = {
  title: string;
  listings: HorizontalListingCardProps[];
};

export default function ListingSection({
  title,
  listings,
}: ListingSectionProps) {
  return (
    <main className="container max-w-7xl mx-auto px-4 pt-8">
      <h1 className="text-2xl font-bold mb-6">{title}</h1>

      <div className="flex flex-col gap-4">
        {listings.map((listing) => (
          <HorizontalListingCard
            key={listing.id}
            id={listing.id}
            title={listing.title}
            price={listing.price}
            image={listing.image}
            location={listing.location}
            description={listing.description}
            category={listing.category}
            subcategory={listing.subcategory}
          />
        ))}
      </div>
    </main>
  );
}
