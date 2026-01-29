"use client";

import { useActionState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { joinWaitlist } from "@/app/actions/waitlist";
import { ArrowRight } from "lucide-react";
import { AnimateOnScroll } from "./AnimateOnScroll";

const initialState = null;

const ROLE_OPTIONS = [
  { value: "", label: "Position" },
  // Front of House (FOH)
  { value: "server", label: "Server" },
  { value: "bartender", label: "Bartender" },
  { value: "host", label: "Host/Hostess" },
  { value: "busser", label: "Busser" },
  { value: "barback", label: "Barback" },
  { value: "food_runner", label: "Food Runner" },
  { value: "sommelier", label: "Sommelier" },
  // Back of House (BOH)
  { value: "line_cook", label: "Line Cook" },
  { value: "prep_cook", label: "Prep Cook" },
  { value: "sous_chef", label: "Sous Chef" },
  { value: "executive_chef", label: "Executive Chef" },
  { value: "pastry_chef", label: "Pastry Chef" },
  { value: "dishwasher", label: "Dishwasher" },
  { value: "expeditor", label: "Expeditor (Expo)" },
  // Management
  { value: "general_manager", label: "General Manager (GM)" },
  { value: "assistant_manager", label: "Assistant Manager" },
  { value: "kitchen_manager", label: "Kitchen Manager" },
  { value: "bar_manager", label: "Bar Manager" },
  { value: "foh_manager", label: "Front of House Manager" },
  // Other
  { value: "porter", label: "Porter" },
  { value: "janitor", label: "Janitor" },
  { value: "other", label: "Other" },
];

export function EmailCapture() {
  const roleSelectRef = useRef<HTMLSelectElement>(null);
  
  const [state, formAction, isPending] = useActionState(
    joinWaitlist,
    initialState
  );

  return (
    <section id="waitlist" className="border-b border-neutral-200 bg-white px-6 py-20 md:px-8 md:py-32">
      <div className="mx-auto w-full max-w-4xl text-center">
        <AnimateOnScroll delay={0}>
          <h2 className="font-heading mx-auto max-w-3xl text-4xl font-bold leading-tight tracking-tight text-neutral-900 md:text-5xl lg:text-6xl">
            Join as a Worker
          </h2>
        </AnimateOnScroll>
        <AnimateOnScroll delay={100}>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-neutral-600 md:mt-6 md:text-lg">
            Early access rolling out now in West Hollywood, LA
          </p>
        </AnimateOnScroll>

        <AnimateOnScroll delay={200}>
          <form
            action={formAction}
            className="mx-auto mt-8 max-w-2xl md:mt-10"
          >
            <input type="hidden" name="user_type" value="worker" />
            
            {/* Vertical column layout */}
            <div className="flex flex-col gap-4">
              {/* Email Input */}
              <Input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="h-16 w-full rounded-xl border-2 border-neutral-300 bg-white px-8 text-lg shadow-sm transition-all focus:border-green-500 focus:shadow-md focus:ring-0 focus-visible:ring-0"
                aria-label="Email address"
                disabled={isPending}
                required
              />
              
              {/* Position Dropdown */}
              <select
                ref={roleSelectRef}
                name="role"
                aria-label="Your position"
                disabled={isPending}
                className="h-16 w-full appearance-none rounded-xl border-2 border-neutral-300 bg-white bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%234b5563%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22%3E%3Cpolyline points=%226 9 12 15 18 9%22%3E%3C/polyline%3E%3C/svg%3E')] bg-[length:20px_20px] bg-[right_16px_center] bg-no-repeat px-6 pr-12 text-lg text-neutral-900 shadow-sm transition-all focus:border-green-500 focus:outline-none focus:ring-0 focus:shadow-md disabled:opacity-50 [&>option]:bg-white [&>option]:text-neutral-900 [&>option]:p-2"
              >
                {ROLE_OPTIONS.map((opt) => (
                  <option key={opt.value || "placeholder"} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              
              {/* Button */}
              <Button
                type="submit"
                className="h-16 w-full rounded-xl bg-neutral-900 px-10 text-lg font-semibold text-white shadow-lg transition-all hover:bg-neutral-800 hover:shadow-xl disabled:opacity-50"
                disabled={isPending}
              >
                {isPending ? (
                  "Joining..."
                ) : (
                  <>
                    Join waitlist
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </AnimateOnScroll>

        {/* Success/Error Message */}
        {state && (
          <AnimateOnScroll delay={0}>
            <p
              className={`mt-4 text-sm font-medium ${
                state.success ? "text-green-600" : "text-red-600"
              }`}
            >
              {state.message}
            </p>
          </AnimateOnScroll>
        )}

        <AnimateOnScroll delay={300}>
          <p className="mt-6 text-sm font-medium text-neutral-500">
            100% free for workers. Always.
          </p>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
