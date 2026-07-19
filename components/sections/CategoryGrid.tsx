import Link from "next/link";

export interface Category {
  id: string;
  name: string;
  href: string;
  color?: string;
}

export interface CategoryGridProps {
  title: string;
  categories: Category[];
}

export default function CategoryGrid({ title, categories }: CategoryGridProps) {
  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {categories.map((category) => (
          <Link key={category.id} href={category.href}>
            <div className="bg-gray-100 hover:bg-gray-200 rounded-lg p-6 sm:p-8 flex items-center justify-center min-h-[120px] sm:min-h-[140px] lg:min-h-[160px] cursor-pointer transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md text-center">
              <span className="font-semibold text-gray-800 text-sm sm:text-base lg:text-lg">
                {category.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
