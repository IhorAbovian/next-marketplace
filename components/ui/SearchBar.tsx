"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import CategorySelect from "./CategorySelect";
import type { Prisma } from "@/generated/prisma/browser";

type CategoryWithRelations = Prisma.CategoryGetPayload<{
  select: {
    slug: true;
    name: true;
    children: {
      select: {
        slug: true;
        name: true;
      };
    };
  };
}>;

export default function SearchBar({
  categories,
  initialValue = "",
  initialCategory = "",
}: {
  categories: CategoryWithRelations[];
  initialValue?: string;
  initialCategory?: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState(initialValue);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (selectedCategory) params.set("category", selectedCategory);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex w-full max-w-xl items-center bg-white rounded-lg border border-gray-300 overflow-hidden shadow-sm"
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="What are you looking for?"
        className="flex-1 px-4 py-3 border-none focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
      />

      <div className="w-px h-10 bg-gray-300"></div>

      <CategorySelect
        categories={categories}
        value={selectedCategory}
        onChange={setSelectedCategory}
      />

      <button
        type="submit"
        className="px-8 py-3 text-black font-semibold border rounded-lg cursor-pointer hover:bg-gray-200 transition-colors duration-300"
      >
        Search
      </button>
    </form>
  );
}
