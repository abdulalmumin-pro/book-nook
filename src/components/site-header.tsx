"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/books", label: "All Books" },
  { href: "/add-books", label: "Add Book" },
  { href: "/my-books", label: "My Books" },
  { href: "/my-borrows", label: "My Borrows" },
];

function isActiveLink(pathname: string, href: string) {
  return href === "/"
    ? pathname === "/"
    : pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold"
          onClick={() => setMobileOpen(false)}
        >
          <BookOpen className="size-6 text-primary" />
          <span className="text-lg tracking-tight">BookNook</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground",
                isActiveLink(pathname, link.href)
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
              aria-current={isActiveLink(pathname, link.href) ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button variant="outline" render={<Link href="/login" />}>
            Login
          </Button>
          <Button render={<Link href="/register" />}>Register</Button>
        </div>

        <button
          type="button"
          className="inline-flex size-9 items-center justify-center rounded-md transition-colors hover:bg-muted md:hidden"
          onClick={() => setMobileOpen((open) => !open)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {mobileOpen && (
        <nav
          id="mobile-menu"
          aria-label="Main"
          className="mx-auto w-full max-w-7xl border-t border-border px-4 pb-4 pt-2 md:hidden"
        >
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground",
                  isActiveLink(pathname, link.href)
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground"
                )}
                aria-current={
                  isActiveLink(pathname, link.href) ? "page" : undefined
                }
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              render={<Link href="/login" />}
              onClick={() => setMobileOpen(false)}
            >
              Login
            </Button>
            <Button
              className="flex-1"
              render={<Link href="/register" />}
              onClick={() => setMobileOpen(false)}
            >
              Register
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
}
