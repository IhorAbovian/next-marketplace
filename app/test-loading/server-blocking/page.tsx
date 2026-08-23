import { getItems } from "@/app/test-loading/_lib/delay";

// ANTI-PATTERN (for comparison only): awaiting slow data with no loading.tsx
// and no <Suspense> boundary. The browser shows nothing at all — not even a
// spinner — until the whole page finishes rendering on the server.
export default async function Page() {
  const items = await getItems();

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-xl font-bold mb-4">server-blocking</h1>
      <p className="text-sm text-gray-600 mb-4">
        No loading state at all — the navigation just hangs until this
        resolves. Avoid this for anything slower than a few hundred ms.
      </p>
      <ul className="list-disc pl-5">
        {items.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}
