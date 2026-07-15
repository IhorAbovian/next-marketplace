"use client";

import ListingSection from "@/components/sections/ListingSection";

const motorcycleListings = [
  {
    id: "moto-1",
    title: "2019 Harley-Davidson Street 750",
    price: 9500,
    image: "https://placehold.co/400x300",
    location: "Miami, FL",
    description:
      "Excellent condition, low miles. Recently serviced and ready to ride.",
    category: "autos",
    subcategory: "motorcycles",
  },
  {
    id: "moto-2",
    title: "2021 Yamaha MT-07",
    price: 8200,
    image: "https://placehold.co/400x300",
    location: "Austin, TX",
    description:
      "Sport naked bike with aggressive styling and smooth performance.",
    category: "autos",
    subcategory: "motorcycles",
  },
];

export default function MotorcyclesPage() {
  return <ListingSection title="Motorcycles" listings={motorcycleListings} />;
}
