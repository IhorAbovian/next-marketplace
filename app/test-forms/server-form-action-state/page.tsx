"use client";

import { useActionState } from "react";
import { submitValidatedAction, type ActionState } from "./actions";

const initialState: ActionState = {
  errors: {},
  values: { name: "", email: "", message: "" },
};

// RECOMMENDED for forms that need field-level validation errors while
// keeping the <form action={...}> progressive-enhancement path. Zod runs
// ONLY on the server (the only place validation can be trusted) and
// useActionState feeds the returned {errors, values} back into the form —
// invalid fields show their message and the form is repopulated with what
// the user typed. Compare with client-form-rhf-zod, which validates on the
// client too for instant feedback, at the cost of requiring JS.
export default function Page() {
  const [state, action, pending] = useActionState(
    submitValidatedAction,
    initialState,
  );

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-xl font-bold mb-1">server-form-action-state</h1>
      <p className="text-sm text-gray-600 mb-4">
        Server Action + Zod validation, surfaced via useActionState.
      </p>

      <form action={action} className="space-y-3" noValidate>
        <div>
          <input
            name="name"
            defaultValue={state.values.name}
            placeholder="Name"
            className="border rounded px-2 py-1 w-full"
          />

          {state.errors.name && (
            <p className="text-sm text-red-700 mt-1">{state.errors.name[0]}</p>
          )}
        </div>

        <div>
          <input
            name="email"
            defaultValue={state.values.email}
            placeholder="Email"
            className="border rounded px-2 py-1 w-full"
          />

          {state.errors.email && (
            <p className="text-sm text-red-700 mt-1">{state.errors.email[0]}</p>
          )}
        </div>

        <div>
          <textarea
            name="message"
            defaultValue={state.values.message}
            placeholder="Message"
            rows={3}
            className="border rounded px-2 py-1 w-full"
          />

          {state.errors.message && (
            <p className="text-sm text-red-700 mt-1">
              {state.errors.message[0]}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={pending}
          className="border rounded px-3 py-1 bg-gray-100"
        >
          {pending ? "Submitting..." : "Submit"}
        </button>

        {state.success && <p className="text-sm text-green-700">Saved!</p>}
      </form>
    </div>
  );
}
