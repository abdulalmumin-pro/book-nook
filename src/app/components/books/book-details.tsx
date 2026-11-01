import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import BorrowBookDialog from "@/app/components/books/borrow-book-dialog";
import type { Book } from "@/app/components/home/bookCard";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

function NotFoundPanel({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#d8d2c4] bg-white px-6 py-20 text-center">
      <h2 className="text-2xl font-bold text-[#244536]">Book Not Found</h2>
      <p className="mt-2 text-gray-500">{message}</p>
      <Link
        href="/books"
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#174c3c] to-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:from-emerald-700 hover:to-[#174c3c]"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Back to All Books
      </Link>
    </div>
  );
}

async function BookDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let book: Book | null = null;
  let backendDown = false;

  try {
    const jwtToken = await auth.api.getToken({
      headers: await headers(),
    })
    const token = jwtToken?.token;
    console.log(token);

    const res = await fetch(`http://localhost:7000/books/${id}`, {
      headers: {
        authorization: `Bearer ${token}`
      },
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      book = data?.book ?? data;
      if (!book || !book._id) book = null;
    }
  } catch (error) {
    console.error("Error fetching book details:", error);
    backendDown = true;
  }

  if (!book) {
    return (
      <NotFoundPanel
        message={
          backendDown
            ? "The library server is unreachable right now. Please try again later."
            : "This book doesn't exist in the library, or it has been removed."
        }
      />
    );
  }

  return (
    <article className="overflow-hidden rounded-2xl border border-[#e8e5dc] bg-white shadow-sm">
      <div className="grid gap-8 p-6 md:grid-cols-[320px_1fr] md:p-8">
        {/* Cover */}
        <div className="relative flex h-80 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[#e8f0e8] via-[#f5f1e8] to-[#efe5d6] p-6 md:h-[420px]">
          <div
            aria-hidden
            className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-200/30 blur-2xl"
          />
          <div
            aria-hidden
            className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-amber-200/40 blur-2xl"
          />
          <Image
            src={book.image}
            alt={`Cover of ${book.title}`}
            width={260}
            height={380}
            priority
            className="relative z-10 h-full w-auto max-w-full rounded-lg object-contain shadow-lg"
          />
        </div>

        {/* Information */}
        <div className="flex flex-col">
          <span className="w-fit rounded-full border border-white/60 bg-[#e3eee5] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#245b43]">
            {book.category}
          </span>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#243c30]">
            {book.title}
          </h1>

          <p className="mt-1 text-sm font-medium text-[#a0835c]">
            By {book.author}
          </p>

          <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
            <span className="rounded-md bg-[#dcece2] px-2.5 py-1 text-xs font-bold text-[#176344]">
              {book.totalCopies}
            </span>
            copies available
          </div>

          <h2 className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-[#62816d]">
            Description
          </h2>
          <p className="mt-2 leading-7 text-gray-600">{book.description}</p>

          {/* Who added it */}
          <div className="mt-6 rounded-xl bg-[#f3f6f1] p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#62816d]">
              Added by
            </p>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e3eee5] text-base font-bold text-[#286044]">
                {book.userName?.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[#263b32]">
                  {book.userName}
                </p>
                <p className="truncate text-xs text-gray-400">
                  {book.userEmail}
                </p>
              </div>
            </div>
          </div>

          {/* Borrow */}
          <div className="mt-6">
            <BorrowBookDialog book={book} />
          </div>
        </div>
      </div>
    </article>
  );
}

export default BookDetails;
