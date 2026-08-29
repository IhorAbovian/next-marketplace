import Form from "next/form";

// RECOMMENDED for search/filter forms that navigate via GET and update URL
// search params. `next/form` (a Server Component, no "use client" needed)
// behaves like a native <form method="get">, but Next.js also prefetches
// the destination route's shared UI (layout.tsx / loading.tsx) once the
// form scrolls into view, and performs a client-side navigation on submit
// instead of a full page reload.
export default function Page() {
  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-xl font-bold mb-1">next-form-search</h1>
      <p className="text-sm text-gray-600 mb-4">
        next/form with a string action — navigates to ?query=... on submit.
      </p>

      <Form action="/test-forms/next-form-search/results" className="flex gap-2">
        <input
          name="query"
          placeholder="Search..."
          className="border rounded px-2 py-1 flex-1"
        />
        <button type="submit" className="border rounded px-3 py-1 bg-gray-100">
          Search
        </button>
      </Form>
    </div>
  );
}
