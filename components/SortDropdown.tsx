"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, ArrowUpDown } from "lucide-react";

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export default function SortDropdown({
  currentSort = "newest",
}: {
  currentSort?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSort = (sortValue: string) => {
    const params = new URLSearchParams();
    const q = searchParams.get("q") || "";
    const category = searchParams.get("category") || "";
    if (q) params.set("q", q);
    if (category) params.set("category", category);
    params.set("sort", sortValue);
    router.push(`/search?${params.toString()}`);
    setOpen(false);
  };

  const currentLabel =
    sortOptions.find((opt) => opt.value === currentSort)?.label || "Sort By";

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
      >
        <ArrowUpDown className="w-4 h-4" />
        <span className="text-sm font-medium">{currentLabel}</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          {sortOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleSort(opt.value)}
              className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                currentSort === opt.value ? "bg-blue-50 text-blue-600" : ""
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
