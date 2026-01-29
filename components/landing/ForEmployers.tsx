import { X, Check } from "lucide-react";
import { AnimateOnScroll } from "./AnimateOnScroll";
import { EmployerWaitlist } from "./EmployerWaitlist";

const problems = [
  "Gig workers who ghost after one shift",
  "No way to see if someone is reliable",
  "Expensive staffing fees (25-45% per shift)",
  "High turnover because of bad culture matches",
];

const solutions = [
  "Access workers with verified track records",
  "See ratings from other restaurants",
  "Find people looking for careers, not gigs",
  "Showcase your culture to attract better talent",
  "Better matches = lower turnover = save money",
  "Flat monthly fee (not per-hire)",
];

export function ForEmployers() {
  return (
    <section id="for-employers" className="border-b border-neutral-200 bg-orange-50/30 px-6 py-20 md:px-8 md:py-32">
      <div className="mx-auto w-full max-w-7xl">
        {/* Header */}
        <AnimateOnScroll>
          <div className="text-center">
            <h2 className="font-heading text-4xl font-bold tracking-tight text-neutral-900 md:text-5xl lg:text-6xl">
              For Restaurant Owners & Managers
            </h2>
            <p className="mt-6 text-xl font-semibold text-neutral-600 md:text-2xl">
              Find workers who&apos;ll actually stay.
            </p>
          </div>
        </AnimateOnScroll>

        {/* Two Column Layout */}
        <div className="mt-16 grid gap-12 md:mt-20 lg:grid-cols-2 lg:gap-16">
          {/* Problems - from left */}
          <AnimateOnScroll delay={0} direction="left">
            <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-lg md:p-10">
              <h3 className="text-sm font-bold uppercase tracking-wide text-neutral-500">
                The problem with other platforms
              </h3>
              <ul className="mt-8 space-y-4">
                {problems.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-4 text-base text-neutral-700"
                  >
                    <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 shadow-sm">
                      <X className="h-4 w-4 text-red-600" aria-hidden />
                    </div>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </AnimateOnScroll>

          {/* Solutions - from right */}
          <AnimateOnScroll delay={100} direction="right">
            <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-lg md:p-10">
              <h3 className="text-sm font-bold uppercase tracking-wide text-neutral-500">
                With ShiftCrew
              </h3>
              <ul className="mt-8 space-y-4">
                {solutions.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-4 text-base text-neutral-700"
                  >
                    <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 shadow-sm">
                      <Check className="h-4 w-4 text-green-600" aria-hidden />
                    </div>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </AnimateOnScroll>
        </div>

        {/* Employer Waitlist Form */}
        <EmployerWaitlist />
      </div>
    </section>
  );
}
