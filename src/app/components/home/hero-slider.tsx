"use client";

import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Keyboard, Pagination } from "swiper/modules";
import { Button } from "@/app/components/ui/button";
import { cn } from "@/lib/utils";

import "swiper/css";
import "swiper/css/pagination";

const slides = [
  {
    title: "Discover Your Next Adventure",
    text: "Thousands of titles across fiction, science, history and more — your next great read is only a click away.",
    image:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1600&q=80",
    gradient: "from-emerald-950 via-zinc-900 to-zinc-800",
  },
  {
    title: "Borrowing Made Simple",
    text: "Reserve a book in one click, enjoy it at your own pace, and return it when you're done. No queues, no fuss.",
    image:
      "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1600&q=80",
    gradient: "from-rose-950 via-zinc-900 to-zinc-800",
  },
  {
    title: "Join a Community of Readers",
    text: "Follow new arrivals, swap recommendations, and discover hidden gems loved by fellow readers.",
    image:
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=1600&q=80",
    gradient: "from-sky-950 via-zinc-900 to-zinc-800",
  },
];

export function HeroSlider() {
  return (
    <section aria-label="Featured" className="w-full">
      <Swiper
        modules={[Autoplay, Keyboard, Pagination]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        keyboard={{ enabled: true }}
        loop
        className="w-full [&_.swiper-pagination-bullet]:bg-white/50 [&_.swiper-pagination-bullet-active]:bg-white"
      >
        {slides.map(({ title, text, image, gradient }, index) => (
          <SwiperSlide key={title}>
            <div
              className={cn(
                "relative flex min-h-[420px] items-center overflow-hidden bg-gradient-to-br md:min-h-[480px]",
                gradient
              )}
            >
              {/* Background photo; the gradient above stays visible if it fails to load. */}
              <Image
                src={image}
                alt=""
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover"
              />
              {/* Dark scrim so the white text stays readable over any photo. */}
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/25"
              />
              <div className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="max-w-xl space-y-5">
                  <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
                    {title}
                  </h1>
                  <p className="text-base text-zinc-300 sm:text-lg">{text}</p>
                  <Button
                    size="lg"
                    render={
                      <Link href="/books" aria-label={`Browse Books — ${title}`} />
                    }
                  >
                    Browse Books
                  </Button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
