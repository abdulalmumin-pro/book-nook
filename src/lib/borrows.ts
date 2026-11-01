/**
 * Client-side store for borrowed books. The Express backend has no borrow
 * endpoint yet, so borrows persist in localStorage — enough to carry a borrow
 * from the details-page dialog to the My Borrows page in this browser.
 *
 * Both mutation helpers fire BORROWS_CHANGED_EVENT so a mounted My Borrows
 * list re-reads without a full navigation.
 */

export interface BorrowRecord {
  id: string;
  title: string;
  image: string;
  borrowDate: string;
  returnDate: string;
  userEmail: string;
}

const STORAGE_KEY = "book-nook:borrows";

/** Window event fired after any borrow is saved or removed. */
export const BORROWS_CHANGED_EVENT = "book-nook:borrows-changed";

function readAll(): BorrowRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(records: BorrowRecord[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {
    // Ignore storage failures (private mode / quota) — the UI still updates.
  }
}

function notifyChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(BORROWS_CHANGED_EVENT));
}

/** Borrows belonging to the given user; empty when signed out. */
export function getBorrowsForUser(userEmail?: string): BorrowRecord[] {
  if (!userEmail) return [];
  return readAll().filter((record) => record.userEmail === userEmail);
}

/** Saves a borrow, replacing any existing row for the same book, then notifies. */
export function saveBorrow(record: BorrowRecord): void {
  const others = readAll().filter((existing) => existing.id !== record.id);
  writeAll([record, ...others]);
  notifyChanged();
}

/** Removes a borrow by book id, then notifies. */
export function removeBorrow(id: string): void {
  writeAll(readAll().filter((record) => record.id !== id));
  notifyChanged();
}
