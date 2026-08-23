"use client";

import { use } from "react";
import type { Item } from "@/app/test-loading/_lib/delay";

// Reads the promise started on the server with React's use() API. Must be
// rendered inside a <Suspense> boundary — it suspends until the promise settles.
export default function ItemsList({
  itemsPromise,
}: {
  itemsPromise: Promise<Item[]>;
}) {
  const items = use(itemsPromise);

  return (
    <ul className="list-disc pl-5">
      {items.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
