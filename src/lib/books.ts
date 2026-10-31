import { connectDB } from "@/lib/mongodb";
import { Book } from "@/models/book";

export interface BookCardData {
  id: string;
  title: string;
  author: string;
  category: string;
  image: string;
}

/**
 * Latest books, newest first. Fresh on every request (not cached) so new
 * books show up immediately.
 */
export async function getLatestBooks(limit = 6): Promise<BookCardData[]> {
  if (!process.env.MONGODB_URI) {
    console.warn("[books] MONGODB_URI is not set — returning no books.");
    return [];
  }
  try {
    await connectDB();
    const books = await Book.find()
      .sort({ createdAt: -1 }) // newest first
      .limit(limit)
      .select({ title: 1, author: 1, category: 1, image: 1 })
      .lean();

    return books.map((book) => ({
      id: String(book._id),
      title: book.title,
      author: book.author,
      category: book.category,
      image: book.image,
    }));
  } catch (error) {
    console.error("[books] Failed to load latest books:", error);
    return [];
  }
}
