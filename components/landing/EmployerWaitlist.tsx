"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { joinWaitlist } from "@/app/actions/waitlist";
import { ArrowRight } from "lucide-react";

const initialState = null;

export function EmployerWaitlist() {
  const [state, formAction, isPending] = useActionState(
    joinWaitlist,
    initialState
  );

  return (
    <div className="mx-auto mt-16 max-w-2xl text-center md:mt-20">
      <form
        action={formAction}
        className="mx-auto max-w-2xl"
      >
        <input type="hidden" name="user_type" value="employer" />
        
        {/* Vertical column layout */}
        <div className="flex flex-col gap-4">
          {/* Email Input */}
          <Input
            type="email"
            name="email"
            placeholder="Enter your email"
            className="h-16 w-full rounded-xl border-2 border-neutral-300 bg-white px-8 text-lg shadow-sm transition-all focus:border-neutral-900 focus:shadow-md focus:ring-0 focus-visible:ring-0"
            aria-label="Email address"
            disabled={isPending}
            required
          />
          
          {/* Button */}
          <Button
            type="submit"
            className="h-16 w-full rounded-xl bg-neutral-900 px-10 text-lg font-semibold text-white shadow-lg transition-all hover:bg-neutral-800 hover:shadow-xl disabled:opacity-50"
            disabled={isPending}
          >
            {isPending ? (
              "Signing up..."
            ) : (
              <>
                Sign up my restaurant
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Success/Error Message */}
      {state && (
        <p
          className={`mt-4 text-center text-sm font-medium ${
            state.success ? "text-green-600" : "text-red-600"
          }`}
        >
          {state.message}
        </p>
      )}
    </div>
  );
}
