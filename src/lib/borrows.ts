/**
 * Borrows live in the Express backend now (MongoDB `borrows` collection) so
 * stock counts can be decremented/incremented atomically with $inc and a user
 * can't borrow the same book twice. Every call is authenticated with the
 * better-auth JWT.
 */

import { authClient } from "@/lib/auth-client";

export interface BorrowRecord {
  id: string;
  bookId: string;
  title: string;
  image: string;
  /** ISO date string from the API. */
  borrowDate: string;
  /** ISO date string from the API. */
  returnDate: string;
  userEmail: string;
}

/** Error thrown for API failures, carrying the backend's machine-readable code. */
export class BorrowApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "BorrowApiError";
    this.status = status;
    this.code = code;
  }
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/** Window event fired after any borrow or return so mounted lists re-fetch. */
export const BORROWS_CHANGED_EVENT = "book-nook:borrows-changed";

function notifyChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(BORROWS_CHANGED_EVENT));
}

async function authorizedFetch(
  path: string,
  init: RequestInit = {}
): Promise<Response> {
  const { data } = await authClient.token();
  const token = data?.token;

  if (!token) {
    throw new BorrowApiError(
      "Please sign in again to continue.",
      401,
      "UNAUTHENTICATED"
    );
  }

  return fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      ...(init.headers ?? {}),
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
}

async function toApiError(response: Response): Promise<BorrowApiError> {
  let message = `Request failed (${response.status}).`;
  let code: string | undefined;

  try {
    const body = await response.json();
    if (typeof body?.message === "string") message = body.message;
    if (typeof body?.code === "string") code = body.code;
  } catch {
    // Non-JSON response — keep the generic message.
  }

  return new BorrowApiError(message, response.status, code);
}

/** All active borrows for the signed-in user. */
export async function fetchBorrows(): Promise<BorrowRecord[]> {
  const response = await authorizedFetch("/borrows");

  if (!response.ok) {
    throw await toApiError(response);
  }

  const data = await response.json();
  return Array.isArray(data) ? (data as BorrowRecord[]) : [];
}

/** Borrow one copy of a book. Throws BorrowApiError on 409/404 etc. */
export async function borrowBook(bookId: string) {
  const response = await authorizedFetch(`/books/${bookId}/borrow`, {
    method: "POST",
  });

  if (!response.ok) {
    throw await toApiError(response);
  }

  notifyChanged();
  return response.json();
}

/** Return a borrowed book, restoring one copy to stock. */
export async function returnBook(bookId: string) {
  const response = await authorizedFetch(`/books/${bookId}/return`, {
    method: "POST",
  });

  if (!response.ok) {
    throw await toApiError(response);
  }

  notifyChanged();
  return response.json();
}
