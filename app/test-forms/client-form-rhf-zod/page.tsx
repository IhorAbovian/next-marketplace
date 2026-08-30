"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactInput } from "@/app/test-forms/_lib/schema";
import { submitContactAction } from "@/app/test-forms/_lib/actions";

// RECOMMENDED when you need rich client-side UX: per-field errors as the
// user types/blurs, a submit button disabled until the form is valid, etc.
// react-hook-form drives the form; the resolver validates with the SAME
// Zod schema the Server Action re-validates with, so the two never drift
// apart. handleSubmit only calls the Server Action once client validation
// passes — but the server still re-validates, since client checks can
// always be bypassed. Trade-off vs server-form-action-state: this form
// requires JS and loses native progressive enhancement.
export default function Page() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) });

  const onSubmit = handleSubmit(async (data) => {
    await submitContactAction(data);
  });

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-xl font-bold mb-1">client-form-rhf-zod</h1>
      <p className="text-sm text-gray-600 mb-4">
        react-hook-form + zodResolver, calling a Server Action on valid submit.
      </p>

      <form onSubmit={onSubmit} className="space-y-3" noValidate>
        <div>
          <input
            {...register("name")}
            placeholder="Name"
            className="border rounded px-2 py-1 w-full"
          />
          {errors.name && (
            <p className="text-sm text-red-700 mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <input
            {...register("email")}
            placeholder="Email"
            className="border rounded px-2 py-1 w-full"
          />
          {errors.email && (
            <p className="text-sm text-red-700 mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <textarea
            {...register("message")}
            placeholder="Message"
            rows={3}
            className="border rounded px-2 py-1 w-full"
          />
          {errors.message && (
            <p className="text-sm text-red-700 mt-1">
              {errors.message.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="border rounded px-3 py-1 bg-gray-100"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
