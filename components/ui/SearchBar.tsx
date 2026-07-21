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
}: {
  categories: CategoryWithRelations[];
}) {
  return (
    <form className="flex w-full max-w-xl items-center bg-white rounded-lg border border-gray-300 overflow-hidden shadow-sm">
      <input
        type="text"
        placeholder="What are you looking for?"
        className="flex-1 px-4 py-3 border-none focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
      />

      <div className="w-px h-10 bg-gray-300"></div>

      <CategorySelect categories={categories} />

      <button
        type="submit"
        className="px-8 py-3 text-black font-semibold border rounded-lg cursor-pointer hover:bg-gray-200 transition-colors duration-300"
      >
        Search
      </button>
    </form>
  );
}
