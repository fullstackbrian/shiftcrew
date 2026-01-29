import { Card, CardContent } from "@/components/ui/card";
import {
  MoneyProblemIllustration,
  CultureProblemIllustration,
  ReputationProblemIllustration,
} from "./illustrations";
import { AnimateOnScroll } from "./AnimateOnScroll";

const problems = [
  {
    title: "The money looks good until you start",
    body: "'Make $300/night in tips!' for servers. '$25/hr!' for line cooks. Both turn into way less. And they cut you early when it's slow, so you made $60 for showing up. But you already quit your last job for this.",
    borderColor: "border-l-red-500",
    Illustration: MoneyProblemIllustration,
  },
  {
    title: "You don't know what the culture is really like",
    body: "The job post says 'fun team environment!' but does the chef scream at you? Does the manager have your back? Is the team supportive or toxic? You won't know until you've already quit your last job and you're stuck there.",
    borderColor: "border-l-orange-500",
    Illustration: CultureProblemIllustration,
  },
  {
    title: "You can't build a real reputation",
    body: "You've been a solid cook for 5 years. Reliable, fast, never call out. But every time you apply somewhere new, you're starting from zero. Your track record doesn't follow you.",
    borderColor: "border-l-red-500",
    Illustration: ReputationProblemIllustration,
  },
];

export function Problem() {
  return (
    <section id="problems" className="border-b border-neutral-200 bg-neutral-50 px-6 py-20 md:px-8 md:py-32">
      <div className="mx-auto w-full max-w-7xl">
        {/* Section Header */}
        <AnimateOnScroll>
          <div className="text-center">
            <h2 className="font-heading text-4xl font-bold tracking-tight text-neutral-900 md:text-5xl lg:text-6xl">
              Job posts leave out what matters.
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-neutral-600 md:mt-8 md:text-xl">
              We&apos;ve been there. ShiftCrew is real pay data and culture reviews
              from workers at that location—so you can decide with your eyes open.
            </p>
          </div>
        </AnimateOnScroll>

        {/* Problem Cards */}
        <div className="mt-16 grid gap-8 md:mt-20 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
          {problems.map((item, index) => {
            const Illustration = item.Illustration;
            // Alternate left/right for visual interest
            const direction = index % 2 === 0 ? "left" : "right";
            return (
              <AnimateOnScroll key={item.title} delay={index * 100} direction={direction}>
                <Card
                  className={`group border-l-4 ${item.borderColor} border-neutral-200 bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl`}
                >
                  <CardContent className="p-8">
                    <Illustration />
                    <h3 className="font-heading text-xl font-bold text-neutral-900 md:text-2xl">
                      {item.title}
                    </h3>
                    <p className="mt-4 text-base leading-relaxed text-neutral-600 md:text-lg">
                      {item.body}
                    </p>
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
