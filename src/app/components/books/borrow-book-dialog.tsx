"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { toast } from "@/app/components/ui/toast";
import type { Book } from "@/app/components/home/bookCard";
import { authClient } from "@/lib/auth-client";
import { BorrowApiError, borrowBook } from "@/lib/borrows";

interface BorrowBookDialogProps {
  book: Book;
}

const LOAN_PERIOD_DAYS = 7;

/**
 * "Borrow This Book" trigger + confirmation dialog. The borrower's name and
 * email are read-only and come from the signed-in session. Confirming calls the
 * JWT-protected backend, which decrements the stock with $inc and rejects a
 * duplicate active borrow.
 */
const BorrowBookDialog = ({ book }: BorrowBookDialogProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const copies = Number(book.totalCopies);
  const available = Number.isFinite(copies) && copies > 0;

  const handleConfirm = async () => {
    if (!user) {
      toast.add({
        type: "error",
        title: "Not signed in",
        description: "Sign in again before borrowing a book.",
      });
      return;
    }

    setSubmitting(true);

    try {
      await borrowBook(book._id);

      toast.add({
        type: "success",
        title: "Book borrowed",
        description: `You can keep "${book.title}" for ${LOAN_PERIOD_DAYS} days.`,
      });

      setOpen(false);
      router.refresh();
    } catch (error) {
      const alreadyBorrowed =
        error instanceof BorrowApiError && error.code === "ALREADY_BORROWED";

      toast.add({
        type: "error",
        title: alreadyBorrowed ? "Already borrowed" : "Could not borrow book",
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        disabled={!available}
        render={
          <Button
            size="lg"
            disabled={!available}
            className="w-full bg-gradient-to-r from-[#174c3c] to-emerald-700 text-white hover:from-emerald-700 hover:to-[#174c3c] disabled:cursor-not-allowed md:w-auto"
          />
        }
      >
        {available ? "Borrow This Book" : "Not Available"}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Borrow &ldquo;{book.title}&rdquo;</DialogTitle>
          <DialogDescription>
            You can keep this book for {LOAN_PERIOD_DAYS} days.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="borrow-user-name">User Name</Label>
            <Input
              id="borrow-user-name"
              readOnly
              value={user?.name ?? ""}
              placeholder="Sign in to borrow"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="borrow-user-email">User Email</Label>
            <Input
              id="borrow-user-email"
              readOnly
              value={user?.email ?? ""}
              placeholder="Sign in to borrow"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={handleConfirm}
            disabled={!user || submitting || !available}
            className="bg-emerald-600 text-white hover:bg-emerald-700"
          >
            {submitting ? "Borrowing..." : "Confirm Borrow"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BorrowBookDialog;
