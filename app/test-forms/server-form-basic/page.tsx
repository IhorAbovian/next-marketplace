import { getSubmissions } from "@/app/test-forms/_lib/data";
import { submitBasicAction } from "./actions";
import { SubmitButton } from "./submit-button";

// RECOMMENDED baseline for simple forms with no client-side interactivity.
// This is a Server Component — no "use client" anywhere on the page itself.
// `<form action={submitBasicAction}>` posts straight to the Server Action,
// which mutates data and calls revalidatePath so the list below re-renders
// with fresh data. Works even with JS disabled (progressive enhancement),
// and ships zero client JS beyond the SubmitButton's pending indicator.
// Trade-off: no inline field-level validation errors — see
// server-form-action-state for that.
export default async function Page() {
  const submissions = await getSubmissions();

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-xl font-bold mb-1">server-form-basic</h1>
      <p className="text-sm text-gray-600 mb-4">
        Plain Server Component + Server Action. No client JS required to submit.
      </p>

      <form action={submitBasicAction} className="flex gap-2 mb-6">
        <input
          name="name"
          placeholder="Your name"
          required
          className="border rounded px-2 py-1 flex-1"
        />

        <SubmitButton />
      </form>

      <ul className="space-y-1 text-sm">
        {submissions.map((s) => (
          <li key={s.id} className="text-gray-700">
            {s.name}
          </li>
        ))}

        {submissions.length === 0 && (
          <li className="text-gray-400">No submissions yet.</li>
        )}
      </ul>
    </div>
  );
}
