"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = Object.fromEntries(new FormData(event.currentTarget));
    form.category = category;
    // TODO: send `data` to an API route / server action that saves the book
    // to MongoDB (file upload will need multipart/form-data handling).

    try {
      const response = await fetch('http://localhost:7000/add-books', {
        method: 'POST',
        headers:{
            "Content-Type" : "application/json" 
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

      const data = await response.json();
      console.log(data);

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
      <section className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8 bg-gray-300">
        <div className="mx-auto w-full max-w-7xl px-4 py-12 text-center sm:px-6 lg:px-8">
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

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="User Name" htmlFor="userName">
              <Input
                id="userName"
                name="userName"
                placeholder="e.g. Jane Doe"
                className={fieldFocus}
              />
            </Field>
            <Field label="User Email" htmlFor="userEmail">
              <Input
                id="userEmail"
                name="userEmail"
                type="email"
                placeholder="jane@example.com"
                className={fieldFocus}
              />
            </Field>
          </div>

          <Button
            type="submit"
            size="lg"
            className="h-10 w-full bg-emerald-400 text-emerald-950 hover:bg-emerald-500"
          >
            Add Book
          </Button>
        </form>
      </section>
    </>
  );
}
