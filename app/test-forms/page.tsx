import Link from "next/link";

const routes = [
  {
    section: "Server Actions — plain <form>",
    links: [
      {
        href: "/test-forms/server-form-basic",
        label: "form action={serverAction} (no client JS)",
        desc: "Best for: simple forms with no validation feedback needed. RECOMMENDED default — Server Component, works with JS disabled.",
      },
      {
        href: "/test-forms/server-form-action-state",
        label: "form action + useActionState + Zod",
        desc: "Best for: forms that need field-level errors. RECOMMENDED when you need validation feedback but want to keep progressive enhancement.",
      },
    ],
  },
  {
    section: "Client forms — React Hook Form + Zod",
    links: [
      {
        href: "/test-forms/client-form-rhf-zod",
        label: "react-hook-form + zodResolver → Server Action",
        desc: "Best for: rich client-side UX (instant per-field errors, disabled-until-valid submit). RECOMMENDED for complex/interactive forms. Requires JS.",
      },
      {
        href: "/test-forms/client-form-manual-state",
        label: "Hand-rolled useState + manual validation (anti-pattern)",
        desc: "Same form, wired up by hand with no shared schema. Shown for comparison only — see client-form-rhf-zod.",
      },
    ],
  },
  {
    section: "Navigation forms (GET / search params)",
    links: [
      {
        href: "/test-forms/next-form-search",
        label: "next/form with a string action",
        desc: "Best for: search/filter forms that update the URL. RECOMMENDED — prefetches the destination and does a client-side navigation.",
      },
    ],
  },
];

export default function TestFormsIndexPage() {
  return (
    <div className="max-w-3xl mx-auto p-8 space-y-10">
      <div>
        <h1 className="text-2xl font-bold">Form patterns</h1>
        <p className="text-gray-600 mt-1">
          Reference routes demonstrating the different ways to build forms in
          Next.js — plain Server Actions, Server Actions with Zod validation,
          and client-driven forms with react-hook-form + Zod. Mutations are
          artificially delayed (~1.2s) so pending states are visible.
        </p>
      </div>

      {routes.map((group) => (
        <div key={group.section}>
          <h2 className="text-lg font-semibold mb-3">{group.section}</h2>
          <ul className="space-y-3">
            {group.links.map((link) => (
              <li key={link.href} className="border rounded-lg p-4">
                <Link
                  href={link.href}
                  className="font-medium text-blue-600 hover:underline"
                >
                  {link.label}
                </Link>
                <p className="text-sm text-gray-600 mt-1">{link.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
