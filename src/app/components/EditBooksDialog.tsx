"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";

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
import { Button } from "./ui/button";
import { toast } from "./ui/toast";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*  Types & constants                                                          */
/* -------------------------------------------------------------------------- */

export type Book = {
  id: number | string; // use the MongoDB _id (string) once you fetch real data
  title: string;
  author: string;
  category: string;
  totalCopies: number;
  image?: string;
  description?: string;
};

const API_URL = "http://localhost:7000";

const CATEGORIES = [
  "Fiction",
  "Science",
  "History",
  "Biography",
  "Self-Help",
  "Children",
];

/** BookNook-coloured focus ring shared by every field. */
const fieldFocus =
  "focus-visible:border-[#7a4b2a] focus-visible:ring-[#7a4b2a]/30";

/* -------------------------------------------------------------------------- */
/*  Small layout helper                                                        */
/* -------------------------------------------------------------------------- */

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
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-[#3b2a1e]">
        {label}
      </label>
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

type EditBooksDialogProps = {
  book: Book;
  /** Called with the updated book after a successful save. */
  onSaved?: (updated: Book) => void;
};

const EditBooksDialog = ({ book, onSaved }: EditBooksDialogProps) => {
  console.log(book);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState(book.category || CATEGORIES[0]);
  const [saving, setSaving] = useState(false);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    // Reset the category every time the dialog opens
    if (next) setCategory(book.category || CATEGORIES[0]);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = Object.fromEntries(new FormData(event.currentTarget));
    const title = String(form.title ?? "").trim();
    const author = String(form.author ?? "").trim();
    const totalCopies = Number(form.totalCopies);

    // ---- Validation ----
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

    // ---- Save ----
    setSaving(true);
    try {
      const { data } = await authClient.token();

      const response = await fetch(`${API_URL}/books/${book.id}`, {
        method: "PATCH", // change to PUT if your backend expects it
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

      onSaved?.({ ...book, ...payload });
      setOpen(false);
      router.refresh();
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
      {/* Base UI: render the trigger AS the button (no button-inside-button) */}
      <DialogTrigger
        render={
          <Button
            type="button"
            className="rounded border border-[#d9c9ad] bg-[#fffdf8] px-3 py-1 text-xs font-medium text-[#5a4231] transition-colors hover:bg-[#f3ead9]"
          />
        }
      >
        Edit
      </DialogTrigger>

      {/*
        Sizing:
        - mobile: full width minus 1rem gutters, never taller than the screen
        - sm+: capped at max-w-xl
        - content scrolls inside the dialog instead of overflowing the page
      */}
      <DialogContent className="max-h-[90vh] w-[calc(100%-2rem)] gap-0 overflow-y-auto bg-[#fffdf8] p-0 sm:max-w-xl">
        <DialogHeader className="border-b border-[#e6dccb] px-5 py-4 text-left sm:px-6">
          <DialogTitle className="font-serif text-xl text-[#2b1d12]">
            Edit book
          </DialogTitle>
          <DialogDescription className="text-sm text-[#8a7560]">
            Update the details of &ldquo;{book.title}&rdquo;.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 px-5 py-5 sm:px-6"
        >
          {/* Title + Author */}
          <div className="grid gap-4 sm:grid-cols-2">
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

          {/* Category + Copies */}
          <div className="grid gap-4 sm:grid-cols-2">
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

          {/* Image */}
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

          {/* Description */}
          <Field label="Short Description" htmlFor="description">
            <Textarea
              id="description"
              name="description"
              defaultValue={book.description}
              placeholder="A short blurb about this book..."
              className={cn("min-h-24 resize-y", fieldFocus)}
            />
          </Field>

          {/* Actions: stacked on mobile, side by side on sm+ */}
          <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
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
};

export default EditBooksDialog;