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

type CategorySelectProps = {
  categories: CategoryWithRelations[];
  onChange?: (value: unknown) => void;
} & React.ComponentProps<typeof Select>;

export default function CategorySelect({
  categories,
  onChange,
  ...restProps
}: CategorySelectProps) {
  return (
    <Select name="category" onValueChange={onChange} {...restProps}>
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
              <SelectItem key={child.slug} value={child.slug}>
                {child.name}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}
