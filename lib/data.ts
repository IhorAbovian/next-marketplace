import { ListingCardProps } from "@/components/cards/ListingCard";
import { HorizontalListingCardProps } from "@/components/cards/HorizontalListingCard";

export type Listing = {
  id: string;
  title: string;
  price: number;
  image: string;
  location: string;
  category: string;
};

export const listings: Listing[] = [
  // Cars & Trucks
  {
    id: "car-1",
    title: "2015 Toyota Camry",
    price: 15000,
    image: "https://placehold.co/400x300",
    location: "Los Angeles, CA",
    category: "autos",
  },
  {
    id: "car-2",
    title: "2018 Honda Civic",
    price: 18000,
    image: "https://placehold.co/400x300",
    location: "San Francisco, CA",
    category: "autos",
  },
  {
    id: "car-3",
    title: "2020 Ford F-150",
    price: 25000,
    image: "https://placehold.co/400x300",
    location: "Phoenix, AZ",
    category: "autos",
  },
  // Motorcycles
  {
    id: "moto-1",
    title: "2019 Harley-Davidson Street 750",
    price: 9500,
    image: "https://placehold.co/400x300",
    location: "Miami, FL",
    category: "autos",
  },
  {
    id: "moto-2",
    title: "2021 Yamaha MT-07",
    price: 8200,
    image: "https://placehold.co/400x300",
    location: "Austin, TX",
    category: "autos",
  },
  // Boats
  {
    id: "boat-1",
    title: "2017 Yamaha 212X",
    price: 32000,
    image: "https://placehold.co/400x300",
    location: "Seattle, WA",
    category: "autos",
  },
  {
    id: "boat-2",
    title: "2020 Sea Ray SPX 195",
    price: 28500,
    image: "https://placehold.co/400x300",
    location: "Tampa, FL",
    category: "autos",
  },
  // Real Estate - For Sale
  {
    id: "re-1",
    title: "Modern Apartment in Downtown",
    price: 450000,
    image: "https://placehold.co/400x300",
    location: "Seattle, WA",
    category: "real-estate",
  },
  {
    id: "re-2",
    title: "Family Home with Garden",
    price: 680000,
    image: "https://placehold.co/400x300",
    location: "Portland, OR",
    category: "real-estate",
  },
  {
    id: "fs-1",
    title: "Luxury Condo for Sale",
    price: 750000,
    image: "https://placehold.co/400x300",
    location: "New York, NY",
    category: "real-estate",
  },
  {
    id: "fs-2",
    title: "Cozy Cottage",
    price: 320000,
    image: "https://placehold.co/400x300",
    location: "Denver, CO",
    category: "real-estate",
  },
  // Real Estate - For Rent
  {
    id: "fr-1",
    title: "Downtown Loft for Rent",
    price: 2500,
    image: "https://placehold.co/400x300",
    location: "Chicago, IL",
    category: "real-estate",
  },
  {
    id: "fr-2",
    title: "Suburban Family Home",
    price: 3200,
    image: "https://placehold.co/400x300",
    location: "Minneapolis, MN",
    category: "real-estate",
  },
];

export const popularAutosListings: HorizontalListingCardProps[] = [
  {
    id: "car-1",
    title: "2023 Toyota Camry",
    price: 25000,
    image: "https://placehold.co/800x400",
    location: "Los Angeles, CA",
    description: "Excellent condition, low mileage, clean title.",
    category: "autos",
    subcategory: "cars-trucks",
  },
  {
    id: "car-2",
    title: "2022 Honda Civic",
    price: 22000,
    image: "https://placehold.co/800x400",
    location: "San Francisco, CA",
    description: "Well maintained, single owner, great fuel economy.",
    category: "autos",
    subcategory: "cars-trucks",
  },
  {
    id: "car-3",
    title: "2021 Ford F-150",
    price: 35000,
    image: "https://placehold.co/800x400",
    location: "Phoenix, AZ",
    description: "4x4, crew cab, tow package included.",
    category: "autos",
    subcategory: "cars-trucks",
  },
];

export const popularRealEstateListings: HorizontalListingCardProps[] = [
  {
    id: "re-1",
    title: "Modern Apartment Downtown",
    price: 450000,
    image: "https://placehold.co/800x400",
    location: "Seattle, WA",
    description: "2BR/2BA condo with city views and parking.",
    category: "real-estate",
    subcategory: "for-sale",
  },
  {
    id: "re-2",
    title: "Family House with Garden",
    price: 750000,
    image: "https://placehold.co/800x400",
    location: "Portland, OR",
    description: "4BR/3BA, updated kitchen, large backyard.",
    category: "real-estate",
    subcategory: "for-sale",
  },
  {
    id: "re-3",
    title: "Cozy Studio Apartment",
    price: 280000,
    image: "https://placehold.co/800x400",
    location: "Denver, CO",
    description: "Perfect starter home, move-in ready.",
    category: "real-estate",
    subcategory: "for-sale",
  },
];
