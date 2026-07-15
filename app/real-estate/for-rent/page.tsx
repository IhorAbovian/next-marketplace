"use client";

import ListingSection from "@/components/sections/ListingSection";

const forRentListings = [
  {
    id: "fr-1",
    title: "Downtown Loft for Rent",
    price: 2500,
    image: "https://placehold.co/400x300",
    location: "Chicago, IL",
    description:
      "1BR loft in historic building. High ceilings, exposed brick, in-unit laundry.",
    category: "real-estate",
    subcategory: "for-rent",
  },
  {
    id: "fr-2",
    title: "Suburban Family Home",
    price: 3200,
    image: "https://placehold.co/400x300",
    location: "Minneapolis, MN",
    description:
      "4BR home in excellent school district. Updated kitchen, finished basement.",
    category: "real-estate",
    subcategory: "for-rent",
  },
];

export default function ForRentPage() {
  return <ListingSection title="For Rent" listings={forRentListings} />;
}
