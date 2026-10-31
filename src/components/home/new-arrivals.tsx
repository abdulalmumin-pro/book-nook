import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import BookCard from "@/components/home/bookCard";
import { getLatestBooks } from "@/lib/books";

export async function NewArrivals() {
  const books = await getLatestBooks(6);

  return (
    <>
      {books.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#d8d2c4] bg-white px-6 py-16 text-center">
          <h3 className="text-2xl font-bold text-[#244536]">
            No Books Found!
          </h3>
          <p className="mt-2 text-gray-500">
            There are no books available in the library right now.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <BookCard key={book._id} book={book} showMeta={false} />
          ))}
        </div>
      )}

      <div className="mt-10 flex justify-center">
        <Button variant="outline" size="lg" render={<Link href="/books" />}>
          See All Books
          <ArrowRight data-icon="inline-end" />
        </Button>
      </div>
    </>
  );
}
