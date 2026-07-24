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
import type { Prisma } from "@/generated/prisma/browser";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaCar } from "react-icons/fa";
import { FaHouse } from "react-icons/fa6";

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

export default function CategorySelect({
  categories,
}: {
  categories: CategoryWithRelations[];
}) {
  const router = useRouter();
  const [selected, setSelected] = useState("");

  const handleCategoryChange = (value: string | null) => {
    setSelected(value || "");
    if (value) {
      router.push(value);
    }
  };

  return (
    <Select value={selected} onValueChange={handleCategoryChange}>
      <SelectTrigger className="border-none w-48">
        <SelectValue placeholder="All Categories" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="">All Categories</SelectItem>
        <SelectSeparator />

        {categories.map((category) => (
          <SelectGroup key={category.slug}>
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
                key={child.slug}
                value={`/${category.slug}/${child.slug}`}
              >
                {child.name}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}
