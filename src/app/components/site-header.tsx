"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BookOpen, LogOut, Menu, UserRound, X } from "lucide-react";
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";
import { Button } from "@/app/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";

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

function getInitial(name: string | undefined) {
  return name?.trim().charAt(0).toUpperCase() || "?";
}

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const user = session?.user;

  const handleSignOut = async () => {
    setMobileOpen(false);
    await authClient.signOut();
    router.replace("/");
    router.refresh();
  };

  const renderSignedInPills = (className?: string) => (
    <div className={cn("flex items-center gap-3 sm:gap-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger
          className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          aria-label="Open profile menu"
        >
          <Avatar size="lg">
            <AvatarFallback>{getInitial(user?.name)}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-56">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold text-foreground">
                {user?.name ?? "Signed in user"}
              </span>
              <span className="max-w-52 truncate font-normal">
                {user?.email}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuItem render={<Link href="/my-books" />}>
              <UserRound />
              My books
            </DropdownMenuItem>
            <DropdownMenuItem render={<Link href="/my-borrows" />}>
              <BookOpen />
              My borrows
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={handleSignOut}>
            <LogOut />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  const renderSignedOutPills = (className?: string) => (
    <div className={cn("flex items-center gap-2", className)}>
      <Button variant="outline" render={<Link href="/sign-in" />}>
        Sign in
      </Button>
      <Button render={<Link href="/sign-up" />}>Sign up</Button>
    </div>
  );

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

        {/* Desktop right side: avatar dropdown when signed in, buttons otherwise */}
        <div className="hidden items-center gap-2 md:flex">
          {sessionLoading ? null : user
            ? renderSignedInPills()
            : renderSignedOutPills()}
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

          {user ? (
            <div className="mt-3 flex items-center justify-between gap-2 px-1">
              <div className="flex items-center gap-2">
                <Avatar size="default">
                  <AvatarFallback>{getInitial(user.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{user.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </div>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="size-4" />
                Sign out
              </Button>
            </div>
          ) : (
            <div className="mt-3 flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                render={<Link href="/sign-in" />}
                onClick={() => setMobileOpen(false)}
              >
                Sign in
              </Button>
              <Button
                className="flex-1"
                render={<Link href="/sign-up" />}
                onClick={() => setMobileOpen(false)}
              >
                Sign up
              </Button>
            </div>
          )}
        </nav>
      )}
    </header>
  );
}
