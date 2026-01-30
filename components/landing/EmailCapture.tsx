"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AnimateOnScroll } from "./AnimateOnScroll";

export function EmailCapture() {
  return (
    <section id="join" className="border-b border-neutral-200 bg-white px-6 py-20 md:px-8 md:py-32">
      <div className="mx-auto w-full max-w-4xl text-center">
        <AnimateOnScroll delay={0}>
          <h2 className="font-heading mx-auto max-w-3xl text-4xl font-bold leading-tight tracking-tight text-neutral-900 md:text-5xl lg:text-6xl">
            Ready to Get Started?
          </h2>
        </AnimateOnScroll>
        <AnimateOnScroll delay={100}>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-neutral-600 md:mt-6 md:text-lg">
            Browse jobs, see culture insights, and apply with transparency.
          </p>
        </AnimateOnScroll>

        <AnimateOnScroll delay={200}>
          <div className="mx-auto mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center md:mt-10">
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

        <AnimateOnScroll delay={300}>
          <p className="mt-6 text-sm font-medium text-neutral-500">
            100% free for workers. Always.
          </p>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
