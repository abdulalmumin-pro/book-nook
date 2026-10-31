/** Loading skeleton shaped like BookCard, shown while the New Arrivals
 *  query streams in. */
export function NewArrivalsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="h-full overflow-hidden rounded-2xl border border-[#e8e5dc] bg-white shadow-sm"
        >
          <div className="h-44 w-full animate-pulse bg-gradient-to-br from-[#e8f0e8] via-[#f5f1e8] to-[#efe5d6]" />
          <div className="space-y-3 p-4">
            <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
            <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
            <div className="min-h-10 w-full animate-pulse rounded bg-muted" />
            <div className="h-10 w-full animate-pulse rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}
