import Image from "next/image";
import Link from "next/link";
import React from "react";

export interface Book {
  _id: string;
  author: string;
  category: string;
  description: string;
  image: string;
  title: string;
  totalCopies: string | number;
  userEmail: string;
  userName: string;
}

interface BookCardProps {
  book: Book;
  /** Show the Total Copies box and added-by user info. Hidden on the home
   *  New Arrivals section. @default true */
  showMeta?: boolean;
}

const BookCard = ({ book, showMeta = true }: BookCardProps) => {
  const copies = Number(book.totalCopies);
  const available = Number.isFinite(copies) && copies > 0;

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#e8e5dc] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-200 hover:shadow-[0_15px_35px_rgba(23,76,60,0.12)]">
      {/* Book Image */}
      <div className="relative flex h-44 shrink-0 items-center justify-center overflow-hidden bg-gradient-to-br from-[#e8f0e8] via-[#f5f1e8] to-[#efe5d6] p-4">
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-200/30 blur-2xl" />

        <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-amber-200/40 blur-2xl" />

        {book.image ? (
          <Image
            src={book.image}
            alt={book.title}
            width={160}
            height={190}
            className="relative z-10 h-full w-auto max-w-full rounded-md object-contain shadow-md transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          // next/image throws on an empty src, and the Add Book form allows
          // books without a cover — show an initial-based placeholder instead.
          <div className="relative z-10 flex h-full w-28 items-center justify-center rounded-md bg-gradient-to-br from-[#174c3c] to-emerald-700 shadow-md">
            <span className="font-serif text-4xl font-bold text-white/90">
              {book.title.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        {/* Category */}
        <span className="absolute left-3 top-3 z-20 rounded-full border border-white/60 bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#245b43] shadow-sm backdrop-blur-sm">
          {book.category}
        </span>
      </div>

      {/* Book Information */}
      <div className="flex flex-1 flex-col p-4">
        {/* Title and Author */}
        <div>
          <h2 className="line-clamp-1 text-lg font-bold tracking-tight text-[#243c30] transition-colors group-hover:text-emerald-700">
            {book.title}
          </h2>

          <p className="mt-1 text-xs font-medium text-[#a0835c]">
            By {book.author}
          </p>
        </div>

        {/* Description */}
        <p className="mt-3 line-clamp-2 min-h-10 text-[13px] leading-5 text-gray-500">
          {book.description}
        </p>

        {/* Copies + added-by user (optional) */}
        {showMeta && (
          <>
            <div className="mt-3 flex items-center justify-between rounded-lg bg-[#f3f6f1] px-3 py-2">
              <span className="text-xs font-medium text-gray-600">
                Total Copies
              </span>

              <span
                className={
                  available
                    ? "rounded-md bg-[#dcece2] px-2.5 py-1 text-xs font-bold text-[#176344]"
                    : "rounded-md bg-[#fbeae6] px-2.5 py-1 text-xs font-bold text-[#9b3a2b]"
                }
              >
                {available ? book.totalCopies : "Not Available"}
              </span>
            </div>

            <div className="mt-3 flex items-center gap-2.5 border-t border-[#eeeae2] pt-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e3eee5] text-sm font-bold text-[#286044]">
                {book.userName?.charAt(0).toUpperCase()}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-[#263b32]">
                  {book.userName}
                </p>

                <p className="truncate text-[11px] text-gray-400">
                  {book.userEmail}
                </p>
              </div>
            </div>
          </>
        )}

        {/* View Details Button */}
        <div className="mt-4">
          <Link
            href={`/books/${book._id}`}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#174c3c] to-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:from-emerald-700 hover:to-[#174c3c] hover:shadow-md active:scale-[0.98]"
          >
            View Details
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
