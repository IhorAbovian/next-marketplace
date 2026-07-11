"use client";

import ListingSection from "@/components/sections/ListingSection";

const carListings = [
  {
    id: "1",
    title: "2015 Toyota Camry",
    price: 15000,
    image: "https://placehold.co/400x300",
    location: "Los Angeles, CA",
    description:
      "Well-maintained sedan with low mileage. Clean interior and excellent condition.",
  },
  {
    id: "2",
    title: "2018 Honda Civic",
    price: 18000,
    image: "https://placehold.co/400x300",
    location: "San Francisco, CA",
    description:
      "Reliable compact car, perfect for city driving. Recent service records available.",
  },
  {
    id: "3",
    title: "2020 Ford F-150",
    price: 25000,
    image: "https://placehold.co/400x300",
    location: "Phoenix, AZ",
    description:
      "Powerful truck with towing package. Great for work or adventure.",
  },
];

export default function CarsPage() {
  return <ListingSection title="Cars & Trucks" listings={carListings} />;
}
