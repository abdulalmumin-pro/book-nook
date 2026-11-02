
"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Button } from "@/app/components/ui/button";
import { toast } from "@/app/components/ui/toast";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* Types & Constants                                                          */
/* -------------------------------------------------------------------------- */

type Book = {
  id: string;
  title: string;
  author: string;
  category: string;
  totalCopies: number;
  image?: string;
  description?: string;
  userEmail?: string;
};

type Status = "loading" | "error" | "ready";

const API_URL = "http://localhost:7000";

const CATEGORIES = [
  "Fiction",
  "Science",
  "History",
  "Biography",
  "Self-Help",
  "Children",
];

const TINTS = [
  "from-emerald-800 to-emerald-950",
  "from-rose-700 to-rose-900",
  "from-amber-700 to-amber-900",
  "from-stone-500 to-stone-700",
  "from-red-700 to-red-900",
  "from-orange-600 to-orange-800",
];

const fieldFocus =
  "focus-visible:border-[#7a4b2a] focus-visible:ring-[#7a4b2a]/30";

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function normalizeBook(raw: Record<string, unknown>): Book {
  return {
    id: String(raw._id ?? raw.id ?? ""),
    title: String(raw.title ?? ""),
    author: String(raw.author ?? ""),
    category: String(raw.category ?? CATEGORIES[0]),
    totalCopies: Number(raw.totalCopies ?? 1),
    image: raw.image ? String(raw.image) : undefined,
    description: raw.description ? String(raw.description) : undefined,
    userEmail: raw.userEmail ? String(raw.userEmail) : undefined,
  };
}

function tintFor(title: string) {
  const sum = [...title].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return TINTS[sum % TINTS.length];
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={htmlFor} className="text-sm font-medium text-[#3b2a1e]">
        {label}
      </label>
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Edit Book Dialog                                                           */
/* -------------------------------------------------------------------------- */

function EditBookDialog({
  book,
  onSaved,
}: {
  book: Book;
  onSaved: (updated: Book) => void;
}) {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState(book.category);
  const [saving, setSaving] = useState(false);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) setCategory(book.category);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = Object.fromEntries(new FormData(event.currentTarget));

    const title = String(form.title ?? "").trim();
    const author = String(form.author ?? "").trim();
    const totalCopies = Number(form.totalCopies);

    if (!title || !author) {
      toast.add({
        type: "error",
        title: "Missing details",
        description: "Title and author can't be empty.",
      });
      return;
    }

    if (!Number.isInteger(totalCopies) || totalCopies < 1) {
      toast.add({
        type: "error",
        title: "Invalid copies",
        description: "Total copies must be a whole number of at least 1.",
      });
      return;
    }

    const payload = {
      title,
      author,
      category,
      totalCopies,
      image: String(form.image ?? "").trim(),
      description: String(form.description ?? "").trim(),
    };

    setSaving(true);

    try {
      const { data } = await authClient.token();

      const response = await fetch(`${API_URL}/books/${book.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${data?.token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        toast.add({
          type: "error",
          title: "Failed to update book",
          description: "The server could not save your changes. Please try again.",
        });
        return;
      }

      toast.add({
        type: "success",
        title: "Book updated",
        description: `"${title}" has been updated.`,
      });

      onSaved({ ...book, ...payload });
      setOpen(false);
    } catch (error) {
      console.error(error);

      toast.add({
        type: "error",
        title: "Something went wrong",
        description: "Could not reach the server. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button
            type="button"
            variant="outline"
            className="h-10 flex-1 rounded-lg border-[#d9c9ad] bg-[#fffdf8] text-xs font-medium text-[#5a4231] transition-colors hover:bg-[#f3ead9]"
          />
        }
      >
        Edit
      </DialogTrigger>

      <DialogContent className="mx-auto max-h-[90vh] w-[calc(100%-2rem)] gap-0 overflow-y-auto rounded-xl bg-[#fffdf8] p-0 sm:max-w-xl">
        <DialogHeader className="border-b border-[#e6dccb] px-5 py-5 text-left sm:px-7">
          <DialogTitle className="font-serif text-xl text-[#2b1d12]">
            Edit book
          </DialogTitle>

          <DialogDescription className="text-sm text-[#8a7560]">
            Update the details of "{book.title}".
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 px-5 py-6 sm:px-7"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Book Title" htmlFor="title">
              <Input
                id="title"
                name="title"
                required
                defaultValue={book.title}
                placeholder="e.g. The Silent Patient"
                className={fieldFocus}
              />
            </Field>

            <Field label="Author Name" htmlFor="author">
              <Input
                id="author"
                name="author"
                required
                defaultValue={book.author}
                placeholder="e.g. Alex Michaelides"
                className={fieldFocus}
              />
            </Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Category">
              <Select
                value={category}
                onValueChange={(value) => setCategory(value ?? category)}
              >
                <SelectTrigger className={cn("w-full", fieldFocus)}>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {CATEGORIES.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Total Copies" htmlFor="totalCopies">
              <Input
                id="totalCopies"
                name="totalCopies"
                type="number"
                min={1}
                step={1}
                required
                defaultValue={book.totalCopies}
                className={fieldFocus}
              />
            </Field>
          </div>

          <Field label="Book Image URL" htmlFor="image">
            <Input
              id="image"
              name="image"
              type="url"
              defaultValue={book.image}
              placeholder="https://example.com/book-cover.jpg"
              className={fieldFocus}
            />
          </Field>

          <Field label="Short Description" htmlFor="description">
            <Textarea
              id="description"
              name="description"
              defaultValue={book.description}
              placeholder="A short blurb about this book..."
              className={cn("min-h-28 resize-y", fieldFocus)}
            />
          </Field>

          <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={saving}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={saving}
              className="w-full bg-[#7a4b2a] text-white hover:bg-[#633b20] sm:w-auto"
            >
              {saving ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* -------------------------------------------------------------------------- */
/* Delete Book Dialog                                                         */
/* -------------------------------------------------------------------------- */

function DeleteBookDialog({
  book,
  onDeleted,
}: {
  book: Book;
  onDeleted: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);

    try {
      const { data } = await authClient.token();

      const response = await fetch(`${API_URL}/books/${book.id}`, {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${data?.token}`,
        },
      });

      if (!response.ok) {
        toast.add({
          type: "error",
          title: "Failed to delete book",
          description: "The server could not delete this book. Please try again.",
        });
        return;
      }

      toast.add({
        type: "success",
        title: "Book deleted",
        description: `"${book.title}" has been removed from the library.`,
      });

      onDeleted(book.id);
      setOpen(false);
    } catch (error) {
      console.error(error);

      toast.add({
        type: "error",
        title: "Something went wrong",
        description: "Could not reach the server. Please try again.",
      });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            type="button"
            variant="outline"
            className="h-10 flex-1 rounded-lg border border-[#e3b9b0] bg-[#fbeae6] text-xs font-medium text-[#9b3a2b] transition-colors hover:bg-[#f5d5ce]"
          />
        }
      >
        Delete
      </DialogTrigger>

      <DialogContent className="mx-auto w-[calc(100%-2rem)] gap-0 rounded-xl bg-[#fffdf8] p-0 sm:max-w-md">
        <DialogHeader className="px-5 py-5 text-left sm:px-6">
          <DialogTitle className="font-serif text-xl text-[#2b1d12]">
            Delete this book?
          </DialogTitle>

          <DialogDescription className="text-sm leading-6 text-[#8a7560]">
            "{book.title}" will be permanently removed from the library.
            This action can't be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col-reverse gap-3 border-t border-[#e6dccb] px-5 py-5 sm:flex-row sm:justify-end sm:px-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={deleting}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="w-full bg-[#9b3a2b] text-white hover:bg-[#7f2e22] sm:w-auto"
          >
            {deleting ? "Deleting..." : "Yes, delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* -------------------------------------------------------------------------- */
/* Book Card                                                                  */
/* -------------------------------------------------------------------------- */

function BookCard({
  book,
  onSaved,
  onDeleted,
}: {
  book: Book;
  onSaved: (updated: Book) => void;
  onDeleted: (id: string) => void;
}) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#e6dccb] bg-[#fffdf8] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* Cover */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#f3ead9]">
        {book.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={book.image}
            alt={book.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${tintFor(
              book.title
            )} font-serif text-5xl font-bold text-white/90`}
          >
            {book.title.charAt(0)}
          </div>
        )}

        <span className="absolute left-3 top-3 rounded-md bg-[#fffdf8]/95 px-3 py-1 text-[11px] font-semibold text-[#7a4b2a] shadow-sm">
          {book.category}
        </span>
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h2 className="line-clamp-2 font-serif text-base font-semibold leading-snug text-[#2b1d12]">
          {book.title}
        </h2>

        <p className="text-sm text-[#8a7560]">{book.author}</p>

        <p className="mt-1 text-xs font-medium text-[#6b5442]">
          {book.totalCopies} {book.totalCopies === 1 ? "copy" : "copies"}
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3 border-t border-[#efe6d6] p-4">
        <EditBookDialog book={book} onSaved={onSaved} />
        <DeleteBookDialog book={book} onDeleted={onDeleted} />
      </div>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/* Main Component                                                             */
/* -------------------------------------------------------------------------- */

export default function MyBooksList() {
  const { data: session, isPending } = authClient.useSession();
  const email = session?.user?.email;

  const [books, setBooks] = useState<Book[]>([]);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    if (isPending) return;

    if (!email) {
      setBooks([]);
      setStatus("ready");
      return;
    }

    const controller = new AbortController();

    async function loadBooks() {
      setStatus("loading");

      try {
        const res = await fetch(`${API_URL}/books`, {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error("Failed to load books");
        }

        const data = await res.json();

        const list: Record<string, unknown>[] = Array.isArray(data)
          ? data
          : (data?.books ?? []);

        setBooks(
          list
            .map(normalizeBook)
            .filter((book) => book.userEmail === email)
        );

        setStatus("ready");
      } catch (error) {
        if ((error as Error).name === "AbortError") return;

        console.error(error);
        setStatus("error");
      }
    }

    loadBooks();

    return () => controller.abort();
  }, [email, isPending]);

  const handleSaved = (updated: Book) => {
    setBooks((prev) =>
      prev.map((book) => (book.id === updated.id ? updated : book))
    );
  };

  const handleDeleted = (id: string) => {
    setBooks((prev) => prev.filter((book) => book.id !== id));
  };

  const containerClass =
    "mx-auto mt-8 mb-10 w-full max-w-7xl px-4 sm:px-6 lg:px-8";

  /* Loading */
  if (status === "loading") {
    return (
      <div className={cn(containerClass, "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4")}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="aspect-[3/4] animate-pulse rounded-xl border border-[#e6dccb] bg-[#f3ead9]"
          />
        ))}
      </div>
    );
  }

  /* Error */
  if (status === "error") {
    return (
      <div className={cn(containerClass, "flex min-h-[300px] items-center justify-center text-center")}>
        <p className="text-sm text-[#9b3a2b]">
          Couldn't load your books. Please check your connection and try again.
        </p>
      </div>
    );
  }

  /* Empty */
  if (books.length === 0) {
    return (
      <div className={cn(containerClass, "flex min-h-[350px] flex-col items-center justify-center text-center")}>
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#f3ead9]">
          <span className="font-serif text-3xl text-[#7a4b2a]">B</span>
        </div>

        <h2 className="font-serif text-xl font-semibold text-[#2b1d12]">
          Your library is empty
        </h2>

        <p className="mt-2 max-w-sm text-sm leading-6 text-[#8a7560]">
          You haven't added any books yet. Start building your personal
          collection today.
        </p>

        <Link
          href="/add-books"
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-[#7a4b2a] px-6 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#633b20] hover:shadow-md"
        >
          Add your first book
        </Link>
      </div>
    );
  }

  /* Books Grid */
  return (
    <div className={cn(containerClass, "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4")}>
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          onSaved={handleSaved}
          onDeleted={handleDeleted}
        />
      ))}
    </div>
  );
}
