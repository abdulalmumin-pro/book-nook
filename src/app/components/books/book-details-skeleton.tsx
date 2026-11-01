/** Skeleton shaped like the book details layout while the fetch streams in. */
export function BookDetailsSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#e8e5dc] bg-white shadow-sm">
      <div className="grid gap-8 p-6 md:grid-cols-[320px_1fr] md:p-8">
        <div className="h-80 w-full animate-pulse rounded-xl bg-gradient-to-br from-[#e8f0e8] via-[#f5f1e8] to-[#efe5d6] md:h-[420px]" />

        <div className="space-y-4">
          <div className="h-5 w-20 animate-pulse rounded-full bg-[#e3eee5]" />
          <div className="h-9 w-3/4 animate-pulse rounded bg-muted" />
          <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
          <div className="h-6 w-32 animate-pulse rounded bg-muted" />
          <div className="space-y-2 pt-2">
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
          </div>
          <div className="h-24 w-full animate-pulse rounded-xl bg-[#f3f6f1]" />
          <div className="h-11 w-full animate-pulse rounded-lg bg-muted md:w-56" />
        </div>
      </div>
    </div>
  );
}
