"use client";

import { useState } from "react";
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
import { saveBorrow } from "@/lib/borrows";

interface BorrowBookDialogProps {
  book: Book;
}

const LOAN_PERIOD_DAYS = 7;

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * "Borrow This Book" trigger + confirmation dialog. The borrower's name and
 * email are read-only and come from the signed-in session. Confirming stores
 * the borrow in the shared localStorage layer (see src/lib/borrows.ts) so it
 * shows up on the My Borrows page.
 */
const BorrowBookDialog = ({ book }: BorrowBookDialogProps) => {
  const [open, setOpen] = useState(false);
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const handleConfirm = () => {
    if (!user) return;

    const borrowedOn = new Date();
    const dueBack = new Date(
      borrowedOn.getTime() + LOAN_PERIOD_DAYS * 24 * 60 * 60 * 1000
    );

    saveBorrow({
      id: book._id,
      title: book.title,
      image: book.image,
      borrowDate: formatDate(borrowedOn),
      returnDate: formatDate(dueBack),
      userEmail: user.email ?? "",
    });

    toast.add({
      type: "success",
      title: "Book borrowed",
      description: `You can keep "${book.title}" for ${LOAN_PERIOD_DAYS} days.`,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            size="lg"
            className="w-full bg-gradient-to-r from-[#174c3c] to-emerald-700 text-white hover:from-emerald-700 hover:to-[#174c3c] md:w-auto"
          />
        }
      >
        Borrow This Book
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
            disabled={!user}
            className="bg-emerald-600 text-white hover:bg-emerald-700"
          >
            Confirm Borrow
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BorrowBookDialog;
