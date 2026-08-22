"use client";

import { useRouter } from "next/navigation";
import CategorySelect from "./CategorySelect";
import type { Prisma } from "@/generated/prisma/browser";
import { useSearchParams } from "next/navigation";

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
}: {
  categories: CategoryWithRelations[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const params = new URLSearchParams();

    const q = formData.get("q") as string;
    if (q) {
      params.set("q", q);
    }

    const category = formData.get("category") as string;
    if (category) {
      params.set("category", category);
    }

    router.push(`/search?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex w-full max-w-xl items-center bg-white rounded-lg border border-gray-300 overflow-hidden shadow-sm"
    >
      <input
        type="text"
        name="q"
        defaultValue={query}
        placeholder="What are you looking for?"
        className="flex-1 px-4 py-3 border-none focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
      />

      <div className="w-px h-10 bg-gray-300"></div>

      <CategorySelect categories={categories} defaultValue={category} />

      <button
        type="submit"
        className="px-8 py-3 text-black font-semibold border rounded-lg cursor-pointer hover:bg-gray-200 transition-colors duration-300"
      >
        Search
      </button>
    </form>
  );
}
