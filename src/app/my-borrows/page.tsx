import MyBorrowsList from "@/app/components/borrows/my-borrows-list";

const MyBorrowsPage = () => {
  return (
    <main className="min-h-screen bg-muted/30">
      {/* Page Header */}
      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-5xl px-4 py-12 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            My Borrows
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Books you are reading right now.
          </p>
        </div>
      </section>

      {/* Borrows Table */}
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <MyBorrowsList />
      </section>
    </main>
  );
};

export default MyBorrowsPage;
