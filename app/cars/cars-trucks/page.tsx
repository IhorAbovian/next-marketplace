'use client';

import ListingSection from "@/components/sections/ListingSection";

const carsTrucksListings = [
  {
    id: "1",
    title: "2019 Chevrolet Silverado 1500",
    price: 35000,
    image: "https://placehold.co/400x300",
    location: "Dallas, TX",
    description: "Crew cab with towing package. Well maintained with clean title.",
  },
  {
    id: "2",
    title: "2021 Ford Transit 250",
    price: 42000,
    image: "https://placehold.co/400x300",
    location: "Denver, CO",
    description: "Cargo van with high roof. Perfect for business use.",
  },
];

export default function CarsTrucksPage() {
  return <ListingSection title="Cars & Trucks" listings={carsTrucksListings} />;
}
