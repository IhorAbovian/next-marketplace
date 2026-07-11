"use client";

import ListingSection from "@/components/sections/ListingSection";

const boatListings = [
  {
    id: "1",
    title: "2017 Yamaha 212X",
    price: 32000,
    image: "https://placehold.co/400x300",
    location: "Seattle, WA",
    description:
      "Wakeboard tower, perfect for water sports. Well maintained with service records.",
  },
  {
    id: "2",
    title: "2020 Sea Ray SPX 195",
    price: 28500,
    image: "https://placehold.co/400x300",
    location: "Tampa, FL",
    description:
      "Spacious bowrider with powerful engine. Great for family outings.",
  },
];

export default function BoatsPage() {
  return <ListingSection title="Boats" listings={boatListings} />;
}
