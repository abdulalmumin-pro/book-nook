import { connectDB } from "@/lib/mongodb";
import { Book } from "@/models/book";

/** Full book shape required by the BookCard component. */
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
      .select({
        title: 1,
        author: 1,
        category: 1,
        image: 1,
        description: 1,
        totalCopies: 1,
        userName: 1,
        userEmail: 1,
      })
      .lean();

    return books.map((book) => ({
      _id: String(book._id),
      title: book.title,
      author: book.author,
      category: book.category,
      image: book.image,
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
