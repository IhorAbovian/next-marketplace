"use client";

import { useState } from "react";
import { submitContactAction } from "@/app/test-forms/_lib/actions";

// NOT RECOMMENDED as a default — hand-rolled validation with one useState
// per field plus manual regex/length checks written by hand. It works, but
// every rule is duplicated by hand and there's no shared schema with the
// server, so client and server checks can silently drift apart. Compare
// with client-form-rhf-zod, which gets the same UX from react-hook-form +
// a single Zod schema also used by the Server Action.
export default function Page() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [savedCount, setSavedCount] = useState(0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const nextErrors: Record<string, string> = {};
    if (name.trim().length < 2) {
      nextErrors.name = "Name must be at least 2 characters";
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      nextErrors.email = "Enter a valid email";
    }
    if (message.trim().length < 10) {
      nextErrors.message = "Message must be at least 10 characters";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      await submitContactAction({ name, email, message });
      setSavedCount((n) => n + 1);
      setName("");
      setEmail("");
      setMessage("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-xl font-bold mb-1">client-form-manual-state</h1>
      <p className="text-sm text-gray-600 mb-4">
        Same form as client-form-rhf-zod, validated and wired up by hand.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3" noValidate>
        <div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="border rounded px-2 py-1 w-full"
          />
          {errors.name && (
            <p className="text-sm text-red-700 mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="border rounded px-2 py-1 w-full"
          />
          {errors.email && (
            <p className="text-sm text-red-700 mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message"
            rows={3}
            className="border rounded px-2 py-1 w-full"
          />
          {errors.message && (
            <p className="text-sm text-red-700 mt-1">{errors.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="border rounded px-3 py-1 bg-gray-100"
        >
          {submitting ? "Submitting..." : "Submit"}
        </button>

        {savedCount > 0 && (
          <p className="text-sm text-green-700">Saved {savedCount} so far</p>
        )}
      </form>
    </div>
  );
}
