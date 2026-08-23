import { Suspense } from "react";
import { getItems } from "@/app/test-loading/_lib/delay";

// RECOMMENDED for: pages that have real content to show immediately and only
// part of the page depends on slow data. Push the await down into a small
// async component and wrap just that with <Suspense>.
export default function Page() {
  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-xl font-bold mb-4">server-suspense</h1>
      <p className="text-sm text-gray-600 mb-4">
        This text renders instantly. Only the list below streams in behind
        its own <code>Suspense</code> boundary.
      </p>
      <Suspense fallback={<div>Loading...</div>}>
        <ItemsList />
      </Suspense>
    </div>
  );
}

async function ItemsList() {
  const items = await getItems();
  return (
    <ul className="list-disc pl-5">
      {items.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
