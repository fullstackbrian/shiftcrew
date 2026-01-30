export default function Loading() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="mx-auto w-full max-w-7xl px-6 py-12 md:px-8">
        <div className="mb-8">
          <div className="h-12 w-64 animate-pulse rounded bg-neutral-200" />
          <div className="mt-2 h-6 w-96 animate-pulse rounded bg-neutral-200" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-48 animate-pulse rounded-lg bg-neutral-200"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
