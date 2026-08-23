import Link from "next/link";

const routes = [
  {
    section: "Reading data — Server Components",
    links: [
      {
        href: "/test-loading/server-loading-file",
        label: "loading.tsx (route-level)",
        desc: "Best for: whole page has nothing to show until data arrives. RECOMMENDED default.",
      },
      {
        href: "/test-loading/server-suspense",
        label: "<Suspense> (granular)",
        desc: "Best for: showing part of the page instantly while one section streams in. RECOMMENDED for partial pages.",
      },
      {
        href: "/test-loading/server-blocking",
        label: "No loading state (anti-pattern)",
        desc: "await with no loading.tsx/Suspense — blocks the whole page. Shown for comparison only.",
      },
    ],
  },
  {
    section: "Reading data — Client Components",
    links: [
      {
        href: "/test-loading/client-swr",
        label: "useSWR",
        desc: "Best for: client-side fetching with caching/revalidation. RECOMMENDED for client components.",
      },
      {
        href: "/test-loading/client-use-promise",
        label: "Server → Client with React use()",
        desc: "Best for: streaming a server-started fetch into a client component. RECOMMENDED for server/client hybrid streaming.",
      },
      {
        href: "/test-loading/client-use-effect",
        label: "useEffect + useState (manual)",
        desc: "Classic pattern, more boilerplate, no caching. Only use when SWR/use() don't fit.",
      },
    ],
  },
  {
    section: "Mutating data",
    links: [
      {
        href: "/test-loading/mutation-action-state",
        label: "Server Action + useActionState (form action prop)",
        desc: "Best for: form submissions calling a Server Action. RECOMMENDED for forms — keeps no-JS progressive enhancement.",
      },
      {
        href: "/test-loading/mutation-handle-submit",
        label: "Server Action + handleSubmit (traditional)",
        desc: "Same form, dispatched via onSubmit/preventDefault + useTransition instead of the action prop. Loses no-JS progressive enhancement — use when you need client-side logic before submitting.",
      },
      {
        href: "/test-loading/mutation-transition",
        label: "Server Action + useTransition",
        desc: "Best for: non-form triggers (button click, onClick) calling a Server Action. RECOMMENDED for imperative mutations.",
      },
      {
        href: "/test-loading/mutation-manual-state",
        label: "Manual useState isLoading (anti-pattern)",
        desc: "Works, but duplicates what useActionState/useTransition give you for free. Shown for comparison only.",
      },
    ],
  },
];

export default function TestLoadingIndexPage() {
  return (
    <div className="max-w-3xl mx-auto p-8 space-y-10">
      <div>
        <h1 className="text-2xl font-bold">Loading state patterns</h1>
        <p className="text-gray-600 mt-1">
          Reference routes demonstrating the different ways to handle loading
          states in Next.js — for reading and mutating data, in server and
          client components. Each route is artificially delayed (~1.5s) so
          the loading state is visible.
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
