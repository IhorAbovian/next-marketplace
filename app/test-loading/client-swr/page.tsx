"use client";

import useSWR from "swr";
import type { Item } from "@/app/test-loading/_lib/delay";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// RECOMMENDED for: client-side data fetching. isLoading/error come for free,
// plus caching, revalidation and dedupe across components using the same key.
export default function Page() {
  const { data, error, isLoading } = useSWR<Item[]>(
    "/api/test-loading/items",
    fetcher,
  );

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-xl font-bold mb-4">client-swr</h1>
      {isLoading && <div>Loading...</div>}

      {error && <div>Error: {error.message}</div>}

      {data && (
        <ul className="list-disc pl-5">
          {data.map((item) => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
