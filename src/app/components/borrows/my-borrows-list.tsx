
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

  useEffect(() => {
    if (isPending) return;

    const sync = () => setBorrows(getBorrowsForUser(userEmail));

    sync();

    window.addEventListener(BORROWS_CHANGED_EVENT, sync);

    return () =>
      window.removeEventListener(BORROWS_CHANGED_EVENT, sync);
  }, [isPending, userEmail]);

  const handleReturn = (record: BorrowRecord) => {
    removeBorrow(record.id);

    toast.add({
      type: "success",
      title: "Book returned",
      description: `"${record.title}" was returned to the library.`,
    });
  };

  if (isPending) {
    return (
      <div className="space-y-3 rounded-xl border border-border bg-background p-4 sm:p-6">
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
      <div className="rounded-xl border border-border bg-background px-4 py-12 text-center sm:px-6 sm:py-16">
        <h3 className="text-lg font-bold text-foreground sm:text-xl">
          No borrows yet
        </h3>

        <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
          Books you borrow will show up here so you can track them.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Card Layout */}
      <div className="grid grid-cols-1 gap-4 sm:hidden">
        {borrows.map((record) => (
          <div
            key={record.id}
            className="flex flex-col gap-4 rounded-xl border border-border bg-background p-4 shadow-sm"
          >
            <div className="flex min-w-0 items-center gap-3">
              <Image
                src={record.image}
                alt={`Cover of ${record.title}`}
                width={48}
                height={64}
                className="h-16 w-12 shrink-0 rounded object-cover"
              />

              <div className="min-w-0 flex-1">
                <h3 className="break-words text-sm font-semibold text-foreground">
                  {record.title}
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 rounded-lg bg-muted/50 p-3">
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">
                  Borrow Date
                </p>
                <p className="mt-1 break-words text-sm font-medium text-foreground">
                  {record.borrowDate}
                </p>
              </div>

              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">
                  Return Date
                </p>
                <p className="mt-1 break-words text-sm font-medium text-foreground">
                  {record.returnDate}
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleReturn(record)}
              className="w-full"
            >
              Return Book
            </Button>
          </div>
        ))}
      </div>

      {/* Tablet & Desktop Table Layout */}
      <div className="hidden overflow-x-auto rounded-xl border border-border bg-background shadow-sm sm:block">
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

                <TableCell className="max-w-[180px] break-words font-medium text-foreground">
                  {record.title}
                </TableCell>

                <TableCell className="whitespace-nowrap text-muted-foreground">
                  {record.borrowDate}
                </TableCell>

                <TableCell className="whitespace-nowrap text-muted-foreground">
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
    </>
  );
};

export default MyBorrowsList;
