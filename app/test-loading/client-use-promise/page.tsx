import { Suspense } from "react";
import { getItems } from "@/app/test-loading/_lib/delay";
import ItemsList from "./items-list";

// RECOMMENDED for: starting a fetch in a Server Component and streaming the
// result into a Client Component (e.g. the client component needs
// interactivity but the data fetch itself is server-side). The fetch starts
// immediately on the server; only the promise crosses the server/client
// boundary, not the awaited data.
export default function Page() {
  const itemsPromise = getItems(); // not awaited — passed down as a promise

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-xl font-bold mb-4">client-use-promise</h1>
      <p className="text-sm text-gray-600 mb-4">
        Server starts the fetch, Client Component resolves it with{" "}
        <code>use()</code>.
      </p>
      <Suspense fallback={<div>Loading...</div>}>
        <ItemsList itemsPromise={itemsPromise} />
      </Suspense>
    </div>
  );
}
