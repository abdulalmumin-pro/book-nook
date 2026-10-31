import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getLatestBooks } from "@/lib/books";

export async function NewArrivals() {
  const books = await getLatestBooks(6);

  return (
    <>
      {books.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed px-6 py-16 text-center">
          <p className="font-medium">No books in the library yet.</p>
          <p className="text-sm text-muted-foreground">
            Add your first book and it will show up here automatically.
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <li key={book.id} className="h-full">
              <Card className="h-full transition-shadow hover:shadow-md">
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
                  <Image
                    src={book.image}
                    alt={`Cover of ${book.title}`}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="line-clamp-2">
                      {book.title}
                    </CardTitle>
                    <Badge variant="secondary">{book.category}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    by {book.author}
                  </p>
                </CardHeader>
                <CardContent className="mt-auto">
                  <Button
                    className="w-full"
                    render={<Link href={`/books/${book.id}`} />}
                  >
                    View Details
                    <ArrowRight data-icon="inline-end" />
                  </Button>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
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
