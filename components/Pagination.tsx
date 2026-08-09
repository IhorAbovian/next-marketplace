"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ totalPages }: { totalPages: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentPage = Number(searchParams.get("page")) || 1;

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    router.push(createPageURL(page));
  };

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push(-1); // ellipsis

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 2) pages.push(-1); // ellipsis
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage <= 1}
        className="p-2 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {pageNumbers.map((page, i) =>
        page === -1 ? (
          <span key={`ellipsis-${i}`} className="px-2 py-1 text-gray-500">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => goToPage(page)}
            className={`px-3 py-1 rounded border ${
              currentPage === page ? "bg-black text-white" : "hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        ),
      )}

      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="p-2 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
