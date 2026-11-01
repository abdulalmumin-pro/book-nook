/**
 * Full book shape required by the BookCard component. Matches the Express
 * backend's book records.
 */
export interface BookCardData {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
  description: string;
  totalCopies: string;
  userName: string;
  userEmail: string;
}

const BACKEND_URL = "http://localhost:7000/books";

/**
 * Latest books, newest first. Reads from the same Express backend that the
 * Add Book form and /books page use, so newly added books show up here
 * immediately. Fresh on every request (not cached).
 */
export async function getLatestBooks(limit = 6): Promise<BookCardData[]> {
  try {
    const res = await fetch(BACKEND_URL, { cache: "no-store" });

    if (!res.ok) {
      throw new Error(`Failed to fetch books (${res.status})`);
    }

    const data = await res.json();
    const books: unknown[] = Array.isArray(data) ? data : (data?.books ?? []);

    // ObjectIds start with a timestamp, so sorting _id descending yields
    // newest-first order without needing a createdAt field.
    return books
      .map((book) => book as Partial<BookCardData>)
      .filter((book): book is BookCardData => Boolean(book?._id))
      .sort((a, b) => (a._id! < b._id! ? 1 : -1))
      .slice(0, limit)
      .map((book) => ({
        _id: book._id!,
        title: book.title ?? "",
        author: book.author ?? "",
        category: book.category ?? "",
        image: book.image ?? "",
        description: book.description ?? "",
        totalCopies: book.totalCopies != null ? String(book.totalCopies) : "1",
        userName: book.userName ?? "",
        userEmail: book.userEmail ?? "",
      }));
  } catch (error) {
    console.error("[books] Failed to load latest books:", error);
    return [];
  }
}
