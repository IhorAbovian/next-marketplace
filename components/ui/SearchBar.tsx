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

interface CategoryFromDB {
  id: number;
  name: string;
  slug: string;
  children: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
}

interface SearchBarProps {
  categories?: CategoryFromDB[];
}

export default function SearchBar({ categories }: SearchBarProps) {
  const router = useRouter();
  const [category, setCategory] = useState<string | null>("");

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
          {categories?.map((category) => (
            <SelectGroup key={category.id}>
              <SelectLabel>
                {category.slug === "autos" ? (
                  <FaCar className="inline mr-2" />
                ) : (
                  <FaHouse className="inline mr-2" />
                )}
                {category.name}
              </SelectLabel>
              {category.children.map((child) => (
                <SelectItem
                  key={child.id}
                  value={`/${category.slug}/${child.slug}`}
                >
                  {child.name}
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
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
