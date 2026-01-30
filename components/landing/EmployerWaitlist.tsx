"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AnimateOnScroll } from "./AnimateOnScroll";

export function EmployerWaitlist() {
  return (
    <AnimateOnScroll delay={200}>
      <div className="mx-auto mt-16 max-w-2xl text-center md:mt-20">
        <p className="mb-6 text-base leading-relaxed text-neutral-600 md:text-lg">
          Post jobs and find quality restaurant workers.
        </p>
        <Link href="/sign-up">
          <Button 
            size="lg"
            className="h-14 bg-[#A52A2A] px-8 text-base font-semibold text-white shadow-lg transition-all hover:bg-[#8B0000] hover:shadow-xl"
            aria-label="Sign up as an employer"
          >
            Post Jobs
          </Button>
        </Link>
        <p className="mt-4 text-sm text-neutral-500">
          Employer features launching soon
        </p>
      </div>
    </AnimateOnScroll>
  );
}
