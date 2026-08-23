"use client";

import { useState, useTransition } from "react";
import { likeAction } from "./actions";

// RECOMMENDED for: mutations triggered imperatively (button onClick, not a
// <form> submit). useTransition's isPending drives the loading state and
// keeps the UI responsive while the Server Action runs.
export default function Page() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [likes, setLikes] = useState(0);

  const handleClick = () => {
    startTransition(async () => {
      try {
        await likeAction();
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        }
      }

      setLikes((n) => n + 1);
    });
  };

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-xl font-bold mb-4">mutation-transition</h1>
      <p className="mb-2">Likes: {likes}</p>

      <button
        onClick={handleClick}
        disabled={isPending}
        className="border rounded px-3 py-1 bg-gray-100"
      >
        {isPending ? "Loading..." : "Like"}
      </button>

      {error && <p className="mt-4 text-sm text-red-700">Error: {error}</p>}
    </div>
  );
}
