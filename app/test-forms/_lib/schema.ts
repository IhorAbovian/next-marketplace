import { z } from "zod";

// The single source of truth for what a valid submission looks like. Shared
// by the client (react-hook-form's zodResolver, for instant feedback) and
// the server (Server Actions re-validate with this exact schema — the
// client can always be bypassed, e.g. curl/devtools, so the server check is
// the one that actually matters).
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z
    .string()
    .trim()
    .min(1, "Email must not be empty")
    .email("Enter a valid email"),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(500, "Message must be under 500 characters"),
});

export type ContactInput = z.infer<typeof contactSchema>;
