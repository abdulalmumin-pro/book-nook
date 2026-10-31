import { Suspense } from "react";
import BookCard, { type Book } from "@/components/home/bookCard";

async function BooksGrid() {
  let books: Book[] = [];

  try {
    const res = await fetch("http://localhost:7000/books", {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch books");
    }

    const data = await res.json();

    books = Array.isArray(data) ? data : data.books ?? [];
  } catch (error) {
    console.error("Error fetching books:", error);
  }

  return (
    <>
      {/* Section Title */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-[#244536]">
            Our Book Collection
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Browse our collection and find something worth reading.
          </p>
        </div>

        <span className="rounded-full bg-[#e3eee5] px-4 py-2 text-sm font-semibold text-[#286044]">
          {books.length} Books Available
        </span>
      </div>

      {/* Book Cards */}
      {books.length > 0 ? (
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {books.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[#d8d2c4] bg-white px-6 py-20 text-center">
          <h3 className="text-2xl font-bold text-[#244536]">
            No Books Found!
          </h3>

          <p className="mt-2 text-gray-500">
            There are no books available in the library right now.
          </p>
        </div>
      )}
    </>
  );
}

/** Shaped like the book grid so layout doesn't jump when data streams in. */
function BooksGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="h-full overflow-hidden rounded-2xl border border-[#e8e5dc] bg-white shadow-sm"
        >
          <div className="h-44 w-full animate-pulse bg-gradient-to-br from-[#e8f0e8] via-[#f5f1e8] to-[#efe5d6]" />
          <div className="space-y-3 p-4">
            <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
            <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
            <div className="min-h-10 w-full animate-pulse rounded bg-muted" />
            <div className="h-8 w-full animate-pulse rounded bg-[#f3f6f1]" />
            <div className="h-10 w-full animate-pulse rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

const ALLBooksPage = () => {
  return (
    <main className="min-h-screen bg-[#f8f7f2]">

      {/* Page Header */}
      <section className="border-b border-[#e9e4d9] bg-gradient-to-r from-[#e5eee5] via-[#f4f0e5] to-[#f5e9d7]">
        <div className="mx-auto max-w-7xl px-4 py-14 text-center sm:px-6 lg:px-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#62816d]">
            Discover Your Next Favorite
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-[#244536] sm:text-5xl">
            Explore All Books
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-[#777568]">
            Find your next adventure, discover new knowledge, and explore
            thousands of amazing stories in our library.
          </p>

          <div className="mx-auto mt-7 h-1 w-20 rounded-full bg-[#b58b52]" />
        </div>
      </section>

      {/* All Books Section */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <Suspense fallback={<BooksGridSkeleton />}>
          <BooksGrid />
        </Suspense>
      </section>
    </main>
  );
};

export default ALLBooksPage;
