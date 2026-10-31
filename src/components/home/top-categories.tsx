import Link from "next/link";
import {
  ArrowRight,
  FlaskConical,
  Heart,
  Landmark,
  Sparkles,
  UserRound,
  LibraryBig,
} from "lucide-react";

const categories = [
  { name: "Fiction", icon: LibraryBig },
  { name: "Science", icon: FlaskConical },
  { name: "History", icon: Landmark },
  { name: "Biography", icon: UserRound },
  { name: "Self-Help", icon: Sparkles },
  { name: "Children", icon: Heart },
];

export function TopCategories() {
  return (
    <section>
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Top Categories
            </h2>
            <p className="text-muted-foreground">
              Jump straight into the shelves our readers love most.
            </p>
          </div>
          <Link
            href="/books"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            See all books
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map(({ name, icon: Icon }) => (
            <li key={name}>
              <Link
                href={`/books?category=${encodeURIComponent(name)}`}
                className="flex flex-col items-center gap-3 rounded-xl bg-muted/40 p-6 text-center transition-colors hover:bg-muted"
              >
                <span className="inline-flex size-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                  <Icon className="size-6" aria-hidden />
                </span>
                <span className="text-sm font-medium">{name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
