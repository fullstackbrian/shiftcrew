"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { AnimateOnScroll } from "./AnimateOnScroll";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserTypePicker } from "./UserTypePicker";

export function Hero() {
  const [showPicker, setShowPicker] = useState(false);

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
            See verified pay and honest culture reviews from workers at that location—before you apply.
          </p>
        </AnimateOnScroll>

        {/* CTA Button */}
        <AnimateOnScroll delay={200}>
          <div className="mx-auto mt-10 md:mt-12">
            <Button
              onClick={() => setShowPicker(true)}
              size="lg"
              className="h-14 bg-neutral-900 px-8 text-base font-semibold text-white shadow-lg transition-all hover:bg-neutral-800 hover:shadow-xl"
            >
              Get started
            </Button>
          </div>
        </AnimateOnScroll>

        {/* User Type Picker Modal */}
        <Dialog open={showPicker} onOpenChange={setShowPicker}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center text-2xl">
                I'm a...
              </DialogTitle>
              <DialogDescription className="text-center">
                Choose how you want to use ShiftCrew
              </DialogDescription>
            </DialogHeader>
            <UserTypePicker onClose={() => setShowPicker(false)} />
          </DialogContent>
        </Dialog>

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
              <span className="font-nums font-semibold text-neutral-900">500+</span>{" "}
              restaurant workers already joined
            </p>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
