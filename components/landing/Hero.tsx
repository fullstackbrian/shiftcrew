"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { AnimateOnScroll } from "./AnimateOnScroll";

export function Hero() {
  return (
    <section className="relative flex min-h-[85vh] items-center justify-center border-b border-neutral-200 bg-white px-6 py-20 md:px-8 md:py-32">
      <div className="mx-auto w-full max-w-4xl text-center">
        {/* Main Headline */}
        <AnimateOnScroll delay={0}>
          <h1 className="font-heading mx-auto max-w-3xl text-5xl font-extrabold leading-tight tracking-tight text-neutral-900 md:text-6xl lg:text-7xl">
            Find restaurant jobs with real transparency.
          </h1>
        </AnimateOnScroll>

        {/* Subheadline */}
        <AnimateOnScroll delay={100}>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-neutral-600 md:mt-8 md:text-xl">
            See pay insights and honest culture reviews from workers at that location—before you apply.
          </p>
        </AnimateOnScroll>

        {/* CTA Buttons */}
        <AnimateOnScroll delay={200}>
          <div className="mx-auto mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center md:mt-12">
            <Link href="/sign-up">
              <Button
                size="lg"
                className="h-14 w-full min-w-[160px] bg-[#A52A2A] px-8 text-base font-semibold text-white shadow-lg transition-all hover:bg-[#8B0000] hover:shadow-xl sm:w-auto"
                aria-label="Sign up for a free account"
              >
                Sign Up Free
              </Button>
            </Link>
            <Link href="/browse">
              <Button
                size="lg"
                variant="outline"
                className="h-14 w-full min-w-[160px] px-8 text-base font-semibold shadow-lg transition-all hover:shadow-xl sm:w-auto"
                aria-label="Browse available jobs"
              >
                Browse Jobs
              </Button>
            </Link>
          </div>
        </AnimateOnScroll>

        {/* Social Proof */}
        <AnimateOnScroll delay={300}>
          <div className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row md:gap-3">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className="h-4 w-4 fill-[#A52A2A] text-[#A52A2A]"
                />
              ))}
            </div>
            <p className="text-sm text-neutral-600">
              Early preview • Real reviews and job postings coming soon
            </p>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
