import { BookCheck, ClipboardList, PackageCheck, Search } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Browse the catalog",
    text: "Search by title, author or category and find your next read in seconds.",
  },
  {
    icon: ClipboardList,
    title: "Request a borrow",
    text: "Found the one? Send a borrow request with a single click.",
  },
  {
    icon: BookCheck,
    title: "Enjoy your book",
    text: "Pick it up or have it delivered, then read at your own pace.",
  },
  {
    icon: PackageCheck,
    title: "Return when done",
    text: "Return it by the due date so the next reader can enjoy it too.",
  },
];

export function HowBorrowingWorks() {
  return (
    <section className="bg-muted/40">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl space-y-2 text-center">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            How Borrowing Works
          </h2>
          <p className="text-muted-foreground">
            Four simple steps between you and your next great read.
          </p>
        </div>

        <ol className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ icon: Icon, title, text }, index) => (
            <li
              key={title}
              className="flex flex-col items-center gap-3 rounded-xl bg-background p-6 text-center ring-1 ring-foreground/10"
            >
              <span className="inline-flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Icon className="size-6" aria-hidden />
              </span>
              <span className="text-xs font-medium text-muted-foreground">
                Step {index + 1}
              </span>
              <h3 className="font-heading font-medium">{title}</h3>
              <p className="text-sm text-muted-foreground">{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
