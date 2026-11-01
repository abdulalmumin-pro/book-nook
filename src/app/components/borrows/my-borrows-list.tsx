"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/app/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { toast } from "@/app/components/ui/toast";
import { authClient } from "@/lib/auth-client";
import {
  BORROWS_CHANGED_EVENT,
  getBorrowsForUser,
  removeBorrow,
  type BorrowRecord,
} from "@/lib/borrows";

const MyBorrowsList = () => {
  const { data: session, isPending } = authClient.useSession();
  const [borrows, setBorrows] = useState<BorrowRecord[]>([]);
  const userEmail = session?.user?.email;

  // Read the shared store on mount and whenever a borrow changes elsewhere.
  useEffect(() => {
    if (isPending) return;
    const sync = () => setBorrows(getBorrowsForUser(userEmail));
    sync();
    window.addEventListener(BORROWS_CHANGED_EVENT, sync);
    return () => window.removeEventListener(BORROWS_CHANGED_EVENT, sync);
  }, [isPending, userEmail]);

  const handleReturn = (record: BorrowRecord) => {
    // State refreshes through BORROWS_CHANGED_EVENT fired by removeBorrow.
    removeBorrow(record.id);
    toast.add({
      type: "success",
      title: "Book returned",
      description: `"${record.title}" was returned to the library.`,
    });
  };

  if (isPending) {
    return (
      <div className="space-y-3 rounded-xl border border-border bg-background p-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-10 w-full animate-pulse rounded bg-muted"
          />
        ))}
      </div>
    );
  }

  if (borrows.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-background px-6 py-16 text-center">
        <h3 className="text-xl font-bold text-foreground">No borrows yet</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Books you borrow will show up here so you can track them.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-background shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Image</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Borrow Date</TableHead>
            <TableHead>Return Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {borrows.map((record) => (
            <TableRow key={record.id}>
              <TableCell className="py-3">
                <Image
                  src={record.image}
                  alt={`Cover of ${record.title}`}
                  width={32}
                  height={44}
                  className="h-11 w-8 rounded object-cover"
                />
              </TableCell>

              <TableCell className="font-medium text-foreground">
                {record.title}
              </TableCell>

              <TableCell className="text-muted-foreground">
                {record.borrowDate}
              </TableCell>

              <TableCell className="text-muted-foreground">
                {record.returnDate}
              </TableCell>

              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleReturn(record)}
                >
                  Return Book
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MyBorrowsList;
