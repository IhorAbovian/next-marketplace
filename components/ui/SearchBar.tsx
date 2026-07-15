"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FaCar } from "react-icons/fa";
import { FaHouse } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar() {
  const router = useRouter();
  const [category, setCategory] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(category || "/");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-xl items-center bg-white rounded-lg border border-gray-300 overflow-hidden shadow-sm"
    >
      <input
        type="text"
        placeholder="What are you looking for?"
        className="flex-1 px-4 py-3 border-none focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
      />
      <div className="w-px h-10 bg-gray-300"></div>
      <Select value={category} onValueChange={setCategory}>
        <SelectTrigger className="border-none w-48">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Categories</SelectItem>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>
              <FaCar className="inline mr-2" /> Autos
            </SelectLabel>
            <SelectItem value="/autos/cars-trucks">Cars & Trucks</SelectItem>
            <SelectItem value="/autos/motorcycles">Motorcycles</SelectItem>
            <SelectItem value="/autos/boats">Boats</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>
              <FaHouse className="inline mr-2" /> Real Estate
            </SelectLabel>
            <SelectItem value="/real-estate/for-sale">For Sale</SelectItem>
            <SelectItem value="/real-estate/for-rent">For Rent</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <button
        type="submit"
        className="px-8 py-3 text-black font-semibold  border rounded-lg cursor-pointer hover:bg-gray-200 transition-colors duration-300"
      >
        Search
      </button>
    </form>
  );
}
