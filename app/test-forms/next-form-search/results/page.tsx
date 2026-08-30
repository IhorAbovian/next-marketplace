export default async function ResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const { query } = await searchParams;

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-xl font-bold mb-4">next-form-search results</h1>
      <p className="text-sm text-gray-700">
        You searched for: <strong>{query || "(nothing)"}</strong>
      </p>
    </div>
  );
}
