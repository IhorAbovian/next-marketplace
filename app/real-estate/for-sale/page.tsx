"use client";

import ListingSection from "@/components/sections/ListingSection";

const forSaleListings = [
  {
    id: "fs-1",
    title: "Luxury Condo for Sale",
    price: 750000,
    image: "https://placehold.co/400x300",
    location: "New York, NY",
    description:
      "3BR penthouse with panoramic city views. Building amenities include gym and pool.",
    category: "real-estate",
    subcategory: "for-sale",
  },
  {
    id: "fs-2",
    title: "Cozy Cottage",
    price: 320000,
    image: "https://placehold.co/400x300",
    location: "Denver, CO",
    description:
      "2BR mountain cottage with updated kitchen. Perfect vacation or primary home.",
    category: "real-estate",
    subcategory: "for-sale",
  },
];

export default function ForSalePage() {
  return <ListingSection title="For Sale" listings={forSaleListings} />;
}
