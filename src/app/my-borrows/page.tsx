
import MyBorrowsList from "@/app/components/borrows/my-borrows-list";

const MyBorrowsPage = () => {
  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-muted/30">
      {/* Page Header */}
      <section className="border-b border-border bg-background">
        <div className="mx-auto w-full max-w-5xl px-4 py-8 text-center sm:px-6 sm:py-10 md:py-12 lg:px-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
            My Borrows
          </h1>

          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Books you are reading right now.
          </p>
        </div>
      </section>

      {/* Borrows Table */}
      <section className="mx-auto w-full max-w-5xl px-3 py-6 sm:px-6 sm:py-8 md:py-10 lg:px-8">
        <MyBorrowsList />
      </section>
    </main>
  );
};

export default MyBorrowsPage;
