import { getItems } from "@/app/test-loading/_lib/delay";

// RECOMMENDED for: a page where nothing is worth showing until data arrives.
// Next.js auto-wraps this page in <Suspense fallback={<Loading />}> using
// the sibling loading.tsx file — no manual Suspense needed here.
export default async function Page() {
  const items = await getItems();

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-xl font-bold mb-4">server-loading-file</h1>
      <p className="text-sm text-gray-600 mb-4">
        Uses a sibling <code>loading.tsx</code>. Navigating here shows the
        loading UI immediately, then swaps in this page once the fetch
        resolves.
      </p>
      <ul className="list-disc pl-5">
        {items.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}
