"use client";

import ListingSection from "@/components/sections/ListingSection";

const realEstateListings = [
  {
    id: "re-1",
    title: "Modern Apartment in Downtown",
    price: 450000,
    image: "https://placehold.co/400x300",
    location: "Seattle, WA",
    description:
      "2BR/2BA condo with city views. Updated kitchen and hardwood floors throughout.",
    category: "real-estate",
    subcategory: "for-sale",
  },
  {
    id: "re-2",
    title: "Family Home with Garden",
    price: 680000,
    image: "https://placehold.co/400x300",
    location: "Portland, OR",
    description:
      "4BR/3BA single family home. Updated kitchen, fenced backyard with garden.",
    category: "real-estate",
    subcategory: "for-sale",
  },
];

export default function RealEstatePage() {
  return <ListingSection title="Real Estate" listings={realEstateListings} />;
}
