"use client";

import { useTransition } from "react";
import { createItemAction } from "./actions";
import { toast } from "@/components/ui/toast";

// Traditional SPA-style form: onSubmit + preventDefault, then call the
// Server Action imperatively inside useTransition for the pending state.
// Trade-off vs mutation-action-state's `action={fn}` + useActionState: this
// form no longer submits/progressively-enhances without JS, since submission
// is driven entirely by the onSubmit handler. Reach for this only when you
// need to run extra client-side logic (e.g. client-side validation, reading
// non-form state) before dispatching the Server Action.
export default function Page() {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        await createItemAction(formData);
      } catch (err: unknown) {
        if (err instanceof Error) {
          toast.add({
            type: "error",
            title: "Error",
            description: err.message,
          });
        }
      }

      toast.add({
        type: "success",
        title: "Success",
        description: "Listing created successfully",
      });
    });
  }

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-xl font-bold mb-4">mutation-handle-submit</h1>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          name="name"
          placeholder="Item name"
          className="border rounded px-2 py-1"
        />

        <button
          type="submit"
          disabled={isPending}
          className="border rounded px-3 py-1 bg-gray-100"
        >
          {isPending ? "Loading..." : "Create"}
        </button>
      </form>
    </div>
  );
}
