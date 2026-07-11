"use client";

import ListingSection from "@/components/sections/ListingSection";

const forSaleListings = [
  {
    id: "1",
    title: "Luxury Condo for Sale",
    price: 750000,
    image: "https://placehold.co/400x300",
    location: "New York, NY",
    description:
      "3BR penthouse with panoramic city views. Building amenities include gym and pool.",
  },
  {
    id: "2",
    title: "Cozy Cottage",
    price: 320000,
    image: "https://placehold.co/400x300",
    location: "Denver, CO",
    description:
      "2BR mountain cottage with updated kitchen. Perfect vacation or primary home.",
  },
];

export default function ForSalePage() {
  return <ListingSection title="For Sale" listings={forSaleListings} />;
}
