"use client";

import { useActionState } from "react";
import { createItemAction } from "./actions";

// RECOMMENDED for: form submissions that call a Server Action. Pass the
// action straight to `<form action={...}>` — useActionState gives you the
// pending boolean and returned state for free, and the form still submits
// with JS disabled (progressive enhancement). Compare with
// mutation-handle-submit for the traditional onSubmit approach.
export default function Page() {
  const [state, action, pending] = useActionState(createItemAction, null);

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-xl font-bold mb-4">mutation-action-state</h1>
      <form action={action} className="flex gap-2">
        <input
          name="name"
          placeholder="Item name"
          className="border rounded px-2 py-1"
        />

        <button
          type="submit"
          disabled={pending}
          className="border rounded px-3 py-1 bg-gray-100"
        >
          {pending ? "Loading..." : "Create"}
        </button>
      </form>

      {state?.created && (
        <p className="mt-4 text-sm text-green-700">Created: {state.created}</p>
      )}
    </div>
  );
}
