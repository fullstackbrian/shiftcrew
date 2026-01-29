import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";
import {
  PayIllustration,
  CultureIllustration,
  ReputationIllustration,
} from "./illustrations";
import { AnimateOnScroll } from "./AnimateOnScroll";

const features = [
  {
    title: "Verified Pay & Tips",
    description: "Know what you'll actually make before you apply",
    bullets: [
      "Base pay + tips verified by current workers",
      "Shift-by-shift breakdown (dinner service vs prep shift)",
      "See what you'll REALLY take home",
      "No more \"$25/hr!\" lies",
    ],
    tagline: "Stop applying blind. See real earnings first.",
    borderColor: "border-t-green-500",
    Illustration: PayIllustration,
  },
  {
    title: "Real Work Culture Reviews",
    description: "See what it's REALLY like from people who work there",
    bullets: [
      "How does management/chef treat you?",
      "Is the team supportive or toxic?",
      "Do they give crew meals?",
      "Kitchen culture, respect, work-life balance",
      "Location-specific (not corporate reviews)",
    ],
    tagline:
      "No corporate fluff. Just honest reviews from workers at THIS location.",
    borderColor: "border-t-blue-500",
    Illustration: CultureIllustration,
  },
  {
    title: "Build Your Professional Reputation",
    description: "Good workers get recognized and rewarded",
    bullets: [
      "Work history that follows you",
      "Employer ratings & recommendations",
      "Verified skills & certifications",
      "Better reputation = better opportunities",
    ],
    tagline: "Your track record speaks for itself.",
    borderColor: "border-t-orange-500",
    Illustration: ReputationIllustration,
  },
];

export function Solution() {
  return (
    <section id="how-it-works" className="border-b border-neutral-200 bg-white px-6 py-20 md:px-8 md:py-32">
      <div className="mx-auto w-full max-w-7xl">
        {/* Section Header */}
        <AnimateOnScroll>
          <div className="text-center">
            <h2 className="font-heading text-4xl font-bold tracking-tight text-neutral-900 md:text-5xl lg:text-6xl">
              Fresh, honest, community-first
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-neutral-600 md:mt-8 md:text-xl">
              Build a real professional profile. See real pay and culture before you
              apply. Find jobs where you&apos;ll actually want to stay.
            </p>
          </div>
        </AnimateOnScroll>

        {/* Feature Cards */}
        <div className="mt-16 grid gap-8 md:mt-20 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
          {features.map(({ title, description, bullets, tagline, borderColor, Illustration }, index) => {
            // Alternate left/right for visual interest
            const direction = index % 2 === 0 ? "right" : "left";
            return (
              <AnimateOnScroll key={title} delay={index * 100} direction={direction}>
                <Card
                  className={`group border-t-4 ${borderColor} border-neutral-200 bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl`}
                >
                  <CardContent className="p-8 md:p-10">
                    {/* Illustration */}
                    <Illustration />

                    {/* Title */}
                    <h3 className="font-heading text-2xl font-bold text-neutral-900">
                      {title}
                    </h3>

                    {/* Tagline - Prominent */}
                    <p className="mt-4 text-lg font-semibold text-neutral-900">
                      {tagline}
                    </p>

                    {/* Description */}
                    <p className="mt-4 text-base text-neutral-600">
                      {description}
                    </p>

                    {/* Bullets with checkmarks */}
                    <ul className="mt-6 space-y-3">
                      {bullets.map((b) => (
                        <li key={b} className="flex items-start gap-3 text-base text-neutral-600">
                          <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-500" aria-hidden />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </AnimateOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
