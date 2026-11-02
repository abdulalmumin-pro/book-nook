"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { toast } from "@/app/components/ui/toast";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";

const categories = [
  "Fiction",
  "Science",
  "History",
  "Biography",
  "Self-Help",
  "Children",
];

/** Green focus ring on every field, matching the design. */
const fieldFocus =
  "focus-visible:border-emerald-500 focus-visible:ring-emerald-500/40";

/** Trim, collapse whitespace, and lowercase for case/space-insensitive compare. */
function normalizeText(value: unknown): string {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

interface BookFields {
  title?: unknown;
  author?: unknown;
  category?: unknown;
  description?: unknown;
  image?: unknown;
  totalCopies?: unknown;
  userName?: unknown;
  userEmail?: unknown;
}

/**
 * Canonical key for a full book record. Two records are "the same entry" only
 * when every field matches — so the same title/author can be added again as
 * more copies (different totalCopies or user), but an identical record is
 * caught as a duplicate.
 */
function recordKey(record: BookFields): string {
  const copies = Number(record.totalCopies);
  return [
    normalizeText(record.title),
    normalizeText(record.author),
    normalizeText(record.category),
    normalizeText(record.description),
    // URLs: trim only — path segments are case-sensitive.
    String(record.image ?? "").trim(),
    Number.isFinite(copies) ? String(copies) : normalizeText(record.totalCopies),
    normalizeText(record.userName),
    normalizeText(record.userEmail),
  ].join("|");
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
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
      </label>
      {children}
    </div>
  );
}

export default function AddBooksPage() {
  const [category, setCategory] = useState("Fiction");
  const { data: session, isPending: sessionPending } = authClient.useSession();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = Object.fromEntries(new FormData(event.currentTarget));
    form.category = category;

    // Ownership always comes from the signed-in account, never from a typed
    // email — otherwise the book can't be matched back to this user on
    // /my-books.
    const userName = session?.user?.name ?? "";
    const userEmail = session?.user?.email ?? "";

    if (!userEmail) {
      toast.add({
        type: "error",
        title: "Not signed in",
        description: "Sign in again before adding a book.",
      });
      return;
    }

    form.userName = userName;
    form.userEmail = userEmail;

    const totalCopies = Number(form.totalCopies);

    if (!Number.isInteger(totalCopies) || totalCopies < 1) {
      toast.add({
        type: "error",
        title: "Invalid copies",
        description: "Total copies must be a whole number of at least 1.",
      });
      return;
    }

    // The backend stores this as a number so borrow/return can use $inc.
    form.totalCopies = String(totalCopies);

    // TODO: send `data` to an API route / server action that saves the book
    // to MongoDB (file upload will need multipart/form-data handling).

    // The backend doesn't enforce uniqueness, so compare the full record
    // against the library first. The same book (title/author) may be added
    // again as more copies — only an identical record is refused.
    const newEntryKey = recordKey({
      title: form.title,
      author: form.author,
      category: form.category,
      description: form.description,
      image: form.image,
      totalCopies: form.totalCopies,
      userName: form.userName,
      userEmail: form.userEmail,
    });

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books`, {
        cache: "no-store",
      });

      if (res.ok) {
        const data = await res.json();
        const books: unknown[] = Array.isArray(data) ? data : (data?.books ?? []);
        const isDuplicate = books.some(
          (book) => recordKey(book as BookFields) === newEntryKey
        );

        if (isDuplicate) {
          toast.add({
            type: "error",
            title: "Duplicate entry",
            description:
              "This exact entry is already in the library. To add copies, change the number of copies (or another detail).",
          });
          return;
        }
      }
    } catch (error) {
      // Couldn't verify duplicates — proceed and let the POST report its own
      // success or failure.
      console.error("Duplicate check failed:", error);
    }

    try {
      const { data } = await authClient.token()
      const token = data?.token
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/add-books`, {
        method: 'POST',
        headers:{
            "Content-Type" : "application/json",
            authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      })

      if (!response.ok) {
        toast.add({
          type: "error",
          title: "Failed to add book",
          description: "The server could not save this book. Please try again.",
        });
        return;
      }

      const result = await response.json();
      console.log(result);

      toast.add({
        type: "success",
        title: "Book added successfully",
        description: `"${form.title}" is now in the library.`,
      });
    } catch (error) {
      console.error(error);
      toast.add({
        type: "error",
        title: "Something went wrong",
        description: "Could not reach the server. Please try again.",
      });
    }
  }

  return (
    <>
      {/* Page banner */}
      <section className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl px-4 py-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Add a Book
          </h1>
          <p className="mt-2 text-sm text-zinc-700 sm:text-base">
            Put a book from your shelf into the library.
          </p>
        </div>
      </section>

      {/* Form card */}
      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <form
          onSubmit={handleSubmit}
          className="mx-auto w-full max-w-xl space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Book Title" htmlFor="title">
              <Input
                id="title"
                name="title"
                required
                placeholder="e.g. The Silent Patient"
                className={fieldFocus}
              />
            </Field>
            <Field label="Author Name" htmlFor="author">
              <Input
                id="author"
                name="author"
                required
                placeholder="e.g. Alex Michaelides"
                className={fieldFocus}
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Category">
              <Select
                value={category}
                onValueChange={(value) => setCategory(value ?? "Fiction")}
              >
                <SelectTrigger className={cn("w-full", fieldFocus)}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((item) => (
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
                defaultValue={1}
                className={fieldFocus}
              />
            </Field>
          </div>

          <Field label="Book Image" htmlFor="image">
            <Input
              id="image"
              name="image"
              type="url"
              placeholder="https://example.com/book-cover.jpg"
              className={fieldFocus}
            />
          </Field>

          <Field label="Short Description" htmlFor="description">
            <Textarea
              id="description"
              name="description"
              placeholder="A short blurb about this book..."
              className={cn("min-h-20", fieldFocus)}
            />
          </Field>

          {/* Owner is always the signed-in account (see handleSubmit). */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="User Name" htmlFor="userName">
              <Input
                id="userName"
                name="userName"
                readOnly
                value={session?.user?.name ?? ""}
                placeholder={sessionPending ? "Loading account..." : "—"}
                className={cn("bg-muted", fieldFocus)}
              />
            </Field>
            <Field label="User Email" htmlFor="userEmail">
              <Input
                id="userEmail"
                name="userEmail"
                type="email"
                readOnly
                value={session?.user?.email ?? ""}
                placeholder={sessionPending ? "Loading account..." : "—"}
                className={cn("bg-muted", fieldFocus)}
              />
            </Field>
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={sessionPending}
            className="h-10 w-full bg-emerald-400 text-emerald-950 hover:bg-emerald-500"
          >
            Add Book
          </Button>
        </form>
      </section>
    </>
  );
}
