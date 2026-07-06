"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FaCar } from "react-icons/fa";
import { FaHouse } from "react-icons/fa6";

export default function SearchBar() {
  return (
    <form className="flex w-full max-w-xl items-center bg-white rounded-lg border border-gray-300 overflow-hidden shadow-sm">
      <input
        type="text"
        placeholder="What are you looking for?"
        className="flex-1 px-4 py-3 border-none focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
      />
      <div className="w-px h-10 bg-gray-300"></div>
      <Select defaultValue="">
        <SelectTrigger className="border-none w-40">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Categories</SelectItem>
          <SelectItem value="Cars & Vehicles">
            <FaCar /> Cars & Vehicles
          </SelectItem>
          <SelectItem value="Real Estate">
            <FaHouse /> Real Estate
          </SelectItem>
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
