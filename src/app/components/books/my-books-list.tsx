"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BookCard, { type Book } from "@/app/components/home/bookCard";
import EditBooksDialog, {
  type Book as EditableBook,
} from "@/app/components/EditBooksDialog";
import { Button } from "@/app/components/ui/button";
import { authClient } from "@/lib/auth-client";

const BACKEND_URL = `${process.env.NEXT_PUBLIC_API_URL}/books`;

type Status = "loading" | "ready" | "error";

/**
 * The backend returns plain JSON, so fill in any missing field before handing
 * the record to <BookCard>, which expects the full book shape.
 */
function normalizeBook(value: unknown): Book | null {
  if (!value || typeof value !== "object") return null;

  const book = value as Partial<Book>;
  if (!book._id) return null;

  return {
    _id: String(book._id),
    title: book.title ?? "",
    author: book.author ?? "",
    category: book.category ?? "",
    description: book.description ?? "",
    image: book.image ?? "",
    totalCopies: book.totalCopies != null ? String(book.totalCopies) : "0",
    userName: book.userName ?? "",
    userEmail: book.userEmail ?? "",
  };
}

/** Shaped like the book grid so the layout doesn't jump while loading. */
function BooksGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
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

const MyBooksList = () => {
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const [books, setBooks] = useState<Book[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [reloadToken, setReloadToken] = useState(0);

  const userEmail = session?.user?.email?.trim().toLowerCase() ?? "";

  // Load every book from the library, then keep only the ones this user
  // added. GET /books is public; no JWT is needed just to read.
  useEffect(() => {
    if (sessionPending || !userEmail) return;

    const controller = new AbortController();

    async function load() {
      try {
        const res = await fetch(BACKEND_URL, {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch books (${res.status})`);
        }

        const data = await res.json();
        const list: unknown[] = Array.isArray(data) ? data : (data?.books ?? []);

        const mine = list
          .map(normalizeBook)
          .filter((book): book is Book => book !== null)
          .filter((book) => book.userEmail.trim().toLowerCase() === userEmail);

        setBooks(mine);
        setStatus("ready");
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("[my-books] Failed to load books:", error);
        setStatus("error");
      }
    }

    load();
    return () => controller.abort();
  }, [sessionPending, userEmail, reloadToken]);

  const handleRetry = () => {
    setStatus("loading");
    setReloadToken((token) => token + 1);
  };

  const handleDelete = (id: Book["_id"]) => {
    if (!window.confirm("Delete this book?")) return;
    // TODO: await fetch DELETE (with the JWT), then update state
    setBooks((prev) => prev.filter((book) => book._id !== id));
  };

  const handleSaved = (updated: EditableBook) => {
    setBooks((prev) =>
      prev.map((book) =>
        book._id === updated.id
          ? {
              ...book,
              title: updated.title,
              author: updated.author,
              category: updated.category,
              totalCopies: String(updated.totalCopies),
              image: updated.image ?? "",
              description: updated.description ?? "",
            }
          : book
      )
    );
  };

  if (sessionPending || (status === "loading" && userEmail)) {
    return <BooksGridSkeleton />;
  }

  if (status === "error") {
    return (
      <div className="rounded-2xl border border-dashed border-[#d8d2c4] bg-[#fffdf8] px-6 py-16 text-center">
        <h2 className="text-2xl font-bold text-[#244536]">
          Couldn&apos;t load your books
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          The library server may be offline. Please try again.
        </p>
        <Button
          type="button"
          onClick={handleRetry}
          className="mt-6 bg-[#174c3c] text-white hover:bg-emerald-700"
        >
          Try again
        </Button>
      </div>
    );
  }

  if (!userEmail || books.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#d8d2c4] bg-[#fffdf8] px-6 py-16 text-center">
        <h2 className="text-2xl font-bold text-[#244536]">No books yet</h2>
        <p className="mt-2 text-sm text-gray-500">
          Books you add to the library will show up here.
        </p>
        <Button
          render={<Link href="/add-books" />}
          className="mt-6 bg-[#174c3c] text-white hover:bg-emerald-700"
        >
          Add a book
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[#6b5442]">
          Books added with{" "}
          <span className="font-semibold text-[#2b1d12]">{userEmail}</span>
        </p>

        <span className="rounded-full bg-[#e3eee5] px-4 py-2 text-sm font-semibold text-[#286044]">
          {books.length} {books.length === 1 ? "Book" : "Books"}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {books.map((book) => (
          <div key={book._id} className="flex flex-col">
            <div className="flex-1">
              <BookCard book={book} />
            </div>

            <div className="mt-3 flex gap-2">
              <EditBooksDialog
                book={{
                  id: book._id,
                  title: book.title,
                  author: book.author,
                  category: book.category,
                  totalCopies: Number(book.totalCopies) || 1,
                  image: book.image,
                  description: book.description,
                }}
                onSaved={handleSaved}
              />

              <button
                type="button"
                onClick={() => handleDelete(book._id)}
                className="rounded border border-[#e3b9b0] bg-[#fbeae6] px-3 py-1 text-xs font-medium text-[#9b3a2b] transition-colors hover:bg-[#f5d5ce]"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default MyBooksList;
