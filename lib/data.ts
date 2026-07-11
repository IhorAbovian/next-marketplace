import { ProductCardProps } from "@/components/cards/ProductCard";
import { HorizontalProductCardProps } from "@/components/cards/HorizontalProductCard";

export const products: ProductCardProps[] = [
  {
    id: "1",
    title: "2023 Toyota Camry",
    price: 25000,
    image: "https://placehold.co/800x400",
    location: "Los Angeles, CA",
  },
  {
    id: "2",
    title: "2022 Honda Civic",
    price: 22000,
    image: "https://placehold.co/800x400",
    location: "San Francisco, CA",
  },
  {
    id: "3",
    title: "2021 Ford F-150",
    price: 35000,
    image: "https://placehold.co/800x400",
    location: "Phoenix, AZ",
  },
  {
    id: "4",
    title: "Modern Apartment Downtown",
    price: 450000,
    image: "https://placehold.co/800x400",
    location: "Seattle, WA",
  },
  {
    id: "5",
    title: "Family House with Garden",
    price: 750000,
    image: "https://placehold.co/800x400",
    location: "Portland, OR",
  },
  {
    id: "6",
    title: "Cozy Studio Apartment",
    price: 280000,
    image: "https://placehold.co/800x400",
    location: "Denver, CO",
  },
];

export const popularAutosListings: HorizontalProductCardProps[] = [
  {
    id: "1",
    title: "2023 Toyota Camry",
    price: 25000,
    image: "https://placehold.co/800x400",
    location: "Los Angeles, CA",
    description: "Excellent condition, low mileage, clean title.",
  },
  {
    id: "2",
    title: "2022 Honda Civic",
    price: 22000,
    image: "https://placehold.co/800x400",
    location: "San Francisco, CA",
    description: "Well maintained, single owner, great fuel economy.",
  },
  {
    id: "3",
    title: "2021 Ford F-150",
    price: 35000,
    image: "https://placehold.co/800x400",
    location: "Phoenix, AZ",
    description: "4x4, crew cab, tow package included.",
  },
];

export const popularRealEstateListings: HorizontalProductCardProps[] = [
  {
    id: "4",
    title: "Modern Apartment Downtown",
    price: 450000,
    image: "https://placehold.co/800x400",
    location: "Seattle, WA",
    description: "2BR/2BA condo with city views and parking.",
  },
  {
    id: "5",
    title: "Family House with Garden",
    price: 750000,
    image: "https://placehold.co/800x400",
    location: "Portland, OR",
    description: "4BR/3BA, updated kitchen, large backyard.",
  },
  {
    id: "6",
    title: "Cozy Studio Apartment",
    price: 280000,
    image: "https://placehold.co/800x400",
    location: "Denver, CO",
    description: "Perfect starter home, move-in ready.",
  },
];
