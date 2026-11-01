import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import BookDetails from "@/app/components/books/book-details";
import { BookDetailsSkeleton } from "@/app/components/books/book-details-skeleton";

// This route renders live per-book data (no static shell is possible), so it
// blocks at request time instead of being force-prerendered. That also lets the
// root layout's <SiteHeader> (which reads usePathname) render with the real URL.
export const instant = false;

type Props = {
  params: Promise<{
    id: string;
  }>;
};

const BooksDetailsPage = ({ params }: Props) => {
  return (
    <main className="min-h-screen bg-[#f8f7f2]">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href="/books"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#245b43] transition-colors hover:text-emerald-700"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back to All Books
        </Link>

        {/* params and the fetch are awaited inside this boundary so the shell
            prerenders and the details stream in (cacheComponents rule). */}
        <Suspense fallback={<BookDetailsSkeleton />}>
          <BookDetails params={params} />
        </Suspense>
      </div>
    </main>
  );
};

export default BooksDetailsPage;
