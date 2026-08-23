"use client";

import { useEffect, useState } from "react";
import type { Item } from "@/app/test-loading/_lib/delay";

// NOT RECOMMENDED as a default — manual loading/error state, no caching, no
// dedupe, and easy to get wrong (race conditions on fast re-renders). Prefer
// useSWR (see client-swr) unless you have a reason to avoid a dependency.
export default function Page() {
  const [items, setItems] = useState<Item[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);

    fetch("/api/test-loading/items")
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-xl font-bold mb-4">client-use-effect</h1>
      {loading && <div>Loading...</div>}

      {error && <div>Error: {error}</div>}

      {items && (
        <ul className="list-disc pl-5">
          {items.map((item) => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
