"use client";

import Link from "next/link";
import VerticalListingCard, {
  VerticalListingCardProps,
} from "@/components/cards/VerticalListingCard";

export type PopularListingsGridProps = {
  title: string;
  listings: VerticalListingCardProps[];
};

export default function PopularListingsGrid({
  title,
  listings,
}: PopularListingsGridProps) {
  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {listings.map((listing) => (
          <VerticalListingCard
            key={listing.id}
            id={listing.id}
            title={listing.title}
            price={listing.price}
            image={listing.image}
            location={listing.location}
            category={listing.category}
            subcategory={listing.subcategory}
          />
        ))}
      </div>
    </section>
  );
}
