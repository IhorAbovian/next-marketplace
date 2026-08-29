"use client";

import { useFormStatus } from "react-dom";

// The page itself stays a Server Component (no "use client" needed just to
// render a <form>). The only bit of interactivity — a pending indicator —
// is isolated into this tiny client child via useFormStatus, which reads
// pending state from the nearest ancestor <form>.
export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="border rounded px-3 py-1 bg-gray-100"
    >
      {pending ? "Saving..." : "Add"}
    </button>
  );
}
