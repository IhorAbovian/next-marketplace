"use client";

import { useState } from "react";

// NOT RECOMMENDED as a default — manually tracking isLoading around a fetch
// call to a Route Handler. Works fine, but useActionState/useTransition give
// you the same pending state without the extra state variable, and pair
// naturally with Server Actions. Reach for this only when calling a plain
// API route from a client component with no Server Action involved.
export default function Page() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);

    try {
      const res = await fetch("/api/test-loading/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Manual item" }),
      });

      const item = await res.json();

      setCreated(item.name);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-xl font-bold mb-4">mutation-manual-state</h1>

      <button
        onClick={handleClick}
        disabled={loading}
        className="border rounded px-3 py-1 bg-gray-100"
      >
        {loading ? "Loading..." : "Create"}
      </button>

      {error && <p className="mt-4 text-sm text-red-700">Error: {error}</p>}

      {created && (
        <p className="mt-4 text-sm text-green-700">Created: {created}</p>
      )}
    </div>
  );
}
