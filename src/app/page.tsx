import { Suspense } from "react";
import { HeroSlider } from "@/components/home/hero-slider";
import { HowBorrowingWorks } from "@/components/home/how-borrowing-works";
import { NewArrivals } from "@/components/home/new-arrivals";
import { NewArrivalsSkeleton } from "@/components/home/new-arrivals-skeleton";
import { TopCategories } from "@/components/home/top-categories";

export default function Home() {
  return (
    <>
      {/* Swiper reads new Date() internally, which is unstable during
          prerendering — Suspense lets the slider stream in at request time. */}
      <Suspense
        fallback={
          <div
            aria-hidden
            className="min-h-[420px] w-full bg-gradient-to-br from-emerald-950 via-zinc-900 to-zinc-800 md:min-h-[480px]"
          />
        }
      >
        <HeroSlider />
      </Suspense>

      <section
        aria-labelledby="new-arrivals-heading"
        className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="space-y-2">
          <h2
            id="new-arrivals-heading"
            className="text-2xl font-semibold tracking-tight sm:text-3xl"
          >
            New Arrivals
          </h2>
          <p className="text-muted-foreground">
            The freshest additions to the library, newest first.
          </p>
        </div>
        <div className="mt-10">
          <Suspense fallback={<NewArrivalsSkeleton />}>
            <NewArrivals />
          </Suspense>
        </div>
      </section>

      <HowBorrowingWorks />
      <TopCategories />
    </>
  );
}
